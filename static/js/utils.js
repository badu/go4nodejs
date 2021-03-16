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
    } : () => {};

    // sets all fitties to dirty so they are redrawn on the next redraw loop, then calls redraw
    const redrawAll = (type) => () => {
        fitties.forEach(f => f.dirty = type);
        requestRedraw();
    };

    // redraws fitties so they nicely fit their parent container
    const redraw = function(fitties) {
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

    const markAsClean = function(f) { f.dirty = DrawState.IDLE };

    const calculateStyles = function(f) {
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
    const shouldRedraw = function(f) { f.dirty !== DrawState.DIRTY_LAYOUT || (f.dirty === DrawState.DIRTY_LAYOUT && f.element.parentNode.clientWidth !== f.availableWidth) };

    // every fitty element is tested for invalid styles
    const computeStyle = function(f) {
        // get style properties
        const style = w.getComputedStyle(f.element, null);
        // get current font size in pixels (if we already calculated it, use the calculated version)
        f.currentFontSize = parseFloat(style.getPropertyValue('font-size'));
        // get display type and wrap mode
        f.display = style.getPropertyValue('display');
        f.whiteSpace = style.getPropertyValue('white-space');
    };

    // determines if this fitty requires initial styling, can be prevented by applying correct styles through CSS
    const shouldPreStyle = function(f) {
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
    const applyStyle = function(f) {
        f.element.style.whiteSpace = f.whiteSpace;
        f.element.style.display = f.display;
        f.element.style.fontSize = f.currentFontSize + 'px';
    };

    // dispatch a fit event on a fitty
    const dispatchFitEvent = function(f) {
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

    const init = function(f) {
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

    const destroy = function(f) {
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
    const subscribe = function(f) {
        if (f.active) return;
        f.active = true;
        requestRedraw();
    };

    // remove an existing fitty
    const unsubscribe = function(f) { f.active = false };

    const observeMutations = function(f) {
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
        const publicFitties = elements.map(function(element) {
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
    const onWindowResized = function() {
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

const colorBrightness = (color) => {
    if (typeof color === 'string') color = colorToRgb(color);
    if (color) {
        return (color.r * 299 + color.g * 587 + color.b * 114) / 1000;
    }
    return null;
}

const extend = (a, b) => {
    for (let i in b) {
        a[i] = b[i];
    }
    return a;
}

const queryAll = (el, selector) => {
    return Array.from(el.querySelectorAll(selector));
}

const toggleClass = (el, className, value) => {
    if (value) {
        el.classList.add(className);
    } else {
        el.classList.remove(className);
    }
}

const deserialize = function(value) {
    if (typeof value === 'string') {
        if (value === 'null') return null;
        else if (value === 'true') return true;
        else if (value === 'false') return false;
        else if (value.match(/^-?[\d\.]+$/)) return parseFloat(value);
    }
    return value;
}

const distanceBetween = (a, b) => {
    let dx = a.x - b.x,
        dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

const transformElement = (element, transform) => {
    element.style.transform = transform;
}

const matches = (target, selector) => {
    let matchesMethod = target.matches || target.matchesSelector || target.msMatchesSelector;
    return !!(matchesMethod && matchesMethod.call(target, selector));
}

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

const SLIDES_SELECTOR = '.slides section';

const isMobile = /(iphone|ipod|ipad|android)/gi.test(navigator.userAgentUA) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPadOS

const isChrome = /chrome/i.test(navigator.userAgent) && !/edge/i.test(navigator.userAgent);

const supportsZoom = 'zoom' in document.createElement('div').style && !isMobile && (isChrome || /Version\/[\d\.]+.*Safari/.test(navigator.userAgent));

export {
    createStyleSheet,
    closest,
    matches,
    transformElement,
    distanceBetween,
    deserialize,
    toggleClass,
    queryAll,
    extend,
    colorBrightness,
    colorToRgb,
    SLIDES_SELECTOR,
    isMobile,
    supportsZoom,
    fitty
}