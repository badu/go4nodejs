import {
    closest,
    transformElement,
    deserialize,
    toggleClass,
    queryAll,
    extend,
    SLIDES_SELECTOR,
    isMobile,
    supportsZoom
} from './utils.js'

import { Config } from './config.js';
import { Fragments } from './fragments.js';
import { Controls } from './controls.js';
import { Keyboard } from './keyboard.js';
import { Location } from './location.js';
import { Notes } from './notes.js';
import { Overview } from './overview.js';
import { Playback } from './playback.js';
import { Pointer } from './pointer.js';
import { Print } from './print.js';
import { Progress } from './progress.js';
import { Touch } from './touch.js'
import { SlideNumber } from './slide_number.js';
import { Plugins } from './plugins.js';
import { AutoAnimate } from './auto_animate.js';
import { Backgrounds } from './backgrounds.js';
import { SlideContent } from './slide_content.js';
import { Focus } from './focus.js';

const HORIZONTAL_SLIDES_SELECTOR = '.slides>section';
const VERTICAL_SLIDES_SELECTOR = '.slides>section.present>section';
const POST_MESSAGE_METHOD_BLACKLIST = /registerPlugin|registerKeyboardShortcut|addKeyBinding|addEventListener/; // Methods that may not be invoked via the postMessage API
class Deck {
    config = new Config();
    ready = false; // Flags if  is loaded (has dispatched the 'ready' event)
    indexh; // The horizontal and vertical index of the currently active slide
    indexv;
    previousSlide; // The previous and current slide HTML elements
    currentSlide;
    navigationHistory = { // Remember which directions that the user has navigated towards
        hasNavigatedHorizontally: false,
        hasNavigatedVertically: false
    };
    state = []; // Slides may have a data-state attribute which we pick up and apply as a class to the body. This list contains the combined state of all current slides.
    scale = 1; // The current scale of the presentation (see width/height config)    
    slidesTransform = { layout: '', overview: '' }; // CSS transform that is currently applied to the slides container, split into two groups
    dom = {}; // Cached references to DOM elements
    eventsAreBound = false; // Flags if the interaction event listeners are bound
    transition = 'idle'; // The current slide transition state; idle or running
    autoSlideDuration = 0; // The current auto-slide duration
    autoSlidePlayer; // Auto slide properties
    autoSlideTimeout = 0;
    autoSlideStartTime = -1;
    autoSlidePaused = false;
    deckElement = {};

    constructor(el) {
        this.deckElement = el;
        this.dom.wrapper = el;
        this.dom.slides = el.querySelector('.slides');

        this.slideContent = new SlideContent(this);
        this.slideNumber = new SlideNumber(this);
        this.autoAnimate = new AutoAnimate(this);
        this.backgrounds = new Backgrounds(this);
        this.fragments = new Fragments(this);
        this.overview = new Overview(this);
        this.keyboard = new Keyboard(this);
        this.location = new Location(this);
        this.controls = new Controls(this);
        this.progress = new Progress(this);
        this.pointer = new Pointer(this);
        this.plugins = new Plugins(this);
        this.print = new Print(this);
        this.focus = new Focus(this);
        this.touch = new Touch(this);
        this.notes = new Notes(this);

        this.onTransitionEnd = this.onTransitionEnd.bind(this);
        this.onPageVisibilityChange = this.onPageVisibilityChange.bind(this);
        this.onPostMessage = this.onPostMessage.bind(this);
        this.resume = this.resume.bind(this);
        this.onPreviewLinkClicked = this.onPreviewLinkClicked.bind(this);
        this.closeOverlay = this.closeOverlay.bind(this);
        this.layout = this.layout.bind(this);
        this.dispatchPostMessage = this.dispatchPostMessage.bind(this);
        this.dispatchEvent = this.dispatchEvent.bind(this);
        this.onUserInput = this.onUserInput.bind(this);
        this.onAutoSlidePlayerClick = this.onAutoSlidePlayerClick.bind(this);
    }

    getConfig() {
        return this.config;
    }

    on(type, listener, useCapture) {
        this.deckElement.addEventListener(type, listener, useCapture);
    }

    off(type, listener, useCapture) {
        this.deckElement.removeEventListener(type, listener, useCapture);
    }

    initialize(initOptions) {
        this.config = {...this.config, ...initOptions, ...this.location.getQueryHash() };
        this.setViewport();
        window.addEventListener('load', this.layout, false); // Force a layout when the whole page, incl fonts, has loaded
        this.plugins.load(this.config.plugins, this.config.dependencies).then(function() { // Register plugins and load dependencies, then move on to #start()
            this.start()
        }.bind(this));
        return new Promise(resolve => this.addEventListener('ready', resolve));
    }

    setViewport() {

        if (this.config.embedded === true) { // Embedded decks use the reveal element as their viewport
            this.dom.viewport = closest(revealElement, '.reveal-viewport') || revealElement;
        } else { // Full-page decks use the body as their viewport
            this.dom.viewport = document.body;
            document.documentElement.classList.add('reveal-full-page');
        }
        this.dom.viewport.classList.add('reveal-viewport');
    }

    start() {
        this.ready = true;
        this.removeHiddenSlides(); // Remove slides hidden with data-visibility
        this.setupDOM(); // Make sure we've got all the DOM elements we need
        this.setupPostMessage(); // Listen to messages posted to this window
        this.setupScrollPrevention(); // Prevent the slides from being scrolled out of view
        this.resetVerticalSlides(); // Resets all vertical slides so that only the first is visible
        this.configure(); // Updates the presentation to match the current configuration values
        this.location.readURL(); // Read the initial hash
        this.backgrounds.update(true); // Create slide backgrounds       
        let timeoutFn = function() { // Notify listeners that the presentation is ready but use a 1ms timeout to ensure it's not fired synchronously after #initialize()
            // Enable transitions now that we're loaded
            this.dom.slides.classList.remove('no-transition');
            this.dom.wrapper.classList.add('ready');
            const indexh = this.indexh;
            const indexv = this.indexv;
            const currentSlide = this.currentSlide;
            const target = this.dom.wrapper;
            this.dispatchEvent({
                target: target,
                type: 'ready',
                data: {
                    indexh,
                    indexv,
                    currentSlide
                }
            });
            this.dispatchPostMessage('ready')
        }.bind(this);

        setTimeout(timeoutFn, 1);

        if (this.print.isPrintingPDF()) { // Special setup and config is required when printing to PDF
            this.removeEventListeners();
            if (document.readyState === 'complete') { // The document needs to have loaded for the PDF layout measurements to be accurate
                this.print.setupPDF();
            } else {
                window.addEventListener('load', this.print.setupPDF);
            }
        }
    }

    removeHiddenSlides() {
        if (!this.config.showHiddenSlides) {
            queryAll(this.dom.wrapper, 'section[data-visibility="hidden"]').forEach(function(slide) {
                slide.parentNode.removeChild(slide);
            });
        }
    }

