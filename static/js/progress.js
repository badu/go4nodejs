import {Deck} from './deck.js';

class Progress {

    constructor(deck) {
        if (!(deck instanceof Deck)) {
            throw new Error("expecting instance of Deck");
        }
        this.deck = deck;
        this.onProgressClicked = this.onProgressClicked.bind(this);
        this.deck.on('slided', function (event) {
            this.update();
        }.bind(this));
        this.deck.on('synced', function (event) {
            this.update();
        }.bind(this));
    }

    render() {
        this.element = document.createElement('div');
        this.element.className = 'progress';
        this.deck.deckElement.appendChild(this.element);
        this.bar = document.createElement('span');
        this.element.appendChild(this.bar);
    }

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

    update() {
        if (this.deck.config.progress && this.bar) { // Update progress if enabled
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

    onProgressClicked(event) {
        this.deck.onUserInput(event);
        event.preventDefault();
        let slidesTotal = this.deck.getHorizontalSlides().length;
        let slideIndex = Math.floor((event.clientX / this.getMaxWidth()) * slidesTotal);
        this.deck.slide('progress', slideIndex);
    }
}

export {Progress}
