import {Deck} from './deck.js';
import {closest} from './utils.js';

class Focus {
    constructor(deck) {
        if (!(deck instanceof Deck)) {
            throw new Error("expecting instance of Deck");
        }
        this.deck = deck;
        this.onRevealPointerDown = this.onRevealPointerDown.bind(this);
        this.onDocumentPointerDown = this.onDocumentPointerDown.bind(this);
        this.isFocused = this.isFocused.bind(this);
    }

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
        if (this.state !== 'focus') {
            this.deck.deckElement.classList.add('focused');
            document.addEventListener('pointerdown', this.onDocumentPointerDown, false);
        }
        this.state = 'focus';
    }

    blur() {
        if (this.state !== 'blur') {
            this.deck.deckElement.classList.remove('focused');
            document.removeEventListener('pointerdown', this.onDocumentPointerDown, false);
        }
        this.state = 'blur';
    }

    isFocused() {
        return this.state === 'focus';
    }

    onRevealPointerDown(event) {
        this.focus();
    }

    onDocumentPointerDown(event) {
        if (event === undefined) {
            console.error('event is undefined, but it should NOT be', new Error().stack);
            return
        }
        let el = closest(event.target, '.reveal');
        if (!el || el !== this.deck.deckElement) {
            this.blur();
        }
    }
}

export {Focus}