    createSingletonNode(container, tagname, classname, innerHTML = '') {
        // Find all nodes matching the description
        let nodes = container.querySelectorAll('.' + classname);
        // Check all matches to find one which is a direct child of
        // the specified container
        for (let i = 0; i < nodes.length; i++) {
            let testNode = nodes[i];
            if (testNode.parentNode === container) {
                return testNode;
            }
        }
        // If no node was found, create it now
        let node = document.createElement(tagname);
        node.className = classname;
        node.innerHTML = innerHTML;
        container.appendChild(node);
        return node;

    }

    setupDOM() {
        this.dom.slides.classList.add('no-transition'); // Prevent transitions while we're loading
        if (isMobile) {
            this.dom.wrapper.classList.add('no-hover');
        } else {
            this.dom.wrapper.classList.remove('no-hover');
        }
        this.backgrounds.render();
        this.slideNumber.render();
        this.controls.render(this.deckElement, this.config.rtl);
        this.progress.render();
        this.notes.render();
        this.dom.pauseOverlay = this.createSingletonNode(this.dom.wrapper, 'div', 'pause-overlay', this.config.controls ? '<button class="resume-button">Resume presentation</button>' : null); // Overlay graphic which is displayed during the paused mode
        this.dom.statusElement = this.createStatusElement();
        this.dom.wrapper.setAttribute('role', 'application');
    }

    createStatusElement() {
        let statusElement = this.dom.wrapper.querySelector('.aria-status');
        if (!statusElement) {
            statusElement = document.createElement('div');
            statusElement.style.position = 'absolute';
            statusElement.style.height = '1px';
            statusElement.style.width = '1px';
            statusElement.style.overflow = 'hidden';
            statusElement.style.clip = 'rect( 1px, 1px, 1px, 1px )';
            statusElement.classList.add('aria-status');
            statusElement.setAttribute('aria-live', 'polite');
            statusElement.setAttribute('aria-atomic', 'true');
            this.dom.wrapper.appendChild(statusElement);
        }
        return statusElement;
    }

    announceStatus(value) {
        this.dom.statusElement.textContent = value;
    }

    getStatusText(node) {
        let text = '';
        // Text node
        if (node.nodeType === 3) {
            text += node.textContent;
        }
        // Element node
        else if (node.nodeType === 1) {
            let isAriaHidden = node.getAttribute('aria-hidden');
            let isDisplayHidden = window.getComputedStyle(node)['display'] === 'none';
            if (isAriaHidden !== 'true' && !isDisplayHidden) {
                Array.from(node.childNodes).forEach(function(child) {
                    text += this.getStatusText(child);
                }, this);
            }
        }
        text = text.trim();
        return text === '' ? '' : text + ' ';
    }

    setupScrollPrevention() {
        setInterval(function() {
            if (this.dom.wrapper.scrollTop !== 0 || this.dom.wrapper.scrollLeft !== 0) {
                this.dom.wrapper.scrollTop = 0;
                this.dom.wrapper.scrollLeft = 0;
            }
        }.bind(this), 1000);
    }

    configure(options) {
        const oldConfig = {...this.config }
            // New config options may be passed when this method
            // is invoked through the API after initialization
        if (typeof options === 'object') extend(this.config, options);
        // Abort if  hasn't finished loading, config
        // changes will be applied automatically once ready
        if (this.isReady === false) return;
        const numberOfSlides = this.dom.wrapper.querySelectorAll(SLIDES_SELECTOR).length;
        // The transition is added as a class on the .reveal element
        this.dom.wrapper.classList.remove(oldConfig.transition);
        this.dom.wrapper.classList.add(this.config.transition);
        this.dom.wrapper.setAttribute('data-transition-speed', this.config.transitionSpeed);
        this.dom.wrapper.setAttribute('data-background-transition', this.config.backgroundTransition);
        // Expose our configured slide dimensions as custom props
        this.dom.viewport.style.setProperty('--slide-width', this.config.width + 'px');
        this.dom.viewport.style.setProperty('--slide-height', this.config.height + 'px');
        if (this.config.shuffle) {
            this.shuffle();
        }
        toggleClass(this.dom.wrapper, 'embedded', this.config.embedded);
        toggleClass(this.dom.wrapper, 'rtl', this.config.rtl);
        toggleClass(this.dom.wrapper, 'center', this.config.center);
        // Exit the paused mode if it was configured off
        if (this.config.pause === false) {
            this.resume();
        }
        // Iframe link previews
        if (this.config.previewLinks) {
            this.enablePreviewLinks();
            this.disablePreviewLinks('[data-preview-link=false]');
        } else {
            this.disablePreviewLinks();
            this.enablePreviewLinks('[data-preview-link]:not([data-preview-link=false])');
        }
        // Reset all changes made by auto-animations
        this.autoAnimate.reset();
        // Remove existing auto-slide controls
        if (this.autoSlidePlayer) {
            this.autoSlidePlayer.destroy();
            this.autoSlidePlayer = null;
        }
        // Generate auto-slide controls if needed
        if (numberOfSlides > 1 && this.config.autoSlide && this.config.autoSlideStoppable) {
            this.autoSlidePlayer = new Playback(this.dom.wrapper, function() {
                return Math.min(Math.max((Date.now() - this.autoSlideStartTime) / this.autoSlideDuration, 0), 1);
            }.bind(this));
            this.autoSlidePlayer.on('click', onAutoSlidePlayerClick);
            this.autoSlidePaused = false;
        }
        // Add the navigation mode to the DOM so we can adjust styling
        if (this.config.navigationMode !== 'default') {
            this.dom.wrapper.setAttribute('data-navigation-mode', this.config.navigationMode);
        } else {
            this.dom.wrapper.removeAttribute('data-navigation-mode');
        }
        this.notes.configure(this.config, oldConfig);
        this.focus.configure(this.config, oldConfig);
        this.pointer.configure(this.config, oldConfig);
        this.controls.configure(this.config);
        this.progress.configure(this.config, oldConfig);
        this.keyboard.configure(this.config, oldConfig);
        this.fragments.configure(this.config, oldConfig);
        this.slideNumber.configure(this.config, oldConfig);
        this.sync();
    }

    onTransitionEnd(event) {
        if (this.transition === 'running' && /section/gi.test(event.target.nodeName)) {
            this.transition = 'idle';
            this.dispatchEvent({
                type: 'slidetransitionend',
                data: {
                    indexh: this.indexh,
                    indexv: this.indexv,
                    previousSlide: this.previousSlide,
                    currentSlide: this.currentSlide
                }
            });
        }
    }

    onPageVisibilityChange(event) {
        if (document.hidden === false && document.activeElement !== document.body) { // If, after clicking a link or similar and we're coming back, focus the document.body to ensure we can use keyboard shortcuts
            if (typeof document.activeElement.blur === 'function') { // Not all elements support .blur() - SVGs among them.
                document.activeElement.blur();
            }
            document.body.focus();
        };
    }

