(function() {
    var notes,
        notesValue,
        currentState,
        currentSlide,
        upcomingSlide,
        layoutLabel,
        layoutDropdown,
        pendingCalls = {},
        lastAPICallID = 0,
        connected = false,
        SPEAKER_LAYOUTS = {
            'default': 'Default',
            'wide': 'Wide',
            'tall': 'Tall',
            'notes-only': 'Notes only'
        },
        connectionStatus = document.querySelector('#connection-status'),
        connectionTimeout = setTimeout(function() {
            connectionStatus.innerHTML = 'Error connecting to main window.<br>Please try closing and reopening the speaker view.';
        }, 5000);

    setupLayout();

    window.addEventListener('message', function(event) {
        clearTimeout(connectionTimeout);
        connectionStatus.style.display = 'none';
        var data = JSON.parse(event.data);
        if (!data) {
            return;
        }
        if (data.state) delete data.state.overview; // The overview mode is only useful to the instance where navigation occurs so we don't sync it  
        switch (data.namespace) {
            case 'speaker-notes': // Messages sent by the notes plugin inside of the main window
                switch (data.type) {
                    case 'connect':
                        handleConnectMessage(data);
                        break;
                    case 'state':
                        handleStateMessage(data);
                        break;
                    case 'return':
                        if (pendingCalls) {
                            pendingCalls[data.callId](data.result);
                            delete pendingCalls[data.callId];
                        }
                        break;
                }
                break;
            case 'deck': // Messages sent by the inside of the current slide preview
                if (/ready/.test(data.eventName)) {
                    window.opener.postMessage(JSON.stringify({ namespace: 'speaker-notes', type: 'connected' }), '*'); // Send a message back to notify that the handshake is complete
                } else if (/slidechanged|fragmentshown|fragmenthidden|paused|resumed/.test(data.eventName) && currentState !== JSON.stringify(data.state)) {
                    window.opener.postMessage(JSON.stringify({ methodName: 'setState', args: [data.state] }), '*');
                }
                break;
        }
    });

    function callAPI(method, args, callback) {
        var callId = ++lastAPICallID;
        pendingCalls[callId] = callback;
        window.opener.postMessage(JSON.stringify({
            namespace: 'speaker-notes',
            type: 'call',
            callId: callId,
            methodName: method,
            arguments: args
        }), '*');
    }

    function handleConnectMessage(data) {
        if (connected === false) {
            connected = true;
            setupIframes(data);
            setupKeyboard();
            setupNotes();
            setupTimer();
        }
    }

    function handleStateMessage(data) {
        currentState = JSON.stringify(data.state); // Store the most recently set state to avoid circular loops applying the same state
        if (data.notes) { // No need for updating the notes in case of fragment changes
            notes.classList.remove('hidden');
            notesValue.style.whiteSpace = data.whitespace;
            if (data.markdown) {
                notesValue.innerHTML = marked(data.notes);
            } else {
                notesValue.innerHTML = data.notes;
            }
        } else {
            notes.classList.add('hidden');
        }
        currentSlide.contentWindow.postMessage(JSON.stringify({ methodName: 'setState', args: [data.state] }), '*'); // Update the note slides
        upcomingSlide.contentWindow.postMessage(JSON.stringify({ methodName: 'setState', args: [data.state] }), '*');
        upcomingSlide.contentWindow.postMessage(JSON.stringify({ methodName: 'navigateNext' }), '*');
    }

    handleStateMessage = debounce(handleStateMessage, 200); // Limit to max one state update per X ms

    function setupKeyboard() {
        document.addEventListener('keydown', function(event) {
            if (event.keyCode === 116 || (event.metaKey && event.keyCode === 82)) { /* F8 and r */
                event.preventDefault();
                return false;
            }
            currentSlide.contentWindow.postMessage(JSON.stringify({ methodName: 'triggerKey', args: [event.keyCode] }), '*');
        });
    }

    function setupIframes(data) {
        var params = [
            'receiver',
            'progress=false',
            'history=false',
            'transition=none',
            'autoSlide=0',
            'backgroundTransition=none'
        ].join('&');
        var urlSeparator = data.url.includes("?") ? '&' : '?';
        var hash = '#/' + data.state.indexh + '/' + data.state.indexv;
        var currentURL = data.url + urlSeparator + params + '&postMessageEvents=true' + hash;
        var upcomingURL = data.url + urlSeparator + params + '&controls=false' + hash;
        currentSlide = document.createElement('iframe');
        currentSlide.setAttribute('width', 1280);
        currentSlide.setAttribute('height', 1024);
        currentSlide.setAttribute('src', currentURL);
        document.querySelector('#current-slide').appendChild(currentSlide);
        upcomingSlide = document.createElement('iframe');
        upcomingSlide.setAttribute('width', 640);
        upcomingSlide.setAttribute('height', 512);
        upcomingSlide.setAttribute('src', upcomingURL);
        document.querySelector('#upcoming-slide').appendChild(upcomingSlide);
    }

    function setupNotes() {
        notes = document.querySelector('.speaker-controls-notes');
        notesValue = document.querySelector('.speaker-controls-notes .value');
    }

    function getTimings(callback) {
        callAPI('getSlidesAttributes', [], function(slideAttributes) {
            callAPI('getConfig', [], function(config) {
                var totalTime = config.totalTime;
                var minTimePerSlide = config.minimumTimePerSlide || 0;
                var defaultTiming = config.defaultTiming;
                if ((defaultTiming == null) && (totalTime == null)) {
                    callback(null);
                    return;
                }
                if (totalTime) { // Setting totalTime overrides defaultTiming
                    defaultTiming = 0;
                }
                var timings = [];
                for (var i in slideAttributes) {
                    var slide = slideAttributes[i];
                    var timing = defaultTiming;
                    if (slide.hasOwnProperty('data-timing')) {
                        var t = slide['data-timing'];
                        timing = parseInt(t);
                        if (isNaN(timing)) {
                            console.warn("Could not parse timing '" + t + "' of slide " + i + "; using default of " + defaultTiming);
                            timing = defaultTiming;
                        }
                    }
                    timings.push(timing);
                }
                if (totalTime) {
                    var remainingTime = totalTime - timings.reduce(function(a, b) { return a + b; }, 0); // After we've allocated time to individual slides, we summarize it and subtract it from the total time
                    var remainingSlides = (timings.filter(function(x) { return x == 0 })).length // The remaining time is divided by the number of slides that have 0 seconds allocated at the moment, giving the average time-per-slide on the remaining slides
                    var timePerSlide = Math.round(remainingTime / remainingSlides, 0)
                        // And now we replace every zero-value timing with that average
                    timings = timings.map(function(x) { return (x == 0 ? timePerSlide : x) });
                }
                var slidesUnderMinimum = timings.filter(function(x) { return (x < minTimePerSlide) }).length
                if (slidesUnderMinimum) {
                    message = "The pacing time for " + slidesUnderMinimum + " slide(s) is under the configured minimum of " + minTimePerSlide + " seconds. Check the data-timing attribute on individual slides, or consider increasing the totalTime or minimumTimePerSlide configuration options (or removing some slides).";
                    alert(message);
                }
                callback(timings);
            });
        });
    }

    function getTimeAllocated(timings, callback) {
        callAPI('getSlidePastCount', [], function(currentSlide) {
            var allocated = 0;
            for (var i in timings.slice(0, currentSlide + 1)) {
                allocated += timings[i];
            }
            callback(allocated);
        });
    }

    function setupTimer() {
        var start = new Date(),
            timeEl = document.querySelector('.speaker-controls-time'),
            clockEl = timeEl.querySelector('.clock-value'),
            hoursEl = timeEl.querySelector('.hours-value'),
            minutesEl = timeEl.querySelector('.minutes-value'),
            secondsEl = timeEl.querySelector('.seconds-value'),
            pacingTitleEl = timeEl.querySelector('.pacing-title'),
            pacingEl = timeEl.querySelector('.pacing'),
            pacingHoursEl = pacingEl.querySelector('.hours-value'),
            pacingMinutesEl = pacingEl.querySelector('.minutes-value'),
            pacingSecondsEl = pacingEl.querySelector('.seconds-value');
        var timings = null;
        getTimings(function(_timings) {
            timings = _timings;
            if (_timings !== null) {
                pacingTitleEl.style.removeProperty('display');
                pacingEl.style.removeProperty('display');
            }
            _updateTimer(); // Update once directly            
            setInterval(_updateTimer, 1000); // Then update every second
        });

        function _resetTimer() {
            if (timings == null) {
                start = new Date();
                _updateTimer();
            } else {
                getTimeAllocated(timings, function(slideEndTimingSeconds) { // Reset timer to beginning of current slide
                    var slideEndTiming = slideEndTimingSeconds * 1000;
                    callAPI('getSlidePastCount', [], function(currentSlide) {
                        var currentSlideTiming = timings[currentSlide] * 1000;
                        var previousSlidesTiming = slideEndTiming - currentSlideTiming;
                        var now = new Date();
                        start = new Date(now.getTime() - previousSlidesTiming);
                        _updateTimer();
                    });
                });
            }
        }

        timeEl.addEventListener('click', function() {
            _resetTimer();
            return false;
        });

        function _displayTime(hrEl, minEl, secEl, time) {
            var sign = Math.sign(time) == -1 ? "-" : "";
            time = Math.abs(Math.round(time / 1000));
            var seconds = time % 60;
            var minutes = Math.floor(time / 60) % 60;
            var hours = Math.floor(time / (60 * 60));
            hrEl.innerHTML = sign + zeroPadInteger(hours);
            if (hours == 0) {
                hrEl.classList.add('mute');
            } else {
                hrEl.classList.remove('mute');
            }
            minEl.innerHTML = ':' + zeroPadInteger(minutes);
            if (hours == 0 && minutes == 0) {
                minEl.classList.add('mute');
            } else {
                minEl.classList.remove('mute');
            }
            secEl.innerHTML = ':' + zeroPadInteger(seconds);
        }

        function _updateTimer() {
            var diff,
                now = new Date();
            diff = now.getTime() - start.getTime();
            clockEl.innerHTML = now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' });
            _displayTime(hoursEl, minutesEl, secondsEl, diff);
            if (timings !== null) {
                _updatePacing(diff);
            }
        }

        function _updatePacing(diff) {
            getTimeAllocated(timings, function(slideEndTimingSeconds) {
                var slideEndTiming = slideEndTimingSeconds * 1000;
                callAPI('getSlidePastCount', [], function(currentSlide) {
                    var currentSlideTiming = timings[currentSlide] * 1000;
                    var timeLeftCurrentSlide = slideEndTiming - diff;
                    if (timeLeftCurrentSlide < 0) {
                        pacingEl.className = 'pacing behind';
                    } else if (timeLeftCurrentSlide < currentSlideTiming) {
                        pacingEl.className = 'pacing on-track';
                    } else {
                        pacingEl.className = 'pacing ahead';
                    }
                    _displayTime(pacingHoursEl, pacingMinutesEl, pacingSecondsEl, timeLeftCurrentSlide);
                });
            });
        }
    }

    function setupLayout() {
        layoutDropdown = document.querySelector('.speaker-layout-dropdown');
        layoutLabel = document.querySelector('.speaker-layout-label');
        for (var id in SPEAKER_LAYOUTS) { // Render the list of available layouts
            var option = document.createElement('option');
            option.setAttribute('value', id);
            option.textContent = SPEAKER_LAYOUTS[id];
            layoutDropdown.appendChild(option);
        }
        layoutDropdown.addEventListener('change', function(event) { // Monitor the dropdown for changes
            setLayout(layoutDropdown.value);
        }, false);
        setLayout(getLayout()); // Restore any currently persisted layout
    }

    function setLayout(value) {
        var title = SPEAKER_LAYOUTS[value];
        layoutLabel.innerHTML = 'Layout' + (title ? (': ' + title) : '');
        layoutDropdown.value = value;
        document.body.setAttribute('data-speaker-layout', value);
        // Persist locally
        if (supportsLocalStorage()) {
            window.localStorage.setItem('speaker-layout', value);
        }
    }

    function getLayout() {
        if (supportsLocalStorage()) {
            var layout = window.localStorage.getItem('speaker-layout');
            if (layout) {
                return layout;
            }
        }
        for (var id in SPEAKER_LAYOUTS) { // Default to the first record in the layouts hash
            return id;
        }
    }

    function supportsLocalStorage() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (e) {
            return false;
        }
    }

    function zeroPadInteger(num) {
        var str = '00' + parseInt(num);
        return str.substring(str.length - 2);

    }

    function debounce(fn, ms) {
        var lastTime = 0,
            timeout;

        return function() {
            var args = arguments;
            var context = this;
            clearTimeout(timeout);
            var timeSinceLastCall = Date.now() - lastTime;
            if (timeSinceLastCall > ms) {
                fn.apply(context, args);
                lastTime = Date.now();
            } else {
                timeout = setTimeout(function() {
                    fn.apply(context, args);
                    lastTime = Date.now();
                }, ms - timeSinceLastCall);
            }
        }
    }
})();