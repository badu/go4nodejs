(function () {
    let wsConnected = false,
        wsConn,
        notesValue,
        totpInputCode,
        wsConnectButton,
        consoler,
        currentSlide,
        upcomingSlide,
        layoutLabel,
        layoutDropdown,
        wsClientNo,
        SPEAKER_LAYOUTS = {
            'default': 'Default',
            'wide': 'Wide',
            'tall': 'Tall',
            'notes-only': 'Notes only'
        },
        useConsoler = false,
        allClients = new Set(),
        activeClients = new Set(),
        inactiveClients = new Set();


    if (useConsoler) {
        consoler = document.getElementById('consoler');
        consoler.addEventListener('dblclick', function () {
            consoler.value = '\n';
        })
        consoler.value = '\n';
    } else {
        const debuggerElem = document.getElementById('debugger');
        debuggerElem.parentNode.removeChild(debuggerElem);
    }

    function trace(message) {
        if (!useConsoler) {
            return
        }
        consoler.value = message + '\n' + consoler.value;
    }

    function callAPI(method, args, callback) {
        callback(deck[method].apply(deck, args));
    }

    function setupIframes() {
        var params = [
            'receiver',
            'progress=false',
            'history=false',
            'transition=none',
            'autoSlide=0',
            'backgroundTransition=none'
        ].join('&');

        var url = window.location.protocol + '//' + window.location.host + window.location.pathname + window.location.search;
        var state = deck.getState();
        var urlSeparator = url.includes("?") ? '&' : '?';
        var hash = '#/' + state.indexh + '/' + state.indexv;
        var currentURL = url + urlSeparator + params + hash;
        var upcomingURL = url + urlSeparator + params + '&controls=false' + hash;

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

    function getTimings(callback) {
        callAPI('getSlidesAttributes', [], function (slideAttributes) {
            callAPI('getConfig', [], function (config) {
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
                            trace("Could not parse timing '" + t + "' of slide " + i + "; using default of " + defaultTiming);
                            timing = defaultTiming;
                        }
                    }
                    timings.push(timing);
                }
                if (totalTime) {
                    var remainingTime = totalTime - timings.reduce(function (a, b) {
                        return a + b;
                    }, 0); // After we've allocated time to individual slides, we summarize it and subtract it from the total time
                    var remainingSlides = (timings.filter(function (x) {
                        return x == 0
                    })).length // The remaining time is divided by the number of slides that have 0 seconds allocated at the moment, giving the average time-per-slide on the remaining slides
                    var timePerSlide = Math.round(remainingTime / remainingSlides, 0)
                    // And now we replace every zero-value timing with that average
                    timings = timings.map(function (x) {
                        return (x == 0 ? timePerSlide : x)
                    });
                }
                var slidesUnderMinimum = timings.filter(function (x) {
                    return (x < minTimePerSlide)
                }).length
                if (slidesUnderMinimum) {
                    message = "The pacing time for " + slidesUnderMinimum + " slide(s) is under the configured minimum of " + minTimePerSlide + " seconds. Check the data-timing attribute on individual slides, or consider increasing the totalTime or minimumTimePerSlide configuration options (or removing some slides).";
                    alert(message);
                }
                callback(timings);
            });
        });
    }

    function getTimeAllocated(timings, callback) {
        callAPI('getSlidePastCount', [], function (currentSlide) {
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
        getTimings(function (_timings) {
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
                getTimeAllocated(timings, function (slideEndTimingSeconds) { // Reset timer to beginning of current slide
                    var slideEndTiming = slideEndTimingSeconds * 1000;
                    callAPI('getSlidePastCount', [], function (currentSlide) {
                        var currentSlideTiming = timings[currentSlide] * 1000;
                        var previousSlidesTiming = slideEndTiming - currentSlideTiming;
                        var now = new Date();
                        start = new Date(now.getTime() - previousSlidesTiming);
                        _updateTimer();
                    });
                });
            }
        }

        timeEl.addEventListener('click', function () {
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
            clockEl.innerHTML = now.toLocaleTimeString('en-US', {hour12: true, hour: '2-digit', minute: '2-digit'});
            _displayTime(hoursEl, minutesEl, secondsEl, diff);
            if (timings !== null) {
                _updatePacing(diff);
            }
        }

        function _updatePacing(diff) {
            getTimeAllocated(timings, function (slideEndTimingSeconds) {
                var slideEndTiming = slideEndTimingSeconds * 1000;
                callAPI('getSlidePastCount', [], function (currentSlide) {
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
        layoutDropdown.addEventListener('change', function (event) { // Monitor the dropdown for changes
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

    function connectToWs(totpCode) {
        wsConn = new WebSocket("ws://" + document.location.host + "/ws?totp=" + totpCode);

        wsConn.onclose = function (e) {
            trace('[speaker-ws] connection closed:' + JSON.stringify(e.reason));
            wsConnectButton.innerText = 'Connect';
            totpInputCode.style.visibility = 'visible';
            wsConnected = false;
        };

        const lm = document.getElementById('last-message');

        wsConn.onmessage = function (evt) {
            try {
                const decoded = JSON.parse(evt.data);
                switch (decoded.com) {
                    case StatusRequestCommand:
                        lm.innerText = 'Client #' + decoded.c + ' REQ [STAT]\n' + lm.innerText;
                        const message = {
                            com: StatusReplyCommand,
                            c: decoded.c,
                            state: currentSlide.contentWindow.theDeck.getState()
                        };
                        wsConn.send(JSON.stringify(message));
                        break;
                    case ClientStatsCommand:
                        switch (decoded.s) {
                            case 1:
                                inactiveClients.delete(decoded.c);
                                activeClients.add(decoded.c);
                                allClients.add(decoded.c);
                                break;
                            case 2:
                                inactiveClients.add(decoded.c);
                                activeClients.delete(decoded.c);
                                allClients.add(decoded.c);
                                break;
                            case 3:
                                inactiveClients.delete(decoded.c);
                                activeClients.delete(decoded.c);
                                allClients.delete(decoded.c);
                                break;
                            case 4:
                                activeClients.add(decoded.c);
                                allClients.add(decoded.c);
                                break;
                        }
                        trace(`client status ${JSON.stringify(decoded)}`);
                        break;
                    case ConnectedReplyCommand:
                        if (decoded.s === 5) {
                            wsClientNo = decoded.c;
                            // assuming they are all active, eagerly waiting for Mr Speaker to show up
                            decoded.cn.forEach(function (value) {
                                activeClients.add(value);
                                allClients.add(value);
                            })
                            wsConn.send(JSON.stringify({
                                com: HideControlsCommand,
                                c: wsClientNo,
                                state: currentSlide.contentWindow.theDeck.getState()
                            }));
                        } else {
                            lm.innerText = 'Client #' + decoded.c + ' connected [why?]\n' + lm.innerText;
                        }
                        break;
                    default:
                        lm.innerText = `Unknown message typed ${decoded.com} from client #${decoded.c}` + '\n' + lm.innerText;
                        trace(`message ${JSON.stringify(decoded)}`);
                        break;
                }

                document.getElementById('total').innerText = `${allClients.size} Total`;
                document.getElementById('focused').innerText = `${activeClients.size} Focused`;
                document.getElementById('unfocused').innerText = `${inactiveClients.size} Out of focus`;

            } catch (ex) {
                lm.innerText = `[speaker-ws] failed to decode ${evt.data} due to ${ex}` + '\n' + lm.innerText;
                trace(`[speaker-ws] failed to decode ${evt.data} due to ${ex}`);
            }
        };

        wsConn.onopen = function (e) {
            totpInputCode.style.visibility = 'hidden';
            wsConnectButton.innerText = 'Disconnect';
            wsConnected = true;
        }

        wsConn.onerror = function (e) {
            trace('[speaker-ws] error:' + JSON.stringify(e));
            wsConnected = false;
        };
    }

    totpInputCode = document.getElementById('totpInputCode');
    wsConnectButton = document.getElementById('wsConnectButton');

    wsConnectButton.addEventListener('click', function () {
        if (!wsConnected) {
            connectToWs(totpInputCode.value);
        } else {
            wsConn.send(JSON.stringify({com: ShowControlsCommand, c: wsClientNo}));
            setTimeout(function () {
                wsConn.close(3000, 'Mr Speaker has left the building.');
                wsConnected = false;
                wsConnectButton.innerText = 'Connect';
                totpInputCode.style.visibility = 'visible';
            }, 500);
        }
    })

    // for debugging
    function fetchTOTPCode() {
        fetch(window.location.protocol + '//' + window.location.host + "/code")
            .then((response) => response.json())
            .then((data) => {
                trace("[speaker-ws] TOTP code:" + data.code + ". Connecting to WS!");
                totpInputCode.value = data.code;
            });
    }

    function setupKeyboard() {
        document.addEventListener('keydown', function (event) {
            if (event.keyCode === 116 || (event.metaKey && event.keyCode === 82)) { /* F8 and r */
                event.preventDefault();
                return false;
            }
        });
    }

    notesValue = document.querySelector('.speaker-controls-notes .value');

    function setCurrentSlideNotes() {
        let slideElement = currentSlide.contentWindow.theDeck.currentSlide,
            notesElement = slideElement.querySelector('aside.notes'),
            fragmentElement = slideElement.querySelector('.current-fragment'),
            effectiveNotes = "",
            hasMarkDown = false;

        console.log(slideElement);
        console.log(slideElement.querySelector('aside.notes'));

        if (notesElement) { // Look for notes defined in an aside element
            effectiveNotes = notesElement.innerHTML;
            hasMarkDown = typeof notesElement.getAttribute('data-markdown') === 'string';
        }

        if (fragmentElement) { // Look for notes defined in a fragment
            let fragmentNotes = fragmentElement.querySelector('aside.notes');
            if (fragmentNotes) {
                effectiveNotes = fragmentNotes.innerHTML;
            } else if (fragmentElement.hasAttribute('data-notes')) {
                effectiveNotes = fragmentElement.getAttribute('data-notes');
                notesValue.style.whiteSpace = 'pre-wrap';
                notesElement = null; // In case there are slide notes
            }
        }

        if (slideElement.hasAttribute('data-notes')) { // Look for notes defined in a slide attribute
            hasMarkDown = typeof slideElement.getAttribute('data-markdown') === 'string';
            if (hasMarkDown) {
                effectiveNotes = marked(slideElement.getAttribute('data-notes'));
            } else {
                effectiveNotes = slideElement.getAttribute('data-notes');
            }
        }

        if (effectiveNotes !== "") {
            notesValue.style.whiteSpace = 'pre-wrap';
            notesValue.innerHTML = effectiveNotes;
        } else {
            notesValue.innerHTML = "no notes for this slide"
        }
    }

    setupIframes();

    upcomingSlide.contentWindow.addEventListener('ready', function () {
        upcomingSlide.contentWindow.theDeck.navigateNext();
    });

    currentSlide.contentWindow.addEventListener('ready', function () {

        setCurrentSlideNotes();

        currentSlide.contentWindow.theDeck.on('paused', function (e) {
            const message = JSON.stringify({com: PausedCommand, c: wsClientNo})
            if (wsConnected) {
                wsConn.send(message)
            } else {
                trace('error : we are NOT connected to WS.');
            }
        });

        currentSlide.contentWindow.theDeck.on('resumed', function (e) {
            const message = JSON.stringify({com: ResumedCommand, c: wsClientNo})
            if (wsConnected) {
                wsConn.send(message)
            } else {
                trace('error : we are NOT connected to WS.');
            }
        });

        currentSlide.contentWindow.theDeck.on('fragmentshown', function (event) {
            setCurrentSlideNotes();
            const message = JSON.stringify({
                com: FragmentShownCommand,
                c: wsClientNo,
                state: currentSlide.contentWindow.theDeck.getState()
            });
            if (wsConnected) {
                wsConn.send(message)
            } else {
                trace('error : we are NOT connected to WS.');
            }

            upcomingSlide.contentWindow.theDeck.navigateNext();
        });

        currentSlide.contentWindow.theDeck.on('slided', function (event) {
            setCurrentSlideNotes();
            const message = JSON.stringify({
                com: SlidedCommand,
                c: wsClientNo,
                state: currentSlide.contentWindow.theDeck.getState()
            });
            if (wsConnected) {
                wsConn.send(message)
            } else {
                trace('error : we are NOT connected to WS.');
            }

            let called = false
            const callOnce = function () {
                if (called) {
                    return
                }
                called = true;
                upcomingSlide.contentWindow.theDeck.navigateNext();
                upcomingSlide.contentWindow.theDeck.removeEventListener('slided', callOnce, false);
            }

            upcomingSlide.contentWindow.theDeck.addEventListener('slided', callOnce, false);
            upcomingSlide.contentWindow.theDeck.setState(currentSlide.contentWindow.theDeck.getState());
        });

        currentSlide.contentWindow.theDeck.on('overviewshown', function (e) {
            const message = JSON.stringify({com: OverviewShownCommand, c: wsClientNo})
            if (wsConnected) {
                wsConn.send(message)
            } else {
                trace('error : we are NOT connected to WS.');
            }
        });

        currentSlide.contentWindow.theDeck.on('overviewhidden', function (e) {
            const message = JSON.stringify({com: OverviewHiddenCommand, c: wsClientNo})
            if (wsConnected) {
                wsConn.send(message)
            } else {
                trace('error : we are NOT connected to WS.');
            }
        });
    })

    window.onbeforeunload = function () {
        if (wsConnected) {
            wsConn.send(JSON.stringify({com: ShowControlsCommand, c: wsClientNo}));
        }
    }

    setupLayout();
    setupKeyboard();
    setupTimer();

    fetchTOTPCode();

})();
