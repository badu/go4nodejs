// === config ===
/**
 * The default  config object.
 */
const defaultConfig = {

        // The "normal" size of the presentation, aspect ratio will be preserved
        // when the presentation is scaled to fit different resolutions
        width: 960,
        height: 700,

        // Factor of the display size that should remain empty around the content
        margin: 0.04,

        // Bounds for smallest/largest possible scale to apply to content
        minScale: 0.2,
        maxScale: 2.0,

        // Display presentation control arrows
        controls: true,

        // Help the user learn the controls by providing hints, for example by
        // bouncing the down arrow when they first encounter a vertical slide
        controlsTutorial: true,

        // Determines where controls appear, "edges" or "bottom-right"
        controlsLayout: 'bottom-right',

        // Visibility rule for backwards navigation arrows; "faded", "hidden"
        // or "visible"
        controlsBackArrows: 'faded',

        // Display a presentation progress bar
        progress: true,

        // Display the page number of the current slide
        // - true:    Show slide number
        // - false:   Hide slide number
        //
        // Can optionally be set as a string that specifies the number formatting:
        // - "h.v":	  Horizontal . vertical slide number (default)
        // - "h/v":	  Horizontal / vertical slide number
        // - "c":	  Flattened slide number
        // - "c/t":	  Flattened slide number / total slides
        //
        // Alternatively, you can provide a function that returns the slide
        // number for the current slide. The function should take in a slide
        // object and return an array with one string [slideNumber] or
        // three strings [n1,delimiter,n2]. See #formatSlideNumber().
        slideNumber: false,

        // Can be used to limit the contexts in which the slide number appears
        // - "all":      Always show the slide number
        // - "print":    Only when printing to PDF
        // - "speaker":  Only in the speaker view
        showSlideNumber: 'all',

        // Use 1 based indexing for # links to match slide number (default is zero
        // based)
        hashOneBasedIndex: false,

        // Add the current slide number to the URL hash so that reloading the
        // page/copying the URL will return you to the same slide
        hash: false,

        // Flags if we should monitor the hash and change slides accordingly
        respondToHashChanges: true,

        // Push each slide change to the browser history.  Implies `hash: true`
        history: false,

        // Enable keyboard shortcuts for navigation
        keyboard: true,

        // Optional function that blocks keyboard events when retuning false
        //
        // If you set this to 'foucsed', we will only capture keyboard events
        // for embdedded decks when they are in focus
        keyboardCondition: null,

        // Disables the default  slide layout (scaling and centering)
        // so that you can use custom CSS layout
        disableLayout: false,

        // Enable the slide overview mode
        overview: true,

        // Vertical centering of slides
        center: true,

        // Enables touch navigation on devices with touch input
        touch: true,

        // Loop the presentation
        loop: false,

        // Change the presentation direction to be RTL
        rtl: false,

        // Changes the behavior of our navigation directions.
        //
        // "default"
        // Left/right arrow keys step between horizontal slides, up/down
        // arrow keys step between vertical slides. Space key steps through
        // all slides (both horizontal and vertical).
        //
        // "linear"
        // Removes the up/down arrows. Left/right arrows step through all
        // slides (both horizontal and vertical).
        //
        // "grid"
        // When this is enabled, stepping left/right from a vertical stack
        // to an adjacent vertical stack will land you at the same vertical
        // index.
        //
        // Consider a deck with six slides ordered in two vertical stacks:
        // 1.1    2.1
        // 1.2    2.2
        // 1.3    2.3
        //
        // If you're on slide 1.3 and navigate right, you will normally move
        // from 1.3 -> 2.1. If "grid" is used, the same navigation takes you
        // from 1.3 -> 2.3.
        navigationMode: 'default',

        // Randomizes the order of slides each time the presentation loads
        shuffle: false,

        // Turns fragments on and off globally
        fragments: true,

        // Flags whether to include the current fragment in the URL,
        // so that reloading brings you to the same fragment position
        fragmentInURL: true,

        // Flags if the presentation is running in an embedded mode,
        // i.e. contained within a limited portion of the screen
        embedded: false,

        // Flags if we should show a help overlay when the question-mark
        // key is pressed
        help: true,

        // Flags if it should be possible to pause the presentation (blackout)
        pause: true,

        // Flags if speaker notes should be visible to all viewers
        showNotes: false,

        // Flags if slides with data-visibility="hidden" should be kep visible
        showHiddenSlides: false,

        // Global override for autolaying embedded media (video/audio/iframe)
        // - null:   Media will only autoplay if data-autoplay is present
        // - true:   All media will autoplay, regardless of individual setting
        // - false:  No media will autoplay, regardless of individual setting
        autoPlayMedia: null,

        // Global override for preloading lazy-loaded iframes
        // - null:   Iframes with data-src AND data-preload will be loaded when within
        //           the viewDistance, iframes with only data-src will be loaded when visible
        // - true:   All iframes with data-src will be loaded when within the viewDistance
        // - false:  All iframes with data-src will be loaded only when visible
        preloadIframes: null,

        // Can be used to globally disable auto-animation
        autoAnimate: true,

        // Optionally provide a custom element matcher that will be
        // used to dictate which elements we can animate between.
        autoAnimateMatcher: null,

        // Default settings for our auto-animate transitions, can be
        // overridden per-slide or per-element via data arguments
        autoAnimateEasing: 'ease',
        autoAnimateDuration: 1.0,
        autoAnimateUnmatched: true,

        // CSS properties that can be auto-animated. Position & scale
        // is matched separately so there's no need to include styles
        // like top/right/bottom/left, width/height or margin.
        autoAnimateStyles: [
            'opacity',
            'color',
            'background-color',
            'padding',
            'font-size',
            'line-height',
            'letter-spacing',
            'border-width',
            'border-color',
            'border-radius',
            'outline',
            'outline-offset'
        ],

        // Controls automatic progression to the next slide
        // - 0:      Auto-sliding only happens if the data-autoslide HTML attribute
        //           is present on the current slide or fragment
        // - 1+:     All slides will progress automatically at the given interval
        // - false:  No auto-sliding, even if data-autoslide is present
        autoSlide: 0,

        // Stop auto-sliding after user input
        autoSlideStoppable: true,

        // Use this method for navigation when auto-sliding (defaults to navigateNext)
        autoSlideMethod: null,

        // Specify the average time in seconds that you think you will spend
        // presenting each slide. This is used to show a pacing timer in the
        // speaker view
        defaultTiming: null,

        // Enable slide navigation via mouse wheel
        mouseWheel: false,

        // Opens links in an iframe preview overlay
        // Add `data-preview-link` and `data-preview-link="false"` to customise each link
        // individually
        previewLinks: false,

        // Exposes the  API through window.postMessage
        postMessage: true,

        // Dispatches all  events to the parent window through postMessage
        postMessageEvents: false,

        // Focuses body when page changes visibility to ensure keyboard shortcuts work
        focusBodyOnPageVisibilityChange: true,

        // Transition style
        transition: 'slide', // none/fade/slide/convex/concave/zoom

        // Transition speed
        transitionSpeed: 'default', // default/fast/slow

        // Transition style for full page slide backgrounds
        backgroundTransition: 'fade', // none/fade/slide/convex/concave/zoom

        // Parallax background image
        parallaxBackgroundImage: '', // CSS syntax, e.g. "a.jpg"

        // Parallax background size
        parallaxBackgroundSize: '', // CSS syntax, e.g. "3000px 2000px"

        // Parallax background repeat
        parallaxBackgroundRepeat: '', // repeat/repeat-x/repeat-y/no-repeat/initial/inherit

        // Parallax background position
        parallaxBackgroundPosition: '', // CSS syntax, e.g. "top left"

        // Amount of pixels to move the parallax background per slide step
        parallaxBackgroundHorizontal: null,
        parallaxBackgroundVertical: null,

        // The maximum number of pages a single slide can expand onto when printing
        // to PDF, unlimited by default
        pdfMaxPagesPerSlide: Number.POSITIVE_INFINITY,

        // Prints each fragment on a separate slide
        pdfSeparateFragments: true,

        // Offset used to reduce the height of content within exported PDF pages.
        // This exists to account for environment differences based on how you
        // print to PDF. CLI printing options, like phantomjs and wkpdf, can end
        // on precisely the total height of the document whereas in-browser
        // printing has to end one pixel before.
        pdfPageHeightOffset: -1,

        // Number of slides away from the current that are visible
        viewDistance: 3,

        // Number of slides away from the current that are visible on mobile
        // devices. It is advisable to set this to a lower number than
        // viewDistance in order to save resources.
        mobileViewDistance: 2,

        // The display mode that will be used to show slides
        display: 'block',

        // Hide cursor if inactive
        hideInactiveCursor: true,

        // Time before the cursor is hidden (in ms)
        hideCursorTime: 5000,

        // Script dependencies to load
        dependencies: [],

        // Plugin objects to register and use for this presentation
        plugins: []

    }
    // === end of config ===
    // === utils ===


// Function to perform a better "data-trim" on code snippets
// Will slice an indentation amount on each line of the snippet (amount based on the line having the lowest indentation length)
function betterTrim(snippetEl) {
    // Helper functions
    function trimLeft(val) {
        // Adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill
        return val.replace(/^[\s\uFEFF\xA0]+/g, '');
    }

    function trimLineBreaks(input) {
        var lines = input.split('\n');
        // Trim line-breaks from the beginning
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].trim() === '') {
                lines.splice(i--, 1);
            } else break;
        }
        // Trim line-breaks from the end
        for (var i = lines.length - 1; i >= 0; i--) {
            if (lines[i].trim() === '') {
                lines.splice(i, 1);
            } else break;
        }
        return lines.join('\n');
    }
    // Main function for betterTrim()
    return (function(snippetEl) {
        var content = trimLineBreaks(snippetEl.innerHTML);
        var lines = content.split('\n');
        // Calculate the minimum amount to remove on each line start of the snippet (can be 0)
        var pad = lines.reduce(function(acc, line) {
            if (line.length > 0 && trimLeft(line).length > 0 && acc > line.length - trimLeft(line).length) {
                return line.length - trimLeft(line).length;
            }
            return acc;
        }, Number.POSITIVE_INFINITY);
        // Slice each line with this amount
        return lines.map(function(line, index) {
                return line.slice(pad);
            })
            .join('\n');
    })(snippetEl);
}

/**
 * Converts various color input formats to an {r:0,g:0,b:0} object.
 *
 * @param {string} color The string representation of a color
 * @example
 * colorToRgb('#000');
 * @example
 * colorToRgb('#000000');
 * @example
 * colorToRgb('rgb(0,0,0)');
 * @example
 * colorToRgb('rgba(0,0,0)');
 *
 * @return {{r: number, g: number, b: number, [a]: number}|null}
 */
const colorToRgb = (color) => {
    let hex3 = color.match(/^#([0-9a-f]{3})$/i);
    if (hex3 && hex3[1]) {
        hex3 = hex3[1];
        return {
            r: parseInt(hex3.charAt(0), 16) * 0x11,
            g: parseInt(hex3.charAt(1), 16) * 0x11,
            b: parseInt(hex3.charAt(2), 16) * 0x11
        };
    }

    let hex6 = color.match(/^#([0-9a-f]{6})$/i);
    if (hex6 && hex6[1]) {
        hex6 = hex6[1];
        return {
            r: parseInt(hex6.substr(0, 2), 16),
            g: parseInt(hex6.substr(2, 2), 16),
            b: parseInt(hex6.substr(4, 2), 16)
        };
    }

    let rgb = color.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    if (rgb) {
        return {
            r: parseInt(rgb[1], 10),
            g: parseInt(rgb[2], 10),
            b: parseInt(rgb[3], 10)
        };
    }

    let rgba = color.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\,\s*([\d]+|[\d]*.[\d]+)\s*\)$/i);
    if (rgba) {
        return {
            r: parseInt(rgba[1], 10),
            g: parseInt(rgba[2], 10),
            b: parseInt(rgba[3], 10),
            a: parseFloat(rgba[4])
        };
    }

    return null;
}

/**
 * Calculates brightness on a scale of 0-255.
 *
 * @param {string} color See colorToRgb for supported formats.
 * @see {@link colorToRgb}
 */
const colorBrightness = (color) => {
        if (typeof color === 'string') color = colorToRgb(color);
        if (color) {
            return (color.r * 299 + color.g * 587 + color.b * 114) / 1000;
        }
        return null;
    }
    /**
     * Extend object a with the properties of object b.
     * If there's a conflict, object b takes precedence.
     *
     * @param {object} a
     * @param {object} b
     */
const extend = (a, b) => {
    for (let i in b) {
        a[i] = b[i];
    }
    return a;
}

/**
 * querySelectorAll but returns an Array.
 */
const queryAll = (el, selector) => {
    return Array.from(el.querySelectorAll(selector));
}

/**
 * classList.toggle() with cross browser support
 */
const toggleClass = (el, className, value) => {
    if (value) {
        el.classList.add(className);
    } else {
        el.classList.remove(className);
    }
}

/**
 * Utility for deserializing a value.
 *
 * @param {*} value
 * @return {*}
 */
const deserialize = (value) => {
    if (typeof value === 'string') {
        if (value === 'null') return null;
        else if (value === 'true') return true;
        else if (value === 'false') return false;
        else if (value.match(/^-?[\d\.]+$/)) return parseFloat(value);
    }
    return value;

}

/**
 * Measures the distance in pixels between point a
 * and point b.
 *
 * @param {object} a point with x/y properties
 * @param {object} b point with x/y properties
 *
 * @return {number}
 */
