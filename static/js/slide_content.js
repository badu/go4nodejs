import {closest, extend, isMobile, queryAll} from './utils.js';
import {Deck} from './deck.js';

const IFRAME_DATA_SRC = 'iframe[data-src]';
const IMG_DATA_SRC = 'img[data-src]';
const VIDEO_DATA_SRC = 'video[data-src]';
const AUDIO_DATA_SRC = 'audio[data-src]';
const SOURCE_DATA_SRC = 'source[data-src]';
const VIDEO_DATA_LAZY_SRC = 'video[data-lazy-loaded][src]';
const AUDIO_DATA_LAZY_SRC = 'audio[data-lazy-loaded][src]';
const IFRAME_DATA_LAZY_SRC = 'iframe[data-lazy-loaded][src]';
const IFRAME_SRC = 'iframe[src]';

const fitty = ((w) => {
    if (!w) return; // no window, early exit
    const toArray = nl => [].slice.call(nl); // node list to array helper method
    const DrawState = { // states
        IDLE: 0,
        DIRTY_CONTENT: 1,
        DIRTY_LAYOUT: 2,
        DIRTY: 3
    };
    let fitties = []; // all active fitty elements

    let redrawFrame = null; // group all redraw calls till next frame, we cancel each frame request when a new one comes in. If no support for request animation frame, this is an empty function and supports for fitty stops.
    const requestRedraw = 'requestAnimationFrame' in w ? () => {
        w.cancelAnimationFrame(redrawFrame);
        redrawFrame = w.requestAnimationFrame(() => redraw(fitties.filter(f => f.dirty && f.active)));
    } : () => {
    };

    // sets all fitties to dirty so they are redrawn on the next redraw loop, then calls redraw
    const redrawAll = (type) => () => {
        fitties.forEach(f => f.dirty = type);
        requestRedraw();
    };

    // redraws fitties so they nicely fit their parent container
    const redraw = function (fitties) {
        // getting info from the DOM at this point should not trigger a reflow, let's gather as much intel as possible before triggering a reflow
        // check if styles of all fitties have been computed
        fitties
            .filter(f => !f.styleComputed)
            .forEach(f => {
                f.styleComputed = computeStyle(f)
            });

        // restyle elements that require pre-styling, this triggers a reflow, please try to prevent by adding CSS rules (see docs)
        fitties
            .filter(shouldPreStyle)
            .forEach(applyStyle);

        // we now determine which fitties should be redrawn
        const fittiesToRedraw = fitties.filter(shouldRedraw);

        // we calculate final styles for these fitties
        fittiesToRedraw.forEach(calculateStyles);

        // now we apply the calculated styles from our previous loop
        fittiesToRedraw.forEach(f => {
            applyStyle(f);
            markAsClean(f);
        });

        // now we dispatch events for all restyled fitties
        fittiesToRedraw.forEach(dispatchFitEvent);
    };

    const markAsClean = function (f) {
        f.dirty = DrawState.IDLE
    };

    const calculateStyles = function (f) {
        // get available width from parent node
        f.availableWidth = f.element.parentNode.clientWidth;
        // the space our target element uses
        f.currentWidth = f.element.scrollWidth;
        // remember current font size
        f.previousFontSize = f.currentFontSize;
        // let's calculate the new font size
        f.currentFontSize = Math.min(
            Math.max(
                f.minSize,
                (f.availableWidth / f.currentWidth) * f.previousFontSize
            ),
            f.maxSize
        );
        // if allows wrapping, only wrap when at minimum font size (otherwise would break container)
        f.whiteSpace = f.multiLine && f.currentFontSize === f.minSize ?
            'normal' :
            'nowrap';
    };

    // should always redraw if is not dirty layout, if is dirty layout, only redraw if size has changed
    const shouldRedraw = function (f) {
        f.dirty !== DrawState.DIRTY_LAYOUT || (f.dirty === DrawState.DIRTY_LAYOUT && f.element.parentNode.clientWidth !== f.availableWidth)
    };

    // every fitty element is tested for invalid styles
    const computeStyle = function (f) {
        // get style properties
        const style = w.getComputedStyle(f.element, null);
        // get current font size in pixels (if we already calculated it, use the calculated version)
        f.currentFontSize = parseFloat(style.getPropertyValue('font-size'));
        // get display type and wrap mode
        f.display = style.getPropertyValue('display');
        f.whiteSpace = style.getPropertyValue('white-space');
    };

    // determines if this fitty requires initial styling, can be prevented by applying correct styles through CSS
    const shouldPreStyle = function (f) {
        let preStyle = false;
        // if we already tested for prestyling we don't have to do it again
        if (f.preStyleTestCompleted) return false;
        // should have an inline style, if not, apply
        if (!/inline-/.test(f.display)) {
            preStyle = true;
            f.display = 'inline-block';
        }
        // to correctly calculate dimensions the element should have whiteSpace set to nowrap
        if (f.whiteSpace !== 'nowrap') {
            preStyle = true;
            f.whiteSpace = 'nowrap';
        }
        // we don't have to do this twice
        f.preStyleTestCompleted = true;
        return preStyle;
    };

    // apply styles to single fitty
    const applyStyle = function (f) {
        f.element.style.whiteSpace = f.whiteSpace;
        f.element.style.display = f.display;
        f.element.style.fontSize = f.currentFontSize + 'px';
    };

    // dispatch a fit event on a fitty
    const dispatchFitEvent = function (f) {
        f.element.dispatchEvent(new CustomEvent('fit', {
            detail: {
                oldValue: f.previousFontSize,
                newValue: f.currentFontSize,
                scaleFactor: f.currentFontSize / f.previousFontSize
            }
        }));
    };

    // fit method, marks the fitty as dirty and requests a redraw (this will also redraw any other fitty marked as dirty)
    const fit = (f, type) => () => {
        f.dirty = type;
        if (!f.active) return;
        requestRedraw();
    };

    const init = function (f) {
        // save some of the original CSS properties before we change them
        f.originalStyle = {
            whiteSpace: f.element.style.whiteSpace,
            display: f.element.style.display,
            fontSize: f.element.style.fontSize,
        };
        // should we observe DOM mutations
        observeMutations(f);
        // this is a new fitty so we need to validate if it's styles are in order
        f.newbie = true;
        // because it's a new fitty it should also be dirty, we want it to redraw on the first loop
        f.dirty = true;
        // we want to be able to update this fitty
        fitties.push(f);
    }

    const destroy = function (f) {
        // remove from fitties array
        fitties = fitties.filter(_ => _.element !== f.element);
        // stop observing DOM
        if (f.observeMutations) f.observer.disconnect();
        // reset the CSS properties we changes
        f.element.style.whiteSpace = f.originalStyle.whiteSpace;
        f.element.style.display = f.originalStyle.display;
        f.element.style.fontSize = f.originalStyle.fontSize;
    };

    // add a new fitty, does not redraw said fitty
    const subscribe = function (f) {
        if (f.active) return;
        f.active = true;
        requestRedraw();
    };

    // remove an existing fitty
    const unsubscribe = function (f) {
        f.active = false
    };

    const observeMutations = function (f) {
        // no observing?
        if (!f.observeMutations) return;
        // start observing mutations
        f.observer = new MutationObserver(fit(f, DrawState.DIRTY_CONTENT));
        // start observing
        f.observer.observe(
            f.element,
            f.observeMutations
        );
    };

    // default mutation observer settings
    const mutationObserverDefaultSetting = {
        subtree: true,
        childList: true,
        characterData: true
    };

    // default fitty options
    const defaultOptions = {
        minSize: 16,
        maxSize: 512,
        multiLine: true,
        observeMutations: 'MutationObserver' in w ? mutationObserverDefaultSetting : false
    };

    // array of elements in, fitty instances out
    function fittyCreate(elements, options) {
        // set options object
        const fittyOptions = {
            // expand default options
            ...defaultOptions,
            // override with custom options
            ...options
        };

        // create fitties
        const publicFitties = elements.map(function (element) {
            // create fitty instance
            const f = {
                // expand defaults
                ...fittyOptions,
                // internal options for this fitty
                element,
                active: true
            };

            // initialize this fitty
            init(f);

            // expose API
            return {
                element,
                fit: fit(f, DrawState.DIRTY),
                unfreeze: subscribe(f),
                freeze: unsubscribe(f),
                unsubscribe: destroy(f)
            };

        });
        // call redraw on newly initiated fitties
        requestRedraw();
        // expose fitties
        return publicFitties;
    }

    // fitty creation function
    function fitty(target, options = {}) {
        // if target is a string
        return typeof target === 'string' ?
            // treat it as a querySelector
            fittyCreate(toArray(document.querySelectorAll(target)), options) :
            // create single fitty
            fittyCreate([target], options)[0];
    }

    // handles viewport changes, redraws all fitties, but only does so after a timeout
    let resizeDebounce = null;
    const onWindowResized = function () {
        w.clearTimeout(resizeDebounce);
        resizeDebounce = w.setTimeout(
            redrawAll(DrawState.DIRTY_LAYOUT),
            fitty.observeWindowDelay
        );
    };

    // define observe window property, so when we set it to true or false events are automatically added and removed
    const events = ['resize', 'orientationchange'];
    Object.defineProperty(fitty, 'observeWindow', {
        set: enabled => {
            const method = `${enabled ? 'add' : 'remove'}EventListener`;
            events.forEach(e => {
                w[method](e, onWindowResized);
            });
        }
    });
    fitty.observeWindow = true; // fitty global properties (by setting observeWindow to true the events above get added)
    fitty.observeWindowDelay = 100;
    fitty.fitAll = redrawAll(DrawState.DIRTY); // public fit all method, will force redraw no matter what
    return fitty; // export our fitty function, we don't want to keep it to our selves

})(typeof window === 'undefined' ? null : window);