    addEventListeners() {
        this.eventsAreBound = true;
        window.addEventListener('resize', this.layout, false);
        if (this.config.touch) this.touch.bind();
        if (this.config.keyboard) this.keyboard.bind();
        if (this.config.progress) this.progress.bind();
        if (this.config.respondToHashChanges) this.location.bind();
        this.controls.bind();
        this.focus.bind();
        this.dom.slides.addEventListener('transitionend', this.onTransitionEnd, false);
        this.dom.pauseOverlay.addEventListener('click', this.resume, false);
        if (this.config.focusBodyOnPageVisibilityChange) {
            document.addEventListener('visibilitychange', this.onPageVisibilityChange, false);
        }
    }

    removeEventListeners() {
        this.eventsAreBound = false;
        this.touch.unbind();
        this.focus.unbind();
        this.keyboard.unbind();
        this.controls.unbind();
        this.progress.unbind();
        this.location.unbind();
        window.removeEventListener('resize', this.layout, false);
        this.dom.slides.removeEventListener('transitionend', this.onTransitionEnd, false);
        this.dom.pauseOverlay.removeEventListener('click', this.resume, false);
        if (this.config.focusBodyOnPageVisibilityChange) {
            document.removeEventListener('visibilitychange', this.onPageVisibilityChange, false);
        }
    }

    addEventListener(type, listener, useCapture) {
        this.deckElement.addEventListener(type, listener, useCapture);
    }

    removeEventListener(type, listener, useCapture) {
        this.deckElement.removeEventListener(type, listener, useCapture);
    }

    transformSlides(transforms) {
        // Pick up new transforms from arguments
        if (typeof transforms.layout === 'string') this.slidesTransform.layout = transforms.layout;
        if (typeof transforms.overview === 'string') this.slidesTransform.overview = transforms.overview;
        // Apply the transforms to the slides container
        if (this.slidesTransform.layout) {
            transformElement(this.dom.slides, this.slidesTransform.layout + ' ' + this.slidesTransform.overview);
        } else {
            transformElement(this.dom.slides, this.slidesTransform.overview);
        }
    }

    dispatchEvent({ target = this.dom.wrapper, type, data, bubbles = true }) {
        let event = document.createEvent('HTMLEvents', 1, 2);
        event.initEvent(type, bubbles, true);
        extend(event, data);
        target.dispatchEvent(event);
        if (target === this.dom.wrapper) {
            this.dispatchPostMessage(type); // If we're in an iframe, post each reveal.js event to the parent window. Used by the notes plugin
        }
    }

    dispatchPostMessage(type, data) {
        if (this.config.postMessageEvents && window.parent !== window.self) {
            let message = {
                namespace: 'deck',
                eventName: type,
                state: this.getState()
            };
            extend(message, data);
            window.parent.postMessage(JSON.stringify(message), '*');
        }
    }

    enablePreviewLinks(selector = 'a') {
        Array.from(this.dom.wrapper.querySelectorAll(selector)).forEach(function(el) {
            if (/^(http|www)/gi.test(el.getAttribute('href'))) {
                el.addEventListener('click', this.onPreviewLinkClicked, false);
            }
        }, this);
    }

    disablePreviewLinks(selector = 'a') {
        Array.from(this.dom.wrapper.querySelectorAll(selector)).forEach(function(el) {
            if (/^(http|www)/gi.test(el.getAttribute('href'))) {
                el.removeEventListener('click', this.onPreviewLinkClicked, false);
            }
        }, this);
    }

    showPreview(url) {
        this.closeOverlay();
        this.dom.overlay = document.createElement('div');
        this.dom.overlay.classList.add('overlay');
        this.dom.overlay.classList.add('overlay-preview');
        this.dom.wrapper.appendChild(dom.overlay);
        this.dom.overlay.innerHTML =
            `<header>
				<a class="close" href="#"><span class="icon"></span></a>
				<a class="external" href="${url}" target="_blank"><span class="icon"></span></a>
			</header>
			<div class="spinner"></div>
			<div class="viewport">
				<iframe src="${url}"></iframe>
				<small class="viewport-inner">
					<span class="x-frame-error">Unable to load iframe. This is likely due to the site's policy (x-frame-options).</span>
				</small>
			</div>`;
        this.dom.overlay.querySelector('iframe').addEventListener('load', function(event) {
            this.dom.overlay.classList.add('loaded');
        }.bind(this), false);
        this.dom.overlay.querySelector('.close').addEventListener('click', function(event) {
            this.closeOverlay();
            event.preventDefault();
        }.bind(this), false);
        dom.overlay.querySelector('.external').addEventListener('click', this.closeOverlay, false);
    }

    toggleHelp(override) {
        if (typeof override === 'boolean') {
            override ? this.showHelp() : this.closeOverlay();
        } else {
            if (this.dom.overlay) {
                this.closeOverlay();
            } else {
                this.showHelp();
            }
        }
    }

    showHelp() {
        if (!this.config.help) {
            return;
        }
        this.closeOverlay();
        this.dom.overlay = document.createElement('div');
        this.dom.overlay.classList.add('overlay');
        this.dom.overlay.classList.add('overlay-help');
        this.dom.wrapper.appendChild(dom.overlay);
        let html = '<p class="title">Keyboard Shortcuts</p><br/>';
        let shortcuts = this.keyboard.getShortcuts(),
            bindings = this.keyboard.getBindings();
        html += '<table><th>KEY</th><th>ACTION</th>';
        for (let key in shortcuts) {
            html += `<tr><td>${key}</td><td>${shortcuts[key]}</td></tr>`;
        }
        for (let binding in bindings) { // Add custom key bindings that have associated descriptions
            if (bindings[binding].key && bindings[binding].description) {
                html += `<tr><td>${bindings[binding].key}</td><td>${bindings[binding].description}</td></tr>`;
            }
        }
        html += '</table>';
        this.dom.overlay.innerHTML = `
				<header>
					<a class="close" href="#"><span class="icon"></span></a>
				</header>
				<div class="viewport">
					<div class="viewport-inner">${html}</div>
				</div>
			`;
        this.dom.overlay.querySelector('.close').addEventListener('click', event => {
            this.closeOverlay();
            event.preventDefault();
        }, false);
    }

    closeOverlay() {
        if (this.dom.overlay) {
            this.dom.overlay.parentNode.removeChild(dom.overlay);
            this.dom.overlay = null;
            return true;
        }
        return false;
    }

