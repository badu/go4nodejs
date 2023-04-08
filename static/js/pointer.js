import {Deck} from './deck.js';

class Pointer {

    constructor(deck) {
        if (!(deck instanceof Deck)) {
            throw new Error("expecting instance of Deck");
        }
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

    showCursor() {
        if (this.cursorHidden) {
            this.cursorHidden = false;
            this.deck.deckElement.style.cursor = '';
        }
    }

    hideCursor() {
        if (this.cursorHidden === false) {
            this.cursorHidden = true;
            this.deck.deckElement.style.cursor = 'none';
        }
    }

    onDocumentCursorActive(event) {
        this.showCursor();
        clearTimeout(this.cursorInactiveTimeout);
        this.cursorInactiveTimeout = setTimeout(this.hideCursor.bind(this), this.deck.config.hideCursorTime);
    }

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

export {Pointer}