class SlideContent {

    constructor(deck) {
        if (!(deck instanceof Deck)) {
            throw new Error("expecting instance of Deck");
        }
        this.deck = deck;
        this.startEmbeddedIframe = this.startEmbeddedIframe.bind(this);
        this.startEmbeddedMedia = this.startEmbeddedMedia.bind(this);
        this.load = this.load.bind(this);
        this.unload = this.unload.bind(this);
        this.shouldPreload = this.shouldPreload.bind(this);
        this.deck.on('synced', function (event) {
            this.formatEmbeddedContent();
        }.bind(this));
        this.deck.on('syncSlide', function (event) {
            this.load(event.data);
        }.bind(this))
    }

    shouldPreload(el) {
        // Prefer an explicit global preload setting
        let preload = this.deck.config.preloadIframes;
        // If no global setting is available, fall back on the element's
        // own preload setting
        if (typeof preload !== 'boolean') {
            preload = el.hasAttribute('data-preload');
        }
        return preload;
    }

    load(slide, options = {}) {
        // Show the slide element
        slide.style.display = this.deck.config.display;
        // Media elements with data-src attributes
        queryAll(slide, `${IMG_DATA_SRC}, ${VIDEO_DATA_SRC}, ${AUDIO_DATA_SRC}, ${IFRAME_DATA_SRC}`).forEach(function (element) {
            if (element.tagName !== 'IFRAME' || this.shouldPreload(element)) {
                element.setAttribute('src', element.getAttribute('data-src'));
                element.setAttribute('data-lazy-loaded', '');
                element.removeAttribute('data-src');
            }
        }, this);
        // Media elements with <source> children
        queryAll(slide, 'video, audio').forEach(function (media) {
            let sources = 0;
            queryAll(media, SOURCE_DATA_SRC).forEach(function (source) {
                source.setAttribute('src', source.getAttribute('data-src'));
                source.removeAttribute('data-src');
                source.setAttribute('data-lazy-loaded', '');
                sources += 1;
            });
            // Enable inline video playback in mobile Safari
            if (isMobile && media.tagName === 'VIDEO') {
                media.setAttribute('playsinline', '');
            }
            // If we rewrote sources for this video/audio element, we need
            // to manually tell it to load from its new origin
            if (sources > 0) {
                media.load();
            }
        });
        // Show the corresponding background element
        let background = slide.slideBackgroundElement;
        if (background) {
            background.style.display = 'block';
            let backgroundContent = slide.slideBackgroundContentElement;
            let backgroundIframe = slide.getAttribute('data-background-iframe');
            // If the background contains media, load it
            if (background.hasAttribute('data-loaded') === false) {
                background.setAttribute('data-loaded', 'true');
                let backgroundImage = slide.getAttribute('data-background-image'),
                    backgroundVideo = slide.getAttribute('data-background-video'),
                    backgroundVideoLoop = slide.hasAttribute('data-background-video-loop'),
                    backgroundVideoMuted = slide.hasAttribute('data-background-video-muted');
                // Images
                if (backgroundImage) {
                    backgroundContent.style.backgroundImage = 'url(' + encodeURI(backgroundImage) + ')';
                }
                // Videos
                else if (backgroundVideo && !this.deck.notes.isSpeakerNotesWindow()) {
                    let video = document.createElement('video');
                    if (backgroundVideoLoop) {
                        video.setAttribute('loop', '');
                    }
                    if (backgroundVideoMuted) {
                        video.muted = true;
                    }
                    // Enable inline playback in mobile Safari
                    //
                    // Mute is required for video to play when using
                    // swipe gestures to navigate since they don't
                    // count as direct user actions :'(
                    if (isMobile) {
                        video.muted = true;
                        video.setAttribute('playsinline', '');
                    }
                    // Support comma separated lists of video sources
                    backgroundVideo.split(',').forEach(function (source) {
                        video.innerHTML += '<source src="' + source + '">';
                    });
                    backgroundContent.appendChild(video);
                }
                // Iframes
                else if (backgroundIframe && options.excludeIframes !== true) {
                    let iframe = document.createElement('iframe');
                    iframe.setAttribute('allowfullscreen', '');
                    iframe.setAttribute('mozallowfullscreen', '');
                    iframe.setAttribute('webkitallowfullscreen', '');
                    iframe.setAttribute('allow', 'autoplay');
                    iframe.setAttribute('data-src', backgroundIframe);
                    iframe.style.width = '100%';
                    iframe.style.height = '100%';
                    iframe.style.maxHeight = '100%';
                    iframe.style.maxWidth = '100%';
                    backgroundContent.appendChild(iframe);
                }
            }

            // Start loading preloadable iframes
            let backgroundIframeElement = backgroundContent.querySelector(IFRAME_DATA_SRC);
            if (backgroundIframeElement) {
                // Check if this iframe is eligible to be preloaded
                if (this.shouldPreload(background) && !/autoplay=(1|true|yes)/gi.test(backgroundIframe)) {
                    if (backgroundIframeElement.getAttribute('src') !== backgroundIframe) {
                        backgroundIframeElement.setAttribute('src', backgroundIframe);
                    }
                }
            }
        }
        // Autosize text with the r-fit-text class based on the
        // size of its container. This needs to happen after the
        // slide is visible in order to measure the text.
        Array.from(slide.querySelectorAll('.r-fit-text:not([data-fitted])')).forEach(function (element) {
            element.dataset.fitted = '';
            fitty(element, {
                minSize: 24,
                maxSize: this.deck.config.height * 0.8,
                observeMutations: false,
                observeWindow: false
            });
        }, this);
    }