    layout() {
        if (!this.dom.wrapper) {
            return;
        }
        if (this.print.isPrintingPDF()) {
            return;
        }

        if (!this.config.disableLayout) {
            if (this.isMobile && !this.config.embedded) {
                document.documentElement.style.setProperty('--vh', (window.innerHeight * 0.01) + 'px');
            }
            const size = this.getComputedSlideSize();
            const oldScale = this.scale;

            this.layoutSlideContents(this.config.width, this.config.height); // Layout the contents of the slides
            this.dom.slides.style.width = size.width + 'px';
            this.dom.slides.style.height = size.height + 'px';

            this.scale = Math.min(size.presentationWidth / size.width, size.presentationHeight / size.height); // Determine scale of content to fit within available space

            this.scale = Math.max(this.scale, this.config.minScale); // Respect max/min scale settings
            this.scale = Math.min(this.scale, this.config.maxScale);

            if (this.scale === 1) { // Don't apply any scaling styles if scale is 1
                this.dom.slides.style.zoom = '';
                this.dom.slides.style.left = '';
                this.dom.slides.style.top = '';
                this.dom.slides.style.bottom = '';
                this.dom.slides.style.right = '';
                this.transformSlides({ layout: '' });
            } else {
                if (this.scale > 1 && supportsZoom && window.devicePixelRatio < 2) {
                    this.dom.slides.style.zoom = this.scale;
                    this.dom.slides.style.left = '';
                    this.dom.slides.style.top = '';
                    this.dom.slides.style.bottom = '';
                    this.dom.slides.style.right = '';
                    this.transformSlides({ layout: '' });
                } else {
                    this.dom.slides.style.zoom = '';
                    this.dom.slides.style.left = '50%';
                    this.dom.slides.style.top = '50%';
                    this.dom.slides.style.bottom = 'auto';
                    this.dom.slides.style.right = 'auto';
                    this.transformSlides({ layout: 'translate(-50%, -50%) scale(' + this.scale + ')' });
                }
            }
            const slides = Array.from(this.dom.wrapper.querySelectorAll(SLIDES_SELECTOR)); // Select all slides, vertical and horizontal
            slides.forEach(function(slide) {
                if (slide.style.display === 'none') { // Don't bother updating invisible slides
                    return;
                }
                if (this.config.center || slide.classList.contains('center')) {
                    if (slide.classList.contains('stack')) { // Vertical stacks are not centred since their section children will be
                        slide.style.top = 0;
                    } else {
                        slide.style.top = Math.max((size.height - slide.scrollHeight) / 2, 0) + 'px';
                    }
                } else {
                    slide.style.top = '';
                }
            }, this);
            if (oldScale !== this.scale) {
                this.dispatchEvent({
                    type: 'resize',
                    data: {
                        oldScale: oldScale,
                        scale: this.scale,
                        size: size
                    }
                });
            }
        }
        this.progress.update();
        this.backgrounds.updateParallax();
        if (this.overview.isActive()) {
            this.overview.update();
        }
    }

    getRemainingHeight(element, height = 0) {
        if (element) {
            let newHeight, oldHeight = element.style.height;
            element.style.height = '0px'; // Change the .stretch element height to 0 in order find the height of all the other elements        
            element.parentNode.style.height = 'auto'; // In Overview mode, the parent (.slide) height is set of 700px. Restore it temporarily to its natural height.
            newHeight = height - element.parentNode.offsetHeight;
            element.style.height = oldHeight + 'px'; // Restore the old height, just in case
            element.parentNode.style.removeProperty('height'); // Clear the parent (.slide) height. .removeProperty works in IE9+
            return newHeight;
        }
        return height;
    }

    layoutSlideContents(width, height) {
        queryAll(this.dom.slides, 'section > .stretch, section > .r-stretch').forEach(function(el) { // Handle sizing of elements with the 'r-stretch' class
            let remainingHeight = this.getRemainingHeight(el, height); // Determine how much vertical space we can use
            if (/(img|video)/gi.test(el.nodeName)) { // Consider the aspect ratio of media elements
                const nw = el.naturalWidth || el.videoWidth,
                    nh = el.naturalHeight || el.videoHeight;
                const es = Math.min(width / nw, remainingHeight / nh);
                el.style.width = (nw * es) + 'px';
                el.style.height = (nh * es) + 'px';
            } else {
                el.style.width = width + 'px';
                el.style.height = remainingHeight + 'px';
            }
        }, this);
    }

    getComputedSlideSize(presentationWidth, presentationHeight) {
        const size = {
            width: this.config.width, // Slide size
            height: this.config.height,
            presentationWidth: presentationWidth || this.dom.wrapper.offsetWidth, // Presentation size
            presentationHeight: presentationHeight || this.dom.wrapper.offsetHeight
        };
        size.presentationWidth -= (size.presentationWidth * this.config.margin); // Reduce available space by margin
        size.presentationHeight -= (size.presentationHeight * this.config.margin);
        if (typeof size.width === 'string' && /%$/.test(size.width)) { // Slide width may be a percentage of available width
            size.width = parseInt(size.width, 10) / 100 * size.presentationWidth;
        }
        if (typeof size.height === 'string' && /%$/.test(size.height)) { // Slide height may be a percentage of available height
            size.height = parseInt(size.height, 10) / 100 * size.presentationHeight;
        }
        return size;
    }

    setPreviousVerticalIndex(stack, v) {
        if (typeof stack === 'object' && typeof stack.setAttribute === 'function') {
            stack.setAttribute('data-previous-indexv', v || 0);
        }
    }

    getPreviousVerticalIndex(stack) {
        if (typeof stack === 'object' && typeof stack.setAttribute === 'function' && stack.classList.contains('stack')) {
            const attributeName = stack.hasAttribute('data-start-indexv') ? 'data-start-indexv' : 'data-previous-indexv'; // Prefer manually defined start-indexv
            return parseInt(stack.getAttribute(attributeName) || 0, 10);
        }
        return 0;
    }

    isVerticalSlide(slide = this.currentSlide) {
        return slide && slide.parentNode && !!slide.parentNode.nodeName.match(/section/i);
    }

    isLastVerticalSlide() {
        if (this.currentSlide && this.isVerticalSlide(this.currentSlide)) {
            if (this.currentSlide.nextElementSibling) return false; // Does this slide have a next sibling?
            return true;
        }
        return false;
    }

    isFirstSlide() {
        return this.indexh === 0 && this.indexv === 0;
    }

    isLastSlide() {
        if (this.currentSlide) {
            if (this.currentSlide.nextElementSibling) return false; // Does this slide have a next sibling?            
            if (this.isVerticalSlide(this.currentSlide) && this.currentSlide.parentNode.nextElementSibling) return false; // If it's vertical, does its parent have a next sibling?
            return true;
        }
        return false;
    }

    pause() {
        if (!this.config.pause) {
            return;
        }
        const wasPaused = this.dom.wrapper.classList.contains('paused');
        this.cancelAutoSlide();
        this.dom.wrapper.classList.add('paused');
        if (wasPaused === false) {
            this.dispatchEvent({ type: 'paused' });
        }
    }

    resume() {
        const wasPaused = this.dom.wrapper.classList.contains('paused');
        this.dom.wrapper.classList.remove('paused');
        this.cueAutoSlide();
        if (wasPaused) {
            this.dispatchEvent({ type: 'resumed' });
        }
    }

    togglePause(override) {
        if (typeof override === 'boolean') {
            override ? this.pause() : this.resume();
        } else {
            this.isPaused() ? this.resume() : this.pause();
        }
    }

    isPaused() {
        return this.dom.wrapper.classList.contains('paused');
    }

    toggleAutoSlide(override) {
        if (typeof override === 'boolean') {
            override ? this.resumeAutoSlide() : this.pauseAutoSlide();
        } else {
            this.autoSlidePaused ? this.resumeAutoSlide() : this.pauseAutoSlide();
        }
    }

