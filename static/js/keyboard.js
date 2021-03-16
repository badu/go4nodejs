import { Deck } from './deck.js';
class Keyboard {

    constructor(deck) {
        if (!(deck instanceof Deck)) {
            throw new Error("expecting instance of Deck");
        }
        this.deck = deck;
        // A key:value map of keyboard keys and descriptions of
        // the actions they trigger
        this.shortcuts = {};
        // Holds custom key code mappings
        this.bindings = {};
        this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
        this.onDocumentKeyPress = this.onDocumentKeyPress.bind(this);
        this.addKeyBinding = this.addKeyBinding.bind(this);
        this.removeKeyBinding = this.removeKeyBinding.bind(this);
        this.registerKeyboardShortcut = this.registerKeyboardShortcut.bind(this);
    }

    configure(config, oldConfig) {
        if (config.navigationMode === 'linear') {
            this.shortcuts['&#8594;  ,  &#8595;  ,  SPACE  ,  N  ,  L  ,  J'] = 'Next slide';
            this.shortcuts['&#8592;  ,  &#8593;  ,  P  ,  H  ,  K'] = 'Previous slide';
        } else {
            this.shortcuts['N  ,  SPACE'] = 'Next slide';
            this.shortcuts['P'] = 'Previous slide';
            this.shortcuts['&#8592;  ,  H'] = 'Navigate left';
            this.shortcuts['&#8594;  ,  L'] = 'Navigate right';
            this.shortcuts['&#8593;  ,  K'] = 'Navigate up';
            this.shortcuts['&#8595;  ,  J'] = 'Navigate down';
        }
        this.shortcuts['Home  ,  Shift &#8592;'] = 'First slide';
        this.shortcuts['End  ,  Shift &#8594;'] = 'Last slide';
        this.shortcuts['B  ,  .'] = 'Pause';
        this.shortcuts['F'] = 'Fullscreen';
        this.shortcuts['ESC, O'] = 'Slide overview';
    }

    bind() {
        document.addEventListener('keydown', this.onDocumentKeyDown, false);
        document.addEventListener('keypress', this.onDocumentKeyPress, false);
    }

    unbind() {
        document.removeEventListener('keydown', this.onDocumentKeyDown, false);
        document.removeEventListener('keypress', this.onDocumentKeyPress, false);
    }

    addKeyBinding(binding, callback) {
        if (typeof binding === 'object' && binding.keyCode) {
            this.bindings[binding.keyCode] = {
                callback: callback,
                key: binding.key,
                description: binding.description
            };
        } else {
            this.bindings[binding] = {
                callback: callback,
                key: null,
                description: null
            };
        }
    }

    removeKeyBinding(keyCode) {
        delete this.bindings[keyCode];
    }

    triggerKey(keyCode) {
        this.onDocumentKeyDown({ keyCode });
    }

    registerKeyboardShortcut(key, value) {
        this.shortcuts[key] = value;
    }

    getShortcuts() {
        return this.shortcuts;
    }

    getBindings() {
        return this.bindings;
    }

    onDocumentKeyPress(event) {
        // Check if the pressed key is question mark
        if (event.shiftKey && event.charCode === 63) {
            this.deck.toggleHelp();
        }
    }

    enterFullscreen(element) {
        element = element || document.documentElement;
        // Check which implementation is available
        let requestMethod = element.requestFullscreen ||
            element.webkitRequestFullscreen ||
            element.webkitRequestFullScreen ||
            element.mozRequestFullScreen ||
            element.msRequestFullscreen;
        if (requestMethod) {
            requestMethod.apply(element);
        }
    }