    unload(slide) {
        // Hide the slide element
        slide.style.display = 'none';
        // Hide the corresponding background element
        let background = this.deck.getSlideBackground(slide);
        if (background) {
            background.style.display = 'none';
            // Unload any background iframes
            queryAll(background, IFRAME_SRC).forEach(function (el) {
                el.removeAttribute('src');
            });
        }
        // Reset lazy-loaded media elements with src attributes
        queryAll(slide, `${VIDEO_DATA_LAZY_SRC}, ${AUDIO_DATA_LAZY_SRC}, ${IFRAME_DATA_LAZY_SRC}`).forEach(function (el) {
            el.setAttribute('data-src', el.getAttribute('src'));
            el.removeAttribute('src');
        });
        // Reset lazy-loaded media elements with <source> children
        queryAll(slide, 'video[data-lazy-loaded] source[src], audio source[src]').forEach(function (src) {
            src.setAttribute('data-src', src.getAttribute('src'));
            src.removeAttribute('src');
        });
    }

    formatEmbeddedContent() {
        let _appendParamToIframeSource = function (srcAttr, srcURL, param) {
            queryAll(this.deck.dom.slides, 'iframe[' + srcAttr + '*="' + srcURL + '"]').forEach(function (el) {
                let src = el.getAttribute(srcAttr);
                if (src && src.indexOf(param) === -1) {
                    el.setAttribute(srcAttr, src + (!/\?/.test(src) ? '?' : '&') + param);
                }
            }, this);
        }.bind(this);
        // YouTube frames must include "?enablejsapi=1"
        _appendParamToIframeSource('src', 'youtube.com/embed/', 'enablejsapi=1');
        _appendParamToIframeSource('data-src', 'youtube.com/embed/', 'enablejsapi=1');
        // Vimeo frames must include "?api=1"
        _appendParamToIframeSource('src', 'player.vimeo.com/', 'api=1');
        _appendParamToIframeSource('data-src', 'player.vimeo.com/', 'api=1');
    }