    isAutoSliding() {
        return !!(this.autoSlideDuration && !this.autoSlidePaused);
    }

    slide(hIdx, vIdx, fragment, origin) {
        this.previousSlide = this.currentSlide; // Remember where we were at before
        const horizontalSlides = this.dom.wrapper.querySelectorAll(HORIZONTAL_SLIDES_SELECTOR); // Query all horizontal slides in the deck
        if (horizontalSlides.length === 0) return; // Abort if there are no slides
        if (vIdx === undefined && !this.overview.isActive()) { // If no vertical index is specified and the upcoming slide is a stack, resume at its previous vertical index
            vIdx = this.getPreviousVerticalIndex(horizontalSlides[hIdx]);
        }
        // If we were on a vertical stack, remember what vertical index
        // it was on so we can resume at the same position when returning
        if (this.previousSlide && this.previousSlide.parentNode && this.previousSlide.parentNode.classList.contains('stack')) {
            this.setPreviousVerticalIndex(this.previousSlide.parentNode, this.indexv);
        }
        const stateBefore = this.state.concat(); // Remember the state before this slide
        this.state.length = 0; // Reset the state array
        let indexhBefore = this.indexh || 0,
            indexvBefore = this.indexv || 0;
        this.indexh = this.updateSlides(HORIZONTAL_SLIDES_SELECTOR, hIdx === undefined ? this.indexh : hIdx); // Activate and transition to the new slide
        this.indexv = this.updateSlides(VERTICAL_SLIDES_SELECTOR, vIdx === undefined ? this.indexv : vIdx);
        let slideChanged = (this.indexh !== indexhBefore || this.indexv !== indexvBefore); // Dispatch an event if the slide changed
        if (!slideChanged) this.previousSlide = null; // Ensure that the previous slide is never the same as the current
        let currentHorizontalSlide = horizontalSlides[this.indexh], // Find the current horizontal slide and any possible vertical slides  within it
            currentVerticalSlides = currentHorizontalSlide.querySelectorAll('section');
        this.currentSlide = currentVerticalSlides[this.indexv] || currentHorizontalSlide; // Store references to the previous and current slides
        let autoAnimateTransition = false;
        if (slideChanged && this.previousSlide && this.currentSlide && !this.overview.isActive()) { // Detect if we're moving between two auto-animated slides
            if (this.previousSlide.hasAttribute('data-auto-animate') && this.currentSlide.hasAttribute('data-auto-animate')) { // If this is an auto-animated transition, we disable the regular slide transition
                autoAnimateTransition = true;
                this.dom.slides.classList.add('disable-slide-transitions');
            }
            this.transition = 'running';
        }

        this.updateSlidesVisibility(); // Update the visibility of slides now that the indices have changed
        this.layout();
        if (this.overview.isActive()) { // Update the overview if it's currently active
            this.overview.update();
        }
        if (typeof fragment !== 'undefined') { // Show fragment, if specified
            this.fragments.goto(fragment);
        }
        if (this.previousSlide && this.previousSlide !== this.currentSlide) { // Solves an edge case where the previous slide maintains the 'present' class when navigating between adjacent vertical stacks
            this.previousSlide.classList.remove('present');
            this.previousSlide.setAttribute('aria-hidden', 'true');

            if (this.isFirstSlide()) { // Reset all slides upon navigate to home                    
                setTimeout(function() { // Launch async task
                    this.getVerticalStacks().forEach(function(slide) {
                        this.setPreviousVerticalIndex(slide, 0);
                    }, this);
                }.bind(this), 0);
            }
        }
        const dom = this.dom,
            state = this.state,
            dispatchEvent = this.dispatchEvent;
        stateLoop:
            for (let i = 0, len = state.length; i < len; i++) { // Apply the new state
                for (let j = 0; j < stateBefore.length; j++) { // Check if this state existed on the previous slide. If it did, we will avoid adding it repeatedly
                    if (stateBefore[j] === state[i]) {
                        stateBefore.splice(j, 1);
                        continue stateLoop;
                    }
                }
                dom.viewport.classList.add(state[i]);
                dispatchEvent({ type: state[i] }); // Dispatch custom event matching the state's name
            }
        while (stateBefore.length) { // Clean up the remains of the previous state
            dom.viewport.classList.remove(stateBefore.pop());
        }
        if (slideChanged) {
            this.dispatchEvent({
                type: 'slidechanged',
                data: {
                    indexh: this.indexh,
                    indexv: this.indexv,
                    previousSlide: this.previousSlide,
                    currentSlide: this.currentSlide,
                    origin: origin
                }
            });
        }
        if (slideChanged || !this.previousSlide) { // Handle embedded content
            this.slideContent.stopEmbeddedContent(this.previousSlide);
            this.slideContent.startEmbeddedContent(this.currentSlide);
        }
        this.announceStatus(this.getStatusText(this.currentSlide)); // Announce the current slide contents to screen readers
        this.dispatchEvent({ type: 'slided' });
        this.cueAutoSlide();
        if (autoAnimateTransition) { // Auto-animation
            setTimeout(() => {
                dom.slides.classList.remove('disable-slide-transitions');
            }, 0);
            if (this.config.autoAnimate) {
                this.autoAnimate.run(this.previousSlide, this.currentSlide); // Run the auto-animation between our slides
            }
        }
    }

    sync() {
        this.removeEventListeners(); // Subscribe to input
        this.addEventListeners();
        this.layout(); // Force a layout to make sure the current config is accounted for
        this.autoSlideDuration = this.config.autoSlide; // Reflect the current autoSlide value
        this.cueAutoSlide(); // Start auto-sliding if it's enabled
        this.dispatchEvent({ type: 'synced' });
        this.updateSlidesVisibility();
        if (this.config.autoPlayMedia === false) { // Start or stop embedded content depending on global config
            this.slideContent.stopEmbeddedContent(this.currentSlide, { unloadIframes: false });
        } else {
            this.slideContent.startEmbeddedContent(this.currentSlide);
        }
        if (this.overview.isActive()) {
            this.overview.layout();
        }
    }

    syncSlide(slide = this.currentSlide) {
        this.dispatchEvent({ type: 'syncSlide', data: slide });
    }

    resetVerticalSlides() {
        this.getHorizontalSlides().forEach(function(horizontalSlide) {
            queryAll(horizontalSlide, 'section').forEach(function(verticalSlide, y) {
                if (y > 0) {
                    verticalSlide.classList.remove('present');
                    verticalSlide.classList.remove('past');
                    verticalSlide.classList.add('future');
                    verticalSlide.setAttribute('aria-hidden', 'true');
                }
            });
        });
    }

    shuffle(slides = this.getHorizontalSlides()) {
        slides.forEach(function(slide) {
            let beforeSlide = slides[Math.floor(Math.random() * slides.length)]; // Insert the slide next to a randomly picked sibling slide slide. This may cause the slide to insert before itself, but that's not an issue.
            if (beforeSlide.parentNode === slide.parentNode) {
                slide.parentNode.insetBefore(slide, beforeSlide);
            }
            let verticalSlides = slide.querySelectorAll('section'); // Randomize the order of vertical slides (if there are any)
            if (verticalSlides.length) {
                this.shuffle(verticalSlides);
            }
        }, this);
    }

