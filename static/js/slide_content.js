import { queryAll, extend, closest, isMobile, fitty } from './utils.js';
import { Deck } from './deck.js';

const IFRAME_DATA_SRC = 'iframe[data-src]';
const IMG_DATA_SRC = 'img[data-src]';
const VIDEO_DATA_SRC = 'video[data-src]';
const AUDIO_DATA_SRC = 'audio[data-src]';
const SOURCE_DATA_SRC = 'source[data-src]';
const VIDEO_DATA_LAZY_SRC = 'video[data-lazy-loaded][src]';
const AUDIO_DATA_LAZY_SRC = 'audio[data-lazy-loaded][src]';
const IFRAME_DATA_LAZY_SRC = 'iframe[data-lazy-loaded][src]';
const IFRAME_SRC = 'iframe[src]';
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
        this.deck.on('synced', function(event) {
            this.formatEmbeddedContent();
        }.bind(this));
        this.deck.on('syncSlide', function(event) {
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
        queryAll(slide, `${IMG_DATA_SRC}, ${VIDEO_DATA_SRC}, ${AUDIO_DATA_SRC}, ${IFRAME_DATA_SRC}`).forEach(function(element) {
            if (element.tagName !== 'IFRAME' || this.shouldPreload(element)) {
                element.setAttribute('src', element.getAttribute('data-src'));
                element.setAttribute('data-lazy-loaded', '');
                element.removeAttribute('data-src');
            }
        }, this);
        // Media elements with <source> children
        queryAll(slide, 'video, audio').forEach(function(media) {
            let sources = 0;
            queryAll(media, SOURCE_DATA_SRC).forEach(function(source) {
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
                    backgroundVideo.split(',').forEach(function(source) {
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
        Array.from(slide.querySelectorAll('.r-fit-text:not([data-fitted])')).forEach(function(element) {
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
            queryAll(background, IFRAME_SRC).forEach(function(el) {
                el.removeAttribute('src');
            });
        }
        // Reset lazy-loaded media elements with src attributes
        queryAll(slide, `${VIDEO_DATA_LAZY_SRC}, ${AUDIO_DATA_LAZY_SRC}, ${IFRAME_DATA_LAZY_SRC}`).forEach(function(el) {
            el.setAttribute('data-src', el.getAttribute('src'));
            el.removeAttribute('src');
        });
        // Reset lazy-loaded media elements with <source> children
        queryAll(slide, 'video[data-lazy-loaded] source[src], audio source[src]').forEach(function(src) {
            src.setAttribute('data-src', src.getAttribute('src'));
            src.removeAttribute('src');
        });
    }

    formatEmbeddedContent() {
        let _appendParamToIframeSource = function(srcAttr, srcURL, param) {
            queryAll(this.deck.dom.slides, 'iframe[' + srcAttr + '*="' + srcURL + '"]').forEach(function(el) {
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
            queryAll(element, 'img[src$=".gif"]').forEach(function(el) {
                // Setting the same unchanged source like this was confirmed
                // to work in Chrome, FF & Safari
                el.setAttribute('src', el.getAttribute('src'));
            });
            // HTML5 media elements
            queryAll(element, 'video, audio').forEach(function(el) {
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
                        this.startEmbeddedMedia({ target: el });
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
            queryAll(element, IFRAME_SRC).forEach(function(el) {
                if (closest(el, '.fragment') && !closest(el, '.fragment.visible')) {
                    return;
                }
                this.startEmbeddedIframe({ target: el });
            }, this);

            // Lazy loading iframes
            queryAll(element, IFRAME_DATA_SRC).forEach(function(el) {
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
                // YouTube postMessage API
                if (/youtube\.com\/embed\//.test(iframe.getAttribute('src')) && autoplay) {
                    iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                }
                // Vimeo postMessage API
                else if (/player\.vimeo\.com\//.test(iframe.getAttribute('src')) && autoplay) {
                    iframe.contentWindow.postMessage('{"method":"play"}', '*');
                }
                // Generic postMessage API
                else {
                    iframe.contentWindow.postMessage('slide:start', '*');
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
            queryAll(el, 'video, audio').forEach(function(el) {
                if (!el.hasAttribute('data-ignore') && typeof el.pause === 'function') {
                    el.setAttribute('data-paused-by-reveal', '');
                    el.pause();
                }
            });
            // Generic postMessage API for non-lazy loaded iframes
            queryAll(el, 'iframe').forEach(function(el) {
                if (el.contentWindow) el.contentWindow.postMessage('slide:stop', '*');
                el.removeEventListener('load', this.startEmbeddedIframe);
            }, this);
            // YouTube postMessage API
            queryAll(el, 'iframe[src*="youtube.com/embed/"]').forEach(function(el) {
                if (!el.hasAttribute('data-ignore') && el.contentWindow && typeof el.contentWindow.postMessage === 'function') {
                    el.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                }
            });
            // Vimeo postMessage API
            queryAll(el, 'iframe[src*="player.vimeo.com/"]').forEach(function(el) {
                if (!el.hasAttribute('data-ignore') && el.contentWindow && typeof el.contentWindow.postMessage === 'function') {
                    el.contentWindow.postMessage('{"method":"pause"}', '*');
                }
            });
            if (options.unloadIframes === true) {
                // Unload lazy-loaded iframes
                queryAll(el, IFRAME_DATA_SRC).forEach(function(el) {
                    // Only removing the src doesn't actually unload the frame
                    // in all browsers (Firefox) so we set it to blank first
                    el.setAttribute('src', 'about:blank');
                    el.removeAttribute('src');
                });
            }
        }
    }
}

export { SlideContent }