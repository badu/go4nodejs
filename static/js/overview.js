import {queryAll, SLIDES_SELECTOR, transformElement} from './utils.js';
import {Deck} from './deck.js';

class Overview {
    constructor(deck) {
        if (!(deck instanceof Deck)) {
            throw new Error("expecting instance of Deck");
        }
        this.deck = deck;
        this.active = false;
        this.onSlideClicked = this.onSlideClicked.bind(this);
        this.toggle = this.toggle.bind(this);
        this.isActive = this.isActive.bind(this);
    }

    activate() {
        // Only proceed if enabled in config
        if (!this.deck.config.overview) {
            return;
        }
        if (this.isActive()) {
            return;
        }

        this.active = true;
        this.deck.deckElement.classList.add('overview');
        // Don't auto-slide while in overview mode
        this.deck.cancelAutoSlide();
        // Move the backgrounds element into the slide container to
        // that the same scaling is applied
        this.deck.dom.slides.appendChild(this.deck.backgrounds.element);
        // Clicking on an overview slide navigates to it
        queryAll(this.deck.deckElement, SLIDES_SELECTOR).forEach(function (slide) {
            if (!slide.classList.contains('stack')) {
                slide.addEventListener('click', this.onSlideClicked, true);
            }
        }, this);
        // Calculate slide sizes
        const margin = 70;
        const slideSize = this.deck.getComputedSlideSize();
        this.overviewSlideWidth = slideSize.width + margin;
        this.overviewSlideHeight = slideSize.height + margin;
        this.deck.updateSlidesVisibility();
        this.layout();
        this.update();
        this.deck.layout();
        const indices = this.deck.getIndices();
        // Notify observers of the overview showing
        this.deck.dispatchEvent({
            type: 'overviewshown',
            data: {
                'indexh': indices.h,
                'indexv': indices.v,
                'currentSlide': this.deck.currentSlide
            }
        });
    }

    layout() {

        // Layout slides
        this.deck.getHorizontalSlides().forEach(function (hslide, h) {
            hslide.setAttribute('data-index-h', h);
            transformElement(hslide, 'translate3d(' + (h * this.overviewSlideWidth) + 'px, 0, 0)');
            if (hslide.classList.contains('stack')) {
                queryAll(hslide, 'section').forEach(function (vslide, v) {
                    vslide.setAttribute('data-index-h', h);
                    vslide.setAttribute('data-index-v', v);
                    transformElement(vslide, 'translate3d(0, ' + (v * this.overviewSlideHeight) + 'px, 0)');
                }, this);
            }
        }, this);

        // Layout slide backgrounds
        Array.from(this.deck.backgrounds.element.childNodes).forEach(function (hbackground, h) {
            transformElement(hbackground, 'translate3d(' + (h * this.overviewSlideWidth) + 'px, 0, 0)');
            queryAll(hbackground, '.slide-background').forEach(function (vbackground, v) {
                transformElement(vbackground, 'translate3d(0, ' + (v * this.overviewSlideHeight) + 'px, 0)');
            }, this);
        }, this);
    }

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

    deactivate() {
        // Only proceed if enabled in config
        if (!this.deck.config.overview) {
            return;
        }
        this.active = false;
        this.deck.deckElement.classList.remove('overview');
        // Temporarily add a class so that transitions can do different things
        // depending on whether they are exiting/entering overview, or just
        // moving from slide to slide
        this.deck.deckElement.classList.add('overview-deactivating');
        setTimeout(function () {
            this.deck.deckElement.classList.remove('overview-deactivating');
        }.bind(this), 1);
        // Move the background element back out
        this.deck.deckElement.appendChild(this.deck.backgrounds.element);
        // Clean up changes made to slides
        queryAll(this.deck.deckElement, SLIDES_SELECTOR).forEach(function (slide) {
            transformElement(slide, '');
            slide.removeEventListener('click', this.onSlideClicked, true);
        }, this);
        // Clean up changes made to backgrounds
        queryAll(this.deck.backgrounds.element, '.slide-background').forEach(function (background) {
            transformElement(background, '');
        });
        this.deck.transformSlides({overview: ''});
        const indices = this.deck.getIndices();
        this.deck.slide('overview', indices.h, indices.v);
        this.deck.layout();
        this.deck.cueAutoSlide();
        // Notify observers of the overview hiding
        this.deck.dispatchEvent({
            type: 'overviewhidden',
            data: {
                'indexh': indices.h,
                'indexv': indices.v,
                'currentSlide': this.deck.currentSlide
            }
        });
    }

    toggle(override) {
        if (typeof override === 'boolean') {
            override ? this.activate() : this.deactivate();
        } else {
            this.isActive() ? this.deactivate() : this.activate();
        }
    }

    isActive() {
        return this.active;
    }

    onSlideClicked(event) {
        if (!this.isActive()) {
            return
        }

        event.preventDefault();
        let el = event.target;
        while (el && !el.nodeName.match(/section/gi)) {
            el = el.parentNode;
        }
        if (el && !el.classList.contains('disabled')) {
            this.deactivate();
            if (el.nodeName.match(/section/gi)) {
                let h = parseInt(el.getAttribute('data-index-h'), 10),
                    v = parseInt(el.getAttribute('data-index-v'), 10);

                this.deck.slide('overview', h, v);
            }
        }
    }
}

export {Overview};
