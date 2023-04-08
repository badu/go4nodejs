import {Deck} from './deck.js';

const SWIPE_THRESHOLD = 40;

class Touch {

    constructor(deck) {
        if (!(deck instanceof Deck)) {
            throw new Error("expecting instance of Deck");
        }
        this.deck = deck;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchStartCount = 0;
        this.touchCaptured = false;
        this.isAndroid = /android/gi.test(navigator.userAgent);
        this.onPointerDown = this.onPointerDown.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
        this.onPointerUp = this.onPointerUp.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
    }

    bind() {
        let el = this.deck.deckElement;
        if ('onpointerdown' in window) { // Use W3C pointer events
            el.addEventListener('pointerdown', this.onPointerDown, false);
            el.addEventListener('pointermove', this.onPointerMove, false);
            el.addEventListener('pointerup', this.onPointerUp, false);
        } else if (window.navigator.msPointerEnabled) { // IE 10 uses prefixed version of pointer events
            el.addEventListener('MSPointerDown', this.onPointerDown, false);
            el.addEventListener('MSPointerMove', this.onPointerMove, false);
            el.addEventListener('MSPointerUp', this.onPointerUp, false);
        } else { // Fall back to touch events
            el.addEventListener('touchstart', this.onTouchStart, false);
            el.addEventListener('touchmove', this.onTouchMove, false);
            el.addEventListener('touchend', this.onTouchEnd, false);
        }
    }

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

    isSwipePrevented(target) {
        while (target && typeof target.hasAttribute === 'function') {
            if (target.hasAttribute('data-prevent-swipe')) return true;
            target = target.parentNode;
        }
        return false;
    }

    onTouchStart(event) {
        if (this.isSwipePrevented(event.target)) return true;
        this.touchStartX = event.touches[0].clientX;
        this.touchStartY = event.touches[0].clientY;
        this.touchStartCount = event.touches.length;
    }

    onTouchMove(event) {
        if (this.isSwipePrevented(event.target)) return true;
        let config = this.deck.config;
        if (!this.touchCaptured) { // Each touch should only trigger one action
            this.deck.onUserInput(event);
            let currentX = event.touches[0].clientX;
            let currentY = event.touches[0].clientY;
            if (event.touches.length === 1 && this.touchStartCount !== 2) { // There was only one touch point, look for a swipe
                let availableRoutes = this.deck.availableRoutes({includeFragments: true});
                let deltaX = currentX - this.touchStartX,
                    deltaY = currentY - this.touchStartY;
                if (deltaX > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
                    this.touchCaptured = true;
                    if (config.navigationMode === 'linear') {
                        this.deck.navigatePrev();
                    } else {
                        this.deck.navigateLeft();
                    }
                } else if (deltaX < -SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
                    this.touchCaptured = true;
                    if (config.navigationMode === 'linear') {
                        this.deck.navigateNext();
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
                if (config.embedded) { // If we're embedded, only block touch events if they have triggered an action
                    if (this.touchCaptured || this.deck.isVerticalSlide()) {
                        event.preventDefault();
                    }
                } else { // Not embedded? Block them all to avoid needless tossing around of the viewport in iOS
                    event.preventDefault();
                }

            }
        } else if (this.isAndroid) { // There's a bug with swiping on some Android devices unless the default action is always prevented
            event.preventDefault();
        }
    }

    onTouchEnd(event) {
        this.touchCaptured = false;

    }

    onPointerDown(event) {
        if (event.pointerType === event.MSPOINTER_TYPE_TOUCH || event.pointerType === "touch") {
            event.touches = [{clientX: event.clientX, clientY: event.clientY}];
            this.onTouchStart(event);
        }
    }

    onPointerMove(event) {
        if (event.pointerType === event.MSPOINTER_TYPE_TOUCH || event.pointerType === "touch") {
            event.touches = [{clientX: event.clientX, clientY: event.clientY}];
            this.onTouchMove(event);
        }
    }

    onPointerUp(event) {
        if (event.pointerType === event.MSPOINTER_TYPE_TOUCH || event.pointerType === "touch") {
            event.touches = [{clientX: event.clientX, clientY: event.clientY}];
            this.onTouchEnd(event);
        }
    }
}

export {Touch}
