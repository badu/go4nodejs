import {Deck} from './deck.js';
import {queryAll} from './utils.js';

class Backgrounds {

    constructor(deck) {
        if (!(deck instanceof Deck)) {
            throw new Error("expecting instance of Deck");
        }
        this.deck = deck;
    }

    render() {
        this.element = document.createElement('div');
        this.element.className = 'backgrounds';
        this.deck.deckElement.appendChild(this.element);
        this.deck.on('slided', function (event) {
            this.update();
            this.updateParallax();
        }.bind(this));
        this.deck.on('synced', function (event) {
            this.create();
            this.update(true);
        }.bind(this));
        this.deck.on('syncSlide', function (event) {
            this.sync(event.data);
            this.update();
        }.bind(this))
    }

    create() {
        // Clear prior backgrounds
        this.element.innerHTML = '';
        this.element.classList.add('no-transition');
        // Iterate over all horizontal slides
        this.deck.getHorizontalSlides().forEach(function (slideh) {
            let backgroundStack = this.createBackground(slideh, this.element);
            // Iterate over all vertical slides
            queryAll(slideh, 'section').forEach(function (slidev) {
                this.createBackground(slidev, backgroundStack);
                backgroundStack.classList.add('stack');
            }, this);
        }, this);

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
            setTimeout(function () {
                this.deck.deckElement.classList.add('has-parallax-background');
            }.bind(this), 1);
        } else {
            this.element.style.backgroundImage = '';
            this.deck.deckElement.classList.remove('has-parallax-background');
        }
    }

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

    sync(slide = this.deck.currentSlide) {
        let el = slide.slideBackgroundElement,
            contentElement = slide.slideBackgroundContentElement;
        // Reset the prior background state in case this is not the
        // initial sync
        slide.classList.remove('has-dark-background');
        slide.classList.remove('has-light-background');

        el.removeAttribute('data-loaded');
        el.removeAttribute('data-background-hash');
        el.removeAttribute('data-background-size');
        el.removeAttribute('data-background-transition');
        el.style.backgroundColor = '';

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
                el.style.background = data.background;
            }
        }

        // Create a hash for this combination of background settings.
        // This is used to determine when two slide backgrounds are
        // the same.
        if (data.background || data.backgroundColor || data.backgroundImage || data.backgroundVideo || data.backgroundIframe) {
            el.setAttribute('data-background-hash', data.background +
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
        if (data.backgroundSize) el.setAttribute('data-background-size', data.backgroundSize);
        if (data.backgroundColor) el.style.backgroundColor = data.backgroundColor;
        if (data.backgroundTransition) el.setAttribute('data-background-transition', data.backgroundTransition);

        if (slide.hasAttribute('data-preload')) el.setAttribute('data-preload', '');

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
            let computedBackgroundStyle = window.getComputedStyle(el);
            if (computedBackgroundStyle && computedBackgroundStyle.backgroundColor) {
                contrastColor = computedBackgroundStyle.backgroundColor;
            }
        }

        if (contrastColor) {
            let rgb = this.colorToRgb(contrastColor);

            // Ignore fully transparent backgrounds. Some browsers return
            // rgba(0,0,0,0) when reading the computed background color of
            // an element with no background
            if (rgb && rgb.a !== 0) {
                if (this.colorBrightness(contrastColor) < 128) {
                    slide.classList.add('has-dark-background');
                } else {
                    slide.classList.add('has-light-background');
                }
            }
        }

    }

    update(includeAll = false) {
        let currentSlide = this.deck.currentSlide;
        let indices = this.deck.getIndices();
        let currentBackground = null;
        // Reverse past/future classes when in RTL mode
        let horizontalPast = 'past',
            horizontalFuture = 'future';
        // Update the classes of all backgrounds to match the
        // states of their slides (past/present/future)
        Array.from(this.element.childNodes).forEach(function (backgroundh, h) {
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
            this.deck.slideContent.stopEmbeddedContent(this.previousBackground, {unloadIframes: !this.deck.slideContent.shouldPreload(this.previousBackground)});
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
            ['has-light-background', 'has-dark-background'].forEach(function (classToBubble) {
                if (currentSlide.classList.contains(classToBubble)) {
                    this.deck.deckElement.classList.add(classToBubble);
                } else {
                    this.deck.deckElement.classList.remove(classToBubble);
                }
            }, this);
        }
        // Allow the first background to apply without transition
        setTimeout(function () {
            this.element.classList.remove('no-transition');
        }.bind(this), 1);
    }

    updateParallax() {
        let indices = this.deck.getIndices();
        if (!this.deck.config.parallaxBackgroundImage) {
            return
        }
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

    colorBrightness(color) {
        if (typeof color === 'string') color = this.colorToRgb(color);
        if (color) {
            return (color.r * 299 + color.g * 587 + color.b * 114) / 1000;
        }
        return null;
    }


    colorToRgb(color) {
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
}

export {Backgrounds}