    startEmbeddedContent(element) {
        if (element && !this.deck.notes.isSpeakerNotesWindow()) {
            // Restart GIFs
            queryAll(element, 'img[src$=".gif"]').forEach(function (el) {
                // Setting the same unchanged source like this was confirmed
                // to work in Chrome, FF & Safari
                el.setAttribute('src', el.getAttribute('src'));
            });
            // HTML5 media elements
            queryAll(element, 'video, audio').forEach(function (el) {
                if (closest(el, '.fragment') && !closest(el, '.fragment.visible')) {
                    return;
                }
                // Prefer an explicit global autoplay setting
                let autoplay = this.deck.config.autoPlayMedia;
                // If no global setting is available, fall back on the element's
                // own autoplay setting
                if (typeof autoplay !== 'boolean') {
                    autoplay = el.hasAttribute('data-autoplay') || !!closest(el, '.slide-background');
                }
                if (autoplay && typeof el.play === 'function') {
                    // If the media is ready, start playback
                    if (el.readyState > 1) {
                        this.startEmbeddedMedia({target: el});
                    }
                        // Mobile devices never fire a loaded event so instead
                    // of waiting, we initiate playback
                    else if (isMobile) {
                        let promise = el.play();
                        // If autoplay does not work, ensure that the controls are visible so
                        // that the viewer can start the media on their own
                        if (promise && typeof promise.catch === 'function' && el.controls === false) {
                            promise.catch(() => {
                                el.controls = true;

                                // Once the video does start playing, hide the controls again
                                el.addEventListener('play', () => {
                                    el.controls = false;
                                });
                            });
                        }
                    }
                    // If the media isn't loaded, wait before playing
                    else {
                        el.removeEventListener('loadeddata', this.startEmbeddedMedia); // remove first to avoid dupes
                        el.addEventListener('loadeddata', this.startEmbeddedMedia);
                    }
                }
            }, this);
            // Normal iframes
            queryAll(element, IFRAME_SRC).forEach(function (el) {
                if (closest(el, '.fragment') && !closest(el, '.fragment.visible')) {
                    return;
                }
                this.startEmbeddedIframe({target: el});
            }, this);

            // Lazy loading iframes
            queryAll(element, IFRAME_DATA_SRC).forEach(function (el) {
                if (closest(el, '.fragment') && !closest(el, '.fragment.visible')) {
                    return;
                }
                if (el.getAttribute('src') !== el.getAttribute('data-src')) {
                    el.removeEventListener('load', this.startEmbeddedIframe); // remove first to avoid dupes
                    el.addEventListener('load', this.startEmbeddedIframe);
                    el.setAttribute('src', el.getAttribute('data-src'));
                }
            }, this);
        }
    }