    onDocumentKeyDown(event) {
        let config = this.deck.config;

        // If there's a condition specified and it returns false,
        // ignore this event
        if (typeof config.keyboardCondition === 'function' && config.keyboardCondition(event) === false) {
            return true;
        }

        // If keyboardCondition is set, only capture keyboard events
        // for embedded decks when they are focused
        if (config.keyboardCondition === 'focused' && !this.deck.focus.isFocused()) {
            return true;
        }

        // Shorthand
        let keyCode = event.keyCode;

        // Remember if auto-sliding was paused so we can toggle it
        let autoSlideWasPaused = !this.deck.isAutoSliding();

        this.deck.onUserInput(event);

        // Is there a focused element that could be using the keyboard?
        let activeElementIsCE = document.activeElement && document.activeElement.isContentEditable === true;
        let activeElementIsInput = document.activeElement && document.activeElement.tagName && /input|textarea/i.test(document.activeElement.tagName);
        let activeElementIsNotes = document.activeElement && document.activeElement.className && /speaker-notes/i.test(document.activeElement.className);

        // Whitelist specific modified + keycode combinations
        let prevSlideShortcut = event.shiftKey && event.keyCode === 32;
        let firstSlideShortcut = event.shiftKey && keyCode === 37;
        let lastSlideShortcut = event.shiftKey && keyCode === 39;

        // Prevent all other events when a modifier is pressed
        let unusedModifier = !prevSlideShortcut && !firstSlideShortcut && !lastSlideShortcut &&
            (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey);

        // Disregard the event if there's a focused element or a
        // keyboard modifier key is present
        if (activeElementIsCE || activeElementIsInput || activeElementIsNotes || unusedModifier) return;

        // While paused only allow resume keyboard events; 'b', 'v', '.'
        let resumeKeyCodes = [66, 86, 190, 191];
        let key;

        // Custom key bindings for togglePause should be able to resume
        if (typeof config.keyboard === 'object') {
            for (key in config.keyboard) {
                if (config.keyboard[key] === 'togglePause') {
                    resumeKeyCodes.push(parseInt(key, 10));
                }
            }
        }

        if (this.deck.isPaused() && resumeKeyCodes.indexOf(keyCode) === -1) {
            return false;
        }

        // Use linear navigation if we're configured to OR if
        // the presentation is one-dimensional
        let useLinearMode = config.navigationMode === 'linear' || !this.deck.hasHorizontalSlides() || !this.deck.hasVerticalSlides();

        let triggered = false;

        // 1. User defined key bindings
        if (typeof config.keyboard === 'object') {
            for (key in config.keyboard) {
                // Check if this binding matches the pressed key
                if (parseInt(key, 10) === keyCode) {
                    let value = config.keyboard[key];
                    // Callback function
                    if (typeof value === 'function') {
                        value.apply(null, [event]);
                    }
                    // String shortcuts to  API
                    else if (typeof value === 'string' && typeof this.deck[value] === 'function') {
                        this.deck[value].call();
                    }
                    triggered = true;
                }
            }
        }

        // 2. Registered custom key bindings
        if (triggered === false) {
            for (key in this.bindings) {
                // Check if this binding matches the pressed key
                if (parseInt(key, 10) === keyCode) {
                    let action = this.bindings[key].callback;
                    // Callback function
                    if (typeof action === 'function') {
                        action.apply(null, [event]);
                    }
                    // String shortcuts to  API
                    else if (typeof action === 'string' && typeof this.deck[action] === 'function') {
                        this.deck[action].call();
                    }
                    triggered = true;
                }
            }
        }

        // 3. System defined key bindings
        if (triggered === false) {
            // Assume true and try to prove false
            triggered = true;
            // P, PAGE UP
            if (keyCode === 80 || keyCode === 33) {
                this.deck.navigatePrev();
            }
            // N, PAGE DOWN
            else if (keyCode === 78 || keyCode === 34) {
                this.deck.navigateNext();
            }
            // H, LEFT
            else if (keyCode === 72 || keyCode === 37) {
                if (firstSlideShortcut) {
                    this.deck.slide(0);
                } else if (!this.deck.overview.isActive() && useLinearMode) {
                    this.deck.navigatePrev();
                } else {
                    this.deck.navigateLeft();
                }
            }
            // L, RIGHT
            else if (keyCode === 76 || keyCode === 39) {
                if (lastSlideShortcut) {
                    this.deck.slide(Number.MAX_VALUE);
                } else if (!this.deck.overview.isActive() && useLinearMode) {
                    this.deck.navigateNext();
                } else {
                    this.deck.navigateRight();
                }
            }
            // K, UP
            else if (keyCode === 75 || keyCode === 38) {
                if (!this.deck.overview.isActive() && useLinearMode) {
                    this.deck.navigatePrev();
                } else {
                    this.deck.navigateUp();
                }
            }
            // J, DOWN
            else if (keyCode === 74 || keyCode === 40) {
                if (!this.deck.overview.isActive() && useLinearMode) {
                    this.deck.navigateNext();
                } else {
                    this.deck.navigateDown();
                }
            }
            // HOME
            else if (keyCode === 36) {
                this.deck.slide(0);
            }
            // END
            else if (keyCode === 35) {
                this.deck.slide(Number.MAX_VALUE);
            }
            // SPACE
            else if (keyCode === 32) {
                if (this.deck.overview.isActive()) {
                    this.deck.overview.deactivate();
                }
                if (event.shiftKey) {
                    this.deck.navigatePrev();
                } else {
                    this.deck.navigateNext();
                }
            }
            // TWO-SPOT, SEMICOLON, B, V, PERIOD, LOGITECH PRESENTER TOOLS "BLACK SCREEN" BUTTON
            else if (keyCode === 58 || keyCode === 59 || keyCode === 66 || keyCode === 86 || keyCode === 190 || keyCode === 191) {
                this.deck.togglePause();
            }
            // F
            else if (keyCode === 70) {
                this.enterFullscreen(config.embedded ? this.deck.dom.viewport : document.documentElement);
            }
            // A
            else if (keyCode === 65) {
                if (config.autoSlideStoppable) {
                    this.deck.toggleAutoSlide(autoSlideWasPaused);
                }
            } else {
                triggered = false;
            }

        }

        // If the input resulted in a triggered action we should prevent
        // the browsers default behavior
        if (triggered) {
            event.preventDefault && event.preventDefault();
        }
        // ESC or O key
        else if (keyCode === 27 || keyCode === 79) {
            if (this.deck.closeOverlay() === false) {
                this.deck.overview.toggle();
            }

            event.preventDefault && event.preventDefault();
        }
        // If auto-sliding is enabled we need to cue up
        // another timeout
        this.deck.cueAutoSlide();
    }
}
export { Keyboard }