    updateSlides(selector, index) {
        let slides = queryAll(this.dom.wrapper, selector), // Select all slides and convert the NodeList result to an array
            slidesLength = slides.length;
        let printMode = this.print.isPrintingPDF();
        if (slidesLength) {
            if (this.config.loop) { // Should the index loop?
                index %= slidesLength;
                if (index < 0) {
                    index = slidesLength + index;
                }
            }
            index = Math.max(Math.min(index, slidesLength - 1), 0); // Enforce max and minimum index bounds
            slides.forEach(function(slide, i) {
                let reverse = this.config.rtl && !this.isVerticalSlide(slide);
                slide.classList.remove('past'); // Avoid .remove() with multiple args for IE11 support
                slide.classList.remove('present');
                slide.classList.remove('future');
                slide.setAttribute('hidden', ''); // http://www.w3.org/html/wg/drafts/html/master/editing.html#the-hidden-attribute
                slide.setAttribute('aria-hidden', 'true');
                if (slide.querySelector('section')) { // If this element contains vertical slides
                    slide.classList.add('stack');
                }
                if (printMode) { // If we're printing static slides, all slides are "present"
                    slide.classList.add('present');
                    return;
                }
                if (i < index) {
                    slide.classList.add(reverse ? 'future' : 'past'); // Any element previous to index is given the 'past' class
                    if (this.config.fragments) {

                        queryAll(slide, '.fragment').forEach(function(fragment) { // Show all fragments in prior slides
                            fragment.classList.add('visible');
                            fragment.classList.remove('current-fragment');
                        });
                    }
                } else if (i > index) {
                    slide.classList.add(reverse ? 'past' : 'future'); // Any element subsequent to index is given the 'future' class
                    if (this.config.fragments) {
                        queryAll(slide, '.fragment.visible').forEach(function(fragment) { // Hide all fragments in future slides
                            fragment.classList.remove('visible', 'current-fragment');
                        });
                    }
                }
            }, this);
            let slide = slides[index];
            let wasPresent = slide.classList.contains('present');
            slide.classList.add('present'); // Mark the current slide as present
            slide.removeAttribute('hidden');
            slide.removeAttribute('aria-hidden');
            if (!wasPresent) {
                // Dispatch an event indicating the slide is now visible
                this.dispatchEvent({
                    target: slide,
                    type: 'visible',
                    bubbles: false,
                });
            }

            let slideState = slide.getAttribute('data-state'); // If this slide has a state associated with it, add it onto the current state of the deck
            if (slideState) {
                this.state = this.state.concat(slideState.split(' '));
            }
        } else {
            index = 0; // Since there are no slides we can't be anywhere beyond zeroth index
        }
        return index;
    }

    updateSlidesVisibility() {
        let horizontalSlides = this.getHorizontalSlides(), // Select all slides and convert the NodeList result to an array
            horizontalSlidesLength = horizontalSlides.length,
            distanceX,
            distanceY;
        if (horizontalSlidesLength && typeof this.indexh !== 'undefined') {
            let viewDistance = this.overview.isActive() ? 10 : this.config.viewDistance; // The number of steps away from the present slide that will be visible
            if (isMobile) { // Shorten the view distance on devices that typically have less resources
                viewDistance = this.overview.isActive() ? 6 : this.config.mobileViewDistance;
            }
            if (this.print.isPrintingPDF()) { // All slides need to be visible when exporting to PDF
                viewDistance = Number.MAX_VALUE;
            }
            horizontalSlides.forEach(function(slide, i) {
                let verticalSlides = queryAll(slide, 'section'),
                    verticalSlidesLength = verticalSlides.length;

                distanceX = Math.abs((this.indexh || 0) - i) || 0; // Determine how far away this slide is from the present
                if (this.config.loop) { // If the presentation is looped, distance should measure 1 between the first and last slides
                    distanceX = Math.abs(((this.indexh || 0) - i) % (horizontalSlidesLength - viewDistance)) || 0;
                }
                if (distanceX < viewDistance) { // Show the horizontal slide if it's within the view distance
                    this.slideContent.load(slide);
                } else {
                    this.slideContent.unload(slide);
                }
                if (verticalSlidesLength) {
                    let oy = this.getPreviousVerticalIndex(slide);
                    verticalSlides.forEach(function(vSlide, j) {
                        distanceY = i === (this.indexh || 0) ? Math.abs((this.indexv || 0) - j) : Math.abs(j - oy);
                        if (distanceX + distanceY < viewDistance) {
                            this.slideContent.load(vSlide);
                        } else {
                            this.slideContent.unload(vSlide);
                        }
                    }, this)
                }
            }, this)
            if (this.hasVerticalSlides()) { // Flag if there are ANY vertical slides, anywhere in the deck
                this.dom.wrapper.classList.add('has-vertical-slides');
            } else {
                this.dom.wrapper.classList.remove('has-vertical-slides');
            }
            if (this.hasHorizontalSlides()) { // Flag if there are ANY horizontal slides, anywhere in the deck
                this.dom.wrapper.classList.add('has-horizontal-slides');
            } else {
                this.dom.wrapper.classList.remove('has-horizontal-slides');
            }
        }
    }

    availableRoutes({ includeFragments = false } = {}) {
        let horizontalSlides = this.dom.wrapper.querySelectorAll(HORIZONTAL_SLIDES_SELECTOR),
            verticalSlides = this.dom.wrapper.querySelectorAll(VERTICAL_SLIDES_SELECTOR);
        let routes = {
            left: this.indexh > 0,
            right: this.indexh < horizontalSlides.length - 1,
            up: this.indexv > 0,
            down: this.indexv < verticalSlides.length - 1
        };
        if (this.config.loop) { // Looped presentations can always be navigated as long as there are slides available
            if (horizontalSlides.length > 1) {
                routes.left = true;
                routes.right = true;
            }
            if (verticalSlides.length > 1) {
                routes.up = true;
                routes.down = true;
            }
        }
        if (horizontalSlides.length > 1 && this.config.navigationMode === 'linear') {
            routes.right = routes.right || routes.down;
            routes.left = routes.left || routes.up;
        }
        if (includeFragments === true) { // If includeFragments is set, a route will be considered available if either a slid OR fragment is available in the given direction
            let fragmentRoutes = this.fragments.availableRoutes();
            routes.left = routes.left || fragmentRoutes.prev;
            routes.up = routes.up || fragmentRoutes.prev;
            routes.down = routes.down || fragmentRoutes.next;
            routes.right = routes.right || fragmentRoutes.next;
        }
        if (this.config.rtl) { // Reverse horizontal controls for rtl
            let left = routes.left;
            routes.left = routes.right;
            routes.right = left;
        }
        return routes;
    }

