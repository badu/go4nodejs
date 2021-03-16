import { Deck } from './deck.js';


class ZoomPlugin {
    id = 'zoom';
    level = 1; // The current zoom level (scale)   
    mouseX = 0; // The current mouse position, used for panning
    mouseY = 0;
    panEngageTimeout = -1; // Timeout before pan is activated
    panUpdateInterval = -1;

    magnify(rect, scale) {

        var scrollOffset = getScrollOffset();

        // Ensure a width/height is set
        rect.width = rect.width || 1;
        rect.height = rect.height || 1;

        // Center the rect within the zoomed viewport
        rect.x -= (window.innerWidth - (rect.width * scale)) / 2;
        rect.y -= (window.innerHeight - (rect.height * scale)) / 2;

        if (this.supportsTransforms) {
            // Reset
            if (scale === 1) {
                document.body.style.transform = '';
                document.body.style.OTransform = '';
                document.body.style.msTransform = '';
                document.body.style.MozTransform = '';
                document.body.style.WebkitTransform = '';
            }
            // Scale
            else {
                var origin = scrollOffset.x + 'px ' + scrollOffset.y + 'px',
                    transform = 'translate(' + -rect.x + 'px,' + -rect.y + 'px) scale(' + scale + ')';

                document.body.style.transformOrigin = origin;
                document.body.style.OTransformOrigin = origin;
                document.body.style.msTransformOrigin = origin;
                document.body.style.MozTransformOrigin = origin;
                document.body.style.WebkitTransformOrigin = origin;

                document.body.style.transform = transform;
                document.body.style.OTransform = transform;
                document.body.style.msTransform = transform;
                document.body.style.MozTransform = transform;
                document.body.style.WebkitTransform = transform;
            }
        } else {
            // Reset
            if (scale === 1) {
                document.body.style.position = '';
                document.body.style.left = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.height = '';
                document.body.style.zoom = '';
            }
            // Scale
            else {
                document.body.style.position = 'relative';
                document.body.style.left = (-(scrollOffset.x + rect.x) / scale) + 'px';
                document.body.style.top = (-(scrollOffset.y + rect.y) / scale) + 'px';
                document.body.style.width = (scale * 100) + '%';
                document.body.style.height = (scale * 100) + '%';
                document.body.style.zoom = scale;
            }
        }

        this.level = scale;

        if (document.documentElement.classList) {
            if (this.level !== 1) {
                document.documentElement.classList.add('zoomed');
            } else {
                document.documentElement.classList.remove('zoomed');
            }
        }
    }

    pan() {
        var range = 0.12,
            rangeX = window.innerWidth * range,
            rangeY = window.innerHeight * range,
            scrollOffset = getScrollOffset();

        // Up
        if (this.mouseY < rangeY) {
            window.scroll(scrollOffset.x, scrollOffset.y - (1 - (this.mouseY / rangeY)) * (14 / this.level));
        }
        // Down
        else if (this.mouseY > window.innerHeight - rangeY) {
            window.scroll(scrollOffset.x, scrollOffset.y + (1 - (window.innerHeight - this.mouseY) / rangeY) * (14 / this.level));
        }

        // Left
        if (this.mouseX < rangeX) {
            window.scroll(scrollOffset.x - (1 - (this.mouseX / rangeX)) * (14 / this.level), scrollOffset.y);
        }
        // Right
        else if (this.mouseX > window.innerWidth - rangeX) {
            window.scroll(scrollOffset.x + (1 - (window.innerWidth - this.mouseX) / rangeX) * (14 / this.level), scrollOffset.y);
        }
    }

    getScrollOffset() {
        return {
            x: window.scrollX !== undefined ? window.scrollX : window.pageXOffset,
            y: window.scrollY !== undefined ? window.scrollY : window.pageYOffset
        }
    }

    init(deck) {
        if (!(deck instanceof Deck)) {
            throw new Error("expecting instance of Deck");
        }
        this.deck = deck;


        // Check for transform support so that we can fallback otherwise
        this.supportsTransforms = 'WebkitTransform' in document.body.style ||
            'MozTransform' in document.body.style ||
            'msTransform' in document.body.style ||
            'OTransform' in document.body.style ||
            'transform' in document.body.style;

        if (this.supportsTransforms) {
            // The easing that will be applied when we zoom in/out
            document.body.style.transition = 'transform 0.8s ease';
            document.body.style.OTransition = '-o-transform 0.8s ease';
            document.body.style.msTransition = '-ms-transform 0.8s ease';
            document.body.style.MozTransition = '-moz-transform 0.8s ease';
            document.body.style.WebkitTransition = '-webkit-transform 0.8s ease';
        }

        // Zoom out if the user hits escape
        document.addEventListener('keyup', function(event) {
            if (this.level !== 1 && event.keyCode === 27) {
                this.out();
            }
        }.bind(this));

        // Monitor mouse movement for panning
        document.addEventListener('mousemove', function(event) {
            if (this.level !== 1) {
                this.mouseX = event.clientX;
                this.mouseY = event.clientY;
            }
        }.bind(this));

        this.deck.deckElement.addEventListener('mousedown', function(event) {
            var defaultModifier = /Linux/.test(window.navigator.platform) ? 'ctrl' : 'alt';

            var modifier = (this.deck.config.zoomKey ? this.deck.config.zoomKey : defaultModifier) + 'Key';
            var zoomLevel = (this.deck.config.zoomLevel ? this.deck.config.zoomLevel : 2);

            if (event[modifier] && !dethis.deckk.overview.isActive()) {
                event.preventDefault();

                this.to({
                    x: event.clientX,
                    y: event.clientY,
                    scale: zoomLevel,
                    pan: false
                });
            }
        }.bind(this));
    }

    to(options) {

        // Due to an implementation limitation we can't zoom in
        // to another element without zooming out first
        if (this.level !== 1) {
            this.out();
        } else {
            options.x = options.x || 0;
            options.y = options.y || 0;

            // If an element is set, that takes precedence
            if (!!options.element) {
                // Space around the zoomed in element to leave on screen
                var padding = 20;
                var bounds = options.element.getBoundingClientRect();

                options.x = bounds.left - padding;
                options.y = bounds.top - padding;
                options.width = bounds.width + (padding * 2);
                options.height = bounds.height + (padding * 2);
            }

            // If width/height values are set, calculate scale from those values
            if (options.width !== undefined && options.height !== undefined) {
                options.scale = Math.max(Math.min(window.innerWidth / options.width, window.innerHeight / options.height), 1);
            }

            if (options.scale > 1) {
                options.x *= options.scale;
                options.y *= options.scale;

                magnify(options, options.scale);

                if (options.pan !== false) {

                    // Wait with engaging panning as it may conflict with the
                    // zoom transition
                    this.panEngageTimeout = setTimeout(function() {
                        this.panUpdateInterval = setInterval(pan, 1000 / 60);
                    }, 800);

                }
            }
        }
    }

    out() {
        clearTimeout(this.panEngageTimeout);
        clearInterval(this.panUpdateInterval);

        this.magnify({ x: 0, y: 0 }, 1);

        this.level = 1;
    }

    magnify(options) { this.to(options) }

    reset() { this.out() }

    zoomLevel() {
        return this.level;
    }
}

export { ZoomPlugin };