    startEmbeddedMedia(event) {
        let isAttachedToDOM = !!closest(event.target, 'html'),
            isVisible = !!closest(event.target, '.present');
        if (isAttachedToDOM && isVisible) {
            event.target.currentTime = 0;
            event.target.play();
        }
        event.target.removeEventListener('loadeddata', this.startEmbeddedMedia);
    }

    startEmbeddedIframe(event) {
        let iframe = event.target;
        if (iframe && iframe.contentWindow) {
            let isAttachedToDOM = !!closest(event.target, 'html'),
                isVisible = !!closest(event.target, '.present');
            if (isAttachedToDOM && isVisible) {
                // Prefer an explicit global autoplay setting
                let autoplay = this.deck.config.autoPlayMedia;
                // If no global setting is available, fall back on the element's
                // own autoplay setting
                if (typeof autoplay !== 'boolean') {
                    autoplay = iframe.hasAttribute('data-autoplay') || !!closest(iframe, '.slide-background');
                }
            }
        }
    }

    stopEmbeddedContent(el, options = {}) {
        options = extend({
            // Defaults
            unloadIframes: true
        }, options);
        if (el && el.parentNode) {
            // HTML5 media elements
            queryAll(el, 'video, audio').forEach(function (el) {
                if (!el.hasAttribute('data-ignore') && typeof el.pause === 'function') {
                    el.setAttribute('data-paused-by-reveal', '');
                    el.pause();
                }
            });
            // Generic postMessage API for non-lazy loaded iframes
            queryAll(el, 'iframe').forEach(function (el) {
                el.removeEventListener('load', this.startEmbeddedIframe);
            }, this);

            if (options.unloadIframes === true) {
                // Unload lazy-loaded iframes
                queryAll(el, IFRAME_DATA_SRC).forEach(function (el) {
                    // Only removing the src doesn't actually unload the frame
                    // in all browsers (Firefox) so we set it to blank first
                    el.setAttribute('src', 'about:blank');
                    el.removeAttribute('src');
                });
            }
        }
    }
}

export {SlideContent}