    getSlidePastCount(slide = this.currentSlide) {
        let horizontalSlides = this.getHorizontalSlides();
        let pastCount = 0; // The number of past slides
        mainLoop: // Step through all slides and count the past ones
            for (let i = 0; i < horizontalSlides.length; i++) {
                let horizontalSlide = horizontalSlides[i];
                let verticalSlides = horizontalSlide.querySelectorAll('section');
                for (let j = 0; j < verticalSlides.length; j++) {
                    if (verticalSlides[j] === slide) { // Stop as soon as we arrive at the present
                        break mainLoop;
                    }
                    if (verticalSlides[j].dataset.visibility !== 'uncounted') { // Don't count slides with the "uncounted" class
                        pastCount++;
                    }
                }
                if (horizontalSlide === slide) { // Stop as soon as we arrive at the present
                    break;
                }
                if (horizontalSlide.classList.contains('stack') === false && horizontalSlide.dataset.visibility !== 'uncounted') { // Don't count the wrapping section for vertical slides and slides marked as uncounted
                    pastCount++;
                }
            }
        return pastCount;
    }

    getProgress() {
        let totalCount = this.getTotalSlides(); // The number of past and total slides
        let pastCount = this.getSlidePastCount();
        if (this.currentSlide) {
            let allFragments = this.currentSlide.querySelectorAll('.fragment');
            if (allFragments.length > 0) { // If there are fragments in the current slide those should be accounted for in the progress.
                let visibleFragments = this.currentSlide.querySelectorAll('.fragment.visible');
                let fragmentWeight = 0.9; // This value represents how big a portion of the slide progress that is made up by its fragments (0-1)
                pastCount += (visibleFragments.length / allFragments.length) * fragmentWeight; // Add fragment progress to the past slide count
            }
        }
        return Math.min(pastCount / (totalCount - 1), 1);
    }

    getIndices(slide) {
        let h = this.indexh, // By default, return the current indices
            v = this.indexv,
            f;
        if (slide) { // If a slide is specified, return the indices of that slide
            let isVertical = this.isVerticalSlide(slide);
            let slideh = isVertical ? slide.parentNode : slide;
            let horizontalSlides = this.getHorizontalSlides(); // Select all horizontal slides            
            h = Math.max(horizontalSlides.indexOf(slideh), 0); // Now that we know which the horizontal slide is, get its index
            v = undefined; // Assume we're not vertical           
            if (isVertical) { // If this is a vertical slide, grab the vertical index
                v = Math.max(queryAll(slide.parentNode, 'section').indexOf(slide), 0);
            }
        } else if (this.currentSlide) {
            let hasFragments = this.currentSlide.querySelectorAll('.fragment').length > 0;
            if (hasFragments) {
                let currentFragment = this.currentSlide.querySelector('.current-fragment');
                if (currentFragment && currentFragment.hasAttribute('data-fragment-index')) {
                    f = parseInt(currentFragment.getAttribute('data-fragment-index'), 10);
                } else {
                    f = this.currentSlide.querySelectorAll('.fragment.visible').length - 1;
                }
            }
        }
        return { h, v, f };
    }

    getSlides() {
        return queryAll(this.dom.wrapper, SLIDES_SELECTOR + ':not(.stack):not([data-visibility="uncounted"])');
    }

    getHorizontalSlides() {
        return queryAll(this.dom.wrapper, HORIZONTAL_SLIDES_SELECTOR);
    }

    getVerticalSlides() {
        return queryAll(this.dom.wrapper, '.slides>section>section');
    }

    getVerticalStacks() {
        return queryAll(this.dom.wrapper, HORIZONTAL_SLIDES_SELECTOR + '.stack');
    }

    hasHorizontalSlides() {
        return this.getHorizontalSlides().length > 1;
    }

    hasVerticalSlides() {
        return this.getVerticalSlides().length > 1;
    }

    getSlidesAttributes() {
        return this.getSlides().map(function(slide) {
            let attributes = {};
            for (let i = 0; i < slide.attributes.length; i++) {
                let attribute = slide.attributes[i];
                attributes[attribute.name] = attribute.value;
            }
            return attributes;
        });
    }

    getTotalSlides() {
        return this.getSlides().length;
    }

    getSlide(x, y) {
        let horizontalSlide = this.getHorizontalSlides()[x];
        let verticalSlides = horizontalSlide && horizontalSlide.querySelectorAll('section');
        if (verticalSlides && verticalSlides.length && typeof y === 'number') {
            return verticalSlides ? verticalSlides[y] : undefined;
        }
        return horizontalSlide;
    }

    getSlideBackground(x, y) {
        let slide = typeof x === 'number' ? this.getSlide(x, y) : x;
        if (slide) {
            return slide.slideBackgroundElement;
        }
        return undefined;
    }

    getState() {
        let indices = this.getIndices();
        return {
            indexh: indices.h,
            indexv: indices.v,
            indexf: indices.f,
            paused: this.isPaused(),
            overview: this.overview.isActive()
        };
    }

    onPostMessage(event) {
        let data = event.data;
        if (typeof data === 'string' && data.charAt(0) === '{' && data.charAt(data.length - 1) === '}') { // Make sure we're dealing with JSON
            data = JSON.parse(data);
            if (!data.methodName) {
                return;
            }
            if (typeof this[data.methodName] === 'function') { // Check if the requested method can be found
                if (POST_MESSAGE_METHOD_BLACKLIST.test(data.methodName) === false) {
                    let result;
                    if (data.args !== undefined) {
                        if (Array.isArray(data.args)) {
                            result = this[data.methodName](data.args[0]);
                        } else {
                            result = this[data.methodName](data.args);
                        }
                    } else {
                        result = this[data.methodName]();
                    }
                    this.dispatchPostMessage('callback', { methodName: data.methodName, result: result }); // Dispatch a postMessage event with the returned value from our method invocation for getter functions
                } else {
                    console.warn(`${data.methodName} is is blacklisted from the postMessage API`);
                }
            } else {
                console.error(`method ${data.methodName} does not exist or it's not a function!`);
            }
        }
    }

    setupPostMessage() {
        if (this.config.postMessage) {
            window.addEventListener('message', this.onPostMessage, false);
        }
    }

    setState(state) {
        if (typeof state !== 'object') {
            console.warn(`passed state is not an object`, state);
            return;
        }
        this.slide(deserialize(state.indexh), deserialize(state.indexv), deserialize(state.indexf));
        let pausedFlag = deserialize(state.paused),
            overviewFlag = deserialize(state.overview);
        if (typeof pausedFlag === 'boolean' && pausedFlag !== this.isPaused()) {
            this.togglePause(pausedFlag);
        }
        if (typeof overviewFlag === 'boolean' && overviewFlag !== overview.isActive()) {
            this.overview.toggle(overviewFlag);
        }
    }

