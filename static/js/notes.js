import { Deck } from './deck.js';
class Notes {

    constructor(deck) {
        if (!(deck instanceof Deck)) {
            throw new Error("expecting instance of Deck");
        }
        this.deck = deck;
        this.getSlideNotes = this.getSlideNotes.bind(this);
        this.isSpeakerNotesWindow = this.isSpeakerNotesWindow.bind(this);
        this.deck.on('slided', function(event) {
            this.update();
        }.bind(this));
        this.deck.on('synced', function(event) {
            this.update();
            this.updateVisibility();
        }.bind(this));
        this.deck.on('syncSlide', function(event) {
            this.update();
        }.bind(this))
    }

    render() {
        this.element = document.createElement('div');
        this.element.className = 'speaker-notes';
        this.element.setAttribute('data-prevent-swipe', '');
        this.element.setAttribute('tabindex', '0');
        this.deck.deckElement.appendChild(this.element);
    }

    configure(config, oldConfig) {
        if (config.showNotes) {
            this.element.setAttribute('data-layout', typeof config.showNotes === 'string' ? config.showNotes : 'inline');
        }
    }

    update() {
        if (this.deck.config.showNotes && this.element && this.deck.currentSlide && !this.deck.print.isPrintingPDF()) {
            this.element.innerHTML = this.notes.getSlideNotes() || '<span class="notes-placeholder">No notes on this slide.</span>';
        }
    }

    updateVisibility() {
        if (this.deck.config.showNotes && this.hasNotes() && !this.deck.print.isPrintingPDF()) {
            this.deck.deckElement.classList.add('show-notes');
        } else {
            this.deck.deckElement.classList.remove('show-notes');
        }
    }

    hasNotes() {
        return this.deck.dom.slides.querySelectorAll('[data-notes], aside.notes').length > 0;
    }

    isSpeakerNotesWindow() {
        return !!window.location.search.match(/receiver/gi);
    }

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
export { Notes };