const distanceBetween = (a, b) => {
    let dx = a.x - b.x,
        dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Applies a CSS transform to the target element.
 *
 * @param {HTMLElement} element
 * @param {string} transform
 */
const transformElement = (element, transform) => {
    element.style.transform = transform;
}

/**
 * Element.matches with IE support.
 *
 * @param {HTMLElement} target The element to match
 * @param {String} selector The CSS selector to match
 * the element against
 *
 * @return {Boolean}
 */
const matches = (target, selector) => {
    let matchesMethod = target.matches || target.matchesSelector || target.msMatchesSelector;
    return !!(matchesMethod && matchesMethod.call(target, selector));
}

/**
 * Find the closest parent that matches the given
 * selector.
 *
 * @param {HTMLElement} target The child element
 * @param {String} selector The CSS selector to match
 * the parents against
 *
 * @return {HTMLElement} The matched parent or null
 * if no matching parent was found
 */
const closest = (target, selector) => {
    // Native Element.closest
    if (typeof target.closest === 'function') {
        return target.closest(selector);
    }
    // Polyfill
    while (target) {
        if (matches(target, selector)) {
            return target;
        }
        // Keep searching
        target = target.parentNode;
    }
    return null;
}

/**
 * Handling the fullscreen functionality via the fullscreen API
 *
 * @see http://fullscreen.spec.whatwg.org/
 * @see https://developer.mozilla.org/en-US/docs/DOM/Using_fullscreen_mode
 */
const enterFullscreen = element => {
    element = element || document.documentElement;
    // Check which implementation is available
    let requestMethod = element.requestFullscreen ||
        element.webkitRequestFullscreen ||
        element.webkitRequestFullScreen ||
        element.mozRequestFullScreen ||
        element.msRequestFullscreen;
    if (requestMethod) {
        requestMethod.apply(element);
    }
}

/**
 * Creates an HTML element and returns a reference to it.
 * If the element already exists the existing instance will
 * be returned.
 *
 * @param {HTMLElement} container
 * @param {string} tagname
 * @param {string} classname
 * @param {string} innerHTML
 *
 * @return {HTMLElement}
 */
const createSingletonNode = (container, tagname, classname, innerHTML = '') => {
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

/**
 * Injects the given CSS styles into the DOM.
 *
 * @param {string} value
 */
const createStyleSheet = (value) => {
    let tag = document.createElement('style');
    tag.type = 'text/css';
    if (value && value.length > 0) {
        if (tag.styleSheet) {
            tag.styleSheet.cssText = value;
        } else {
            tag.appendChild(document.createTextNode(value));
        }
    }
    document.head.appendChild(tag);
    return tag;
}

/**
 * Returns a key:value hash of all query params.
 */
const getQueryHash = () => {
    let query = {};
    location.search.replace(/[A-Z0-9]+?=([\w\.%-]*)/gi, a => {
        query[a.split('=').shift()] = a.split('=').pop();
    });
    // Basic deserialization
    for (let i in query) {
        let value = query[i];
        query[i] = deserialize(unescape(value));
    }
    // Do not accept new dependencies via query config to avoid
    // the potential of malicious script injection
    if (typeof query['dependencies'] !== 'undefined') delete query['dependencies'];
    return query;
}

/**
 * Returns the remaining height within the parent of the
 * target element.
 *
 * remaining height = [ configured parent height ] - [ current parent height ]
 *
 * @param {HTMLElement} element
 * @param {number} [height]
 */
const getRemainingHeight = (element, height = 0) => {
    if (element) {
        let newHeight, oldHeight = element.style.height;
        // Change the .stretch element height to 0 in order find the height of all
        // the other elements
        element.style.height = '0px';
        // In Overview mode, the parent (.slide) height is set of 700px.
        // Restore it temporarily to its natural height.
        element.parentNode.style.height = 'auto';
        newHeight = height - element.parentNode.offsetHeight;
        // Restore the old height, just in case
        element.style.height = oldHeight + 'px';
        // Clear the parent (.slide) height. .removeProperty works in IE9+
        element.parentNode.style.removeProperty('height');
        return newHeight;
    }
    return height;
}


/**
 * Manages focus when a presentation is embedded. This
 * helps us only capture keyboard from the presentation
 * a user is currently interacting with in a page where
 * multiple presentations are embedded.
 */

const STATE_FOCUS = 'focus';
const STATE_BLUR = 'blur';

class Focus {
    constructor(deck) {
        this.deck = deck;
        this.onRevealPointerDown = this.onRevealPointerDown.bind(this);
        this.onDocumentPointerDown = this.onDocumentPointerDown.bind(this);
    }

    /**
     * Called when the  config is updated.
     */
    configure(config, oldConfig) {
        if (config.embedded) {
            this.blur();
        } else {
            this.focus();
            this.unbind();
        }
    }

    bind() {
        if (this.deck.config.embedded) {
            this.deck.deckElement.addEventListener('pointerdown', this.onRevealPointerDown, false);
        }
    }

    unbind() {
        this.deck.deckElement.removeEventListener('pointerdown', this.onRevealPointerDown, false);
        document.removeEventListener('pointerdown', this.onDocumentPointerDown, false);
    }

    focus() {
        if (this.state !== STATE_FOCUS) {
            this.deck.deckElement.classList.add('focused');
            document.addEventListener('pointerdown', this.onDocumentPointerDown, false);
        }
        this.state = STATE_FOCUS;
    }

    blur() {
        if (this.state !== STATE_BLUR) {
            this.deck.deckElement.classList.remove('focused');
            document.removeEventListener('pointerdown', this.onDocumentPointerDown, false);
        }
        this.state = STATE_BLUR;
    }

    isFocused() {
        return this.state === STATE_FOCUS;
    }

    onRevealPointerDown(event) {
        this.focus();
    }

    onDocumentPointerDown(event) {
        if (event === undefined) {
            console.error('event is undefined, but it should NOT be', new Error().stack);
            return
        }
        let revealElement = closest(event.target, '.reveal');
        if (!revealElement || revealElement !== this.deck.deckElement) {
            this.blur();
        }
    }
}

// === end of utils ===

// === constants ===
const SLIDES_SELECTOR = '.slides section';
const HORIZONTAL_SLIDES_SELECTOR = '.slides>section';
const VERTICAL_SLIDES_SELECTOR = '.slides>section.present>section';

// Methods that may not be invoked via the postMessage API
const POST_MESSAGE_METHOD_BLACKLIST = /registerPlugin|registerKeyboardShortcut|addKeyBinding|addEventListener/;

// Regex for retrieving the fragment style from a class attribute
const FRAGMENT_STYLE_REGEX = /fade-(down|up|right|left|out|in-then-out|in-then-semi-out)|semi-fade-out|current-visible|shrink|grow/;
const VERSION = '4.1.0';

const UA = navigator.userAgent;
const testElement = document.createElement('div');

const isMobile = /(iphone|ipod|ipad|android)/gi.test(UA) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPadOS

const isChrome = /chrome/i.test(UA) && !/edge/i.test(UA);

const isAndroid = /android/gi.test(UA);

// Flags if we should use zoom instead of transform to scale
// up slides. Zoom produces crisper results but has a lot of
// xbrowser quirks so we only use it in whitelisted browsers.
const supportsZoom = 'zoom' in testElement.style && !isMobile &&
    (isChrome || /Version\/[\d\.]+.*Safari/.test(UA));
// === end of constants ===

// === autoanimate ===


/**
 * Handles sorting and navigation of slide fragments.
 * Fragments are elements within a slide that are
 * revealed/animated incrementally.
 */
class Fragments {
    constructor(deck) {
            this.deck = deck;
        }
        /**
         * Called when the  config is updated.
         */
    configure(config, oldConfig) {
        if (config.fragments === false) {
            this.disable();
        } else if (oldConfig.fragments === false) {
            this.enable();
        }
    }

    /**
     * If fragments are disabled in the deck, they should all be
     * visible rather than stepped through.
     */
    disable() {
        queryAll(this.deck.dom.slides, '.fragment').forEach(element => {
            element.classList.add('visible');
            element.classList.remove('current-fragment');
        });
    }

    /**
     * Reverse of #disable(). Only called if fragments have
     * previously been disabled.
     */
    enable() {
        queryAll(this.deck.dom.slides, '.fragment').forEach(element => {
            element.classList.remove('visible');
            element.classList.remove('current-fragment');
        });
    }

    /**
     * Returns an object describing the available fragment
     * directions.
     *
     * @return {{prev: boolean, next: boolean}}
     */
    availableRoutes() {
        let currentSlide = this.deck.currentSlide;
        if (currentSlide && this.deck.config.fragments) {
            let fragments = currentSlide.querySelectorAll('.fragment:not(.disabled)');
            let hiddenFragments = currentSlide.querySelectorAll('.fragment:not(.disabled):not(.visible)');
            return {
                prev: fragments.length - hiddenFragments.length > 0,
                next: !!hiddenFragments.length
            };
        } else {
            return { prev: false, next: false };
        }
    }

    /**
     * Return a sorted fragments list, ordered by an increasing
     * "data-fragment-index" attribute.
     *
     * Fragments will be revealed in the order that they are returned by
     * this function, so you can use the index attributes to control the
     * order of fragment appearance.
     *
     * To maintain a sensible default fragment order, fragments are presumed
     * to be passed in document order. This function adds a "fragment-index"
     * attribute to each node if such an attribute is not already present,
     * and sets that attribute to an integer value which is the position of
     * the fragment within the fragments list.
     *
     * @param {object[]|*} fragments
     * @param {boolean} grouped If true the returned array will contain
     * nested arrays for all fragments with the same index
     * @return {object[]} sorted Sorted array of fragments
     */
    sort(fragments, grouped = false) {
        fragments = Array.from(fragments);
        let ordered = [],
            unordered = [],
            sorted = [];

        // Group ordered and unordered elements
        fragments.forEach(fragment => {
            if (fragment.hasAttribute('data-fragment-index')) {
                let index = parseInt(fragment.getAttribute('data-fragment-index'), 10);
                if (!ordered[index]) {
                    ordered[index] = [];
                }
                ordered[index].push(fragment);
            } else {
                unordered.push([fragment]);
            }
        });

        // Append fragments without explicit indices in their
        // DOM order
        ordered = ordered.concat(unordered);

        // Manually count the index up per group to ensure there
        // are no gaps
        let index = 0;

        // Push all fragments in their sorted order to an array,
        // this flattens the groups
        ordered.forEach(group => {
            group.forEach(fragment => {
                sorted.push(fragment);
                fragment.setAttribute('data-fragment-index', index);
            });
            index++;
        });

        return grouped === true ? ordered : sorted;

    }

    /**
     * Sorts and formats all of fragments in the
     * presentation.
     */
    sortAll() {
        this.deck.getHorizontalSlides().forEach(horizontalSlide => {
            let verticalSlides = queryAll(horizontalSlide, 'section');
            verticalSlides.forEach((verticalSlide, y) => {
                this.sort(verticalSlide.querySelectorAll('.fragment'));
            }, this);
            if (verticalSlides.length === 0) this.sort(horizontalSlide.querySelectorAll('.fragment'));
        });
    }

    /**
     * Refreshes the fragments on the current slide so that they
     * have the appropriate classes (.visible + .current-fragment).
     *
     * @param {number} [index] The index of the current fragment
     * @param {array} [fragments] Array containing all fragments
     * in the current slide
     *
     * @return {{shown: array, hidden: array}}
     */
    update(index, fragments) {
        let changedFragments = {
            shown: [],
            hidden: []
        };
        let currentSlide = this.deck.currentSlide;
        if (currentSlide && this.deck.config.fragments) {
            fragments = fragments || this.sort(currentSlide.querySelectorAll('.fragment'));
            if (fragments.length) {
                let maxIndex = 0;
                if (typeof index !== 'number') {
                    let currentFragment = this.sort(currentSlide.querySelectorAll('.fragment.visible')).pop();
                    if (currentFragment) {
                        index = parseInt(currentFragment.getAttribute('data-fragment-index') || 0, 10);
                    }
                }
                Array.from(fragments).forEach((el, i) => {
                    if (el.hasAttribute('data-fragment-index')) {
                        i = parseInt(el.getAttribute('data-fragment-index'), 10);
                    }
                    maxIndex = Math.max(maxIndex, i);
                    // Visible fragments
                    if (i <= index) {
                        let wasVisible = el.classList.contains('visible')
                        el.classList.add('visible');
                        el.classList.remove('current-fragment');
                        if (i === index) {
                            // Announce the fragments one by one to the Screen Reader
                            this.deck.announceStatus(this.deck.getStatusText(el));
                            el.classList.add('current-fragment');
                            this.deck.slideContent.startEmbeddedContent(el);
                        }
                        if (!wasVisible) {
                            changedFragments.shown.push(el)
                            this.deck.dispatchEvent({
                                target: el,
                                type: 'visible',
                                bubbles: false
                            });
                        }
                    }
                    // Hidden fragments
                    else {
                        let wasVisible = el.classList.contains('visible')
                        el.classList.remove('visible');
                        el.classList.remove('current-fragment');

                        if (wasVisible) {
                            changedFragments.hidden.push(el);
                            this.deck.dispatchEvent({
                                target: el,
                                type: 'hidden',
                                bubbles: false
                            });
                        }
                    }
                });
                // Write the current fragment index to the slide <section>.
                // This can be used by end users to apply styles based on
                // the current fragment index.
                index = typeof index === 'number' ? index : -1;
                index = Math.max(Math.min(index, maxIndex), -1);
                currentSlide.setAttribute('data-fragment', index);
            }
        }
        return changedFragments;
    }

    /**
     * Formats the fragments on the given slide so that they have
     * valid indices. Call this if fragments are changed in the DOM
     * after  has already initialized.
     *
     * @param {HTMLElement} slide
     * @return {Array} a list of the HTML fragments that were synced
     */
    sync(slide = this.deck.currentSlide) {
        return this.sort(slide.querySelectorAll('.fragment'));
    }

    /**
     * Navigate to the specified slide fragment.
     *
     * @param {?number} index The index of the fragment that
     * should be shown, -1 means all are invisible
     * @param {number} offset Integer offset to apply to the
     * fragment index
     *
     * @return {boolean} true if a change was made in any
     * fragments visibility as part of this call
     */
    goto(index, offset = 0) {
        let currentSlide = this.deck.currentSlide;
        if (currentSlide && this.deck.config.fragments) {
            let fragments = this.sort(currentSlide.querySelectorAll('.fragment:not(.disabled)'));
            if (fragments.length) {
                // If no index is specified, find the current
                if (typeof index !== 'number') {
                    let lastVisibleFragment = this.sort(currentSlide.querySelectorAll('.fragment:not(.disabled).visible')).pop();
                    if (lastVisibleFragment) {
                        index = parseInt(lastVisibleFragment.getAttribute('data-fragment-index') || 0, 10);
                    } else {
                        index = -1;
                    }
                }

                // Apply the offset if there is one
                index += offset;

                let changedFragments = this.update(index, fragments);

                if (changedFragments.hidden.length) {
                    this.deck.dispatchEvent({
                        target: this.deck.dom.wrapper,
                        type: 'fragmenthidden',
                        data: {
                            fragment: changedFragments.hidden[0],
                            fragments: changedFragments.hidden
                        }
                    });
                }

                if (changedFragments.shown.length) {
                    this.deck.dispatchEvent({
                        target: this.deck.dom.wrapper,
                        type: 'fragmentshown',
                        data: {
                            fragment: changedFragments.shown[0],
                            fragments: changedFragments.shown
                        }
                    });
                }

                this.deck.controls.update();
                this.deck.progress.update();

                if (this.deck.config.fragmentInURL) {
                    this.deck.location.writeURL();
                }
                return !!(changedFragments.shown.length || changedFragments.hidden.length);
            }
        }
        return false;
    }

    /**
     * Navigate to the next slide fragment.
     *
     * @return {boolean} true if there was a next fragment,
     * false otherwise
     */
    next() {
        return this.goto(null, 1);

    }

    /**
     * Navigate to the previous slide fragment.
     *
     * @return {boolean} true if there was a previous fragment,
     * false otherwise
     */
    prev() {
        return this.goto(null, -1);
    }

}


/**
 * Manages our presentation controls. This includes both
 * the built-in control arrows as well as event monitoring
 * of any elements within the presentation with either of the
 * following helper classes:
 * - .navigate-up
 * - .navigate-right
 * - .navigate-down
 * - .navigate-left
 * - .navigate-next
 * - .navigate-prev
 */
class Controls {
    constructor(deck) {
        this.deck = deck;
        this.onNavigateLeftClicked = this.onNavigateLeftClicked.bind(this);
        this.onNavigateRightClicked = this.onNavigateRightClicked.bind(this);
        this.onNavigateUpClicked = this.onNavigateUpClicked.bind(this);
        this.onNavigateDownClicked = this.onNavigateDownClicked.bind(this);
        this.onNavigatePrevClicked = this.onNavigatePrevClicked.bind(this);
        this.onNavigateNextClicked = this.onNavigateNextClicked.bind(this);
    }

    render() {
        const rtl = this.deck.config.rtl;
        const revealElement = this.deck.deckElement;
        this.element = document.createElement('aside');
        this.element.className = 'controls';
        this.element.innerHTML =
            `<button class="navigate-left" aria-label="${rtl ? 'next slide' : 'previous slide'}"><div class="controls-arrow"></div></button>
			<button class="navigate-right" aria-label="${rtl ? 'previous slide' : 'next slide'}"><div class="controls-arrow"></div></button>
			<button class="navigate-up" aria-label="above slide"><div class="controls-arrow"></div></button>
			<button class="navigate-down" aria-label="below slide"><div class="controls-arrow"></div></button>`;
        this.deck.deckElement.appendChild(this.element);
        // There can be multiple instances of controls throughout the page
        this.controlsLeft = queryAll(revealElement, '.navigate-left');
        this.controlsRight = queryAll(revealElement, '.navigate-right');
        this.controlsUp = queryAll(revealElement, '.navigate-up');
        this.controlsDown = queryAll(revealElement, '.navigate-down');
        this.controlsPrev = queryAll(revealElement, '.navigate-prev');
        this.controlsNext = queryAll(revealElement, '.navigate-next');
        // The left, right and down arrows in the standard  controls
        this.controlsRightArrow = this.element.querySelector('.navigate-right');
        this.controlsLeftArrow = this.element.querySelector('.navigate-left');
        this.controlsDownArrow = this.element.querySelector('.navigate-down');
    }

    /**
     * Called when the  config is updated.
     */
    configure(config, oldConfig) {
        this.element.style.display = config.controls ? 'block' : 'none';
        this.element.setAttribute('data-controls-layout', config.controlsLayout);
        this.element.setAttribute('data-controls-back-arrows', config.controlsBackArrows);
    }

    bind() {
        // Listen to both touch and click events, in case the device
        // supports both
        let pointerEvents = ['touchstart', 'click'];
        // Only support touch for Android, fixes double navigations in
        // stock browser
        if (isAndroid) {
            pointerEvents = ['touchstart'];
        }
        pointerEvents.forEach(eventName => {
            this.controlsLeft.forEach(el => el.addEventListener(eventName, this.onNavigateLeftClicked, false));
            this.controlsRight.forEach(el => el.addEventListener(eventName, this.onNavigateRightClicked, false));
            this.controlsUp.forEach(el => el.addEventListener(eventName, this.onNavigateUpClicked, false));
            this.controlsDown.forEach(el => el.addEventListener(eventName, this.onNavigateDownClicked, false));
            this.controlsPrev.forEach(el => el.addEventListener(eventName, this.onNavigatePrevClicked, false));
            this.controlsNext.forEach(el => el.addEventListener(eventName, this.onNavigateNextClicked, false));
        });
    }

    unbind() {
        ['touchstart', 'click'].forEach(eventName => {
            this.controlsLeft.forEach(el => el.removeEventListener(eventName, this.onNavigateLeftClicked, false));
            this.controlsRight.forEach(el => el.removeEventListener(eventName, this.onNavigateRightClicked, false));
            this.controlsUp.forEach(el => el.removeEventListener(eventName, this.onNavigateUpClicked, false));
            this.controlsDown.forEach(el => el.removeEventListener(eventName, this.onNavigateDownClicked, false));
            this.controlsPrev.forEach(el => el.removeEventListener(eventName, this.onNavigatePrevClicked, false));
            this.controlsNext.forEach(el => el.removeEventListener(eventName, this.onNavigateNextClicked, false));
        });
    }

    /**
     * Updates the state of all control/navigation arrows.
     */
    update() {
        let routes = this.deck.availableRoutes();
        // Remove the 'enabled' class from all directions
        [...this.controlsLeft, ...this.controlsRight, ...this.controlsUp, ...this.controlsDown, ...this.controlsPrev, ...this.controlsNext].forEach(node => {
            node.classList.remove('enabled', 'fragmented');
            // Set 'disabled' attribute on all directions
            node.setAttribute('disabled', 'disabled');
        });

        // Add the 'enabled' class to the available routes; remove 'disabled' attribute to enable buttons
        if (routes.left) this.controlsLeft.forEach(el => {
            el.classList.add('enabled');
            el.removeAttribute('disabled');
        });
        if (routes.right) this.controlsRight.forEach(el => {
            el.classList.add('enabled');
            el.removeAttribute('disabled');
        });
        if (routes.up) this.controlsUp.forEach(el => {
            el.classList.add('enabled');
            el.removeAttribute('disabled');
        });
        if (routes.down) this.controlsDown.forEach(el => {
            el.classList.add('enabled');
            el.removeAttribute('disabled');
        });

        // Prev/next buttons
        if (routes.left || routes.up) this.controlsPrev.forEach(el => {
            el.classList.add('enabled');
            el.removeAttribute('disabled');
        });
        if (routes.right || routes.down) this.controlsNext.forEach(el => {
            el.classList.add('enabled');
            el.removeAttribute('disabled');
        });

        // Highlight fragment directions
        let currentSlide = this.deck.currentSlide;
        if (currentSlide) {
            let fragmentsRoutes = this.deck.fragments.availableRoutes();
            // Always apply fragment decorator to prev/next buttons
            if (fragmentsRoutes.prev) this.controlsPrev.forEach(el => {
                el.classList.add('fragmented', 'enabled');
                el.removeAttribute('disabled');
            });
            if (fragmentsRoutes.next) this.controlsNext.forEach(el => {
                el.classList.add('fragmented', 'enabled');
                el.removeAttribute('disabled');
            });
            // Apply fragment decorators to directional buttons based on
            // what slide axis they are in
            if (this.deck.isVerticalSlide(currentSlide)) {
                if (fragmentsRoutes.prev) this.controlsUp.forEach(el => {
                    el.classList.add('fragmented', 'enabled');
                    el.removeAttribute('disabled');
                });
                if (fragmentsRoutes.next) this.controlsDown.forEach(el => {
                    el.classList.add('fragmented', 'enabled');
                    el.removeAttribute('disabled');
                });
            } else {
                if (fragmentsRoutes.prev) this.controlsLeft.forEach(el => {
                    el.classList.add('fragmented', 'enabled');
                    el.removeAttribute('disabled');
                });
                if (fragmentsRoutes.next) this.controlsRight.forEach(el => {
                    el.classList.add('fragmented', 'enabled');
                    el.removeAttribute('disabled');
                });
            }
        }

        if (this.deck.config.controlsTutorial) {
            let indices = this.deck.getIndices();
            // Highlight control arrows with an animation to ensure
            // that the viewer knows how to navigate
            if (!this.deck.navigationHistory.hasNavigatedVertically && routes.down) {
                this.controlsDownArrow.classList.add('highlight');
            } else {
                this.controlsDownArrow.classList.remove('highlight');
                if (this.deck.config.rtl) {
                    if (!this.deck.navigationHistory.hasNavigatedHorizontally && routes.left && indices.v === 0) {
                        this.controlsLeftArrow.classList.add('highlight');
                    } else {
                        this.controlsLeftArrow.classList.remove('highlight');
                    }
                } else {
                    if (!this.deck.navigationHistory.hasNavigatedHorizontally && routes.right && indices.v === 0) {
                        this.controlsRightArrow.classList.add('highlight');
                    } else {
                        this.controlsRightArrow.classList.remove('highlight');
                    }
                }
            }
        }
    }

    /**
     * Event handlers for navigation control buttons.
     */
    onNavigateLeftClicked(event) {
        event.preventDefault();
        this.deck.onUserInput();
        if (this.deck.config.navigationMode === 'linear') {
            this.deck.navigatePrev();
        } else {
            this.deck.navigateLeft();
        }
    }

    onNavigateRightClicked(event) {
        event.preventDefault();
        this.deck.onUserInput();
        if (this.deck.config.navigationMode === 'linear') {
            this.deck.navigateNext();
        } else {
            this.deck.navigateRight();
        }
    }

    onNavigateUpClicked(event) {
        event.preventDefault();
        this.deck.onUserInput();
        this.deck.navigateUp();
    }

    onNavigateDownClicked(event) {
        event.preventDefault();
        this.deck.onUserInput();
        this.deck.navigateDown();
    }

    onNavigatePrevClicked(event) {
        event.preventDefault();
        this.deck.onUserInput();
        this.deck.navigatePrev();
    }

    onNavigateNextClicked(event) {
        event.preventDefault();
        this.deck.onUserInput();
        this.deck.navigateNext();
    }
}

/**
 * Handles all  keyboard interactions.
 */
class Keyboard {

    constructor(deck) {
        this.deck = deck;
        // A key:value map of keyboard keys and descriptions of
        // the actions they trigger
        this.shortcuts = {};
        // Holds custom key code mappings
        this.bindings = {};
        this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
        this.onDocumentKeyPress = this.onDocumentKeyPress.bind(this);
    }

    /**
     * Called when the  config is updated.
     */
    configure(config, oldConfig) {
        if (config.navigationMode === 'linear') {
            this.shortcuts['&#8594;  ,  &#8595;  ,  SPACE  ,  N  ,  L  ,  J'] = 'Next slide';
            this.shortcuts['&#8592;  ,  &#8593;  ,  P  ,  H  ,  K'] = 'Previous slide';
        } else {
            this.shortcuts['N  ,  SPACE'] = 'Next slide';
            this.shortcuts['P'] = 'Previous slide';
            this.shortcuts['&#8592;  ,  H'] = 'Navigate left';
            this.shortcuts['&#8594;  ,  L'] = 'Navigate right';
            this.shortcuts['&#8593;  ,  K'] = 'Navigate up';
            this.shortcuts['&#8595;  ,  J'] = 'Navigate down';
        }
        this.shortcuts['Home  ,  Shift &#8592;'] = 'First slide';
        this.shortcuts['End  ,  Shift &#8594;'] = 'Last slide';
        this.shortcuts['B  ,  .'] = 'Pause';
        this.shortcuts['F'] = 'Fullscreen';
        this.shortcuts['ESC, O'] = 'Slide overview';
    }

    /**
     * Starts listening for keyboard events.
     */
    bind() {
        document.addEventListener('keydown', this.onDocumentKeyDown, false);
        document.addEventListener('keypress', this.onDocumentKeyPress, false);
    }

    /**
     * Stops listening for keyboard events.
     */
    unbind() {
        document.removeEventListener('keydown', this.onDocumentKeyDown, false);
        document.removeEventListener('keypress', this.onDocumentKeyPress, false);
    }

    /**
     * Add a custom key binding with optional description to
     * be added to the help screen.
     */
    addKeyBinding(binding, callback) {
        if (typeof binding === 'object' && binding.keyCode) {
            this.bindings[binding.keyCode] = {
                callback: callback,
                key: binding.key,
                description: binding.description
            };
        } else {
            this.bindings[binding] = {
                callback: callback,
                key: null,
                description: null
            };
        }
    }

    /**
     * Removes the specified custom key binding.
     */
    removeKeyBinding(keyCode) {
        delete this.bindings[keyCode];
    }

    /**
     * Programmatically triggers a keyboard event
     *
     * @param {int} keyCode
     */
    triggerKey(keyCode) {
        this.onDocumentKeyDown({ keyCode });
    }

    /**
     * Registers a new shortcut to include in the help overlay
     *
     * @param {String} key
     * @param {String} value
     */
    registerKeyboardShortcut(key, value) {
        this.shortcuts[key] = value;
    }

    getShortcuts() {
        return this.shortcuts;
    }

    getBindings() {
        return this.bindings;
    }

    /**
     * Handler for the document level 'keypress' event.
     *
     * @param {object} event
     */
    onDocumentKeyPress(event) {
        // Check if the pressed key is question mark
        if (event.shiftKey && event.charCode === 63) {
            this.deck.toggleHelp();
        }
    }

    /**
     * Handler for the document level 'keydown' event.
     *
     * @param {object} event
     */
    onDocumentKeyDown(event) {
        let config = this.deck.config;

        // If there's a condition specified and it returns false,
        // ignore this event
        if (typeof config.keyboardCondition === 'function' && config.keyboardCondition(event) === false) {
            return true;
        }

        // If keyboardCondition is set, only capture keyboard events
        // for embedded decks when they are focused
        if (config.keyboardCondition === 'focused' && !this.deck.focus.isFocused()) {
            return true;
        }

        // Shorthand
        let keyCode = event.keyCode;

        // Remember if auto-sliding was paused so we can toggle it
        let autoSlideWasPaused = !this.deck.isAutoSliding();

        this.deck.onUserInput(event);

        // Is there a focused element that could be using the keyboard?
        let activeElementIsCE = document.activeElement && document.activeElement.isContentEditable === true;
        let activeElementIsInput = document.activeElement && document.activeElement.tagName && /input|textarea/i.test(document.activeElement.tagName);
        let activeElementIsNotes = document.activeElement && document.activeElement.className && /speaker-notes/i.test(document.activeElement.className);

        // Whitelist specific modified + keycode combinations
        let prevSlideShortcut = event.shiftKey && event.keyCode === 32;
        let firstSlideShortcut = event.shiftKey && keyCode === 37;
        let lastSlideShortcut = event.shiftKey && keyCode === 39;

        // Prevent all other events when a modifier is pressed
        let unusedModifier = !prevSlideShortcut && !firstSlideShortcut && !lastSlideShortcut &&
            (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey);

        // Disregard the event if there's a focused element or a
        // keyboard modifier key is present
        if (activeElementIsCE || activeElementIsInput || activeElementIsNotes || unusedModifier) return;

        // While paused only allow resume keyboard events; 'b', 'v', '.'
        let resumeKeyCodes = [66, 86, 190, 191];
        let key;

        // Custom key bindings for togglePause should be able to resume
        if (typeof config.keyboard === 'object') {
            for (key in config.keyboard) {
                if (config.keyboard[key] === 'togglePause') {
                    resumeKeyCodes.push(parseInt(key, 10));
                }
            }
        }

        if (this.deck.isPaused() && resumeKeyCodes.indexOf(keyCode) === -1) {
            return false;
        }

        // Use linear navigation if we're configured to OR if
        // the presentation is one-dimensional
        let useLinearMode = config.navigationMode === 'linear' || !this.deck.hasHorizontalSlides() || !this.deck.hasVerticalSlides();

        let triggered = false;

        // 1. User defined key bindings
        if (typeof config.keyboard === 'object') {
            for (key in config.keyboard) {
                // Check if this binding matches the pressed key
                if (parseInt(key, 10) === keyCode) {
                    let value = config.keyboard[key];
                    // Callback function
                    if (typeof value === 'function') {
                        value.apply(null, [event]);
                    }
                    // String shortcuts to  API
                    else if (typeof value === 'string' && typeof this.deck[value] === 'function') {
                        this.deck[value].call();
                    }
                    triggered = true;
                }
            }
        }

        // 2. Registered custom key bindings
        if (triggered === false) {
            for (key in this.bindings) {
                // Check if this binding matches the pressed key
                if (parseInt(key, 10) === keyCode) {
                    let action = this.bindings[key].callback;
                    // Callback function
                    if (typeof action === 'function') {
                        action.apply(null, [event]);
                    }
                    // String shortcuts to  API
                    else if (typeof action === 'string' && typeof this.deck[action] === 'function') {
                        this.deck[action].call();
                    }
                    triggered = true;
                }
            }
        }

        // 3. System defined key bindings
        if (triggered === false) {
            // Assume true and try to prove false
            triggered = true;
            // P, PAGE UP
            if (keyCode === 80 || keyCode === 33) {
                this.deck.navigatePrev();
            }
            // N, PAGE DOWN
            else if (keyCode === 78 || keyCode === 34) {
                this.deck.navigateNext();
            }
            // H, LEFT
            else if (keyCode === 72 || keyCode === 37) {
                if (firstSlideShortcut) {
                    this.deck.slide(0);
                } else if (!this.deck.overview.isActive() && useLinearMode) {
                    this.deck.navigatePrev();
                } else {
                    this.deck.navigateLeft();
                }
            }
            // L, RIGHT
            else if (keyCode === 76 || keyCode === 39) {
                if (lastSlideShortcut) {
                    this.deck.slide(Number.MAX_VALUE);
                } else if (!this.deck.overview.isActive() && useLinearMode) {
                    this.deck.navigateNext();
                } else {
                    this.deck.navigateRight();
                }
            }
            // K, UP
            else if (keyCode === 75 || keyCode === 38) {
                if (!this.deck.overview.isActive() && useLinearMode) {
                    this.deck.navigatePrev();
                } else {
                    this.deck.navigateUp();
                }
            }
            // J, DOWN
            else if (keyCode === 74 || keyCode === 40) {
                if (!this.deck.overview.isActive() && useLinearMode) {
                    this.deck.navigateNext();
                } else {
                    this.deck.navigateDown();
                }
            }
            // HOME
            else if (keyCode === 36) {
                this.deck.slide(0);
            }
            // END
            else if (keyCode === 35) {
                this.deck.slide(Number.MAX_VALUE);
            }
            // SPACE
            else if (keyCode === 32) {
                if (this.deck.overview.isActive()) {
                    this.deck.overview.deactivate();
                }
                if (event.shiftKey) {
                    this.deck.navigatePrev();
                } else {
                    this.deck.navigateNext();
                }
            }
            // TWO-SPOT, SEMICOLON, B, V, PERIOD, LOGITECH PRESENTER TOOLS "BLACK SCREEN" BUTTON
            else if (keyCode === 58 || keyCode === 59 || keyCode === 66 || keyCode === 86 || keyCode === 190 || keyCode === 191) {
                this.deck.togglePause();
            }
            // F
            else if (keyCode === 70) {
                enterFullscreen(config.embedded ? this.deck.dom.viewport : document.documentElement);
            }
            // A
            else if (keyCode === 65) {
                if (config.autoSlideStoppable) {
                    this.deck.toggleAutoSlide(autoSlideWasPaused);
                }
            } else {
                triggered = false;
            }

        }

        // If the input resulted in a triggered action we should prevent
        // the browsers default behavior
        if (triggered) {
            event.preventDefault && event.preventDefault();
        }
        // ESC or O key
        else if (keyCode === 27 || keyCode === 79) {
            if (this.deck.closeOverlay() === false) {
                this.deck.overview.toggle();
            }

            event.preventDefault && event.preventDefault();
        }
        // If auto-sliding is enabled we need to cue up
        // another timeout
        this.deck.cueAutoSlide();
    }
}
/**
 * Loads a JavaScript file from the given URL and executes it.
 *
 * @param {string} url Address of the .js file to load
 * @param {function} callback Method to invoke when the script
 * has loaded and executed
 */
const loadScript = (url, callback) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = false;
        script.defer = false;
        script.src = url;

        if (typeof callback === 'function') {
            // Success callback
            script.onload = script.onreadystatechange = event => {
                if (event.type === 'load' || /loaded|complete/.test(script.readyState)) {
                    // Kill event listeners
                    script.onload = script.onreadystatechange = script.onerror = null;
                    callback();
                }
            };

            // Error callback
            script.onerror = err => {
                // Kill event listeners
                script.onload = script.onreadystatechange = script.onerror = null;
                callback(new Error('Failed loading script: ' + script.src + '\n' + err));
            };
        }
        // Append the script at the end of <head>
        const head = document.querySelector('head');
        head.insertBefore(script, head.lastChild);
    }
    /**
     * Reads and writes the URL based on ' current state.
     */
class Location {

    constructor(deck) {
        this.deck = deck;
        // Delays updates to the URL due to a Chrome thumbnailer bug
        this.writeURLTimeout = 0;
        this.onWindowHashChange = this.onWindowHashChange.bind(this);
    }

    bind() {
        window.addEventListener('hashchange', this.onWindowHashChange, false);
    }

    unbind() {
        window.removeEventListener('hashchange', this.onWindowHashChange, false);
    }

    /**
     * Reads the current URL (hash) and navigates accordingly.
     */
    readURL() {
        let config = this.deck.config;
        let indices = this.deck.getIndices();
        let currentSlide = this.deck.currentSlide;
        let hash = window.location.hash;
        // Attempt to parse the hash as either an index or name
        let bits = hash.slice(2).split('/'),
            name = hash.replace(/#\/?/gi, '');

        // If the first bit is not fully numeric and there is a name we
        // can assume that this is a named link
        if (!/^[0-9]*$/.test(bits[0]) && name.length) {
            let element;

            let f;

            // Parse named links with fragments (#/named-link/2)
            if (/\/[-\d]+$/g.test(name)) {
                f = parseInt(name.split('/').pop(), 10);
                f = isNaN(f) ? undefined : f;
                name = name.split('/').shift();
            }

            // Ensure the named link is a valid HTML ID attribute
            try {
                element = document.getElementById(decodeURIComponent(name));
            } catch (error) {}

            // Ensure that we're not already on a slide with the same name
            let isSameNameAsCurrentSlide = currentSlide ? currentSlide.getAttribute('id') === name : false;

            if (element) {
                // If the slide exists and is not the current slide...
                if (!isSameNameAsCurrentSlide || typeof f !== 'undefined') {
                    // ...find the position of the named slide and navigate to it
                    let slideIndices = this.deck.getIndices(element);
                    this.deck.slide(slideIndices.h, slideIndices.v, f);
                }
            }
            // If the slide doesn't exist, navigate to the current slide
            else {
                this.deck.slide(indices.h || 0, indices.v || 0);
            }
        } else {
            let hashIndexBase = config.hashOneBasedIndex ? 1 : 0;

            // Read the index components of the hash
            let h = (parseInt(bits[0], 10) - hashIndexBase) || 0,
                v = (parseInt(bits[1], 10) - hashIndexBase) || 0,
                f;

            if (config.fragmentInURL) {
                f = parseInt(bits[2], 10);
                if (isNaN(f)) {
                    f = undefined;
                }
            }

            if (h !== indices.h || v !== indices.v || f !== undefined) {
                this.deck.slide(h, v, f);
            }
        }
    }

    /**
     * Updates the page URL (hash) to reflect the current
     * state.
     *
     * @param {number} delay The time in ms to wait before
     * writing the hash
     */
    writeURL(delay) {
        let config = this.deck.config;
        let currentSlide = this.deck.currentSlide;
        // Make sure there's never more than one timeout running
        clearTimeout(this.writeURLTimeout);
        // If a delay is specified, timeout this call
        if (typeof delay === 'number') {
            this.writeURLTimeout = setTimeout(this.writeURL, delay);
        } else if (currentSlide) {
            let hash = this.getHash();
            // If we're configured to push to history OR the history
            // API is not avaialble.
            if (config.history) {
                window.location.hash = hash;
            }
            // If we're configured to reflect the current slide in the
            // URL without pushing to history.
            else if (config.hash) {
                // If the hash is empty, don't add it to the URL
                if (hash === '/') {
                    window.history.replaceState(null, null, window.location.pathname + window.location.search);
                } else {
                    window.history.replaceState(null, null, '#' + hash);
                }
            }
        }
    }

    /**
     * Return a hash URL that will resolve to the given slide location.
     *
     * @param {HTMLElement} [slide=currentSlide] The slide to link to
     */
    getHash(slide) {

        let url = '/';

        // Attempt to create a named link based on the slide's ID
        let s = slide || this.deck.currentSlide;
        let id = s ? s.getAttribute('id') : null;
        if (id) {
            id = encodeURIComponent(id);
        }

        let index = this.deck.getIndices(slide);
        if (!this.deck.config.fragmentInURL) {
            index.f = undefined;
        }

        // If the current slide has an ID, use that as a named link,
        // but we don't support named links with a fragment index
        if (typeof id === 'string' && id.length) {
            url = '/' + id;

            // If there is also a fragment, append that at the end
            // of the named link, like: #/named-link/2
            if (index.f >= 0) url += '/' + index.f;
        }
        // Otherwise use the /h/v index
        else {
            let hashIndexBase = this.deck.config.hashOneBasedIndex ? 1 : 0;
            if (index.h > 0 || index.v > 0 || index.f >= 0) url += index.h + hashIndexBase;
            if (index.v > 0 || index.f >= 0) url += '/' + (index.v + hashIndexBase);
            if (index.f >= 0) url += '/' + index.f;
        }

        return url;
    }

    /**
     * Handler for the window level 'hashchange' event.
     *
     * @param {object} [event]
     */
    onWindowHashChange(event) {
        this.readURL();
    }
}

/**
 * Handles the showing and
 */
class Notes {

    constructor(deck) {
        this.deck = deck;

    }

    render() {
        this.element = document.createElement('div');
        this.element.className = 'speaker-notes';
        this.element.setAttribute('data-prevent-swipe', '');
        this.element.setAttribute('tabindex', '0');
        this.deck.deckElement.appendChild(this.element);
    }

    /**
     * Called when the  config is updated.
     */
    configure(config, oldConfig) {
        if (config.showNotes) {
            this.element.setAttribute('data-layout', typeof config.showNotes === 'string' ? config.showNotes : 'inline');
        }
    }

    /**
     * Pick up notes from the current slide and display them
     * to the viewer.
     *
     * @see {@link config.showNotes}
     */
    update() {
        if (this.deck.config.showNotes && this.element && this.deck.currentSlide && !this.deck.print.isPrintingPDF()) {
            this.element.innerHTML = this.notes.getSlideNotes() || '<span class="notes-placeholder">No notes on this slide.</span>';
        }
    }

    /**
     * Updates the visibility of the speaker notes sidebar that
     * is used to share annotated slides. The notes sidebar is
     * only visible if showNotes is true and there are notes on
     * one or more slides in the deck.
     */
    updateVisibility() {
        if (this.deck.config.showNotes && this.hasNotes() && !this.deck.print.isPrintingPDF()) {
            this.deck.deckElement.classList.add('show-notes');
        } else {
            this.deck.deckElement.classList.remove('show-notes');
        }
    }

    /**
     * Checks if there are speaker notes for ANY slide in the
     * presentation.
     */
    hasNotes() {
        return this.deck.dom.slides.querySelectorAll('[data-notes], aside.notes').length > 0;
    }

    /**
     * Checks if this presentation is running inside of the
     * speaker notes window.
     *
     * @return {boolean}
     */
    isSpeakerNotesWindow() {
        return !!window.location.search.match(/receiver/gi);
    }

    /**
     * Retrieves the speaker notes from a slide. Notes can be
     * defined in two ways:
     * 1. As a data-notes attribute on the slide <section>
     * 2. As an <aside class="notes"> inside of the slide
     *
     * @param {HTMLElement} [slide=currentSlide]
     * @return {(string|null)}
     */
    getSlideNotes(slide = this.deck.currentSlide) {
        // Notes can be specified via the data-notes attribute...
        if (slide.hasAttribute('data-notes')) {
            return slide.getAttribute('data-notes');
        }
        // ... or using an <aside class="notes"> element
        let notesElement = slide.querySelector('aside.notes');
        if (notesElement) {
            return notesElement.innerHTML;
        }
        return null;
    }
}

/**
 * Handles all logic related to the overview mode
 * (birds-eye view of all slides).
 */
class Overview {
    constructor(deck) {
        this.deck = deck;
        this.active = false;
        this.onSlideClicked = this.onSlideClicked.bind(this);
    }

    /**
     * Displays the overview of slides (quick nav) by scaling
     * down and arranging all slide elements.
     */
    activate() {
        // Only proceed if enabled in config
        if (this.deck.config.overview && !this.isActive()) {
            this.active = true;
            this.deck.deckElement.classList.add('overview');
            // Don't auto-slide while in overview mode
            this.deck.cancelAutoSlide();
            // Move the backgrounds element into the slide container to
            // that the same scaling is applied
            this.deck.dom.slides.appendChild(this.deck.backgrounds.element);
            // Clicking on an overview slide navigates to it
            queryAll(this.deck.deckElement, SLIDES_SELECTOR).forEach(slide => {
                if (!slide.classList.contains('stack')) {
                    slide.addEventListener('click', this.onSlideClicked, true);
                }
            });
            // Calculate slide sizes
            const margin = 70;
            const slideSize = this.deck.getComputedSlideSize();
            this.overviewSlideWidth = slideSize.width + margin;
            this.overviewSlideHeight = slideSize.height + margin;
            // Reverse in RTL mode
            if (this.deck.config.rtl) {
                this.overviewSlideWidth = -this.overviewSlideWidth;
            }
            this.deck.updateSlidesVisibility();
            this.layout();
            this.update();
            this.deck.layout();
            const indices = this.deck.getIndices();
            // Notify observers of the overview showing
            this.deck.dispatchEvent({
                target: this.deck.dom.wrapper,
                type: 'overviewshown',
                data: {
                    'indexh': indices.h,
                    'indexv': indices.v,
                    'currentSlide': this.deck.currentSlide
                }
            });
        }
    }

    /**
     * Uses CSS transforms to position all slides in a grid for
     * display inside of the overview mode.
     */
    layout() {
        // Layout slides
        this.deck.getHorizontalSlides().forEach((hslide, h) => {
            hslide.setAttribute('data-index-h', h);
            transformElement(hslide, 'translate3d(' + (h * this.overviewSlideWidth) + 'px, 0, 0)');
            if (hslide.classList.contains('stack')) {
                queryAll(hslide, 'section').forEach((vslide, v) => {
                    vslide.setAttribute('data-index-h', h);
                    vslide.setAttribute('data-index-v', v);
                    transformElement(vslide, 'translate3d(0, ' + (v * this.overviewSlideHeight) + 'px, 0)');
                });
            }
        });

        // Layout slide backgrounds
        Array.from(this.deck.backgrounds.element.childNodes).forEach((hbackground, h) => {
            transformElement(hbackground, 'translate3d(' + (h * this.overviewSlideWidth) + 'px, 0, 0)');
            queryAll(hbackground, '.slide-background').forEach((vbackground, v) => {
                transformElement(vbackground, 'translate3d(0, ' + (v * this.overviewSlideHeight) + 'px, 0)');
            });
        });
    }

    /**
     * Moves the overview viewport to the current slides.
     * Called each time the current slide changes.
     */
    update() {
        const vmin = Math.min(window.innerWidth, window.innerHeight);
        const scale = Math.max(vmin / 5, 150) / vmin;
        const indices = this.deck.getIndices();
        this.deck.transformSlides({
            overview: [
                'scale(' + scale + ')',
                'translateX(' + (-indices.h * this.overviewSlideWidth) + 'px)',
                'translateY(' + (-indices.v * this.overviewSlideHeight) + 'px)'
            ].join(' ')
        });
    }

    /**
     * Exits the slide overview and enters the currently
     * active slide.
     */
    deactivate() {
        // Only proceed if enabled in config
        if (this.deck.config.overview) {
            this.active = false;
            this.deck.deckElement.classList.remove('overview');
            // Temporarily add a class so that transitions can do different things
            // depending on whether they are exiting/entering overview, or just
            // moving from slide to slide
            this.deck.deckElement.classList.add('overview-deactivating');
            setTimeout(() => {
                this.deck.deckElement.classList.remove('overview-deactivating');
            }, 1);
            // Move the background element back out
            this.deck.deckElement.appendChild(this.deck.backgrounds.element);
            // Clean up changes made to slides
            queryAll(this.deck.deckElement, SLIDES_SELECTOR).forEach(slide => {
                transformElement(slide, '');
                slide.removeEventListener('click', this.onSlideClicked, true);
            });
            // Clean up changes made to backgrounds
            queryAll(this.deck.backgrounds.element, '.slide-background').forEach(background => {
                transformElement(background, '');
            });
            this.deck.transformSlides({ overview: '' });
            const indices = this.deck.getIndices();
            this.deck.slide(indices.h, indices.v);
            this.deck.layout();
            this.deck.cueAutoSlide();
            // Notify observers of the overview hiding
            this.deck.dispatchEvent({
                target: this.deck.dom.wrapper,
                type: 'overviewhidden',
                data: {
                    'indexh': indices.h,
                    'indexv': indices.v,
                    'currentSlide': this.deck.currentSlide
                }
            });
        }
    }

    /**
     * Toggles the slide overview mode on and off.
     *
     * @param {Boolean} [override] Flag which overrides the
     * toggle logic and forcibly sets the desired state. True means
     * overview is open, false means it's closed.
     */
    toggle(override) {
        if (typeof override === 'boolean') {
            override ? this.activate() : this.deactivate();
        } else {
            this.isActive() ? this.deactivate() : this.activate();
        }
    }

    /**
     * Checks if the overview is currently active.
     *
     * @return {Boolean} true if the overview is active,
     * false otherwise
     */
    isActive() {
        return this.active;
    }

    /**
     * Invoked when a slide is and we're in the overview.
     *
     * @param {object} event
     */
    onSlideClicked(event) {
        if (this.isActive()) {
            event.preventDefault();
            let element = event.target;
            while (element && !element.nodeName.match(/section/gi)) {
                element = element.parentNode;
            }
            if (element && !element.classList.contains('disabled')) {
                this.deactivate();
                if (element.nodeName.match(/section/gi)) {
                    let h = parseInt(element.getAttribute('data-index-h'), 10),
                        v = parseInt(element.getAttribute('data-index-v'), 10);

                    this.deck.slide(h, v);
                }
            }
        }
    }
}
/**
 * UI component that lets the use control auto-slide
 * playback via play/pause.
 */
class Playback {
    /**
     * @param {HTMLElement} container The component will append
     * itself to this
     * @param {function} progressCheck A method which will be
     * called frequently to get the current playback progress on
     * a range of 0-1
     */
    constructor(container, progressCheck) {
        // Cosmetics
        this.diameter = 100;
        this.diameter2 = this.diameter / 2;
        this.thickness = 6;

        // Flags if we are currently playing
        this.playing = false;

        // Current progress on a 0-1 range
        this.progress = 0;

        // Used to loop the animation smoothly
        this.progressOffset = 1;

        this.container = container;
        this.progressCheck = progressCheck;

        this.canvas = document.createElement('canvas');
        this.canvas.className = 'playback';
        this.canvas.width = this.diameter;
        this.canvas.height = this.diameter;
        this.canvas.style.width = this.diameter2 + 'px';
        this.canvas.style.height = this.diameter2 + 'px';
        this.context = this.canvas.getContext('2d');

        this.container.appendChild(this.canvas);

        this.render();
    }

    setPlaying(value) {
        const wasPlaying = this.playing;
        this.playing = value;
        // Start repainting if we weren't already
        if (!wasPlaying && this.playing) {
            this.animate();
        } else {
            this.render();
        }
    }

    animate() {
        const progressBefore = this.progress;
        this.progress = this.progressCheck();
        // When we loop, offset the progress so that it eases
        // smoothly rather than immediately resetting
        if (progressBefore > 0.8 && this.progress < 0.2) {
            this.progressOffset = this.progress;
        }
        this.render();
        if (this.playing) {
            requestAnimationFrame(this.animate.bind(this));
        }
    }

    /**
     * Renders the current progress and playback state.
     */
    render() {
        let progress = this.playing ? this.progress : 0,
            radius = (this.diameter2) - this.thickness,
            x = this.diameter2,
            y = this.diameter2,
            iconSize = 28;

        // Ease towards 1
        this.progressOffset += (1 - this.progressOffset) * 0.1;
        const endAngle = (-Math.PI / 2) + (progress * (Math.PI * 2));
        const startAngle = (-Math.PI / 2) + (this.progressOffset * (Math.PI * 2));
        this.context.save();
        this.context.clearRect(0, 0, this.diameter, this.diameter);

        // Solid background color
        this.context.beginPath();
        this.context.arc(x, y, radius + 4, 0, Math.PI * 2, false);
        this.context.fillStyle = 'rgba( 0, 0, 0, 0.4 )';
        this.context.fill();

        // Draw progress track
        this.context.beginPath();
        this.context.arc(x, y, radius, 0, Math.PI * 2, false);
        this.context.lineWidth = this.thickness;
        this.context.strokeStyle = 'rgba( 255, 255, 255, 0.2 )';
        this.context.stroke();

        if (this.playing) {
            // Draw progress on top of track
            this.context.beginPath();
            this.context.arc(x, y, radius, startAngle, endAngle, false);
            this.context.lineWidth = this.thickness;
            this.context.strokeStyle = '#fff';
            this.context.stroke();
        }

        this.context.translate(x - (iconSize / 2), y - (iconSize / 2));

        // Draw play/pause icons
        if (this.playing) {
            this.context.fillStyle = '#fff';
            this.context.fillRect(0, 0, iconSize / 2 - 4, iconSize);
            this.context.fillRect(iconSize / 2 + 4, 0, iconSize / 2 - 4, iconSize);
        } else {
            this.context.beginPath();
            this.context.translate(4, 0);
            this.context.moveTo(0, 0);
            this.context.lineTo(iconSize - 4, iconSize / 2);
            this.context.lineTo(0, iconSize);
            this.context.fillStyle = '#fff';
            this.context.fill();
        }
        this.context.restore();
    }

    on(type, listener) {
        this.canvas.addEventListener(type, listener, false);
    }

    off(type, listener) {
        this.canvas.removeEventListener(type, listener, false);
    }

    destroy() {
        this.playing = false;
        if (this.canvas.parentNode) {
            this.container.removeChild(this.canvas);
        }
    }

}
/**
 * Handles hiding of the pointer/cursor when inactive.
 */
class Pointer {

    constructor(deck) {
        this.deck = deck;
        // Throttles mouse wheel navigation
        this.lastMouseWheelStep = 0;
        // Is the mouse pointer currently hidden from view
        this.cursorHidden = false;
        // Timeout used to determine when the cursor is inactive
        this.cursorInactiveTimeout = 0;
        this.onDocumentCursorActive = this.onDocumentCursorActive.bind(this);
        this.onDocumentMouseScroll = this.onDocumentMouseScroll.bind(this);
    }

    /**
     * Called when the  config is updated.
     */
    configure(config, oldConfig) {
            if (config.mouseWheel) {
                document.addEventListener('DOMMouseScroll', this.onDocumentMouseScroll, false); // FF
                document.addEventListener('mousewheel', this.onDocumentMouseScroll, false);
            } else {
                document.removeEventListener('DOMMouseScroll', this.onDocumentMouseScroll, false); // FF
                document.removeEventListener('mousewheel', this.onDocumentMouseScroll, false);
            }
            // Auto-hide the mouse pointer when its inactive
            if (config.hideInactiveCursor) {
                document.addEventListener('mousemove', this.onDocumentCursorActive, false);
                document.addEventListener('mousedown', this.onDocumentCursorActive, false);
            } else {
                this.showCursor();
                document.removeEventListener('mousemove', this.onDocumentCursorActive, false);
                document.removeEventListener('mousedown', this.onDocumentCursorActive, false);
            }
        }
        /**
         * Shows the mouse pointer after it has been hidden with
         * #hideCursor.
         */
    showCursor() {
        if (this.cursorHidden) {
            this.cursorHidden = false;
            this.deck.deckElement.style.cursor = '';
        }
    }

    /**
     * Hides the mouse pointer when it's on top of the .reveal
     * container.
     */
    hideCursor() {
        if (this.cursorHidden === false) {
            this.cursorHidden = true;
            this.deck.deckElement.style.cursor = 'none';
        }
    }

    /**
     * Called whenever there is mouse input at the document level
     * to determine if the cursor is active or not.
     *
     * @param {object} event
     */
    onDocumentCursorActive(event) {
        this.showCursor();
        clearTimeout(this.cursorInactiveTimeout);
        this.cursorInactiveTimeout = setTimeout(this.hideCursor.bind(this), this.deck.config.hideCursorTime);
    }

    /**
     * Handles mouse wheel scrolling, throttled to avoid skipping
     * multiple slides.
     *
     * @param {object} event
     */
    onDocumentMouseScroll(event) {
        if (Date.now() - this.lastMouseWheelStep > 1000) {
            this.lastMouseWheelStep = Date.now();
            let delta = event.detail || -event.wheelDelta;
            if (delta > 0) {
                this.deck.navigateNext();
            } else if (delta < 0) {
                this.deck.navigatePrev();
            }
        }
    }
}


/**
 * Setups up our presentation for printing/exporting to PDF.
 */
class Print {

    constructor(deck) {
        this.deck = deck;
    }

    /**
     * Configures the presentation for printing to a static
     * PDF.
     */
    setupPDF() {
        let config = this.deck.config;
        let slideSize = this.deck.getComputedSlideSize(window.innerWidth, window.innerHeight);
        // Dimensions of the PDF pages
        let pageWidth = Math.floor(slideSize.width * (1 + config.margin)),
            pageHeight = Math.floor(slideSize.height * (1 + config.margin));

        // Dimensions of slides within the pages
        let slideWidth = slideSize.width,
            slideHeight = slideSize.height;

        // Let the browser know what page size we want to print
        createStyleSheet('@page{size:' + pageWidth + 'px ' + pageHeight + 'px; margin: 0px;}');

        // Limit the size of certain elements to the dimensions of the slide
        createStyleSheet('.reveal section>img, .reveal section>video, .reveal section>iframe{max-width: ' + slideWidth + 'px; max-height:' + slideHeight + 'px}');

        document.documentElement.classList.add('print-pdf');
        document.body.style.width = pageWidth + 'px';
        document.body.style.height = pageHeight + 'px';

        // Make sure stretch elements fit on slide
        this.deck.layoutSlideContents(slideWidth, slideHeight);

        // Compute slide numbers now, before we start duplicating slides
        let doingSlideNumbers = config.slideNumber && /all|print/i.test(config.showSlideNumber);
        queryAll(this.deck.deckElement, SLIDES_SELECTOR).forEach(function(slide) {
            slide.setAttribute('data-slide-number', this.deck.slideNumber.getSlideNumber(slide));
        }, this);

        // Slide and slide background layout
        queryAll(this.deck.deckElement, SLIDES_SELECTOR).forEach(function(slide) {
            // Vertical stacks are not centred since their section
            // children will be
            if (slide.classList.contains('stack') === false) {
                // Center the slide inside of the page, giving the slide some margin
                let left = (pageWidth - slideWidth) / 2,
                    top = (pageHeight - slideHeight) / 2;

                let contentHeight = slide.scrollHeight;
                let numberOfPages = Math.max(Math.ceil(contentHeight / pageHeight), 1);

                // Adhere to configured pages per slide limit
                numberOfPages = Math.min(numberOfPages, config.pdfMaxPagesPerSlide);

                // Center slides vertically
                if (numberOfPages === 1 && config.center || slide.classList.contains('center')) {
                    top = Math.max((pageHeight - contentHeight) / 2, 0);
                }

                // Wrap the slide in a page element and hide its overflow
                // so that no page ever flows onto another
                let page = document.createElement('div');
                page.className = 'pdf-page';
                page.style.height = ((pageHeight + config.pdfPageHeightOffset) * numberOfPages) + 'px';
                slide.parentNode.insertBefore(page, slide);
                page.appendChild(slide);

                // Position the slide inside of the page
                slide.style.left = left + 'px';
                slide.style.top = top + 'px';
                slide.style.width = slideWidth + 'px';

                if (slide.slideBackgroundElement) {
                    page.insertBefore(slide.slideBackgroundElement, slide);
                }

                // Inject notes if `showNotes` is enabled
                if (config.showNotes) {
                    // Are there notes for this slide?
                    let notes = this.deck.notes.getSlideNotes(slide);
                    if (notes) {
                        let notesSpacing = 8;
                        let notesLayout = typeof config.showNotes === 'string' ? config.showNotes : 'inline';
                        let notesElement = document.createElement('div');
                        notesElement.classList.add('speaker-notes');
                        notesElement.classList.add('speaker-notes-pdf');
                        notesElement.setAttribute('data-layout', notesLayout);
                        notesElement.innerHTML = notes;

                        if (notesLayout === 'separate-page') {
                            page.parentNode.insertBefore(notesElement, page.nextSibling);
                        } else {
                            notesElement.style.left = notesSpacing + 'px';
                            notesElement.style.bottom = notesSpacing + 'px';
                            notesElement.style.width = (pageWidth - notesSpacing * 2) + 'px';
                            page.appendChild(notesElement);
                        }
                    }
                }

                // Inject slide numbers if `slideNumbers` are enabled
                if (doingSlideNumbers) {
                    let numberElement = document.createElement('div');
                    numberElement.classList.add('slide-number');
                    numberElement.classList.add('slide-number-pdf');
                    numberElement.innerHTML = slide.getAttribute('data-slide-number');
                    page.appendChild(numberElement);
                }

                // Copy page and show fragments one after another
                if (config.pdfSeparateFragments) {
                    // Each fragment 'group' is an array containing one or more
                    // fragments. Multiple fragments that appear at the same time
                    // are part of the same group.
                    let fragmentGroups = this.deck.fragments.sort(page.querySelectorAll('.fragment'), true);
                    let previousFragmentStep;
                    let previousPage;
                    fragmentGroups.forEach(function(fragments) {

                        // Remove 'current-fragment' from the previous group
                        if (previousFragmentStep) {
                            previousFragmentStep.forEach(function(fragment) {
                                fragment.classList.remove('current-fragment');
                            });
                        }

                        // Show the fragments for the current index
                        fragments.forEach(function(fragment) {
                            fragment.classList.add('visible', 'current-fragment');
                        }, this);

                        // Create a separate page for the current fragment state
                        let clonedPage = page.cloneNode(true);
                        page.parentNode.insertBefore(clonedPage, (previousPage || page).nextSibling);

                        previousFragmentStep = fragments;
                        previousPage = clonedPage;

                    }, this);

                    // Reset the first/original page so that all fragments are hidden
                    fragmentGroups.forEach(function(fragments) {
                        fragments.forEach(function(fragment) {
                            fragment.classList.remove('visible', 'current-fragment');
                        });
                    });

                }
                // Show all fragments
                else {
                    queryAll(page, '.fragment:not(.fade-out)').forEach(function(fragment) {
                        fragment.classList.add('visible');
                    });
                }

            }

        }, this);

        // Notify subscribers that the PDF layout is good to go
        this.deck.dispatchEvent({ target: this.deck.dom.wrapper, type: 'pdf-ready' });

    }

    /**
     * Checks if this instance is being used to print a PDF.
     */
    isPrintingPDF() {
        return (/print-pdf/gi).test(window.location.search);
    }
}

/**
 * Creates a visual progress bar for the presentation.
 */
class Progress {

    constructor(deck) {
        this.deck = deck;
        this.onProgressClicked = this.onProgressClicked.bind(this);
    }

    render() {
        this.element = document.createElement('div');
        this.element.className = 'progress';
        this.deck.deckElement.appendChild(this.element);
        this.bar = document.createElement('span');
        this.element.appendChild(this.bar);
    }

    /**
     * Called when the  config is updated.
     */
    configure(config, oldConfig) {
        this.element.style.display = config.progress ? 'block' : 'none';
    }

    bind() {
        if (this.deck.config.progress && this.element) {
            this.element.addEventListener('click', this.onProgressClicked, false);
        }
    }

    unbind() {
        if (this.deck.config.progress && this.element) {
            this.element.removeEventListener('click', this.onProgressClicked, false);
        }
    }

    /**
     * Updates the progress bar to reflect the current slide.
     */
    update() {
        // Update progress if enabled
        if (this.deck.config.progress && this.bar) {
            let scale = this.deck.getProgress();
            // Don't fill the progress bar if there's only one slide
            if (this.deck.getTotalSlides() < 2) {
                scale = 0;
            }
            this.bar.style.transform = 'scaleX(' + scale + ')';
        }
    }

    getMaxWidth() {
        return this.deck.deckElement.offsetWidth;

    }

    /**
     * Clicking on the progress bar results in a navigation to the
     * closest approximate horizontal slide using this equation:
     *
     * ( clickX / presentationWidth ) * numberOfSlides
     *
     * @param {object} event
     */
    onProgressClicked(event) {
        this.deck.onUserInput(event);
        event.preventDefault();
        let slidesTotal = this.deck.getHorizontalSlides().length;
        let slideIndex = Math.floor((event.clientX / this.getMaxWidth()) * slidesTotal);
        if (this.deck.config.rtl) {
            slideIndex = slidesTotal - slideIndex;
        }
        this.deck.slide(slideIndex);
    }
}


const SWIPE_THRESHOLD = 40;

/**
 * Controls all touch interactions and navigations for
 * a presentation.
 */
class Touch {

    constructor(deck) {

        this.deck = deck;

        // Holds information about the currently ongoing touch interaction
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchStartCount = 0;
        this.touchCaptured = false;

        this.onPointerDown = this.onPointerDown.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
        this.onPointerUp = this.onPointerUp.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);

    }

    /**
     *
     */
    bind() {

        let el = this.deck.deckElement;

        if ('onpointerdown' in window) {
            // Use W3C pointer events
            el.addEventListener('pointerdown', this.onPointerDown, false);
            el.addEventListener('pointermove', this.onPointerMove, false);
            el.addEventListener('pointerup', this.onPointerUp, false);
        } else if (window.navigator.msPointerEnabled) {
            // IE 10 uses prefixed version of pointer events
            el.addEventListener('MSPointerDown', this.onPointerDown, false);
            el.addEventListener('MSPointerMove', this.onPointerMove, false);
            el.addEventListener('MSPointerUp', this.onPointerUp, false);
        } else {
            // Fall back to touch events
            el.addEventListener('touchstart', this.onTouchStart, false);
            el.addEventListener('touchmove', this.onTouchMove, false);
            el.addEventListener('touchend', this.onTouchEnd, false);
        }

    }

    /**
     *
     */
    unbind() {

        let el = this.deck.deckElement;

        el.removeEventListener('pointerdown', this.onPointerDown, false);
        el.removeEventListener('pointermove', this.onPointerMove, false);
        el.removeEventListener('pointerup', this.onPointerUp, false);

        el.removeEventListener('MSPointerDown', this.onPointerDown, false);
        el.removeEventListener('MSPointerMove', this.onPointerMove, false);
        el.removeEventListener('MSPointerUp', this.onPointerUp, false);

        el.removeEventListener('touchstart', this.onTouchStart, false);
        el.removeEventListener('touchmove', this.onTouchMove, false);
        el.removeEventListener('touchend', this.onTouchEnd, false);

    }

    /**
     * Checks if the target element prevents the triggering of
     * swipe navigation.
     */
    isSwipePrevented(target) {

        while (target && typeof target.hasAttribute === 'function') {
            if (target.hasAttribute('data-prevent-swipe')) return true;
            target = target.parentNode;
        }

        return false;

    }

    /**
     * Handler for the 'touchstart' event, enables support for
     * swipe and pinch gestures.
     *
     * @param {object} event
     */
    onTouchStart(event) {

        if (this.isSwipePrevented(event.target)) return true;

        this.touchStartX = event.touches[0].clientX;
        this.touchStartY = event.touches[0].clientY;
        this.touchStartCount = event.touches.length;

    }

    /**
     * Handler for the 'touchmove' event.
     *
     * @param {object} event
     */
    onTouchMove(event) {

        if (this.isSwipePrevented(event.target)) return true;

        let config = this.deck.config;

        // Each touch should only trigger one action
        if (!this.touchCaptured) {
            this.deck.onUserInput(event);

            let currentX = event.touches[0].clientX;
            let currentY = event.touches[0].clientY;

            // There was only one touch point, look for a swipe
            if (event.touches.length === 1 && this.touchStartCount !== 2) {

                let availableRoutes = this.deck.availableRoutes({ includeFragments: true });

                let deltaX = currentX - this.touchStartX,
                    deltaY = currentY - this.touchStartY;

                if (deltaX > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
                    this.touchCaptured = true;
                    if (config.navigationMode === 'linear') {
                        if (config.rtl) {
                            this.deck.navigateNext();
                        } else {
                            this.deck.navigatePrev();
                        }
                    } else {
                        this.deck.navigateLeft();
                    }
                } else if (deltaX < -SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
                    this.touchCaptured = true;
                    if (config.navigationMode === 'linear') {
                        if (config.rtl) {
                            this.deck.navigatePrev();
                        } else {
                            this.deck.navigateNext();
                        }
                    } else {
                        this.deck.navigateRight();
                    }
                } else if (deltaY > SWIPE_THRESHOLD && availableRoutes.up) {
                    this.touchCaptured = true;
                    if (config.navigationMode === 'linear') {
                        this.deck.navigatePrev();
                    } else {
                        this.deck.navigateUp();
                    }
                } else if (deltaY < -SWIPE_THRESHOLD && availableRoutes.down) {
                    this.touchCaptured = true;
                    if (config.navigationMode === 'linear') {
                        this.deck.navigateNext();
                    } else {
                        this.deck.navigateDown();
                    }
                }

                // If we're embedded, only block touch events if they have
                // triggered an action
                if (config.embedded) {
                    if (this.touchCaptured || this.deck.isVerticalSlide()) {
                        event.preventDefault();
                    }
                }
                // Not embedded? Block them all to avoid needless tossing
                // around of the viewport in iOS
                else {
                    event.preventDefault();
                }

            }
        }
        // There's a bug with swiping on some Android devices unless
        // the default action is always prevented
        else if (isAndroid) {
            event.preventDefault();
        }

    }

    /**
     * Handler for the 'touchend' event.
     *
     * @param {object} event
     */
    onTouchEnd(event) {

        this.touchCaptured = false;

    }

    /**
     * Convert pointer down to touch start.
     *
     * @param {object} event
     */
    onPointerDown(event) {

        if (event.pointerType === event.MSPOINTER_TYPE_TOUCH || event.pointerType === "touch") {
            event.touches = [{ clientX: event.clientX, clientY: event.clientY }];
            this.onTouchStart(event);
        }

    }

    /**
     * Convert pointer move to touch move.
     *
     * @param {object} event
     */
    onPointerMove(event) {

        if (event.pointerType === event.MSPOINTER_TYPE_TOUCH || event.pointerType === "touch") {
            event.touches = [{ clientX: event.clientX, clientY: event.clientY }];
            this.onTouchMove(event);
        }

    }

    /**
     * Convert pointer up to touch end.
     *
     * @param {object} event
     */
    onPointerUp(event) {

        if (event.pointerType === event.MSPOINTER_TYPE_TOUCH || event.pointerType === "touch") {
            event.touches = [{ clientX: event.clientX, clientY: event.clientY }];
            this.onTouchEnd(event);
        }

    }

}
/**
 * Handles the display of ' optional slide number.
 */
class SlideNumber {
    constructor(deck) {
        this.deck = deck;

    }

    render() {
        this.element = document.createElement('div');
        this.element.className = 'slide-number';
        this.deck.deckElement.appendChild(this.element);
    }

    /**
     * Called when the  config is updated.
     */
    configure(config, oldConfig) {
        let slideNumberDisplay = 'none';
        if (config.slideNumber && !this.deck.isPrintingPDF()) {
            if (config.showSlideNumber === 'all') {
                slideNumberDisplay = 'block';
            } else if (config.showSlideNumber === 'speaker' && this.deck.notes.isSpeakerNotesWindow()) {
                slideNumberDisplay = 'block';
            }
        }
        this.element.style.display = slideNumberDisplay;
    }

    /**
     * Updates the slide number to match the current slide.
     */
    update() {
        // Update slide number if enabled
        if (this.deck.config.slideNumber && this.element) {
            this.element.innerHTML = this.getSlideNumber();
        }
    }

    /**
     * Returns the HTML string corresponding to the current slide
     * number, including formatting.
     */
    getSlideNumber(slide = this.deck.currentSlide) {
        let config = this.deck.config;
        let value;
        let format = 'h.v';
        if (typeof config.slideNumber === 'function') {
            value = config.slideNumber(slide);
        } else {
            // Check if a custom number format is available
            if (typeof config.slideNumber === 'string') {
                format = config.slideNumber;
            }
            // If there are ONLY vertical slides in this deck, always use
            // a flattened slide number
            if (!/c/.test(format) && this.deck.getHorizontalSlides().length === 1) {
                format = 'c';
            }
            // Offset the current slide number by 1 to make it 1-indexed
            let horizontalOffset = slide && slide.dataset.visibility === 'uncounted' ? 0 : 1;
            value = [];
            switch (format) {
                case 'c':
                    value.push(this.deck.getSlidePastCount(slide) + horizontalOffset);
                    break;
                case 'c/t':
                    value.push(this.deck.getSlidePastCount(slide) + horizontalOffset, '/', this.deck.getTotalSlides());
                    break;
                default:
                    let indices = this.deck.getIndices(slide);
                    value.push(indices.h + horizontalOffset);
                    let sep = format === 'h/v' ? '/' : '.';
                    if (this.deck.isVerticalSlide(slide)) value.push(sep, indices.v + 1);
            }
        }
        let url = '#' + this.deck.location.getHash(slide);
        return this.formatNumber(value[0], value[1], value[2], url);
    }

    /**
     * Applies HTML formatting to a slide number before it's
     * written to the DOM.
     *
     * @param {number} a Current slide
     * @param {string} delimiter Character to separate slide numbers
     * @param {(number|*)} b Total slides
     * @param {HTMLElement} [url='#'+locationHash()] The url to link to
     * @return {string} HTML string fragment
     */
    formatNumber(a, delimiter, b, url = '#' + this.deck.location.getHash()) {
        if (typeof b === 'number' && !isNaN(b)) {
            return `<a href="${url}">
					<span class="slide-number-a">${a}</span>
					<span class="slide-number-delimiter">${delimiter}</span>
					<span class="slide-number-b">${b}</span>
					</a>`;
        } else {
            return `<a href="${url}">
					<span class="slide-number-a">${a}</span>
					</a>`;
        }
    }
}


/**
 * Manages loading and registering of  plugins.
 */
class Plugins {

    constructor(deck) {
        this.deck = deck;
        // Flags our current state (idle -> loading -> loaded)
        this.state = 'idle';
        // An id:instance map of currently registed plugins
        this.registeredPlugins = {};
        this.asyncDependencies = [];
    }

    /**
     * Loads  dependencies, registers and
     * initializes plugins.
     *
     * Plugins are direct references to a  plugin
     * object that we register and initialize after any
     * synchronous dependencies have loaded.
     *
     * Dependencies are defined via the 'dependencies' config
     * option and will be loaded prior to starting .
     * Some dependencies may have an 'async' flag, if so they
     * will load after  has been started up.
     */
    load(plugins, dependencies) {
            this.state = 'loading';
            plugins.forEach(this.registerPlugin.bind(this));
            return new Promise(resolve => {
                let scripts = [],
                    scriptsToLoad = 0;
                dependencies.forEach(s => {
                    // Load if there's no condition or the condition is truthy
                    if (!s.condition || s.condition()) {
                        if (s.async) {
                            this.asyncDependencies.push(s);
                        } else {
                            scripts.push(s);
                        }
                    }
                });
                if (scripts.length) {
                    scriptsToLoad = scripts.length;
                    const scriptLoadedCallback = (s) => {
                        if (s && typeof s.callback === 'function') s.callback();
                        if (--scriptsToLoad === 0) {
                            this.initPlugins().then(resolve);
                        }
                    };

                    // Load synchronous scripts
                    scripts.forEach(s => {
                        if (typeof s.id === 'string') {
                            this.registerPlugin(s);
                            scriptLoadedCallback(s);
                        } else if (typeof s.src === 'string') {
                            loadScript(s.src, () => scriptLoadedCallback(s));
                        } else {
                            console.warn('Unrecognized plugin format', s);
                            scriptLoadedCallback();
                        }
                    });
                } else {
                    this.initPlugins().then(resolve);
                }
            });
        }
        /**
         * Initializes our plugins and waits for them to be ready
         * before proceeding.
         */
    initPlugins() {
            return new Promise(resolve => {
                let pluginValues = Object.values(this.registeredPlugins);
                let pluginsToInitialize = pluginValues.length;
                // If there are no plugins, skip this step
                if (pluginsToInitialize === 0) {
                    this.loadAsync().then(resolve);
                }
                // ... otherwise initialize plugins
                else {
                    let initNextPlugin;
                    let afterPlugInitialized = () => {
                        if (--pluginsToInitialize === 0) {
                            this.loadAsync().then(resolve);
                        } else {
                            initNextPlugin();
                        }
                    };

                    let i = 0;
                    // Initialize plugins serially
                    initNextPlugin = () => {
                        let plugin = pluginValues[i++];
                        // If the plugin has an 'init' method, invoke it
                        if (typeof plugin.init === 'function') {
                            let promise = plugin.init(this.deck);
                            // If the plugin returned a Promise, wait for it
                            if (promise && typeof promise.then === 'function') {
                                promise.then(afterPlugInitialized);
                            } else {
                                afterPlugInitialized();
                            }
                        } else {
                            afterPlugInitialized();
                        }
                    }
                    initNextPlugin();
                }
            })
        }
        /**
         * Loads all async  dependencies.
         */
    loadAsync() {
        this.state = 'loaded';
        if (this.asyncDependencies.length) {
            this.asyncDependencies.forEach(s => {
                loadScript(s.src, s.callback);
            });
        }
        return Promise.resolve();
    }

    /**
     * Registers a new plugin with this instance.
     *
     *  waits for all registered plugins to initialize
     * before considering itself ready, as long as the plugin
     * is registered before calling `Deck.initialize()`.
     */
    registerPlugin(plugin) {
        // Backwards compatibility to make  ~3.9.0
        // plugins work with  4.0.0
        if (arguments.length === 2 && typeof arguments[0] === 'string') {
            plugin = arguments[1];
            plugin.id = arguments[0];
        }
        // Plugin can optionally be a function which we call
        // to create an instance of the plugin
        else if (typeof plugin === 'function') {
            plugin = plugin();
        }

        let id = plugin.id;

        if (typeof id !== 'string') {
            console.warn('Unrecognized plugin format; can\'t find plugin.id', plugin);
        } else if (this.registeredPlugins[id] === undefined) {
            this.registeredPlugins[id] = plugin;

            // If a plugin is registered after  is loaded,
            // initialize it right away
            if (this.state === 'loaded' && typeof plugin.init === 'function') {
                plugin.init(this.deck);
            }
        } else {
            console.warn(': "' + id + '" plugin has already been registered');
        }
    }

    /**
     * Checks if a specific plugin has been registered.
     *
     * @param {String} id Unique plugin identifier
     */
    hasPlugin(id) {
        return !!this.registeredPlugins[id];
    }

    /**
     * Returns the specific plugin instance, if a plugin
     * with the given ID has been registered.
     *
     * @param {String} id Unique plugin identifier
     */
    getPlugin(id) {
        return this.registeredPlugins[id];
    }

    getRegisteredPlugins() {
        return this.registeredPlugins;
    }

}

// Counter used to generate unique IDs for auto-animated elements
let autoAnimateCounter = 0;

/**
 * Automatically animates matching elements across
 * slides with the [data-auto-animate] attribute.
 */
class AutoAnimate {

    constructor(deck) {
        this.deck = deck;
    }

    /**
     * Runs an auto-animation between the given slides.
     *
     * @param  {HTMLElement} fromSlide
     * @param  {HTMLElement} toSlide
     */
    run(fromSlide, toSlide) {
        // Clean up after prior animations
        this.reset();
        // Ensure that both slides are auto-animate targets
        if (fromSlide.hasAttribute('data-auto-animate') && toSlide.hasAttribute('data-auto-animate')) {
            // Create a new auto-animate sheet
            this.autoAnimateStyleSheet = this.autoAnimateStyleSheet || createStyleSheet();
            let animationOptions = this.getAutoAnimateOptions(toSlide);
            // Set our starting state
            fromSlide.dataset.autoAnimate = 'pending';
            toSlide.dataset.autoAnimate = 'pending';
            // Flag the navigation direction, needed for fragment buildup
            let allSlides = this.deck.getSlides();
            animationOptions.slideDirection = allSlides.indexOf(toSlide) > allSlides.indexOf(fromSlide) ? 'forward' : 'backward';
            // Inject our auto-animate styles for this transition
            let css = this.getAutoAnimatableElements(fromSlide, toSlide).map(elements => {
                return this.autoAnimateElements(elements.from, elements.to, elements.options || {}, animationOptions, autoAnimateCounter++);
            });
            // Animate unmatched elements, if enabled
            if (toSlide.dataset.autoAnimateUnmatched !== 'false' && this.deck.config.autoAnimateUnmatched === true) {
                // Our default timings for unmatched elements
                let defaultUnmatchedDuration = animationOptions.duration * 0.8,
                    defaultUnmatchedDelay = animationOptions.duration * 0.2;

                this.getUnmatchedAutoAnimateElements(toSlide).forEach(unmatchedElement => {
                    let unmatchedOptions = this.getAutoAnimateOptions(unmatchedElement, animationOptions);
                    let id = 'unmatched';
                    // If there is a duration or delay set specifically for this
                    // element our unmatched elements should adhere to those
                    if (unmatchedOptions.duration !== animationOptions.duration || unmatchedOptions.delay !== animationOptions.delay) {
                        id = 'unmatched-' + autoAnimateCounter++;
                        css.push(`[data-auto-animate="running"] [data-auto-animate-target="${id}"] { transition: opacity ${unmatchedOptions.duration}s ease ${unmatchedOptions.delay}s; }`);
                    }
                    unmatchedElement.dataset.autoAnimateTarget = id;
                }, this);
                // Our default transition for unmatched elements
                css.push(`[data-auto-animate="running"] [data-auto-animate-target="unmatched"] { transition: opacity ${defaultUnmatchedDuration}s ease ${defaultUnmatchedDelay}s; }`);
            }

            // Setting the whole chunk of CSS at once is the most
            // efficient way to do this. Using sheet.insertRule
            // is multiple factors slower.
            this.autoAnimateStyleSheet.innerHTML = css.join('');

            // Start the animation next cycle
            requestAnimationFrame(() => {
                if (this.autoAnimateStyleSheet) {
                    // This forces our newly injected styles to be applied in Firefox
                    getComputedStyle(this.autoAnimateStyleSheet).fontWeight;

                    toSlide.dataset.autoAnimate = 'running';
                }
            });

            this.deck.dispatchEvent({
                target: this.deck.dom.wrapper,
                type: 'autoanimate',
                data: {
                    fromSlide,
                    toSlide,
                    sheet: this.autoAnimateStyleSheet
                }
            });
        }
    }

    /**
     * Rolls back all changes that we've made to the DOM so
     * that as part of animating.
     */
    reset() {
        // Reset slides
        queryAll(this.deck.deckElement, '[data-auto-animate]:not([data-auto-animate=""])').forEach(element => {
            element.dataset.autoAnimate = '';
        });
        // Reset elements
        queryAll(this.deck.deckElement, '[data-auto-animate-target]').forEach(element => {
            delete element.dataset.autoAnimateTarget;
        });
        // Remove the animation sheet
        if (this.autoAnimateStyleSheet && this.autoAnimateStyleSheet.parentNode) {
            this.autoAnimateStyleSheet.parentNode.removeChild(this.autoAnimateStyleSheet);
            this.autoAnimateStyleSheet = null;
        }
    }

    /**
     * Creates a FLIP animation where the `to` element starts out
     * in the `from` element position and animates to its original
     * state.
     *
     * @param {HTMLElement} from
     * @param {HTMLElement} to
     * @param {Object} elementOptions Options for this element pair
     * @param {Object} animationOptions Options set at the slide level
     * @param {String} id Unique ID that we can use to identify this
     * auto-animate element in the DOM
     */
    autoAnimateElements(from, to, elementOptions, animationOptions, id) {
        // 'from' elements are given a data-auto-animate-target with no value,
        // 'to' elements are are given a data-auto-animate-target with an ID
        from.dataset.autoAnimateTarget = '';
        to.dataset.autoAnimateTarget = id;
        // Each element may override any of the auto-animate options
        // like transition easing, duration and delay via data-attributes
        let options = this.getAutoAnimateOptions(to, animationOptions);

        // If we're using a custom element matcher the element options
        // may contain additional transition overrides
        if (typeof elementOptions.delay !== 'undefined') options.delay = elementOptions.delay;
        if (typeof elementOptions.duration !== 'undefined') options.duration = elementOptions.duration;
        if (typeof elementOptions.easing !== 'undefined') options.easing = elementOptions.easing;

        let fromProps = this.getAutoAnimatableProperties('from', from, elementOptions),
            toProps = this.getAutoAnimatableProperties('to', to, elementOptions);

        // Maintain fragment visibility for matching elements when
        // we're navigating forwards, this way the viewer won't need
        // to step through the same fragments twice
        if (to.classList.contains('fragment')) {
            // Don't auto-animate the opacity of fragments to avoid
            // conflicts with fragment animations
            delete toProps.styles['opacity'];
            if (from.classList.contains('fragment')) {
                let fromFragmentStyle = (from.className.match(FRAGMENT_STYLE_REGEX) || [''])[0];
                let toFragmentStyle = (to.className.match(FRAGMENT_STYLE_REGEX) || [''])[0];
                // Only skip the fragment if the fragment animation style
                // remains unchanged
                if (fromFragmentStyle === toFragmentStyle && animationOptions.slideDirection === 'forward') {
                    to.classList.add('visible', 'disabled');
                }
            }
        }

        // If translation and/or scaling are enabled, css transform
        // the 'to' element so that it matches the position and size
        // of the 'from' element
        if (elementOptions.translate !== false || elementOptions.scale !== false) {
            let presentationScale = this.deck.scale;
            let delta = {
                x: (fromProps.x - toProps.x) / presentationScale,
                y: (fromProps.y - toProps.y) / presentationScale,
                scaleX: fromProps.width / toProps.width,
                scaleY: fromProps.height / toProps.height
            };

            // Limit decimal points to avoid 0.0001px blur and stutter
            delta.x = Math.round(delta.x * 1000) / 1000;
            delta.y = Math.round(delta.y * 1000) / 1000;
            delta.scaleX = Math.round(delta.scaleX * 1000) / 1000;
            delta.scaleX = Math.round(delta.scaleX * 1000) / 1000;

            let translate = elementOptions.translate !== false && (delta.x !== 0 || delta.y !== 0),
                scale = elementOptions.scale !== false && (delta.scaleX !== 0 || delta.scaleY !== 0);

            // No need to transform if nothing's changed
            if (translate || scale) {
                let transform = [];

                if (translate) transform.push(`translate(${delta.x}px, ${delta.y}px)`);
                if (scale) transform.push(`scale(${delta.scaleX}, ${delta.scaleY})`);

                fromProps.styles['transform'] = transform.join(' ');
                fromProps.styles['transform-origin'] = 'top left';

                toProps.styles['transform'] = 'none';
            }
        }

        // Delete all unchanged 'to' styles
        for (let propertyName in toProps.styles) {
            const toValue = toProps.styles[propertyName];
            const fromValue = fromProps.styles[propertyName];
            if (toValue === fromValue) {
                delete toProps.styles[propertyName];
            } else {
                // If these property values were set via a custom matcher providing
                // an explicit 'from' and/or 'to' value, we always inject those values.
                if (toValue.explicitValue === true) {
                    toProps.styles[propertyName] = toValue.value;
                }

                if (fromValue.explicitValue === true) {
                    fromProps.styles[propertyName] = fromValue.value;
                }
            }
        }

        let css = '';

        let toStyleProperties = Object.keys(toProps.styles);

        // Only create animate this element IF at least one style
        // property has changed
        if (toStyleProperties.length > 0) {
            // Instantly move to the 'from' state
            fromProps.styles['transition'] = 'none';
            // Animate towards the 'to' state
            toProps.styles['transition'] = `all ${options.duration}s ${options.easing} ${options.delay}s`;
            toProps.styles['transition-property'] = toStyleProperties.join(', ');
            toProps.styles['will-change'] = toStyleProperties.join(', ');
            // Build up our custom CSS. We need to override inline styles
            // so we need to make our styles vErY IMPORTANT!1!!
            let fromCSS = Object.keys(fromProps.styles).map(propertyName => {
                return propertyName + ': ' + fromProps.styles[propertyName] + ' !important;';
            }).join('');

            let toCSS = Object.keys(toProps.styles).map(propertyName => {
                return propertyName + ': ' + toProps.styles[propertyName] + ' !important;';
            }).join('');

            css = '[data-auto-animate-target="' + id + '"] {' + fromCSS + '}' +
                '[data-auto-animate="running"] [data-auto-animate-target="' + id + '"] {' + toCSS + '}';
        }
        return css;
    }

    /**
     * Returns the auto-animate options for the given element.
     *
     * @param {HTMLElement} element Element to pick up options
     * from, either a slide or an animation target
     * @param {Object} [inheritedOptions] Optional set of existing
     * options
     */
    getAutoAnimateOptions(element, inheritedOptions) {
            let options = {
                easing: this.deck.config.autoAnimateEasing,
                duration: this.deck.config.autoAnimateDuration,
                delay: 0
            };
            options = extend(options, inheritedOptions);
            // Inherit options from parent elements
            if (element.parentNode) {
                let autoAnimatedParent = closest(element.parentNode, '[data-auto-animate-target]');
                if (autoAnimatedParent) {
                    options = this.getAutoAnimateOptions(autoAnimatedParent, options);
                }
            }
            if (element.dataset.autoAnimateEasing) {
                options.easing = element.dataset.autoAnimateEasing;
            }
            if (element.dataset.autoAnimateDuration) {
                options.duration = parseFloat(element.dataset.autoAnimateDuration);
            }
            if (element.dataset.autoAnimateDelay) {
                options.delay = parseFloat(element.dataset.autoAnimateDelay);
            }
            return options;
        }
        /**
         * Returns an object containing all of the properties
         * that can be auto-animated for the given element and
         * their current computed values.
         *
         * @param {String} direction 'from' or 'to'
         */
    getAutoAnimatableProperties(direction, element, elementOptions) {
        let config = this.deck.config;
        let properties = { styles: [] };
        // Position and size
        if (elementOptions.translate !== false || elementOptions.scale !== false) {
            let bounds;
            // Custom auto-animate may optionally return a custom tailored
            // measurement function
            if (typeof elementOptions.measure === 'function') {
                bounds = elementOptions.measure(element);
            } else {
                if (config.center) {
                    // More precise, but breaks when used in combination
                    // with zoom for scaling the deck ¯\_(ツ)_/¯
                    bounds = element.getBoundingClientRect();
                } else {
                    let scale = this.deck.scale;
                    bounds = {
                        x: element.offsetLeft * scale,
                        y: element.offsetTop * scale,
                        width: element.offsetWidth * scale,
                        height: element.offsetHeight * scale
                    };
                }
            }
            properties.x = bounds.x;
            properties.y = bounds.y;
            properties.width = bounds.width;
            properties.height = bounds.height;
        }

        const computedStyles = getComputedStyle(element);

        // CSS styles
        (elementOptions.styles || config.autoAnimateStyles).forEach(style => {
            let value;

            // `style` is either the property name directly, or an object
            // definition of a style property
            if (typeof style === 'string') style = { property: style };

            if (typeof style.from !== 'undefined' && direction === 'from') {
                value = { value: style.from, explicitValue: true };
            } else if (typeof style.to !== 'undefined' && direction === 'to') {
                value = { value: style.to, explicitValue: true };
            } else {
                value = computedStyles[style.property];
            }

            if (value !== '') {
                properties.styles[style.property] = value;
            }
        });
        return properties;
    }

    /**
     * Get a list of all element pairs that we can animate
     * between the given slides.
     *
     * @param {HTMLElement} fromSlide
     * @param {HTMLElement} toSlide
     *
     * @return {Array} Each value is an array where [0] is
     * the element we're animating from and [1] is the
     * element we're animating to
     */
    getAutoAnimatableElements(fromSlide, toSlide) {
        let matcher = typeof this.deck.config.autoAnimateMatcher === 'function' ? this.deck.config.autoAnimateMatcher : this.getAutoAnimatePairs;
        let pairs = matcher.call(this, fromSlide, toSlide);
        let reserved = [];
        // Remove duplicate pairs
        return pairs.filter((pair, index) => {
            if (reserved.indexOf(pair.to) === -1) {
                reserved.push(pair.to);
                return true;
            }
        });
    }

    /**
     * Identifies matching elements between slides.
     *
     * You can specify a custom matcher function by using
     * the `autoAnimateMatcher` config option.
     */
    getAutoAnimatePairs(fromSlide, toSlide) {
        let pairs = [];
        const codeNodes = 'pre';
        const textNodes = 'h1, h2, h3, h4, h5, h6, p, li';
        const mediaNodes = 'img, video, iframe';
        // Explicit matches via data-id
        this.findAutoAnimateMatches(pairs, fromSlide, toSlide, '[data-id]', node => {
            return node.nodeName + ':::' + node.getAttribute('data-id');
        });
        // Text
        this.findAutoAnimateMatches(pairs, fromSlide, toSlide, textNodes, node => {
            return node.nodeName + ':::' + node.innerText;
        });
        // Media
        this.findAutoAnimateMatches(pairs, fromSlide, toSlide, mediaNodes, node => {
            return node.nodeName + ':::' + (node.getAttribute('src') || node.getAttribute('data-src'));
        });
        // Code
        this.findAutoAnimateMatches(pairs, fromSlide, toSlide, codeNodes, node => {
            return node.nodeName + ':::' + node.innerText;
        });
        pairs.forEach(pair => {
            // Disable scale transformations on text nodes, we transition
            // each individual text property instead
            if (matches(pair.from, textNodes)) {
                pair.options = { scale: false };
            }
            // Animate individual lines of code
            else if (matches(pair.from, codeNodes)) {
                // Transition the code block's width and height instead of scaling
                // to prevent its content from being squished
                pair.options = { scale: false, styles: ['width', 'height'] };
                // Lines of code
                this.findAutoAnimateMatches(pairs, pair.from, pair.to, '.hljs .hljs-ln-code', node => {
                    return node.textContent;
                }, {
                    scale: false,
                    styles: [],
                    measure: this.getLocalBoundingBox.bind(this)
                });
                // Line numbers
                this.findAutoAnimateMatches(pairs, pair.from, pair.to, '.hljs .hljs-ln-line[data-line-number]', node => {
                    return node.getAttribute('data-line-number');
                }, {
                    scale: false,
                    styles: ['width'],
                    measure: this.getLocalBoundingBox.bind(this)
                });
            }
        }, this);
        return pairs;
    }

    /**
     * Helper method which returns a bounding box based on
     * the given elements offset coordinates.
     *
     * @param {HTMLElement} element
     * @return {Object} x, y, width, height
     */
    getLocalBoundingBox(element) {
        const presentationScale = this.deck.scale;
        return {
            x: Math.round((element.offsetLeft * presentationScale) * 100) / 100,
            y: Math.round((element.offsetTop * presentationScale) * 100) / 100,
            width: Math.round((element.offsetWidth * presentationScale) * 100) / 100,
            height: Math.round((element.offsetHeight * presentationScale) * 100) / 100
        };
    }

    /**
     * Finds matching elements between two slides.
     *
     * @param {Array} pairs            	List of pairs to push matches to
     * @param {HTMLElement} fromScope   Scope within the from element exists
     * @param {HTMLElement} toScope     Scope within the to element exists
     * @param {String} selector         CSS selector of the element to match
     * @param {Function} serializer     A function that accepts an element and returns
     *                                  a stringified ID based on its contents
     * @param {Object} animationOptions Optional config options for this pair
     */
    findAutoAnimateMatches(pairs, fromScope, toScope, selector, serializer, animationOptions) {
        let fromMatches = {};
        let toMatches = {};
        [].slice.call(fromScope.querySelectorAll(selector)).forEach((element, i) => {
            const key = serializer(element);
            if (typeof key === 'string' && key.length) {
                fromMatches[key] = fromMatches[key] || [];
                fromMatches[key].push(element);
            }
        });
        [].slice.call(toScope.querySelectorAll(selector)).forEach((element, i) => {
            const key = serializer(element);
            toMatches[key] = toMatches[key] || [];
            toMatches[key].push(element);
            let fromElement;
            // Retrieve the 'from' element
            if (fromMatches[key]) {
                const pimaryIndex = toMatches[key].length - 1;
                const secondaryIndex = fromMatches[key].length - 1;

                // If there are multiple identical from elements, retrieve
                // the one at the same index as our to-element.
                if (fromMatches[key][pimaryIndex]) {
                    fromElement = fromMatches[key][pimaryIndex];
                    fromMatches[key][pimaryIndex] = null;
                }
                // If there are no matching from-elements at the same index,
                // use the last one.
                else if (fromMatches[key][secondaryIndex]) {
                    fromElement = fromMatches[key][secondaryIndex];
                    fromMatches[key][secondaryIndex] = null;
                }
            }

            // If we've got a matching pair, push it to the list of pairs
            if (fromElement) {
                pairs.push({
                    from: fromElement,
                    to: element,
                    options: animationOptions
                });
            }
        });
    }

    /**
     * Returns a all elements within the given scope that should
     * be considered unmatched in an auto-animate transition. If
     * fading of unmatched elements is turned on, these elements
     * will fade when going between auto-animate slides.
     *
     * Note that parents of auto-animate targets are NOT considerd
     * unmatched since fading them would break the auto-animation.
     *
     * @param {HTMLElement} rootElement
     * @return {Array}
     */
    getUnmatchedAutoAnimateElements(rootElement) {
        return [].slice.call(rootElement.children).reduce((result, element) => {
            const containsAnimatedElements = element.querySelector('[data-auto-animate-target]');
            // The element is unmatched if
            // - It is not an auto-animate target
            // - It does not contain any auto-animate targets
            if (!element.hasAttribute('data-auto-animate-target') && !containsAnimatedElements) {
                result.push(element);
            }
            if (element.querySelector('[data-auto-animate-target]')) {
                result = result.concat(this.getUnmatchedAutoAnimateElements(element));
            }
            return result;
        }, []);
    }
}

// === end of autoanimate ===

// === backgrounds ===

/**
 * Creates and updates slide backgrounds.
 */
class Backgrounds {

    constructor(deck) {
        this.deck = deck;
    }

    render() {
        this.element = document.createElement('div');
        this.element.className = 'backgrounds';
        this.deck.deckElement.appendChild(this.element);
    }

    /**
     * Creates the slide background elements and appends them
     * to the background container. One element is created per
     * slide no matter if the given slide has visible background.
     */
    create() {
            let printMode = this.deck.isPrintingPDF();
            // Clear prior backgrounds
            this.element.innerHTML = '';
            this.element.classList.add('no-transition');
            // Iterate over all horizontal slides
            this.deck.getHorizontalSlides().forEach(slideh => {
                let backgroundStack = this.createBackground(slideh, this.element);
                // Iterate over all vertical slides
                queryAll(slideh, 'section').forEach(slidev => {
                    this.createBackground(slidev, backgroundStack);
                    backgroundStack.classList.add('stack');
                });
            });

            // Add parallax background if specified
            if (this.deck.config.parallaxBackgroundImage) {
                this.element.style.backgroundImage = 'url("' + this.deck.config.parallaxBackgroundImage + '")';
                this.element.style.backgroundSize = this.deck.config.parallaxBackgroundSize;
                this.element.style.backgroundRepeat = this.deck.config.parallaxBackgroundRepeat;
                this.element.style.backgroundPosition = this.deck.config.parallaxBackgroundPosition;

                // Make sure the below properties are set on the element - these properties are
                // needed for proper transitions to be set on the element via CSS. To remove
                // annoying background slide-in effect when the presentation starts, apply
                // these properties after short time delay
                setTimeout(() => {
                    this.deck.deckElement.classList.add('has-parallax-background');
                }, 1);
            } else {
                this.element.style.backgroundImage = '';
                this.deck.deckElement.classList.remove('has-parallax-background');
            }
        }
        /**
         * Creates a background for the given slide.
         *
         * @param {HTMLElement} slide
         * @param {HTMLElement} container The element that the background
         * should be appended to
         * @return {HTMLElement} New background div
         */
    createBackground(slide, container) {
            // Main slide background element
            let element = document.createElement('div');
            element.className = 'slide-background ' + slide.className.replace(/present|past|future/, '');
            // Inner background element that wraps images/videos/iframes
            let contentElement = document.createElement('div');
            contentElement.className = 'slide-background-content';
            element.appendChild(contentElement);
            container.appendChild(element);
            slide.slideBackgroundElement = element;
            slide.slideBackgroundContentElement = contentElement;
            // Syncs the background to reflect all current background settings
            this.sync(slide);
            return element;
        }
        /**
         * Renders all of the visual properties of a slide background
         * based on the various background attributes.
         *
         * @param {HTMLElement} slide
         */
    sync(slide) {
        let element = slide.slideBackgroundElement,
            contentElement = slide.slideBackgroundContentElement;
        // Reset the prior background state in case this is not the
        // initial sync
        slide.classList.remove('has-dark-background');
        slide.classList.remove('has-light-background');

        element.removeAttribute('data-loaded');
        element.removeAttribute('data-background-hash');
        element.removeAttribute('data-background-size');
        element.removeAttribute('data-background-transition');
        element.style.backgroundColor = '';

        contentElement.style.backgroundSize = '';
        contentElement.style.backgroundRepeat = '';
        contentElement.style.backgroundPosition = '';
        contentElement.style.backgroundImage = '';
        contentElement.style.opacity = '';
        contentElement.innerHTML = '';

        let data = {
            background: slide.getAttribute('data-background'),
            backgroundSize: slide.getAttribute('data-background-size'),
            backgroundImage: slide.getAttribute('data-background-image'),
            backgroundVideo: slide.getAttribute('data-background-video'),
            backgroundIframe: slide.getAttribute('data-background-iframe'),
            backgroundColor: slide.getAttribute('data-background-color'),
            backgroundRepeat: slide.getAttribute('data-background-repeat'),
            backgroundPosition: slide.getAttribute('data-background-position'),
            backgroundTransition: slide.getAttribute('data-background-transition'),
            backgroundOpacity: slide.getAttribute('data-background-opacity')
        };

        if (data.background) {
            // Auto-wrap image urls in url(...)
            if (/^(http|file|\/\/)/gi.test(data.background) || /\.(svg|png|jpg|jpeg|gif|bmp)([?#\s]|$)/gi.test(data.background)) {
                slide.setAttribute('data-background-image', data.background);
            } else {
                element.style.background = data.background;
            }
        }

        // Create a hash for this combination of background settings.
        // This is used to determine when two slide backgrounds are
        // the same.
        if (data.background || data.backgroundColor || data.backgroundImage || data.backgroundVideo || data.backgroundIframe) {
            element.setAttribute('data-background-hash', data.background +
                data.backgroundSize +
                data.backgroundImage +
                data.backgroundVideo +
                data.backgroundIframe +
                data.backgroundColor +
                data.backgroundRepeat +
                data.backgroundPosition +
                data.backgroundTransition +
                data.backgroundOpacity);
        }

        // Additional and optional background properties
        if (data.backgroundSize) element.setAttribute('data-background-size', data.backgroundSize);
        if (data.backgroundColor) element.style.backgroundColor = data.backgroundColor;
        if (data.backgroundTransition) element.setAttribute('data-background-transition', data.backgroundTransition);

        if (slide.hasAttribute('data-preload')) element.setAttribute('data-preload', '');

        // Background image options are set on the content wrapper
        if (data.backgroundSize) contentElement.style.backgroundSize = data.backgroundSize;
        if (data.backgroundRepeat) contentElement.style.backgroundRepeat = data.backgroundRepeat;
        if (data.backgroundPosition) contentElement.style.backgroundPosition = data.backgroundPosition;
        if (data.backgroundOpacity) contentElement.style.opacity = data.backgroundOpacity;

        // If this slide has a background color, we add a class that
        // signals if it is light or dark. If the slide has no background
        // color, no class will be added
        let contrastColor = data.backgroundColor;

        // If no bg color was found, check the computed background
        if (!contrastColor) {
            let computedBackgroundStyle = window.getComputedStyle(element);
            if (computedBackgroundStyle && computedBackgroundStyle.backgroundColor) {
                contrastColor = computedBackgroundStyle.backgroundColor;
            }
        }

        if (contrastColor) {
            let rgb = colorToRgb(contrastColor);

            // Ignore fully transparent backgrounds. Some browsers return
            // rgba(0,0,0,0) when reading the computed background color of
            // an element with no background
            if (rgb && rgb.a !== 0) {
                if (colorBrightness(contrastColor) < 128) {
                    slide.classList.add('has-dark-background');
                } else {
                    slide.classList.add('has-light-background');
                }
            }
        }

    }

    /**
     * Updates the background elements to reflect the current
     * slide.
     *
     * @param {boolean} includeAll If true, the backgrounds of
     * all vertical slides (not just the present) will be updated.
     */
    update(includeAll = false) {
            let currentSlide = this.deck.currentSlide;
            let indices = this.deck.getIndices();
            let currentBackground = null;
            // Reverse past/future classes when in RTL mode
            let horizontalPast = this.deck.config.rtl ? 'future' : 'past',
                horizontalFuture = this.deck.config.rtl ? 'past' : 'future';
            // Update the classes of all backgrounds to match the
            // states of their slides (past/present/future)
            Array.from(this.element.childNodes).forEach((backgroundh, h) => {
                backgroundh.classList.remove('past', 'present', 'future');
                if (h < indices.h) {
                    backgroundh.classList.add(horizontalPast);
                } else if (h > indices.h) {
                    backgroundh.classList.add(horizontalFuture);
                } else {
                    backgroundh.classList.add('present');
                    // Store a reference to the current background element
                    currentBackground = backgroundh;
                }
                if (includeAll || h === indices.h) {
                    queryAll(backgroundh, '.slide-background').forEach((backgroundv, v) => {
                        backgroundv.classList.remove('past', 'present', 'future');
                        if (v < indices.v) {
                            backgroundv.classList.add('past');
                        } else if (v > indices.v) {
                            backgroundv.classList.add('future');
                        } else {
                            backgroundv.classList.add('present');
                            // Only if this is the present horizontal and vertical slide
                            if (h === indices.h) currentBackground = backgroundv;
                        }
                    });
                }
            });

            // Stop content inside of previous backgrounds
            if (this.previousBackground) {
                this.deck.slideContent.stopEmbeddedContent(this.previousBackground, { unloadIframes: !this.deck.slideContent.shouldPreload(this.previousBackground) });
            }

            // Start content in the current background
            if (currentBackground) {
                this.deck.slideContent.startEmbeddedContent(currentBackground);
                let currentBackgroundContent = currentBackground.querySelector('.slide-background-content');
                if (currentBackgroundContent) {
                    let backgroundImageURL = currentBackgroundContent.style.backgroundImage || '';
                    // Restart GIFs (doesn't work in Firefox)
                    if (/\.gif/i.test(backgroundImageURL)) {
                        currentBackgroundContent.style.backgroundImage = '';
                        window.getComputedStyle(currentBackgroundContent).opacity;
                        currentBackgroundContent.style.backgroundImage = backgroundImageURL;
                    }
                }
                // Don't transition between identical backgrounds. This
                // prevents unwanted flicker.
                let previousBackgroundHash = this.previousBackground ? this.previousBackground.getAttribute('data-background-hash') : null;
                let currentBackgroundHash = currentBackground.getAttribute('data-background-hash');
                if (currentBackgroundHash && currentBackgroundHash === previousBackgroundHash && currentBackground !== this.previousBackground) {
                    this.element.classList.add('no-transition');
                }
                this.previousBackground = currentBackground;
            }
            // If there's a background brightness flag for this slide,
            // bubble it to the .reveal container
            if (currentSlide) {
                ['has-light-background', 'has-dark-background'].forEach(classToBubble => {
                    if (currentSlide.classList.contains(classToBubble)) {
                        this.deck.deckElement.classList.add(classToBubble);
                    } else {
                        this.deck.deckElement.classList.remove(classToBubble);
                    }
                }, this);
            }
            // Allow the first background to apply without transition
            setTimeout(() => {
                this.element.classList.remove('no-transition');
            }, 1);
        }
        /**
         * Updates the position of the parallax background based
         * on the current slide index.
         */
    updateParallax() {
        let indices = this.deck.getIndices();
        if (this.deck.config.parallaxBackgroundImage) {
            let horizontalSlides = this.deck.getHorizontalSlides(),
                verticalSlides = this.deck.getVerticalSlides();
            let backgroundSize = this.element.style.backgroundSize.split(' '),
                backgroundWidth, backgroundHeight;
            if (backgroundSize.length === 1) {
                backgroundWidth = backgroundHeight = parseInt(backgroundSize[0], 10);
            } else {
                backgroundWidth = parseInt(backgroundSize[0], 10);
                backgroundHeight = parseInt(backgroundSize[1], 10);
            }
            let slideWidth = this.element.offsetWidth,
                horizontalSlideCount = horizontalSlides.length,
                horizontalOffsetMultiplier,
                horizontalOffset;
            if (typeof this.deck.config.parallaxBackgroundHorizontal === 'number') {
                horizontalOffsetMultiplier = this.deck.config.parallaxBackgroundHorizontal;
            } else {
                horizontalOffsetMultiplier = horizontalSlideCount > 1 ? (backgroundWidth - slideWidth) / (horizontalSlideCount - 1) : 0;
            }
            horizontalOffset = horizontalOffsetMultiplier * indices.h * -1;
            let slideHeight = this.element.offsetHeight,
                verticalSlideCount = verticalSlides.length,
                verticalOffsetMultiplier,
                verticalOffset;
            if (typeof this.deck.config.parallaxBackgroundVertical === 'number') {
                verticalOffsetMultiplier = this.deck.config.parallaxBackgroundVertical;
            } else {
                verticalOffsetMultiplier = (backgroundHeight - slideHeight) / (verticalSlideCount - 1);
            }
            verticalOffset = verticalSlideCount > 0 ? verticalOffsetMultiplier * indices.v : 0;
            this.element.style.backgroundPosition = horizontalOffset + 'px ' + -verticalOffset + 'px';
        }
    }
}
// === end of backgrounds

// === fitty ===
const fitty = ((w) => {
    // no window, early exit
    if (!w) return;

    // node list to array helper method
    const toArray = nl => [].slice.call(nl);

    // states
    const DrawState = {
        IDLE: 0,
        DIRTY_CONTENT: 1,
        DIRTY_LAYOUT: 2,
        DIRTY: 3
    };

    // all active fitty elements
    let fitties = [];

    // group all redraw calls till next frame, we cancel each frame request when a new one comes in.
    // If no support for request animation frame, this is an empty function and supports for fitty stops.
    let redrawFrame = null;
    const requestRedraw = 'requestAnimationFrame' in w ? () => {
        w.cancelAnimationFrame(redrawFrame);
        redrawFrame = w.requestAnimationFrame(() => redraw(fitties.filter(f => f.dirty && f.active)));
    } : () => {};


    // sets all fitties to dirty so they are redrawn on the next redraw loop, then calls redraw
    const redrawAll = (type) => () => {
        fitties.forEach(f => f.dirty = type);
        requestRedraw();
    };


    // redraws fitties so they nicely fit their parent container
    const redraw = fitties => {

        // getting info from the DOM at this point should not trigger a reflow, let's gather as much intel as possible before triggering a reflow

        // check if styles of all fitties have been computed
        fitties
            .filter(f => !f.styleComputed)
            .forEach(f => { f.styleComputed = computeStyle(f) });

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

    const markAsClean = f => f.dirty = DrawState.IDLE;

    const calculateStyles = f => {
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
    const shouldRedraw = f => f.dirty !== DrawState.DIRTY_LAYOUT || (f.dirty === DrawState.DIRTY_LAYOUT && f.element.parentNode.clientWidth !== f.availableWidth);

    // every fitty element is tested for invalid styles
    const computeStyle = f => {
        // get style properties
        const style = w.getComputedStyle(f.element, null);
        // get current font size in pixels (if we already calculated it, use the calculated version)
        f.currentFontSize = parseFloat(style.getPropertyValue('font-size'));
        // get display type and wrap mode
        f.display = style.getPropertyValue('display');
        f.whiteSpace = style.getPropertyValue('white-space');
    };

    // determines if this fitty requires initial styling, can be prevented by applying correct styles through CSS
    const shouldPreStyle = f => {
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
    const applyStyle = f => {
        f.element.style.whiteSpace = f.whiteSpace;
        f.element.style.display = f.display;
        f.element.style.fontSize = f.currentFontSize + 'px';
    };

    // dispatch a fit event on a fitty
    const dispatchFitEvent = f => {
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

    const init = f => {
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

    const destroy = f => () => {
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
    const subscribe = f => () => {
        if (f.active) return;
        f.active = true;
        requestRedraw();
    };

    // remove an existing fitty
    const unsubscribe = f => () => f.active = false;

    const observeMutations = f => {
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
        const publicFitties = elements.map(element => {
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
    const onWindowResized = () => {
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


    // fitty global properties (by setting observeWindow to true the events above get added)
    fitty.observeWindow = true;
    fitty.observeWindowDelay = 100;


    // public fit all method, will force redraw no matter what
    fitty.fitAll = redrawAll(DrawState.DIRTY);


    // export our fitty function, we don't want to keep it to our selves
    return fitty;

})(typeof window === 'undefined' ? null : window);

// === slide content ===
class SlideContent {

    constructor(deck) {
        this.deck = deck;
        this.startEmbeddedIframe = this.startEmbeddedIframe.bind(this);
    }

    /**
     * Should the given element be preloaded?
     * Decides based on local element attributes and global config.
     *
     * @param {HTMLElement} element
     */
    shouldPreload(element) {
        // Prefer an explicit global preload setting
        let preload = this.deck.config.preloadIframes;
        // If no global setting is available, fall back on the element's
        // own preload setting
        if (typeof preload !== 'boolean') {
            preload = element.hasAttribute('data-preload');
        }
        return preload;
    }

    /**
     * Called when the given slide is within the configured view
     * distance. Shows the slide element and loads any content
     * that is set to load lazily (data-src).
     *
     * @param {HTMLElement} slide Slide to show
     */
    load(slide, options = {}) {
        // Show the slide element
        slide.style.display = this.deck.config.display;
        // Media elements with data-src attributes
        queryAll(slide, 'img[data-src], video[data-src], audio[data-src], iframe[data-src]').forEach(element => {
            if (element.tagName !== 'IFRAME' || this.shouldPreload(element)) {
                element.setAttribute('src', element.getAttribute('data-src'));
                element.setAttribute('data-lazy-loaded', '');
                element.removeAttribute('data-src');
            }
        });
        // Media elements with <source> children
        queryAll(slide, 'video, audio').forEach(media => {
            let sources = 0;
            queryAll(media, 'source[data-src]').forEach(source => {
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
                    backgroundVideo.split(',').forEach(source => {
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
            let backgroundIframeElement = backgroundContent.querySelector('iframe[data-src]');
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
        Array.from(slide.querySelectorAll('.r-fit-text:not([data-fitted])')).forEach(element => {
            element.dataset.fitted = '';
            fitty(element, {
                minSize: 24,
                maxSize: this.deck.config.height * 0.8,
                observeMutations: false,
                observeWindow: false
            });
        });
    }

    /**
     * Unloads and hides the given slide. This is called when the
     * slide is moved outside of the configured view distance.
     *
     * @param {HTMLElement} slide
     */
    unload(slide) {
        // Hide the slide element
        slide.style.display = 'none';
        // Hide the corresponding background element
        let background = this.deck.getSlideBackground(slide);
        if (background) {
            background.style.display = 'none';
            // Unload any background iframes
            queryAll(background, 'iframe[src]').forEach(element => {
                element.removeAttribute('src');
            });
        }
        // Reset lazy-loaded media elements with src attributes
        queryAll(slide, 'video[data-lazy-loaded][src], audio[data-lazy-loaded][src], iframe[data-lazy-loaded][src]').forEach(element => {
            element.setAttribute('data-src', element.getAttribute('src'));
            element.removeAttribute('src');
        });
        // Reset lazy-loaded media elements with <source> children
        queryAll(slide, 'video[data-lazy-loaded] source[src], audio source[src]').forEach(source => {
            source.setAttribute('data-src', source.getAttribute('src'));
            source.removeAttribute('src');
        });
    }

    /**
     * Enforces origin-specific format rules for embedded media.
     */
    formatEmbeddedContent() {
        let _appendParamToIframeSource = (sourceAttribute, sourceURL, param) => {
            queryAll(this.deck.dom.slides, 'iframe[' + sourceAttribute + '*="' + sourceURL + '"]').forEach(el => {
                let src = el.getAttribute(sourceAttribute);
                if (src && src.indexOf(param) === -1) {
                    el.setAttribute(sourceAttribute, src + (!/\?/.test(src) ? '?' : '&') + param);
                }
            });
        };
        // YouTube frames must include "?enablejsapi=1"
        _appendParamToIframeSource('src', 'youtube.com/embed/', 'enablejsapi=1');
        _appendParamToIframeSource('data-src', 'youtube.com/embed/', 'enablejsapi=1');
        // Vimeo frames must include "?api=1"
        _appendParamToIframeSource('src', 'player.vimeo.com/', 'api=1');
        _appendParamToIframeSource('data-src', 'player.vimeo.com/', 'api=1');
    }

    /**
     * Start playback of any embedded content inside of
     * the given element.
     *
     * @param {HTMLElement} element
     */
    startEmbeddedContent(element) {
        if (element && !this.deck.notes.isSpeakerNotesWindow()) {
            // Restart GIFs
            queryAll(element, 'img[src$=".gif"]').forEach(el => {
                // Setting the same unchanged source like this was confirmed
                // to work in Chrome, FF & Safari
                el.setAttribute('src', el.getAttribute('src'));
            });
            // HTML5 media elements
            queryAll(element, 'video, audio').forEach(el => {
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
            });
            // Normal iframes
            queryAll(element, 'iframe[src]').forEach(el => {
                if (closest(el, '.fragment') && !closest(el, '.fragment.visible')) {
                    return;
                }
                this.startEmbeddedIframe({ target: el });
            });

            // Lazy loading iframes
            queryAll(element, 'iframe[data-src]').forEach(el => {
                if (closest(el, '.fragment') && !closest(el, '.fragment.visible')) {
                    return;
                }
                if (el.getAttribute('src') !== el.getAttribute('data-src')) {
                    el.removeEventListener('load', this.startEmbeddedIframe); // remove first to avoid dupes
                    el.addEventListener('load', this.startEmbeddedIframe);
                    el.setAttribute('src', el.getAttribute('data-src'));
                }
            });
        }
    }

    /**
     * Starts playing an embedded video/audio element after
     * it has finished loading.
     *
     * @param {object} event
     */
    startEmbeddedMedia(event) {
        let isAttachedToDOM = !!closest(event.target, 'html'),
            isVisible = !!closest(event.target, '.present');
        if (isAttachedToDOM && isVisible) {
            event.target.currentTime = 0;
            event.target.play();
        }
        event.target.removeEventListener('loadeddata', this.startEmbeddedMedia);
    }

    /**
     * "Starts" the content of an embedded iframe using the
     * postMessage API.
     *
     * @param {object} event
     */
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
        /**
         * Stop playback of any embedded content inside of
         * the targeted slide.
         *
         * @param {HTMLElement} element
         */
    stopEmbeddedContent(element, options = {}) {
        options = extend({
            // Defaults
            unloadIframes: true
        }, options);
        if (element && element.parentNode) {
            // HTML5 media elements
            queryAll(element, 'video, audio').forEach(el => {
                if (!el.hasAttribute('data-ignore') && typeof el.pause === 'function') {
                    el.setAttribute('data-paused-by-reveal', '');
                    el.pause();
                }
            });
            // Generic postMessage API for non-lazy loaded iframes
            queryAll(element, 'iframe').forEach(el => {
                if (el.contentWindow) el.contentWindow.postMessage('slide:stop', '*');
                el.removeEventListener('load', this.startEmbeddedIframe);
            });
            // YouTube postMessage API
            queryAll(element, 'iframe[src*="youtube.com/embed/"]').forEach(el => {
                if (!el.hasAttribute('data-ignore') && el.contentWindow && typeof el.contentWindow.postMessage === 'function') {
                    el.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                }
            });
            // Vimeo postMessage API
            queryAll(element, 'iframe[src*="player.vimeo.com/"]').forEach(el => {
                if (!el.hasAttribute('data-ignore') && el.contentWindow && typeof el.contentWindow.postMessage === 'function') {
                    el.contentWindow.postMessage('{"method":"pause"}', '*');
                }
            });
            if (options.unloadIframes === true) {
                // Unload lazy-loaded iframes
                queryAll(element, 'iframe[data-src]').forEach(el => {
                    // Only removing the src doesn't actually unload the frame
                    // in all browsers (Firefox) so we set it to blank first
                    el.setAttribute('src', 'about:blank');
                    el.removeAttribute('src');
                });
            }
        }
    }
}

class Deck {

    config = {};

    // Flags if  is loaded (has dispatched the 'ready' event)
    ready = false;

    // The horizontal and vertical index of the currently active slide
    indexh;
    indexv;

    // The previous and current slide HTML elements
    previousSlide;
    currentSlide;

    // Remember which directions that the user has navigated towards
    navigationHistory = {
        hasNavigatedHorizontally: false,
        hasNavigatedVertically: false
    };

    // Slides may have a data-state attribute which we pick up and apply
    // as a class to the body. This list contains the combined state of
    // all current slides.
    state = [];

    // The current scale of the presentation (see width/height config)
    scale = 1;

    // CSS transform that is currently applied to the slides container,
    // split into two groups
    slidesTransform = { layout: '', overview: '' };

    // Cached references to DOM elements
    dom = {};

    // Flags if the interaction event listeners are bound
    eventsAreBound = false;

    // The current slide transition state; idle or running
    transition = 'idle';

    // The current auto-slide duration
    autoSlide = 0;

    // Auto slide properties
    autoSlidePlayer;
    autoSlideTimeout = 0;
    autoSlideStartTime = -1;
    autoSlidePaused = false;

    // Controllers for different aspects of our presentation. They're
    // all given direct references to this Deck instance since there
    // may be multiple presentations running in parallel.

    deckElement = {};

    constructor(revealElement, options) {
        this.deckElement = revealElement;
        this.options = options;

        this.slideContent = new SlideContent(this);
        this.slideContent.load.bind(this.slideContent);
        this.slideContent.unload.bind(this.slideContent);

        this.slideNumber = new SlideNumber(this);

        this.autoAnimate = new AutoAnimate(this);

        this.backgrounds = new Backgrounds(this);

        this.fragments = new Fragments(this);
        this.fragments.sync.bind(this.fragments);
        this.fragments.goto.bind(this.fragments);
        this.fragments.prev.bind(this.fragments);
        this.fragments.next.bind(this.fragments);
        this.fragments.availableRoutes.bind(this.fragments);

        this.overview = new Overview(this);
        this.overview.toggle.bind(this.overview);
        this.overview.isActive.bind(this.overview);

        this.keyboard = new Keyboard(this);
        this.keyboard.addKeyBinding.bind(this.keyboard);
        this.keyboard.removeKeyBinding.bind(this.keyboard);
        this.keyboard.registerKeyboardShortcut.bind(this.keyboard);

        this.location = new Location(this);

        this.controls = new Controls(this);

        this.progress = new Progress(this);

        this.pointer = new Pointer(this);

        this.plugins = new Plugins(this);
        this.plugins.registerPlugin.bind(this.plugins);
        this.plugins.hasPlugin.bind(this.plugins);
        this.plugins.getPlugin.bind(this.plugins);
        this.plugins.getRegisteredPlugins.bind(this.plugins);

        this.print = new Print(this);


        this.focus = new Focus(this);
        this.focus.isFocused.bind(this.focus);

        this.touch = new Touch(this);

        this.notes = new Notes(this);
        this.notes.getSlideNotes.bind(this.notes);
        this.notes.isSpeakerNotesWindow.bind(this.notes)
    }


    //====================
    // The public  API

    isPrintingPDF() {
            this.print.isPrintingPDF.bind(this.print);
        }
        //====================

    initialize(initOptions) {
        // Cache references to key DOM elements
        this.dom.wrapper = this.deckElement;
        this.dom.slides = this.deckElement.querySelector('.slides');
        // Compose our config object in order of increasing precedence:
        // 1. Default  options
        // 2. Options provided via Deck.configure() prior to
        //    initialization
        // 3. Options passed to the Deck constructor
        // 4. Options passed to Deck.initialize
        // 5. Query params
        this.config = {...defaultConfig, ...this.options, ...initOptions, ...getQueryHash() };
        this.setViewport();
        // Force a layout when the whole page, incl fonts, has loaded
        window.addEventListener('load', () => {
            this.layout();
        }, false);
        // Register plugins and load dependencies, then move on to #start()
        this.plugins.load(this.config.plugins, this.config.dependencies).then(() => {
            console.log(`plugins loaded. getting started...`);
            this.start()
        });
        return new Promise(resolve => this.on('ready', resolve));
    }

    /**
     * Encase the presentation in a  viewport. The
     * extent of the viewport differs based on configuration.
     */
    setViewport() {
        // Embedded decks use the reveal element as their viewport
        if (this.config.embedded === true) {
            this.dom.viewport = closest(revealElement, '.reveal-viewport') || revealElement;
        }
        // Full-page decks use the body as their viewport
        else {
            this.dom.viewport = document.body;
            document.documentElement.classList.add('reveal-full-page');
        }
        this.dom.viewport.classList.add('reveal-viewport');
    }

    /**
     * Starts up  by binding input events and navigating
     * to the current URL deeplink if there is one.
     */
    start() {
        this.ready = true;
        // Remove slides hidden with data-visibility
        this.removeHiddenSlides();
        // Make sure we've got all the DOM elements we need
        this.setupDOM();
        // Listen to messages posted to this window
        this.setupPostMessage();
        // Prevent the slides from being scrolled out of view
        this.setupScrollPrevention();
        // Resets all vertical slides so that only the first is visible
        this.resetVerticalSlides();
        // Updates the presentation to match the current configuration values
        this.configure();
        // Read the initial hash
        this.location.readURL();
        // Create slide backgrounds
        this.backgrounds.update(true);
        // Notify listeners that the presentation is ready but use a 1ms
        // timeout to ensure it's not fired synchronously after #initialize()
        const that = this;
        setTimeout(() => {
            // Enable transitions now that we're loaded
            that.dom.slides.classList.remove('no-transition');
            that.dom.wrapper.classList.add('ready');
            const indexh = that.indexh;
            const indexv = that.indexv;
            const currentSlide = that.currentSlide;
            const target = this.dom.wrapper;
            that.dispatchEvent({
                target: target,
                type: 'ready',
                data: {
                    indexh,
                    indexv,
                    currentSlide
                }
            });
            this.dispatchPostMessage('ready')
        }, 1);
        // Special setup and config is required when printing to PDF
        if (this.print.isPrintingPDF()) {
            this.removeEventListeners();
            // The document needs to have loaded for the PDF layout
            // measurements to be accurate
            if (document.readyState === 'complete') {
                this.print.setupPDF();
            } else {
                window.addEventListener('load', () => {
                    this.print.setupPDF();
                });
            }
        }
    }

    /**
     * Removes all slides with data-visibility="hidden". This
     * is done right before the rest of the presentation is
     * initialized.
     *
     * If you want to show all hidden slides, initialize
     *  with showHiddenSlides set to true.
     */
    removeHiddenSlides() {
        if (!this.config.showHiddenSlides) {
            queryAll(this.dom.wrapper, 'section[data-visibility="hidden"]').forEach(slide => {
                slide.parentNode.removeChild(slide);
            });
        }
    }

    /**
     * Finds and stores references to DOM elements which are
     * required by the presentation. If a required element is
     * not found, it is created.
     */
    setupDOM() {
            // Prevent transitions while we're loading
            this.dom.slides.classList.add('no-transition');
            if (isMobile) {
                this.dom.wrapper.classList.add('no-hover');
            } else {
                this.dom.wrapper.classList.remove('no-hover');
            }
            this.backgrounds.render();
            this.slideNumber.render();
            this.controls.render();
            this.progress.render();
            this.notes.render();
            // Overlay graphic which is displayed during the paused mode
            this.dom.pauseOverlay = createSingletonNode(this.dom.wrapper, 'div', 'pause-overlay', this.config.controls ? '<button class="resume-button">Resume presentation</button>' : null);
            this.dom.statusElement = this.createStatusElement();
            this.dom.wrapper.setAttribute('role', 'application');
        }
        /**
         * Creates a hidden div with role aria-live to announce the
         * current slide content. Hide the div off-screen to make it
         * available only to Assistive Technologies.
         *
         * @return {HTMLElement}
         */
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

    /**
     * Announces the given text to screen readers.
     */
    announceStatus(value) {
        this.dom.statusElement.textContent = value;
    }

    /**
     * Converts the given HTML element into a string of text
     * that can be announced to a screen reader. Hidden
     * elements are excluded.
     */
    getStatusText(node) {
        const that = this;
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
                Array.from(node.childNodes).forEach(child => {
                    text += that.getStatusText(child);
                });
            }
        }
        text = text.trim();
        return text === '' ? '' : text + ' ';
    }

    /**
     * This is an unfortunate necessity. Some actions – such as
     * an input field being focused in an iframe or using the
     * keyboard to expand text selection beyond the bounds of
     * a slide – can trigger our content to be pushed out of view.
     * This scrolling can not be prevented by hiding overflow in
     * CSS (we already do) so we have to resort to repeatedly
     * checking if the slides have been offset :(
     */
    setupScrollPrevention() {
        const dom = this.dom;
        setInterval(() => {
            if (dom.wrapper.scrollTop !== 0 || dom.wrapper.scrollLeft !== 0) {
                dom.wrapper.scrollTop = 0;
                dom.wrapper.scrollLeft = 0;
            }
        }, 1000);
    }

    /**
     * Registers a listener to postMessage events, this makes it
     * possible to call all  API methods from another
     * window. For example:
     *
     * revealWindow.postMessage( JSON.stringify({
     *   method: 'slide',
     *   args: [ 2 ]
     * }), '*' );
     */
    setupPostMessage() {
        if (this.config.postMessage) {
            window.addEventListener('message', event => {
                let data = event.data;
                // Make sure we're dealing with JSON
                if (typeof data === 'string' && data.charAt(0) === '{' && data.charAt(data.length - 1) === '}') {
                    data = JSON.parse(data);
                    // Check if the requested method can be found
                    if (data.method && typeof Deck[data.method] === 'function') {
                        if (POST_MESSAGE_METHOD_BLACKLIST.test(data.method) === false) {
                            const result = Deck[data.method].apply(Deck, data.args);
                            // Dispatch a postMessage event with the returned value from
                            // our method invocation for getter functions
                            this.dispatchPostMessage('callback', { method: data.method, result: result });
                        } else {
                            console.warn(': "' + data.method + '" is is blacklisted from the postMessage API');
                        }
                    }
                }
            }, false);
        }
    }

    /**
     * Applies the configuration settings from the config
     * object. May be called multiple times.
     *
     * @param {object} options
     */
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
        if (this.numberOfSlides > 1 && this.config.autoSlide && this.config.autoSlideStoppable) {
            this.autoSlidePlayer = new Playback(dom.wrapper, () => {
                return Math.min(Math.max((Date.now() - autoSlideStartTime) / autoSlide, 0), 1);
            });
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
        this.controls.configure(this.config, oldConfig);
        this.progress.configure(this.config, oldConfig);
        this.keyboard.configure(this.config, oldConfig);
        this.fragments.configure(this.config, oldConfig);
        this.slideNumber.configure(this.config, oldConfig);
        this.sync();
    }

    /**
     * Binds all event listeners.
     */
    addEventListeners() {
        this.eventsAreBound = true;
        window.addEventListener('resize', this.onWindowResize(), false);
        if (this.config.touch) this.touch.bind();
        if (this.config.keyboard) this.keyboard.bind();
        if (this.config.progress) this.progress.bind();
        if (this.config.respondToHashChanges) this.location.bind();
        this.controls.bind();
        this.focus.bind();
        this.dom.slides.addEventListener('transitionend', this.onTransitionEnd(), false);
        this.dom.pauseOverlay.addEventListener('click', this.resume(), false);
        if (this.config.focusBodyOnPageVisibilityChange) {
            document.addEventListener('visibilitychange', this.onPageVisibilityChange(), false);
        }
    }

    /**
     * Unbinds all event listeners.
     */
    removeEventListeners() {
        this.eventsAreBound = false;
        this.touch.unbind();
        this.focus.unbind();
        this.keyboard.unbind();
        this.controls.unbind();
        this.progress.unbind();
        this.location.unbind();
        window.removeEventListener('resize', this.onWindowResize, false);
        this.dom.slides.removeEventListener('transitionend', this.onTransitionEnd, false);
        this.dom.pauseOverlay.removeEventListener('click', this.resume, false);
    }

    /**
     * Adds a listener to one of our custom  events,
     * like slidechanged.
     */
    on(type, listener, useCapture) {
        this.deckElement.addEventListener(type, listener, useCapture);
    }

    /**
     * Unsubscribes from a  event.
     */
    off(type, listener, useCapture) {
        this.deckElement.removeEventListener(type, listener, useCapture);
    }

    /**
     * Applies CSS transforms to the slides container. The container
     * is transformed from two separate sources: layout and the overview
     * mode.
     *
     * @param {object} transforms
     */
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

    /**
     * Dispatches an event of the specified type from the
     * reveal DOM element.
     */
    dispatchEvent({ target, type, data, bubbles = true }) {
        let event = document.createEvent('HTMLEvents', 1, 2);
        event.initEvent(type, bubbles, true);
        extend(event, data);
        if (target === undefined) {
            console.error(`dispatching event ${type} from undefined target?`)
            return
        }
        target.dispatchEvent(event);
    }

    /**
     * Dispatched a postMessage of the given type from our window.
     */
    dispatchPostMessage(type, data) {
        if (this.config.postMessageEvents && window.parent !== window.self) {
            let message = {
                namespace: 'reveal',
                eventName: type,
                state: getState()
            };
            extend(message, data);
            window.parent.postMessage(JSON.stringify(message), '*');
        }
    }

    /**
     * Bind preview frame links.
     *
     * @param {string} [selector=a] - selector for anchors
     */
    enablePreviewLinks(selector = 'a') {
        const onPreviewLinkClicked = this.onPreviewLinkClicked;
        Array.from(this.dom.wrapper.querySelectorAll(selector)).forEach(element => {
            if (/^(http|www)/gi.test(element.getAttribute('href'))) {
                element.addEventListener('click', onPreviewLinkClicked, false);
            }
        });
    }

    /**
     * Unbind preview frame links.
     */
    disablePreviewLinks(selector = 'a') {
        const onPreviewLinkClicked = this.onPreviewLinkClicked;
        Array.from(this.dom.wrapper.querySelectorAll(selector)).forEach(element => {
            if (/^(http|www)/gi.test(element.getAttribute('href'))) {
                element.removeEventListener('click', onPreviewLinkClicked, false);
            }
        });
    }

    /**
     * Opens a preview window for the target URL.
     *
     * @param {string} url - url for preview iframe src
     */
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
        this.dom.overlay.querySelector('iframe').addEventListener('load', event => {
            dom.overlay.classList.add('loaded');
        }, false);
        this.dom.overlay.querySelector('.close').addEventListener('click', event => {
            this.closeOverlay();
            event.preventDefault();
        }, false);
        dom.overlay.querySelector('.external').addEventListener('click', event => {
            this.closeOverlay();
        }, false);
    }

    /**
     * Open or close help overlay window.
     *
     * @param {Boolean} [override] Flag which overrides the
     * toggle logic and forcibly sets the desired state. True means
     * help is open, false means it's closed.
     */
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

    /**
     * Opens an overlay window with help material.
     */
    showHelp() {
        if (this.config.help) {
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
            // Add custom key bindings that have associated descriptions
            for (let binding in bindings) {
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
    }

    /**
     * Closes any currently open overlay.
     */
    closeOverlay() {
        if (this.dom.overlay) {
            this.dom.overlay.parentNode.removeChild(dom.overlay);
            this.dom.overlay = null;
            return true;
        }
        return false;
    }

    /**
     * Applies JavaScript-controlled layout rules to the
     * presentation.
     */
    layout() {
        if (this.dom.wrapper && !this.print.isPrintingPDF()) {
            if (!this.config.disableLayout) {
                // On some mobile devices '100vh' is taller than the visible
                // viewport which leads to part of the presentation being
                // cut off. To work around this we define our own '--vh' custom
                // property where 100x adds up to the correct height.
                //
                // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
                if (this.isMobile && !this.config.embedded) {
                    document.documentElement.style.setProperty('--vh', (window.innerHeight * 0.01) + 'px');
                }
                const size = this.getComputedSlideSize();
                const oldScale = this.scale;
                // Layout the contents of the slides
                this.layoutSlideContents(this.config.width, this.config.height);
                this.dom.slides.style.width = size.width + 'px';
                this.dom.slides.style.height = size.height + 'px';
                // Determine scale of content to fit within available space
                this.scale = Math.min(size.presentationWidth / size.width, size.presentationHeight / size.height);
                // Respect max/min scale settings
                this.scale = Math.max(this.scale, this.config.minScale);
                this.scale = Math.min(this.scale, this.config.maxScale);
                // Don't apply any scaling styles if scale is 1
                if (this.scale === 1) {
                    this.dom.slides.style.zoom = '';
                    this.dom.slides.style.left = '';
                    this.dom.slides.style.top = '';
                    this.dom.slides.style.bottom = '';
                    this.dom.slides.style.right = '';
                    this.transformSlides({ layout: '' });
                } else {
                    // Zoom Scaling
                    // Content remains crisp no matter how much we scale. Side
                    // effects are minor differences in text layout and iframe
                    // viewports changing size. A 200x200 iframe viewport in a
                    // 2x zoomed presentation ends up having a 400x400 viewport.
                    if (this.scale > 1 && this.supportsZoom && window.devicePixelRatio < 2) {
                        this.dom.slides.style.zoom = scale;
                        this.dom.slides.style.left = '';
                        this.dom.slides.style.top = '';
                        this.dom.slides.style.bottom = '';
                        this.dom.slides.style.right = '';
                        this.transformSlides({ layout: '' });
                    }
                    // Transform Scaling
                    // Content layout remains the exact same when scaled up.
                    // Side effect is content becoming blurred, especially with
                    // high scale values on ldpi screens.
                    else {
                        this.dom.slides.style.zoom = '';
                        this.dom.slides.style.left = '50%';
                        this.dom.slides.style.top = '50%';
                        this.dom.slides.style.bottom = 'auto';
                        this.dom.slides.style.right = 'auto';
                        this.transformSlides({ layout: 'translate(-50%, -50%) scale(' + this.scale + ')' });
                    }
                }
                // Select all slides, vertical and horizontal
                const slides = Array.from(this.dom.wrapper.querySelectorAll(SLIDES_SELECTOR));
                const config = this.config;
                for (let i = 0, len = slides.length; i < len; i++) {
                    const slide = slides[i];
                    // Don't bother updating invisible slides
                    if (slide.style.display === 'none') {
                        continue;
                    }
                    if (config.center || slide.classList.contains('center')) {
                        // Vertical stacks are not centred since their section
                        // children will be
                        if (slide.classList.contains('stack')) {
                            slide.style.top = 0;
                        } else {
                            slide.style.top = Math.max((size.height - slide.scrollHeight) / 2, 0) + 'px';
                        }
                    } else {
                        slide.style.top = '';
                    }
                }
                if (oldScale !== this.scale) {
                    const scale = this.scale;
                    const target = this.dom.wrapper;
                    this.dispatchEvent({
                        target: target,
                        type: 'resize',
                        data: {
                            oldScale,
                            scale,
                            size
                        }
                    });
                    this.dispatchPostMessage('resize')
                }
            }
            this.progress.update();
            this.backgrounds.updateParallax();
            if (this.overview.isActive()) {
                this.overview.update();
            }
        }
    }

    /**
     * Applies layout logic to the contents of all slides in
     * the presentation.
     *
     * @param {string|number} width
     * @param {string|number} height
     */
    layoutSlideContents(width, height) {
        // Handle sizing of elements with the 'r-stretch' class
        queryAll(this.dom.slides, 'section > .stretch, section > .r-stretch').forEach(element => {
            // Determine how much vertical space we can use
            let remainingHeight = getRemainingHeight(element, height);
            // Consider the aspect ratio of media elements
            if (/(img|video)/gi.test(element.nodeName)) {
                const nw = element.naturalWidth || element.videoWidth,
                    nh = element.naturalHeight || element.videoHeight;
                const es = Math.min(width / nw, remainingHeight / nh);
                element.style.width = (nw * es) + 'px';
                element.style.height = (nh * es) + 'px';
            } else {
                element.style.width = width + 'px';
                element.style.height = remainingHeight + 'px';
            }
        });
    }

    /**
     * Calculates the computed pixel size of our slides. These
     * values are based on the width and height configuration
     * options.
     *
     * @param {number} [presentationWidth=dom.wrapper.offsetWidth]
     * @param {number} [presentationHeight=dom.wrapper.offsetHeight]
     */
    getComputedSlideSize(presentationWidth, presentationHeight) {
        const size = {
            // Slide size
            width: this.config.width,
            height: this.config.height,
            // Presentation size
            presentationWidth: this.presentationWidth || this.dom.wrapper.offsetWidth,
            presentationHeight: this.presentationHeight || this.dom.wrapper.offsetHeight
        };
        // Reduce available space by margin
        size.presentationWidth -= (size.presentationWidth * this.config.margin);
        size.presentationHeight -= (size.presentationHeight * this.config.margin);
        // Slide width may be a percentage of available width
        if (typeof size.width === 'string' && /%$/.test(size.width)) {
            size.width = parseInt(size.width, 10) / 100 * size.presentationWidth;
        }
        // Slide height may be a percentage of available height
        if (typeof size.height === 'string' && /%$/.test(size.height)) {
            size.height = parseInt(size.height, 10) / 100 * size.presentationHeight;
        }
        return size;
    }

    /**
     * Stores the vertical index of a stack so that the same
     * vertical slide can be selected when navigating to and
     * from the stack.
     *
     * @param {HTMLElement} stack The vertical stack element
     * @param {string|number} [v=0] Index to memorize
     */
    setPreviousVerticalIndex(stack, v) {
        if (typeof stack === 'object' && typeof stack.setAttribute === 'function') {
            stack.setAttribute('data-previous-indexv', v || 0);
        }
    }

    /**
     * Retrieves the vertical index which was stored using
     * #setPreviousVerticalIndex() or 0 if no previous index
     * exists.
     *
     * @param {HTMLElement} stack The vertical stack element
     */
    getPreviousVerticalIndex(stack) {
        if (typeof stack === 'object' && typeof stack.setAttribute === 'function' && stack.classList.contains('stack')) {
            // Prefer manually defined start-indexv
            const attributeName = stack.hasAttribute('data-start-indexv') ? 'data-start-indexv' : 'data-previous-indexv';
            return parseInt(stack.getAttribute(attributeName) || 0, 10);
        }
        return 0;
    }

    /**
     * Checks if the current or specified slide is vertical
     * (nested within another slide).
     *
     * @param {HTMLElement} [slide=currentSlide] The slide to check
     * orientation of
     * @return {Boolean}
     */
    isVerticalSlide(slide = this.currentSlide) {
        return slide && slide.parentNode && !!slide.parentNode.nodeName.match(/section/i);
    }

    /**
     * Returns true if we're on the last slide in the current
     * vertical stack.
     */
    isLastVerticalSlide() {
        if (this.currentSlide && this.isVerticalSlide(this.currentSlide)) {
            // Does this slide have a next sibling?
            if (this.currentSlide.nextElementSibling) return false;
            return true;
        }
        return false;
    }

    /**
     * Returns true if we're currently on the first slide in
     * the presentation.
     */
    isFirstSlide() {
        return this.indexh === 0 && this.indexv === 0;
    }

    /**
     * Returns true if we're currently on the last slide in
     * the presenation. If the last slide is a stack, we only
     * consider this the last slide if it's at the end of the
     * stack.
     */
    isLastSlide() {
        if (this.currentSlide) {
            // Does this slide have a next sibling?
            if (this.currentSlide.nextElementSibling) return false;
            // If it's vertical, does its parent have a next sibling?
            if (this.isVerticalSlide(this.currentSlide) && this.currentSlide.parentNode.nextElementSibling) return false;
            return true;
        }
        return false;
    }

    /**
     * Enters the paused mode which fades everything on screen to
     * black.
     */
    pause() {
        if (this.config.pause) {
            const wasPaused = this.dom.wrapper.classList.contains('paused');
            this.cancelAutoSlide();
            this.dom.wrapper.classList.add('paused');
            if (wasPaused === false) {
                const target = this.dom.wrapper;
                this.dispatchEvent({
                    target: target,
                    type: 'paused'
                });
                this.dispatchPostMessage('paused');
            }
        }
    }

    /**
     * Exits from the paused mode.
     */
    resume() {
        const wasPaused = this.dom.wrapper.classList.contains('paused');
        this.dom.wrapper.classList.remove('paused');
        this.cueAutoSlide();
        if (wasPaused) {
            const target = this.dom.wrapper;
            this.dispatchEvent({
                target: target,
                type: 'resumed'
            });
            this.dispatchPostMessage('resumed')
        }
    }

    /**
     * Toggles the paused mode on and off.
     */
    togglePause(override) {
        if (typeof override === 'boolean') {
            override ? this.pause() : this.resume();
        } else {
            this.isPaused() ? this.resume() : this.pause();
        }
    }

    /**
     * Checks if we are currently in the paused mode.
     *
     * @return {Boolean}
     */
    isPaused() {
        return this.dom.wrapper.classList.contains('paused');
    }

    /**
     * Toggles the auto slide mode on and off.
     *
     * @param {Boolean} [override] Flag which sets the desired state.
     * True means autoplay starts, false means it stops.
     */

    toggleAutoSlide(override) {
        if (typeof override === 'boolean') {
            override ? this.resumeAutoSlide() : this.pauseAutoSlide();
        } else {
            this.autoSlidePaused ? this.resumeAutoSlide() : this.pauseAutoSlide();
        }
    }

    /**
     * Checks if the auto slide mode is currently on.
     *
     * @return {Boolean}
     */
    isAutoSliding() {
        return !!(this.autoSlide && !this.autoSlidePaused);
    }

    /**
     * Steps from the current point in the presentation to the
     * slide which matches the specified horizontal and vertical
     * indices.
     *
     * @param {number} [h=indexh] Horizontal index of the target slide
     * @param {number} [v=indexv] Vertical index of the target slide
     * @param {number} [f] Index of a fragment within the
     * target slide to activate
     * @param {number} [o] Origin for use in multimaster environments
     */
    slide(h, v, f, o) {
            // Remember where we were at before
            this.previousSlide = this.currentSlide;
            // Query all horizontal slides in the deck
            const horizontalSlides = this.dom.wrapper.querySelectorAll(HORIZONTAL_SLIDES_SELECTOR);
            // Abort if there are no slides
            if (horizontalSlides.length === 0) return;
            // If no vertical index is specified and the upcoming slide is a
            // stack, resume at its previous vertical index
            if (v === undefined && !this.overview.isActive()) {
                v = this.getPreviousVerticalIndex(horizontalSlides[h]);
            }
            // If we were on a vertical stack, remember what vertical index
            // it was on so we can resume at the same position when returning
            if (this.previousSlide && this.previousSlide.parentNode && this.previousSlide.parentNode.classList.contains('stack')) {
                this.setPreviousVerticalIndex(this.previousSlide.parentNode, this.indexv);
            }
            // Remember the state before this slide
            const stateBefore = this.state.concat();
            // Reset the state array
            this.state.length = 0;
            let indexhBefore = this.indexh || 0,
                indexvBefore = this.indexv || 0;
            // Activate and transition to the new slide
            this.indexh = this.updateSlides(HORIZONTAL_SLIDES_SELECTOR, h === undefined ? this.indexh : h);
            this.indexv = this.updateSlides(VERTICAL_SLIDES_SELECTOR, v === undefined ? this.indexv : v);
            // Dispatch an event if the slide changed
            let slideChanged = (this.indexh !== indexhBefore || this.indexv !== indexvBefore);
            // Ensure that the previous slide is never the same as the current
            if (!slideChanged) this.previousSlide = null;
            // Find the current horizontal slide and any possible vertical slides
            // within it
            let currentHorizontalSlide = horizontalSlides[this.indexh],
                currentVerticalSlides = currentHorizontalSlide.querySelectorAll('section');
            // Store references to the previous and current slides
            this.currentSlide = currentVerticalSlides[this.indexv] || currentHorizontalSlide;
            let autoAnimateTransition = false;
            // Detect if we're moving between two auto-animated slides
            if (slideChanged && this.previousSlide && this.currentSlide && !this.overview.isActive()) {
                // If this is an auto-animated transition, we disable the
                // regular slide transition
                //
                // Note 20-03-2020:
                // This needs to happen before we update slide visibility,
                // otherwise transitions will still run in Safari.
                if (this.previousSlide.hasAttribute('data-auto-animate') && this.currentSlide.hasAttribute('data-auto-animate')) {
                    autoAnimateTransition = true;
                    this.dom.slides.classList.add('disable-slide-transitions');
                }
                this.transition = 'running';
            }
            // Update the visibility of slides now that the indices have changed
            this.updateSlidesVisibility();
            this.layout();
            // Update the overview if it's currently active
            if (this.overview.isActive()) {
                this.overview.update();
            }
            // Show fragment, if specified
            if (typeof f !== 'undefined') {
                this.fragments.goto(f);
            }
            // Solves an edge case where the previous slide maintains the
            // 'present' class when navigating between adjacent vertical
            // stacks
            if (this.previousSlide && this.previousSlide !== this.currentSlide) {
                this.previousSlide.classList.remove('present');
                this.previousSlide.setAttribute('aria-hidden', 'true');
                // Reset all slides upon navigate to home
                if (this.isFirstSlide()) {
                    // Launch async task
                    const setPreviousVerticalIndex = this.setPreviousVerticalIndex;
                    setTimeout(() => {
                        this.getVerticalStacks().forEach(slide => {
                            setPreviousVerticalIndex(slide, 0);
                        });
                    }, 0);
                }
            }
            const dom = this.dom;
            // Apply the new state
            stateLoop: for (let i = 0, len = this.state.length; i < len; i++) {
                    // Check if this state existed on the previous slide. If it
                    // did, we will avoid adding it repeatedly
                    for (let j = 0; j < stateBefore.length; j++) {
                        if (stateBefore[j] === this.state[i]) {
                            stateBefore.splice(j, 1);
                            continue stateLoop;
                        }
                    }
                    this.dom.viewport.classList.add(this.state[i]);
                    // Dispatch custom event matching the state's name
                    const target = this.dom.wrapper;
                    this.dispatchEvent({
                        target: target,
                        type: this.state[i]
                    });
                    this.dispatchPostMessage(this.state[i])
                }
                // Clean up the remains of the previous state
            while (stateBefore.length) {
                dom.viewport.classList.remove(stateBefore.pop());
            }
            if (slideChanged) {
                const indexh = this.indexh;
                const indexv = this.indexv;
                const previousSlide = this.previousSlide;
                const currentSlide = this.currentSlide;
                const target = this.dom.wrapper;
                this.dispatchEvent({
                    target: target,
                    type: 'slidechanged',
                    data: {
                        indexh,
                        indexv,
                        previousSlide,
                        currentSlide,
                        origin: o
                    }
                });
                this.dispatchPostMessage('slidechanged')
            }
            // Handle embedded content
            if (slideChanged || !this.previousSlide) {
                this.slideContent.stopEmbeddedContent(this.previousSlide);
                this.slideContent.startEmbeddedContent(this.currentSlide);
            }
            // Announce the current slide contents to screen readers
            this.announceStatus(this.getStatusText(this.currentSlide));
            this.progress.update();
            this.controls.update();
            this.notes.update();
            this.backgrounds.update();
            this.backgrounds.updateParallax();
            this.slideNumber.update();
            this.fragments.update();
            // Update the URL hash
            this.location.writeURL();
            this.cueAutoSlide();
            // Auto-animation
            if (autoAnimateTransition) {
                setTimeout(() => {
                    dom.slides.classList.remove('disable-slide-transitions');
                }, 0);
                if (this.config.autoAnimate) {
                    // Run the auto-animation between our slides
                    this.autoAnimate.run(this.previousSlide, this.currentSlide);
                }
            }
        }
        /**
         * Syncs the presentation with the current DOM. Useful
         * when new slides or control elements are added or when
         * the configuration has changed.
         */
    sync() {
        // Subscribe to input
        this.removeEventListeners();
        this.addEventListeners();
        // Force a layout to make sure the current config is accounted for
        this.layout();
        // Reflect the current autoSlide value
        this.autoSlide = this.config.autoSlide;
        // Start auto-sliding if it's enabled
        this.cueAutoSlide();
        // Re-create all slide backgrounds
        this.backgrounds.create();
        // Write the current hash to the URL
        this.location.writeURL();
        this.fragments.sortAll();
        this.controls.update();
        this.progress.update();
        this.updateSlidesVisibility();
        this.notes.update();
        this.notes.updateVisibility();
        this.backgrounds.update(true);
        this.slideNumber.update();
        this.slideContent.formatEmbeddedContent();
        // Start or stop embedded content depending on global config
        if (this.config.autoPlayMedia === false) {
            this.slideContent.stopEmbeddedContent(this.currentSlide, { unloadIframes: false });
        } else {
            this.slideContent.startEmbeddedContent(this.currentSlide);
        }
        if (this.overview.isActive()) {
            this.overview.layout();
        }
    }

    /**
     * Updates  to keep in sync with new slide attributes. For
     * example, if you add a new `data-background-image` you can call
     * this to have  render the new background image.
     *
     * Similar to #sync() but more efficient when you only need to
     * refresh a specific slide.
     *
     * @param {HTMLElement} slide
     */
    syncSlide(slide = this.currentSlide) {
        this.backgrounds.sync(slide);
        this.fragments.sync(slide);
        this.slideContent.load(slide);
        this.backgrounds.update();
        this.notes.update();
    }

    /**
     * Resets all vertical slides so that only the first
     * is visible.
     */
    resetVerticalSlides() {
        this.getHorizontalSlides().forEach(horizontalSlide => {
            queryAll(horizontalSlide, 'section').forEach((verticalSlide, y) => {
                if (y > 0) {
                    verticalSlide.classList.remove('present');
                    verticalSlide.classList.remove('past');
                    verticalSlide.classList.add('future');
                    verticalSlide.setAttribute('aria-hidden', 'true');
                }
            });
        });
    }

    /**
     * Randomly shuffles all slides in the deck.
     */
    shuffle(slides = this.getHorizontalSlides()) {
        const shuffle = this.shuffle;
        slides.forEach((slide, i) => {
            // Insert the slide next to a randomly picked sibling slide
            // slide. This may cause the slide to insert before itself,
            // but that's not an issue.
            let beforeSlide = slides[Math.floor(Math.random() * slides.length)];
            if (beforeSlide.parentNode === slide.parentNode) {
                slide.parentNode.insertBefore(slide, beforeSlide);
            }
            // Randomize the order of vertical slides (if there are any)
            let verticalSlides = slide.querySelectorAll('section');
            if (verticalSlides.length) {
                shuffle(verticalSlides);
            }
        });
    }

    /**
     * Updates one dimension of slides by showing the slide
     * with the specified index.
     *
     * @param {string} selector A CSS selector that will fetch
     * the group of slides we are working with
     * @param {number} index The index of the slide that should be
     * shown
     *
     * @return {number} The index of the slide that is now shown,
     * might differ from the passed in index if it was out of
     * bounds.
     */
    updateSlides(selector, index) {
        // Select all slides and convert the NodeList result to
        // an array
        let slides = queryAll(this.dom.wrapper, selector),
            slidesLength = slides.length;

        let printMode = this.print.isPrintingPDF();
        if (slidesLength) {
            // Should the index loop?
            if (this.config.loop) {
                index %= slidesLength;
                if (index < 0) {
                    index = slidesLength + index;
                }
            }

            // Enforce max and minimum index bounds
            index = Math.max(Math.min(index, slidesLength - 1), 0);
            const isVerticalSlide = this.isVerticalSlide;
            const config = this.config;
            for (let i = 0; i < slidesLength; i++) {
                let element = slides[i];
                let reverse = config.rtl && !isVerticalSlide(element);
                // Avoid .remove() with multiple args for IE11 support
                element.classList.remove('past');
                element.classList.remove('present');
                element.classList.remove('future');
                // http://www.w3.org/html/wg/drafts/html/master/editing.html#the-hidden-attribute
                element.setAttribute('hidden', '');
                element.setAttribute('aria-hidden', 'true');

                // If this element contains vertical slides
                if (element.querySelector('section')) {
                    element.classList.add('stack');
                }
                // If we're printing static slides, all slides are "present"
                if (printMode) {
                    element.classList.add('present');
                    continue;
                }
                if (i < index) {
                    // Any element previous to index is given the 'past' class
                    element.classList.add(reverse ? 'future' : 'past');
                    if (config.fragments) {
                        // Show all fragments in prior slides
                        queryAll(element, '.fragment').forEach(fragment => {
                            fragment.classList.add('visible');
                            fragment.classList.remove('current-fragment');
                        });
                    }
                } else if (i > index) {
                    // Any element subsequent to index is given the 'future' class
                    element.classList.add(reverse ? 'past' : 'future');
                    if (config.fragments) {
                        // Hide all fragments in future slides
                        queryAll(element, '.fragment.visible').forEach(fragment => {
                            fragment.classList.remove('visible', 'current-fragment');
                        });
                    }
                }
            }
            let slide = slides[index];
            let wasPresent = slide.classList.contains('present');
            // Mark the current slide as present
            slide.classList.add('present');
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
            // If this slide has a state associated with it, add it
            // onto the current state of the deck
            let slideState = slide.getAttribute('data-state');
            if (slideState) {
                this.state = this.state.concat(slideState.split(' '));
            }
        } else {
            // Since there are no slides we can't be anywhere beyond the
            // zeroth index
            index = 0;
        }
        return index;
    }

    /**
     * Optimization method; hide all slides that are far away
     * from the present slide.
     */
    updateSlidesVisibility() {
            // Select all slides and convert the NodeList result to
            // an array
            let horizontalSlides = this.getHorizontalSlides(),
                horizontalSlidesLength = horizontalSlides.length,
                distanceX,
                distanceY;
            if (horizontalSlidesLength && typeof indexh !== 'undefined') {
                // The number of steps away from the present slide that will
                // be visible
                let viewDistance = this.overview.isActive() ? 10 : this.config.viewDistance;
                // Shorten the view distance on devices that typically have
                // less resources
                if (isMobile) {
                    viewDistance = this.overview.isActive() ? 6 : this.config.mobileViewDistance;
                }
                // All slides need to be visible when exporting to PDF
                if (this.print.isPrintingPDF()) {
                    viewDistance = Number.MAX_VALUE;
                }

                const getPreviousVerticalIndex = this.getPreviousVerticalIndex;
                const slideContent = this.slideContent;
                for (let x = 0; x < horizontalSlidesLength; x++) {
                    let horizontalSlide = horizontalSlides[x];
                    let verticalSlides = queryAll(horizontalSlide, 'section'),
                        verticalSlidesLength = verticalSlides.length;
                    // Determine how far away this slide is from the present
                    distanceX = Math.abs((indexh || 0) - x) || 0;
                    // If the presentation is looped, distance should measure
                    // 1 between the first and last slides
                    if (config.loop) {
                        distanceX = Math.abs(((indexh || 0) - x) % (horizontalSlidesLength - viewDistance)) || 0;
                    }
                    // Show the horizontal slide if it's within the view distance
                    if (distanceX < viewDistance) {
                        this.slideContent.load(horizontalSlide);
                    } else {
                        this.slideContent.unload(horizontalSlide);
                    }
                    if (verticalSlidesLength) {
                        let oy = getPreviousVerticalIndex(horizontalSlide);
                        for (let y = 0; y < verticalSlidesLength; y++) {
                            let verticalSlide = verticalSlides[y];
                            distanceY = x === (indexh || 0) ? Math.abs((indexv || 0) - y) : Math.abs(y - oy);
                            if (distanceX + distanceY < viewDistance) {
                                slideContent.load(verticalSlide);
                            } else {
                                slideContent.unload(verticalSlide);
                            }
                        }
                    }
                }
                // Flag if there are ANY vertical slides, anywhere in the deck
                if (this.hasVerticalSlides()) {
                    this.dom.wrapper.classList.add('has-vertical-slides');
                } else {
                    this.dom.wrapper.classList.remove('has-vertical-slides');
                }
                // Flag if there are ANY horizontal slides, anywhere in the deck
                if (this.hasHorizontalSlides()) {
                    this.dom.wrapper.classList.add('has-horizontal-slides');
                } else {
                    this.dom.wrapper.classList.remove('has-horizontal-slides');
                }
            }
        }
        /**
         * Determine what available routes there are for navigation.
         *
         * @return {{left: boolean, right: boolean, up: boolean, down: boolean}}
         */
    availableRoutes({ includeFragments = false } = {}) {
        let horizontalSlides = this.dom.wrapper.querySelectorAll(HORIZONTAL_SLIDES_SELECTOR),
            verticalSlides = this.dom.wrapper.querySelectorAll(VERTICAL_SLIDES_SELECTOR);
        let routes = {
            left: this.indexh > 0,
            right: this.indexh < horizontalSlides.length - 1,
            up: this.indexv > 0,
            down: this.indexv < verticalSlides.length - 1
        };
        // Looped presentations can always be navigated as long as
        // there are slides available
        if (this.config.loop) {
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
        // If includeFragments is set, a route will be considered
        // availalbe if either a slid OR fragment is available in
        // the given direction
        if (includeFragments === true) {
            let fragmentRoutes = this.fragments.availableRoutes();
            routes.left = routes.left || fragmentRoutes.prev;
            routes.up = routes.up || fragmentRoutes.prev;
            routes.down = routes.down || fragmentRoutes.next;
            routes.right = routes.right || fragmentRoutes.next;
        }
        // Reverse horizontal controls for rtl
        if (this.config.rtl) {
            let left = routes.left;
            routes.left = routes.right;
            routes.right = left;
        }
        return routes;
    }

    /**
     * Returns the number of past slides. This can be used as a global
     * flattened index for slides.
     *
     * @param {HTMLElement} [slide=currentSlide] The slide we're counting before
     *
     * @return {number} Past slide count
     */
    getSlidePastCount(slide = this.currentSlide) {
        let horizontalSlides = this.getHorizontalSlides();
        // The number of past slides
        let pastCount = 0;
        // Step through all slides and count the past ones
        mainLoop: for (let i = 0; i < horizontalSlides.length; i++) {
            let horizontalSlide = horizontalSlides[i];
            let verticalSlides = horizontalSlide.querySelectorAll('section');
            for (let j = 0; j < verticalSlides.length; j++) {
                // Stop as soon as we arrive at the present
                if (verticalSlides[j] === slide) {
                    break mainLoop;
                }
                // Don't count slides with the "uncounted" class
                if (verticalSlides[j].dataset.visibility !== 'uncounted') {
                    pastCount++;
                }
            }
            // Stop as soon as we arrive at the present
            if (horizontalSlide === slide) {
                break;
            }
            // Don't count the wrapping section for vertical slides and
            // slides marked as uncounted
            if (horizontalSlide.classList.contains('stack') === false && horizontalSlide.dataset.visibility !== 'uncounted') {
                pastCount++;
            }
        }
        return pastCount;
    }

    /**
     * Returns a value ranging from 0-1 that represents
     * how far into the presentation we have navigated.
     *
     * @return {number}
     */
    getProgress() {
        // The number of past and total slides
        let totalCount = this.getTotalSlides();
        let pastCount = this.getSlidePastCount();
        if (this.currentSlide) {
            let allFragments = this.currentSlide.querySelectorAll('.fragment');
            // If there are fragments in the current slide those should be
            // accounted for in the progress.
            if (allFragments.length > 0) {
                let visibleFragments = this.currentSlide.querySelectorAll('.fragment.visible');
                // This value represents how big a portion of the slide progress
                // that is made up by its fragments (0-1)
                let fragmentWeight = 0.9;
                // Add fragment progress to the past slide count
                pastCount += (visibleFragments.length / allFragments.length) * fragmentWeight;
            }

        }
        return Math.min(pastCount / (totalCount - 1), 1);
    }

    /**
     * Retrieves the h/v location and fragment of the current,
     * or specified, slide.
     *
     * @param {HTMLElement} [slide] If specified, the returned
     * index will be for this slide rather than the currently
     * active one
     *
     * @return {{h: number, v: number, f: number}}
     */
    getIndices(slide) {
        // By default, return the current indices
        let h = this.indexh,
            v = this.indexv,
            f;

        // If a slide is specified, return the indices of that slide
        if (slide) {
            let isVertical = this.isVerticalSlide(slide);
            let slideh = isVertical ? slide.parentNode : slide;
            // Select all horizontal slides
            let horizontalSlides = this.getHorizontalSlides();
            // Now that we know which the horizontal slide is, get its index
            h = Math.max(horizontalSlides.indexOf(slideh), 0);
            // Assume we're not vertical
            v = undefined;
            // If this is a vertical slide, grab the vertical index
            if (isVertical) {
                v = Math.max(queryAll(slide.parentNode, 'section').indexOf(slide), 0);
            }
        }
        if (!slide && this.currentSlide) {
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

    /**
     * Retrieves all slides in this presentation.
     */
    getSlides() {
        return queryAll(this.dom.wrapper, SLIDES_SELECTOR + ':not(.stack):not([data-visibility="uncounted"])');
    }

    /**
     * Returns a list of all horizontal slides in the deck. Each
     * vertical stack is included as one horizontal slide in the
     * resulting array.
     */
    getHorizontalSlides() {
        return queryAll(this.dom.wrapper, HORIZONTAL_SLIDES_SELECTOR);
    }

    /**
     * Returns all vertical slides that exist within this deck.
     */
    getVerticalSlides() {
        return queryAll(this.dom.wrapper, '.slides>section>section');
    }

    /**
     * Returns all vertical stacks (each stack can contain multiple slides).
     */
    getVerticalStacks() {
        return queryAll(this.dom.wrapper, HORIZONTAL_SLIDES_SELECTOR + '.stack');
    }

    /**
     * Returns true if there are at least two horizontal slides.
     */
    hasHorizontalSlides() {
        return this.getHorizontalSlides().length > 1;
    }

    /**
     * Returns true if there are at least two vertical slides.
     */
    hasVerticalSlides() {
        return this.getVerticalSlides().length > 1;
    }

    /**
     * Returns an array of objects where each object represents the
     * attributes on its respective slide.
     */
    getSlidesAttributes() {
        return this.getSlides().map(slide => {
            let attributes = {};
            for (let i = 0; i < slide.attributes.length; i++) {
                let attribute = slide.attributes[i];
                attributes[attribute.name] = attribute.value;
            }
            return attributes;
        });
    }

    /**
     * Retrieves the total number of slides in this presentation.
     *
     * @return {number}
     */
    getTotalSlides() {
        return this.getSlides().length;
    }

    /**
     * Returns the slide element matching the specified index.
     *
     * @return {HTMLElement}
     */
    getSlide(x, y) {
        let horizontalSlide = this.getHorizontalSlides()[x];
        let verticalSlides = horizontalSlide && horizontalSlide.querySelectorAll('section');
        if (verticalSlides && verticalSlides.length && typeof y === 'number') {
            return verticalSlides ? verticalSlides[y] : undefined;
        }
        return horizontalSlide;
    }

    /**
     * Returns the background element for the given slide.
     * All slides, even the ones with no background properties
     * defined, have a background element so as long as the
     * index is valid an element will be returned.
     *
     * @param {mixed} x Horizontal background index OR a slide
     * HTML element
     * @param {number} y Vertical background index
     * @return {(HTMLElement[]|*)}
     */
    getSlideBackground(x, y) {
        let slide = typeof x === 'number' ? this.getSlide(x, y) : x;
        if (slide) {
            return slide.slideBackgroundElement;
        }
        return undefined;
    }

    /**
     * Retrieves the current state of the presentation as
     * an object. This state can then be restored at any
     * time.
     *
     * @return {{indexh: number, indexv: number, indexf: number, paused: boolean, overview: boolean}}
     */
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

    /**
     * Restores the presentation to the given state.
     *
     * @param {object} state As generated by getState()
     * @see {@link getState} generates the parameter `state`
     */
    setState(state) {
        if (typeof state === 'object') {
            this.slide(deserialize(state.indexh), deserialize(state.indexv), deserialize(state.indexf));
            let pausedFlag = deserialize(state.paused),
                overviewFlag = deserialize(state.overview);
            if (typeof pausedFlag === 'boolean' && pausedFlag !== isPaused()) {
                this.togglePause(pausedFlag);
            }
            if (typeof overviewFlag === 'boolean' && overviewFlag !== overview.isActive()) {
                this.overview.toggle(overviewFlag);
            }
        }
    }

    /**
     * Cues a new automated slide if enabled in the config.
     */
    cueAutoSlide() {
        this.cancelAutoSlide();
        if (this.currentSlide && this.config.autoSlide !== false) {
            let fragment = this.currentSlide.querySelector('.current-fragment');
            // When the slide first appears there is no "current" fragment so
            // we look for a data-autoslide timing on the first fragment
            if (!fragment) fragment = this.currentSlide.querySelector('.fragment');
            let fragmentAutoSlide = fragment ? fragment.getAttribute('data-autoslide') : null;
            let parentAutoSlide = this.currentSlide.parentNode ? this.currentSlide.parentNode.getAttribute('data-autoslide') : null;
            let slideAutoSlide = this.currentSlide.getAttribute('data-autoslide');
            // Pick value in the following priority order:
            // 1. Current fragment's data-autoslide
            // 2. Current slide's data-autoslide
            // 3. Parent slide's data-autoslide
            // 4. Global autoSlide setting
            if (fragmentAutoSlide) {
                this.autoSlide = parseInt(fragmentAutoSlide, 10);
            } else if (slideAutoSlide) {
                this.autoSlide = parseInt(slideAutoSlide, 10);
            } else if (parentAutoSlide) {
                this.autoSlide = parseInt(parentAutoSlide, 10);
            } else {
                this.autoSlide = this.config.autoSlide;

                // If there are media elements with data-autoplay,
                // automatically set the autoSlide duration to the
                // length of that media. Not applicable if the slide
                // is divided up into fragments.
                // playbackRate is accounted for in the duration.
                if (this.currentSlide.querySelectorAll('.fragment').length === 0) {
                    queryAll(this.currentSlide, 'video, audio').forEach(el => {
                        if (el.hasAttribute('data-autoplay')) {
                            if (autoSlide && (el.duration * 1000 / el.playbackRate) > autoSlide) {
                                autoSlide = (el.duration * 1000 / el.playbackRate) + 1000;
                            }
                        }
                    });
                }
            }
            // Cue the next auto-slide if:
            // - There is an autoSlide value
            // - Auto-sliding isn't paused by the user
            // - The presentation isn't paused
            // - The overview isn't active
            // - The presentation isn't over
            if (this.autoSlide && !this.autoSlidePaused && !this.isPaused() && !this.overview.isActive() && (!this.isLastSlide() || this.fragments.availableRoutes().next || this.config.loop === true)) {
                const config = this.config;
                const navigateNext = this.navigateNext;
                const cueAutoSlide = this.cueAutoSlide;
                this.autoSlideTimeout = setTimeout(() => {
                    if (typeof config.autoSlideMethod === 'function') {
                        config.autoSlideMethod()
                    } else {
                        navigateNext();
                    }
                    cueAutoSlide();
                }, autoSlide);
                this.autoSlideStartTime = Date.now();
            }
            if (this.autoSlidePlayer) {
                this.autoSlidePlayer.setPlaying(this.autoSlideTimeout !== -1);
            }
        }
    }

    /**
     * Cancels any ongoing request to auto-slide.
     */
    cancelAutoSlide() {
        clearTimeout(this.autoSlideTimeout);
        this.autoSlideTimeout = -1;
    }

    pauseAutoSlide() {
        if (this.autoSlide && !this.autoSlidePaused) {
            this.autoSlidePaused = true;
            const target = this.dom.wrapper;
            this.dispatchEvent({
                target: target,
                type: 'autoslidepaused'
            });
            this.dispatchPostMessage('autoslidepaused')
            clearTimeout(this.autoSlideTimeout);
            if (this.autoSlidePlayer) {
                this.autoSlidePlayer.setPlaying(false);
            }
        }
    }

    resumeAutoSlide() {
        if (this.autoSlide && this.autoSlidePaused) {
            this.autoSlidePaused = false;
            const target = this.dom.wrapper;
            this.dispatchEvent({
                target: target,
                type: 'autoslideresumed'
            });
            this.dispatchPostMessage('autoslideresumed')
            this.cueAutoSlide();
        }
    }

    navigateLeft() {
        this.navigationHistory.hasNavigatedHorizontally = true;
        // Reverse for RTL
        if (this.config.rtl) {
            if ((this.overview.isActive() || this.fragments.next() === false) && this.availableRoutes().left) {
                this.slide(this.indexh + 1, this.config.navigationMode === 'grid' ? this.indexv : undefined);
            }
        }
        // Normal navigation
        else if ((this.overview.isActive() || this.fragments.prev() === false) && this.availableRoutes().left) {
            this.slide(this.indexh - 1, this.config.navigationMode === 'grid' ? this.indexv : undefined);
        }
    }

    navigateRight() {
        this.navigationHistory.hasNavigatedHorizontally = true;
        // Reverse for RTL
        if (this.config.rtl) {
            if ((this.overview.isActive() || this.fragments.prev() === false) && this.availableRoutes().right) {
                this.slide(this.indexh - 1, this.config.navigationMode === 'grid' ? this.indexv : undefined);
            }
        }
        // Normal navigation
        else if ((this.overview.isActive() || this.fragments.next() === false) && this.availableRoutes().right) {
            this.slide(this.indexh + 1, this.config.navigationMode === 'grid' ? this.indexv : undefined);
        }
    }

    navigateUp() {
        // Prioritize hiding fragments
        if ((this.overview.isActive() || this.fragments.prev() === false) && this.availableRoutes().up) {
            this.slide(this.indexh, this.indexv - 1);
        }
    }

    navigateDown() {
        this.navigationHistory.hasNavigatedVertically = true;
        // Prioritize revealing fragments
        if ((this.overview.isActive() || this.fragments.next() === false) && this.availableRoutes().down) {
            this.slide(this.indexh, this.indexv + 1);
        }
    }

    /**
     * Navigates backwards, prioritized in the following order:
     * 1) Previous fragment
     * 2) Previous vertical slide
     * 3) Previous horizontal slide
     */
    navigatePrev() {
        // Prioritize revealing fragments
        if (this.fragments.prev() === false) {
            if (this.availableRoutes().up) {
                this.navigateUp();
            } else {
                // Fetch the previous horizontal slide, if there is one
                let previousSlide;
                if (config.rtl) {
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

    /**
     * The reverse of #navigatePrev().
     */
    navigateNext() {
            this.navigationHistory.hasNavigatedHorizontally = true;
            this.navigationHistory.hasNavigatedVertically = true;
            // Prioritize revealing fragments
            if (this.fragments.next() === false) {
                let routes = this.availableRoutes();
                // When looping is enabled `routes.down` is always available
                // so we need a separate check for when we've reached the
                // end of a stack and should move horizontally
                if (routes.down && routes.right && config.loop && isLastVerticalSlide(currentSlide)) {
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
        // --------------------------------------------------------------------//
        // ----------------------------- EVENTS -------------------------------//
        // --------------------------------------------------------------------//

    /**
     * Called by all event handlers that are based on user
     * input.
     *
     * @param {object} [event]
     */
    onUserInput(event) {
        if (this.config.autoSlideStoppable) {
            this.pauseAutoSlide();
        }
    }

    /**
     * Event listener for transition end on the current slide.
     *
     * @param {object} [event]
     */
    onTransitionEnd(event) {
        if (this.transition === 'running' && /section/gi.test(event.target.nodeName)) {
            this.transition = 'idle';
            const indexh = this.indexh;
            const indexv = this.indexv;
            const previousSlide = this.previousSlide;
            const currentSlide = this.currentSlide;
            const target = this.dom.wrapper;
            this.dispatchEvent({
                target: target,
                type: 'slidetransitionend',
                data: { indexh, indexv, previousSlide, currentSlide }
            });
            this.dispatchPostMessage('slidetransitionend')
        }
    }

    /**
     * Handler for the window level 'resize' event.
     *
     * @param {object} [event]
     */
    onWindowResize(event) {
        this.layout();
    }

    /**
     * Handle for the window level 'visibilitychange' event.
     *
     * @param {object} [event]
     */
    onPageVisibilityChange(event) {
        // If, after clicking a link or similar and we're coming back,
        // focus the document.body to ensure we can use keyboard shortcuts
        if (document.hidden === false && document.activeElement !== document.body) {
            // Not all elements support .blur() - SVGs among them.
            if (typeof document.activeElement.blur === 'function') {
                document.activeElement.blur();
            }
            document.body.focus();
        }
    }

    /**
     * Handles clicks on links that are set to preview in the
     * iframe overlay.
     *
     * @param {object} event
     */
    onPreviewLinkClicked(event) {
        if (event.currentTarget && event.currentTarget.hasAttribute('href')) {
            let url = event.currentTarget.getAttribute('href');
            if (url) {
                this.showPreview(url);
                event.preventDefault();
            }
        }
    }

    /**
     * Handles click on the auto-sliding controls element.
     *
     * @param {object} [event]
     */
    onAutoSlidePlayerClick(event) {
        // Replay
        if (this.isLastSlide() && this.config.loop === false) {
            this.slide(0, 0);
            this.resumeAutoSlide();
        }
        // Resume
        else if (this.autoSlidePaused) {
            this.resumeAutoSlide();
        }
        // Pause
        else {
            this.pauseAutoSlide();
        }
    }
}
// === end of slide content ===
// ===============
// Highlight js
// ===============
class HighlightPlugin {

    constructor(hljs) {
        this.id = 'highlight'
        this.HIGHLIGHT_STEP_DELIMITER = '|'
        this.HIGHLIGHT_LINE_DELIMITER = ','
        this.HIGHLIGHT_LINE_RANGE_DELIMITER = '-'
        this.hljs = hljs
    }

    /**
     * Highlights code blocks withing the given deck.
     *
     * Note that this can be called multiple times if
     * there are multiple presentations on one page.
     *
     */
    init(dock) {
        // Read the plugin config options and provide fallbacks
        var config = dock.config.highlight || {};
        const that = this;
        config.highlightOnLoad = typeof config.highlightOnLoad === 'boolean' ? config.highlightOnLoad : true;
        config.escapeHTML = typeof config.escapeHTML === 'boolean' ? config.escapeHTML : true;
        [].slice.call(dock.deckElement.querySelectorAll('pre code')).forEach(function(block) {
            // Code can optionally be wrapped in script template to avoid
            // HTML being parsed by the browser (i.e. when you need to
            // include <, > or & in your code).
            let substitute = block.querySelector('script[type="text/template"]');
            if (substitute) {
                // textContent handles the HTML entity escapes for us
                block.textContent = substitute.innerHTML;
            }
            // Trim whitespace if the "data-trim" attribute is present
            if (block.hasAttribute('data-trim') && typeof block.innerHTML.trim === 'function') {
                block.innerHTML = betterTrim(block);
            }
            // Escape HTML tags unless the "data-noescape" attrbute is present
            if (config.escapeHTML && !block.hasAttribute('data-noescape')) {
                block.innerHTML = block.innerHTML.replace(/</g, "&lt;").replace(/>/g, '&gt;');
            }
            // Re-highlight when focus is lost (for contenteditable code)
            block.addEventListener('focusout', function(event) {
                hljs.highlightBlock(event.currentTarget);
            }, false);
            if (config.highlightOnLoad) {
                that.highlightBlock(block);
            }
        });
        // If we're printing to PDF, scroll the code highlights of
        // all blocks in the deck into view at once
        dock.on('pdf-ready', function() {
            [].slice.call(dock.deckElement.querySelectorAll('pre code[data-line-numbers].current-fragment')).forEach(function(block) {
                that.scrollHighlightedLineIntoView(block, {}, true);
            });
        });
    }

    /**
     * Highlights a code block. If the <code> node has the
     * 'data-line-numbers' attribute we also generate slide
     * numbers.
     *
     * If the block contains multiple line highlight steps,
     * we clone the block and create a fragment for each step.
     */
    highlightBlock(block) {
        hljs.highlightBlock(block);
        // Don't generate line numbers for empty code blocks
        if (block.innerHTML.trim().length === 0) return;
        if (block.hasAttribute('data-line-numbers')) {
            hljs.lineNumbersBlock(block, { singleLine: true });
            var scrollState = { currentBlock: block };
            // If there is at least one highlight step, generate
            // fragments
            var highlightSteps = this.deserializeHighlightSteps(block.getAttribute('data-line-numbers'));
            if (highlightSteps.length > 1) {
                // If the original code block has a fragment-index,
                // each clone should follow in an incremental sequence
                var fragmentIndex = parseInt(block.getAttribute('data-fragment-index'), 10);
                if (typeof fragmentIndex !== 'number' || isNaN(fragmentIndex)) {
                    fragmentIndex = null;
                }
                const that = this;
                // Generate fragments for all steps except the original block
                highlightSteps.slice(1).forEach(function(highlight) {
                    var fragmentBlock = block.cloneNode(true);
                    fragmentBlock.setAttribute('data-line-numbers', that.serializeHighlightSteps([highlight]));
                    fragmentBlock.classList.add('fragment');
                    block.parentNode.appendChild(fragmentBlock);
                    that.highlightLines(fragmentBlock);
                    if (typeof fragmentIndex === 'number') {
                        fragmentBlock.setAttribute('data-fragment-index', fragmentIndex);
                        fragmentIndex += 1;
                    } else {
                        fragmentBlock.removeAttribute('data-fragment-index');
                    }
                    // Scroll highlights into view as we step through them
                    fragmentBlock.addEventListener('visible', () => { that.scrollHighlightedLineIntoView.bind(Plugin, fragmentBlock, scrollState) });
                    fragmentBlock.addEventListener('hidden', () => { that.scrollHighlightedLineIntoView.bind(Plugin, fragmentBlock.previousSibling, scrollState) });
                });
                block.removeAttribute('data-fragment-index')
                block.setAttribute('data-line-numbers', this.serializeHighlightSteps([highlightSteps[0]]));
            }
            // Scroll the first highlight into view when the slide
            // becomes visible. Note supported in IE11 since it lacks
            // support for Element.closest.
            var slide = typeof block.closest === 'function' ? block.closest('section:not(.stack)') : null;
            if (slide) {
                const that = this;
                var scrollFirstHighlightIntoView = function() {
                    that.scrollHighlightedLineIntoView(block, scrollState, true);
                    slide.removeEventListener('visible', scrollFirstHighlightIntoView);
                }
                slide.addEventListener('visible', scrollFirstHighlightIntoView);
            }
            this.highlightLines(block);
        }
    }

    /**
     * Animates scrolling to the first highlighted line
     * in the given code block.
     */
    scrollHighlightedLineIntoView(block, scrollState, skipAnimation) {
        if (block.tagName === undefined) {
            return;
        }
        cancelAnimationFrame(scrollState.animationFrameID);
        // Match the scroll position of the currently visible
        // code block
        if (scrollState.currentBlock) {
            block.scrollTop = scrollState.currentBlock.scrollTop;
        }
        // Remember the current code block so that we can match
        // its scroll position when showing/hiding fragments
        scrollState.currentBlock = block;
        var highlightBounds = this.getHighlightedLineBounds(block)
        var viewportHeight = block.offsetHeight;
        // Subtract padding from the viewport height
        var blockStyles = getComputedStyle(block);
        viewportHeight -= parseInt(blockStyles.paddingTop) + parseInt(blockStyles.paddingBottom);
        // Scroll position which centers all highlights
        var startTop = block.scrollTop;
        var targetTop = highlightBounds.top + (Math.min(highlightBounds.bottom - highlightBounds.top, viewportHeight) - viewportHeight) / 2;
        // Account for offsets in position applied to the
        // <table> that holds our lines of code
        var lineTable = block.querySelector('.hljs-ln');
        if (lineTable) targetTop += lineTable.offsetTop - parseInt(blockStyles.paddingTop);
        // Make sure the scroll target is within bounds
        targetTop = Math.max(Math.min(targetTop, block.scrollHeight - viewportHeight), 0);
        if (skipAnimation === true || startTop === targetTop) {
            block.scrollTop = targetTop;
        } else {
            // Don't attempt to scroll if there is no overflow
            if (block.scrollHeight <= viewportHeight) return;
            var time = 0;
            const that = this;
            var animate = function() {
                time = Math.min(time + 0.02, 1);
                // Update our eased scroll position
                block.scrollTop = startTop + (targetTop - startTop) * that.easeInOutQuart(time);
                // Keep animating unless we've reached the end
                if (time < 1) {
                    scrollState.animationFrameID = requestAnimationFrame(animate);
                }
            };
            animate();
        }
    }

    /**
     * The easing function used when scrolling.
     */
    easeInOutQuart(t) {
        // easeInOutQuart
        return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    }


    getHighlightedLineBounds(block) {
        if (block.tagName === undefined) {
            return { top: 0, bottom: 0 }
        }
        var highlightedLines = block.querySelectorAll('.highlight-line');
        if (highlightedLines.length === 0) {
            return { top: 0, bottom: 0 };
        } else {
            var firstHighlight = highlightedLines[0];
            var lastHighlight = highlightedLines[highlightedLines.length - 1];
            return {
                top: firstHighlight.offsetTop,
                bottom: lastHighlight.offsetTop + lastHighlight.offsetHeight
            }
        }
    }

    /**
     * Visually emphasize specific lines within a code block.
     * This only works on blocks with line numbering turned on.
     *
     * @param {HTMLElement} block a <code> block
     * @param {String} [linesToHighlight] The lines that should be
     * highlighted in this format:
     * "1" 		= highlights line 1
     * "2,5"	= highlights lines 2 & 5
     * "2,5-7"	= highlights lines 2, 5, 6 & 7
     */
    highlightLines(block, linesToHighlight) {
        var highlightSteps = this.deserializeHighlightSteps(linesToHighlight || block.getAttribute('data-line-numbers'));
        if (highlightSteps.length) {
            highlightSteps[0].forEach(function(highlight) {
                var elementsToHighlight = [];
                // Highlight a range
                if (typeof highlight.end === 'number') {
                    elementsToHighlight = [].slice.call(block.querySelectorAll('table tr:nth-child(n+' + highlight.start + '):nth-child(-n+' + highlight.end + ')'));
                }
                // Highlight a single line
                else if (typeof highlight.start === 'number') {
                    elementsToHighlight = [].slice.call(block.querySelectorAll('table tr:nth-child(' + highlight.start + ')'));
                }
                if (elementsToHighlight.length) {
                    elementsToHighlight.forEach(function(lineElement) {
                        lineElement.classList.add('highlight-line');
                    });
                    block.classList.add('has-highlights');
                }
            });
        }
    }

    /**
     * Parses and formats a user-defined string of line
     * numbers to highlight.
     *
     * @example
     * this.deserializeHighlightSteps( '1,2|3,5-10' )
     * // [
     * //   [ { start: 1 }, { start: 2 } ],
     * //   [ { start: 3 }, { start: 5, end: 10 } ]
     * // ]
     */
    deserializeHighlightSteps(highlightSteps) {
        // Remove whitespace
        highlightSteps = highlightSteps.replace(/\s/g, '');
        // Divide up our line number groups
        highlightSteps = highlightSteps.split(this.HIGHLIGHT_STEP_DELIMITER);
        const that = this;
        return highlightSteps.map(function(highlights) {
            return highlights.split(that.HIGHLIGHT_LINE_DELIMITER).map(function(highlight) {
                // Parse valid line numbers
                if (/^[\d-]+$/.test(highlight)) {
                    highlight = highlight.split(that.HIGHLIGHT_LINE_RANGE_DELIMITER);
                    var lineStart = parseInt(highlight[0], 10),
                        lineEnd = parseInt(highlight[1], 10);
                    if (isNaN(lineEnd)) {
                        return {
                            start: lineStart
                        };
                    } else {
                        return {
                            start: lineStart,
                            end: lineEnd
                        };
                    }
                }
                // If no line numbers are provided, no code will be highlighted
                else {
                    return {};
                }
            });
        });
    }

    /**
     * Serializes parsed line number data into a string so
     * that we can store it in the DOM.
     */
    serializeHighlightSteps(highlightSteps) {
        const that = this;
        return highlightSteps.map(function(highlights) {
            return highlights.map(function(highlight) {
                // Line range
                if (typeof highlight.end === 'number') {
                    return highlight.start + that.HIGHLIGHT_LINE_RANGE_DELIMITER + highlight.end;
                }
                // Single line
                else if (typeof highlight.start === 'number') {
                    return highlight.start;
                }
                // All lines
                else {
                    return '';
                }
            }).join(that.HIGHLIGHT_LINE_DELIMITER);
        }).join(that.HIGHLIGHT_STEP_DELIMITER);
    }

}
// === markdown ===

const DEFAULT_SLIDE_SEPARATOR = '^\r?\n---\r?\n$',
    DEFAULT_NOTES_SEPARATOR = 'notes?:',
    DEFAULT_ELEMENT_ATTRIBUTES_SEPARATOR = '\\\.element\\\s*?(.+?)$',
    DEFAULT_SLIDE_ATTRIBUTES_SEPARATOR = '\\\.slide:\\\s*?(\\\S.+?)$';

const SCRIPT_END_PLACEHOLDER = '__SCRIPT_END__';

const CODE_LINE_NUMBER_REGEX = /\[([\s\d,|-]*)\]/;

const HTML_ESCAPE_MAP = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
};

class MarkdownPlugin {
    id = 'markdown'
    deck = {}
        /**
         * Starts processing and converting Markdown within the
         * current reveal.js deck.
         */
    init(deck) {

            deck = deck;

            let renderer = new marked.Renderer();

            renderer.code = (code, language) => {

                // Off by default
                let lineNumbers = '';

                // Users can opt in to show line numbers and highlight
                // specific lines.
                // ```javascript []        show line numbers
                // ```javascript [1,4-8]   highlights lines 1 and 4-8
                if (CODE_LINE_NUMBER_REGEX.test(language)) {
                    lineNumbers = language.match(CODE_LINE_NUMBER_REGEX)[1].trim();
                    lineNumbers = `data-line-numbers="${lineNumbers}"`;
                    language = language.replace(CODE_LINE_NUMBER_REGEX, '').trim();
                }

                // Escape before this gets injected into the DOM to
                // avoid having the HTML parser alter our code before
                // highlight.js is able to read it
                code = this.escapeForHTML(code);

                return `<pre><code ${lineNumbers} class="${language}">${code}</code></pre>`;
            };

            marked.setOptions({
                renderer,
                ...deck.config.markdown
            });
            const that = this;
            return this.processSlides(deck.deckElement).then(() => { this.convertSlides(that) });

        }
        /**
         * Retrieves the markdown contents of a slide section
         * element. Normalizes leading tabs/whitespace.
         */
    getMarkdownFromSlide(section) {

        // look for a <script> or <textarea data-template> wrapper
        var template = section.querySelector('[data-template]') || section.querySelector('script');

        // strip leading whitespace so it isn't evaluated as code
        var text = (template || section).textContent;

        // restore script end tags
        text = text.replace(new RegExp(SCRIPT_END_PLACEHOLDER, 'g'), '</script>');

        var leadingWs = text.match(/^\n?(\s*)/)[1].length,
            leadingTabs = text.match(/^\n?(\t*)/)[1].length;

        if (leadingTabs > 0) {
            text = text.replace(new RegExp('\\n?\\t{' + leadingTabs + '}', 'g'), '\n');
        } else if (leadingWs > 1) {
            text = text.replace(new RegExp('\\n? {' + leadingWs + '}', 'g'), '\n');
        }

        return text;

    }

    /**
     * Given a markdown slide section element, this will
     * return all arguments that aren't related to markdown
     * parsing. Used to forward any other user-defined arguments
     * to the output markdown slide.
     */
    getForwardedAttributes(section) {

        var attributes = section.attributes;
        var result = [];

        for (var i = 0, len = attributes.length; i < len; i++) {
            var name = attributes[i].name,
                value = attributes[i].value;

            // disregard attributes that are used for markdown loading/parsing
            if (/data\-(markdown|separator|vertical|notes)/gi.test(name)) continue;

            if (value) {
                result.push(name + '="' + value + '"');
            } else {
                result.push(name);
            }
        }

        return result.join(' ');

    }

    /**
     * Inspects the given options and fills out default
     * values for what's not defined.
     */
    getSlidifyOptions(options) {

        options = options || {};
        options.separator = options.separator || DEFAULT_SLIDE_SEPARATOR;
        options.notesSeparator = options.notesSeparator || DEFAULT_NOTES_SEPARATOR;
        options.attributes = options.attributes || '';

        return options;

    }

    /**
     * Helper function for constructing a markdown slide.
     */
    createMarkdownSlide(content, options) {

        options = this.getSlidifyOptions(options);

        var notesMatch = content.split(new RegExp(options.notesSeparator, 'mgi'));

        if (notesMatch.length === 2) {
            content = notesMatch[0] + '<aside class="notes">' + marked(notesMatch[1].trim()) + '</aside>';
        }

        // prevent script end tags in the content from interfering
        // with parsing
        content = content.replace(/<\/script>/g, SCRIPT_END_PLACEHOLDER);

        return '<script type="text/template">' + content + '</script>';

    }

    /**
     * Parses a data string into multiple slides based
     * on the passed in separator arguments.
     */
    slidify(markdown, options) {

        options = this.getSlidifyOptions(options);

        var separatorRegex = new RegExp(options.separator + (options.verticalSeparator ? '|' + options.verticalSeparator : ''), 'mg'),
            horizontalSeparatorRegex = new RegExp(options.separator);

        var matches,
            lastIndex = 0,
            isHorizontal,
            wasHorizontal = true,
            content,
            sectionStack = [];

        // iterate until all blocks between separators are stacked up
        while (matches = separatorRegex.exec(markdown)) {
            var notes = null;

            // determine direction (horizontal by default)
            isHorizontal = horizontalSeparatorRegex.test(matches[0]);

            if (!isHorizontal && wasHorizontal) {
                // create vertical stack
                sectionStack.push([]);
            }

            // pluck slide content from markdown input
            content = markdown.substring(lastIndex, matches.index);

            if (isHorizontal && wasHorizontal) {
                // add to horizontal stack
                sectionStack.push(content);
            } else {
                // add to vertical stack
                sectionStack[sectionStack.length - 1].push(content);
            }

            lastIndex = separatorRegex.lastIndex;
            wasHorizontal = isHorizontal;
        }

        // add the remaining slide
        (wasHorizontal ? sectionStack : sectionStack[sectionStack.length - 1]).push(markdown.substring(lastIndex));

        var markdownSections = '';

        // flatten the hierarchical stack, and insert <section data-markdown> tags
        for (var i = 0, len = sectionStack.length; i < len; i++) {
            // vertical
            if (sectionStack[i] instanceof Array) {
                markdownSections += '<section ' + options.attributes + '>';

                sectionStack[i].forEach(function(child) {
                    markdownSections += '<section data-markdown>' + this.createMarkdownSlide(child, options) + '</section>';
                });

                markdownSections += '</section>';
            } else {
                markdownSections += '<section ' + options.attributes + ' data-markdown>' + this.createMarkdownSlide(sectionStack[i], options) + '</section>';
            }
        }

        return markdownSections;

    }

    /**
     * Parses any current data-markdown slides, splits
     * multi-slide markdown into separate sections and
     * handles loading of external markdown.
     */
    processSlides(scope) {
        const that = this;
        return new Promise(function(resolve) {

            var externalPromises = [];

            [].slice.call(scope.querySelectorAll('[data-markdown]:not([data-markdown-parsed])')).forEach(function(section, i) {

                if (section.getAttribute('data-markdown').length) {

                    externalPromises.push(that.loadExternalMarkdown(section).then(

                        // Finished loading external file
                        function(xhr, url) {
                            section.outerHTML = that.slidify(xhr.responseText, {
                                separator: section.getAttribute('data-separator'),
                                verticalSeparator: section.getAttribute('data-separator-vertical'),
                                notesSeparator: section.getAttribute('data-separator-notes'),
                                attributes: that.getForwardedAttributes(section)
                            });
                        },

                        // Failed to load markdown
                        function(xhr, url) {
                            section.outerHTML = '<section data-state="alert">' +
                                'ERROR: The attempt to fetch ' + url + ' failed with HTTP status ' + xhr.status + '.' +
                                'Check your browser\'s JavaScript console for more details.' +
                                '<p>Remember that you need to serve the presentation HTML from a HTTP server.</p>' +
                                '</section>';
                        }

                    ));

                } else if (section.getAttribute('data-separator') || section.getAttribute('data-separator-vertical') || section.getAttribute('data-separator-notes')) {

                    section.outerHTML = that.slidify(that.getMarkdownFromSlide(section), {
                        separator: section.getAttribute('data-separator'),
                        verticalSeparator: section.getAttribute('data-separator-vertical'),
                        notesSeparator: section.getAttribute('data-separator-notes'),
                        attributes: that.getForwardedAttributes(section)
                    });

                } else {
                    section.innerHTML = that.createMarkdownSlide(that.getMarkdownFromSlide(section));
                }

            });

            Promise.all(externalPromises).then(resolve);

        });

    }

    loadExternalMarkdown(section) {

        return new Promise(function(resolve, reject) {

            var xhr = new XMLHttpRequest(),
                url = section.getAttribute('data-markdown');

            var datacharset = section.getAttribute('data-charset');

            // see https://developer.mozilla.org/en-US/docs/Web/API/element.getAttribute#Notes
            if (datacharset != null && datacharset != '') {
                xhr.overrideMimeType('text/html; charset=' + datacharset);
            }

            xhr.onreadystatechange = function(section, xhr) {
                if (xhr.readyState === 4) {
                    // file protocol yields status code 0 (useful for local debug, mobile applications etc.)
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0) {

                        resolve(xhr, url);

                    } else {

                        reject(xhr, url);

                    }
                }
            }.bind(this, section, xhr);

            xhr.open('GET', url, true);

            try {
                xhr.send();
            } catch (e) {
                console.warn('Failed to get the Markdown file ' + url + '. Make sure that the presentation and the file are served by a HTTP server and the file can be found there. ' + e);
                resolve(xhr, url);
            }

        });

    }

    /**
     * Check if a node value has the attributes pattern.
     * If yes, extract it and add that value as one or several attributes
     * to the target element.
     *
     * You need Cache Killer on Chrome to see the effect on any FOM transformation
     * directly on refresh (F5)
     * http://stackoverflow.com/questions/5690269/disabling-chrome-cache-for-website-development/7000899#answer-11786277
     */
    addAttributeInElement(node, elementTarget, separator) {

        var mardownClassesInElementsRegex = new RegExp(separator, 'mg');
        var mardownClassRegex = new RegExp("([^\"= ]+?)=\"([^\"]+?)\"|(data-[^\"= ]+?)(?=[\" ])", 'mg');
        var nodeValue = node.nodeValue;
        var matches,
            matchesClass;
        if (matches = mardownClassesInElementsRegex.exec(nodeValue)) {

            var classes = matches[1];
            nodeValue = nodeValue.substring(0, matches.index) + nodeValue.substring(mardownClassesInElementsRegex.lastIndex);
            node.nodeValue = nodeValue;
            while (matchesClass = mardownClassRegex.exec(classes)) {
                if (matchesClass[2]) {
                    elementTarget.setAttribute(matchesClass[1], matchesClass[2]);
                } else {
                    elementTarget.setAttribute(matchesClass[3], "");
                }
            }
            return true;
        }
        return false;
    }

    /**
     * Add attributes to the parent element of a text node,
     * or the element of an attribute node.
     */
    addAttributes(section, element, previousElement, separatorElementAttributes, separatorSectionAttributes) {

        if (element != null && element.childNodes != undefined && element.childNodes.length > 0) {
            var previousParentElement = element;
            for (var i = 0; i < element.childNodes.length; i++) {
                var childElement = element.childNodes[i];
                if (i > 0) {
                    var j = i - 1;
                    while (j >= 0) {
                        var aPreviousChildElement = element.childNodes[j];
                        if (typeof aPreviousChildElement.setAttribute == 'function' && aPreviousChildElement.tagName != "BR") {
                            previousParentElement = aPreviousChildElement;
                            break;
                        }
                        j = j - 1;
                    }
                }
                var parentSection = section;
                if (childElement.nodeName == "section") {
                    parentSection = childElement;
                    previousParentElement = childElement;
                }
                if (typeof childElement.setAttribute == 'function' || childElement.nodeType == Node.COMMENT_NODE) {
                    this.addAttributes(parentSection, childElement, previousParentElement, separatorElementAttributes, separatorSectionAttributes);
                }
            }
        }

        if (element.nodeType == Node.COMMENT_NODE) {
            if (this.addAttributeInElement(element, previousElement, separatorElementAttributes) == false) {
                this.addAttributeInElement(element, section, separatorSectionAttributes);
            }
        }
    }

    /**
     * Converts any current data-markdown slides in the
     * DOM to HTML.
     */
    convertSlides(that) {

        var sections = deck.deckElement.querySelectorAll('[data-markdown]:not([data-markdown-parsed])');

        [].slice.call(sections).forEach(function(section) {

            section.setAttribute('data-markdown-parsed', true)

            var notes = section.querySelector('aside.notes');
            var markdown = that.getMarkdownFromSlide(section);

            section.innerHTML = marked(markdown);
            that.addAttributes(section, section, null, section.getAttribute('data-element-attributes') ||
                section.parentNode.getAttribute('data-element-attributes') ||
                DEFAULT_ELEMENT_ATTRIBUTES_SEPARATOR,
                section.getAttribute('data-attributes') ||
                section.parentNode.getAttribute('data-attributes') ||
                DEFAULT_SLIDE_ATTRIBUTES_SEPARATOR);

            // If there were notes, we need to re-add them after
            // having overwritten the section's HTML
            if (notes) {
                section.appendChild(notes);
            }

        });
        return Promise.resolve();
    }

    escapeForHTML(input) {
        return input.replace(/([&<>'"])/g, char => HTML_ESCAPE_MAP[char]);
    }
}
// === end of markdown

// === main ===
let enqueuedAPICalls = [];
['configure', 'on', 'off', 'addEventListener', 'removeEventListener', 'registerPlugin'].forEach(method => {
    Deck[method] = (...args) => {
        enqueuedAPICalls.push(deck => deck[method].call(null, ...args));
    }
});
const highlightPlugin = new HighlightPlugin(hljs);
const markdownPlugin = new MarkdownPlugin();
const deck = new Deck(document.querySelector('.reveal'))
deck.initialize({ controls: true, progress: true, center: true, hash: true, plugins: [highlightPlugin, markdownPlugin] });