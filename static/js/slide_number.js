import { Deck } from './deck.js';
class SlideNumber {
    constructor(deck) {
        if (!(deck instanceof Deck)) {
            throw new Error("expecting instance of Deck");
        }
        this.deck = deck;
        this.deck.on('slided', function(event) {
            this.update();
        }.bind(this));
    }

    render() {
        this.element = document.createElement('div');
        this.element.className = 'slide-number';
        this.deck.deckElement.appendChild(this.element);
    }

    configure(config, oldConfig) {
        let slideNumberDisplay = 'none';
        if (config.slideNumber ) {
            if (config.showSlideNumber === 'all') {
                slideNumberDisplay = 'block';
            } else if (config.showSlideNumber === 'speaker' && this.deck.notes.isSpeakerNotesWindow()) {
                slideNumberDisplay = 'block';
            }
        }
        this.element.style.display = slideNumberDisplay;
    }

    update() {
        // Update slide number if enabled
        if (this.deck.config.slideNumber && this.element) {
            this.element.innerHTML = this.getSlideNumber();
        }
    }

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

export { SlideNumber }