    cueAutoSlide() {
        this.cancelAutoSlide();
        if (this.currentSlide && this.config.autoSlide !== false) {
            let fragment = this.currentSlide.querySelector('.current-fragment');
            if (!fragment) fragment = this.currentSlide.querySelector('.fragment'); // When the slide first appears there is no "current" fragment so we look for a data-autoslide timing on the first fragment
            let fragmentAutoSlide = fragment ? fragment.getAttribute('data-autoslide') : null;
            let parentAutoSlide = this.currentSlide.parentNode ? this.currentSlide.parentNode.getAttribute('data-autoslide') : null;
            let slideAutoSlide = this.currentSlide.getAttribute('data-autoslide');
            if (fragmentAutoSlide) { // Pick value in the following priority order: 1. Current fragment's data-autoslide 2. Current slide's data-autoslide 3. Parent slide's data-autoslide 4. Global autoSlide setting
                this.autoSlideDuration = parseInt(fragmentAutoSlide, 10);
            } else if (slideAutoSlide) {
                this.autoSlideDuration = parseInt(slideAutoSlide, 10);
            } else if (parentAutoSlide) {
                this.autoSlideDuration = parseInt(parentAutoSlide, 10);
            } else {
                this.autoSlideDuration = this.config.autoSlide;
                if (this.currentSlide.querySelectorAll('.fragment').length === 0) { // If there are media elements with data-autoplay, automatically set the autoSlide duration to the length of that media. Not applicable if the slide is divided up into fragments. playbackRate is accounted for in the duration.
                    queryAll(this.currentSlide, 'video, audio').forEach(function(el) {
                        if (el.hasAttribute('data-autoplay')) {
                            if (this.autoSlideDuration && (el.duration * 1000 / el.playbackRate) > this.autoSlideDuration) {
                                this.autoSlideDuration = (el.duration * 1000 / el.playbackRate) + 1000;
                            }
                        }
                    }, this);
                }
            }
            if (this.autoSlideDuration &&
                !this.autoSlidePaused &&
                !this.isPaused() &&
                !this.overview.isActive() &&
                (!this.isLastSlide() || this.fragments.availableRoutes().next || this.config.loop === true)) { // Cue the next auto-slide if: - There is an autoSlide value - Auto-sliding isn't paused by the user - The presentation isn't paused - The overview isn't active - The presentation isn't over
                this.autoSlideTimeout = setTimeout(function() {
                    if (typeof config.autoSlideMethod === 'function') {
                        this.config.autoSlideMethod()
                    } else {
                        this.navigateNext();
                    }
                    this.cueAutoSlide();
                }.bind(this), this.autoSlideDuration);
                this.autoSlideStartTime = Date.now();
            }
            if (this.autoSlidePlayer) {
                this.autoSlidePlayer.setPlaying(this.autoSlideTimeout !== -1);
            }
        }
    }

    cancelAutoSlide() {
        clearTimeout(this.autoSlideTimeout);
        this.autoSlideTimeout = -1;
    }

    pauseAutoSlide() {
        if (this.autoSlideDuration && !this.autoSlidePaused) {
            this.autoSlidePaused = true;
            this.dispatchEvent({ type: 'autoslidepaused' });
            clearTimeout(this.autoSlideTimeout);
            if (this.autoSlidePlayer) {
                this.autoSlidePlayer.setPlaying(false);
            }
        }
    }

    resumeAutoSlide() {
        if (this.autoSlideDuration && this.autoSlidePaused) {
            this.autoSlidePaused = false;
            this.dispatchEvent({ type: 'autoslideresumed' });
            this.cueAutoSlide();
        }
    }

    navigateLeft() {
        this.navigationHistory.hasNavigatedHorizontally = true;
        if (this.config.rtl) { // Reverse for RTL
            if ((this.overview.isActive() || this.fragments.next() === false) && this.availableRoutes().left) {
                this.slide(this.indexh + 1, this.config.navigationMode === 'grid' ? this.indexv : undefined);
            }
        } else if ((this.overview.isActive() || this.fragments.prev() === false) && this.availableRoutes().left) { // Normal navigation
            this.slide(this.indexh - 1, this.config.navigationMode === 'grid' ? this.indexv : undefined);
        }
    }

    navigateRight() {
        this.navigationHistory.hasNavigatedHorizontally = true;
        if (this.config.rtl) { // Reverse for RTL
            if ((this.overview.isActive() || this.fragments.prev() === false) && this.availableRoutes().right) {
                this.slide(this.indexh - 1, this.config.navigationMode === 'grid' ? this.indexv : undefined);
            }
        } else if ((this.overview.isActive() || this.fragments.next() === false) && this.availableRoutes().right) { // Normal navigation
            this.slide(this.indexh + 1, this.config.navigationMode === 'grid' ? this.indexv : undefined);
        }
    }

    navigateUp() {
        if ((this.overview.isActive() || this.fragments.prev() === false) && this.availableRoutes().up) { // Prioritize hiding fragments
            this.slide(this.indexh, this.indexv - 1);
        }
    }

    navigateDown() {
        this.navigationHistory.hasNavigatedVertically = true;
        if ((this.overview.isActive() || this.fragments.next() === false) && this.availableRoutes().down) { // Prioritize revealing fragments
            this.slide(this.indexh, this.indexv + 1);
        }
    }

    navigatePrev() {

        if (this.fragments.prev() === false) { // Prioritize revealing fragments
            if (this.availableRoutes().up) {
                this.navigateUp();
            } else {
                let previousSlide;
                if (config.rtl) { // Fetch the previous horizontal slide, if there is one
                    previousSlide = queryAll(this.dom.wrapper, HORIZONTAL_SLIDES_SELECTOR + '.future').pop();
                } else {
                    previousSlide = queryAll(this.dom.wrapper, HORIZONTAL_SLIDES_SELECTOR + '.past').pop();
                }
                if (previousSlide) {
                    let v = (previousSlide.querySelectorAll('section').length - 1) || undefined;
                    let h = this.indexh - 1;
                    this.slide(h, v);
                }
            }
        }
    }

    navigateNext() {
        this.navigationHistory.hasNavigatedHorizontally = true;
        this.navigationHistory.hasNavigatedVertically = true;
        if (this.fragments.next() === false) { // Prioritize revealing fragments
            let routes = this.availableRoutes();
            if (routes.down && routes.right && config.loop && isLastVerticalSlide(currentSlide)) { // When looping is enabled `routes.down` is always available so we need a separate check for when we've reached the end of a stack and should move horizontally
                routes.down = false;
            }
            if (routes.down) {
                this.navigateDown();
            } else if (this.config.rtl) {
                this.navigateLeft();
            } else {
                this.navigateRight();
            }
        }
    }

    onUserInput(event) {
        if (this.config.autoSlideStoppable) {
            this.pauseAutoSlide();
        }
    }

    onPreviewLinkClicked(event) {
        if (event.currentTarget && event.currentTarget.hasAttribute('href')) {
            let url = event.currentTarget.getAttribute('href');
            if (url) {
                this.showPreview(url);
                event.preventDefault();
            }
        }
    }

    onAutoSlidePlayerClick(event) {
        if (this.isLastSlide() && this.config.loop === false) { // Replay
            this.slide(0, 0);
            this.resumeAutoSlide();
        } else if (this.autoSlidePaused) { // Resume
            this.resumeAutoSlide();
        } else { // Pause
            this.pauseAutoSlide();
        }
    }

    triggerKey(key) {
        this.keyboard.triggerKey(key);
    }
}

export { Deck };