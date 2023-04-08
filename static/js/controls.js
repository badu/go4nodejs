import {queryAll} from './utils.js';
import {Deck} from './deck.js';

class Controls {
    constructor(deck) {
        if (!(deck instanceof Deck)) {
            throw new Error("expecting instance of Deck");
        }
        this.deck = deck;
        this.isAndroid = /android/gi.test(navigator.userAgent);
        this.onNavigateLeftClicked = this.onNavigateLeftClicked.bind(this);
        this.onNavigateRightClicked = this.onNavigateRightClicked.bind(this);
        this.onNavigateUpClicked = this.onNavigateUpClicked.bind(this);
        this.onNavigateDownClicked = this.onNavigateDownClicked.bind(this);
        this.onNavigatePrevClicked = this.onNavigatePrevClicked.bind(this);
        this.onNavigateNextClicked = this.onNavigateNextClicked.bind(this);
        this.deck.on('slided', function (event) {
            this.update();
        }.bind(this));
        this.deck.on('synced', function (event) {
            this.update();
        }.bind(this));
    }

    render(el) {
        this.element = document.createElement('aside');
        el.appendChild(this.element);

        this.element.className = 'controls';
        this.element.innerHTML =
            `<button class="navigate-left" aria-label="'previous slide'"><div class="controls-arrow"></div></button>
			<button class="navigate-right" aria-label="'next slide'"><div class="controls-arrow"></div></button>
			<button class="navigate-up" aria-label="above slide"><div class="controls-arrow"></div></button>
			<button class="navigate-down" aria-label="below slide"><div class="controls-arrow"></div></button>`;


        // There can be multiple instances of controls throughout the page
        this.controlsLeft = queryAll(el, '.navigate-left');
        this.controlsRight = queryAll(el, '.navigate-right');
        this.controlsUp = queryAll(el, '.navigate-up');
        this.controlsDown = queryAll(el, '.navigate-down');
        this.controlsPrev = queryAll(el, '.navigate-prev');
        this.controlsNext = queryAll(el, '.navigate-next');

        // The left, right and down arrows in the standard  controls
        this.controlsRightArrow = this.element.querySelector('.navigate-right');
        this.controlsLeftArrow = this.element.querySelector('.navigate-left');
        this.controlsDownArrow = this.element.querySelector('.navigate-down');
    }

    hide() {
        this.element.style.display = 'none';
    }

    show() {
        this.element.style.display = 'block';
    }

    configure(config) {
        this.element.style.display = config.controls ? 'block' : 'none';
        this.element.setAttribute('data-controls-layout', config.controlsLayout);
        this.element.setAttribute('data-controls-back-arrows', config.controlsBackArrows);
    }

    bind() {
        this.controlsLeft.forEach(function (el) {
            el.addEventListener('touchstart', this.onNavigateLeftClicked, {passive: true, capture: false})
        }, this);
        this.controlsRight.forEach(function (el) {
            el.addEventListener('touchstart', this.onNavigateRightClicked, {passive: true, capture: false})
        }, this);
        this.controlsUp.forEach(function (el) {
            el.addEventListener('touchstart', this.onNavigateUpClicked, {passive: true, capture: false})
        }, this);
        this.controlsDown.forEach(function (el) {
            el.addEventListener('touchstart', this.onNavigateDownClicked, {passive: true, capture: false})
        }, this);
        this.controlsPrev.forEach(function (el) {
            el.addEventListener('touchstart', this.onNavigatePrevClicked, {passive: true, capture: false})
        }, this);
        this.controlsNext.forEach(function (el) {
            el.addEventListener('touchstart', this.onNavigateNextClicked, {passive: true, capture: false})
        }, this);
        if (!this.isAndroid) {
            this.controlsLeft.forEach(function (el) {
                el.addEventListener('click', this.onNavigateLeftClicked, false)
            }, this);
            this.controlsRight.forEach(function (el) {
                el.addEventListener('click', this.onNavigateRightClicked, false)
            }, this);
            this.controlsUp.forEach(function (el) {
                el.addEventListener('click', this.onNavigateUpClicked, false)
            }, this);
            this.controlsDown.forEach(function (el) {
                el.addEventListener('click', this.onNavigateDownClicked, false)
            }, this);
            this.controlsPrev.forEach(function (el) {
                el.addEventListener('click', this.onNavigatePrevClicked, false)
            }, this);
            this.controlsNext.forEach(function (el) {
                el.addEventListener('click', this.onNavigateNextClicked, false)
            }, this);
        }
    }

    unbind() {
        this.controlsLeft.forEach(function (el) {
            el.removeEventListener('touchstart', this.onNavigateLeftClicked, {passive: true, capture: false})
        }, this);
        this.controlsRight.forEach(function (el) {
            el.removeEventListener('touchstart', this.onNavigateRightClicked, {passive: true, capture: false})
        }, this);
        this.controlsUp.forEach(function (el) {
            el.removeEventListener('touchstart', this.onNavigateUpClicked, {passive: true, capture: false})
        }, this);
        this.controlsDown.forEach(function (el) {
            el.removeEventListener('touchstart', this.onNavigateDownClicked, {passive: true, capture: false})
        }, this);
        this.controlsPrev.forEach(function (el) {
            el.removeEventListener('touchstart', this.onNavigatePrevClicked, {passive: true, capture: false})
        }, this);
        this.controlsNext.forEach(function (el) {
            el.removeEventListener('touchstart', this.onNavigateNextClicked, {passive: true, capture: false})
        }, this);
        if (!this.isAndroid) {
            this.controlsLeft.forEach(function (el) {
                el.removeEventListener('click', this.onNavigateLeftClicked, false)
            }, this);
            this.controlsRight.forEach(function (el) {
                el.removeEventListener('click', this.onNavigateRightClicked, false)
            }, this);
            this.controlsUp.forEach(function (el) {
                el.removeEventListener('click', this.onNavigateUpClicked, false)
            }, this);
            this.controlsDown.forEach(function (el) {
                el.removeEventListener('click', this.onNavigateDownClicked, false)
            }, this);
            this.controlsPrev.forEach(function (el) {
                el.removeEventListener('click', this.onNavigatePrevClicked, false)
            }, this);
            this.controlsNext.forEach(function (el) {
                el.removeEventListener('click', this.onNavigateNextClicked, false)
            }, this);
        }
    }

    update() {
        let routes = this.deck.availableRoutes();
        // Remove the 'enabled' class from all directions
        [...this.controlsLeft, ...this.controlsRight, ...this.controlsUp, ...this.controlsDown, ...this.controlsPrev, ...this.controlsNext].forEach(function (node) {
            node.classList.remove('enabled', 'fragmented');
            // Set 'disabled' attribute on all directions
            node.setAttribute('disabled', 'disabled');
        });

        // Add the 'enabled' class to the available routes; remove 'disabled' attribute to enable buttons
        if (routes.left) this.controlsLeft.forEach(function (el) {
            el.classList.add('enabled');
            el.removeAttribute('disabled');
        });
        if (routes.right) this.controlsRight.forEach(function (el) {
            el.classList.add('enabled');
            el.removeAttribute('disabled');
        });
        if (routes.up) this.controlsUp.forEach(function (el) {
            el.classList.add('enabled');
            el.removeAttribute('disabled');
        });
        if (routes.down) this.controlsDown.forEach(function (el) {
            el.classList.add('enabled');
            el.removeAttribute('disabled');
        });

        // Prev/next buttons
        if (routes.left || routes.up) this.controlsPrev.forEach(function (el) {
            el.classList.add('enabled');
            el.removeAttribute('disabled');
        });
        if (routes.right || routes.down) this.controlsNext.forEach(function (el) {
            el.classList.add('enabled');
            el.removeAttribute('disabled');
        });

        // Highlight fragment directions
        let currentSlide = this.deck.currentSlide;
        if (currentSlide) {
            let fragmentsRoutes = this.deck.fragments.availableRoutes();
            // Always apply fragment decorator to prev/next buttons
            if (fragmentsRoutes.prev) this.controlsPrev.forEach(function (el) {
                el.classList.add('fragmented', 'enabled');
                el.removeAttribute('disabled');
            });
            if (fragmentsRoutes.next) this.controlsNext.forEach(function (el) {
                el.classList.add('fragmented', 'enabled');
                el.removeAttribute('disabled');
            });
            // Apply fragment decorators to directional buttons based on
            // what slide axis they are in
            if (this.deck.isVerticalSlide(currentSlide)) {
                if (fragmentsRoutes.prev) this.controlsUp.forEach(function (el) {
                    el.classList.add('fragmented', 'enabled');
                    el.removeAttribute('disabled');
                });
                if (fragmentsRoutes.next) this.controlsDown.forEach(function (el) {
                    el.classList.add('fragmented', 'enabled');
                    el.removeAttribute('disabled');
                });
            } else {
                if (fragmentsRoutes.prev) this.controlsLeft.forEach(function (el) {
                    el.classList.add('fragmented', 'enabled');
                    el.removeAttribute('disabled');
                });
                if (fragmentsRoutes.next) this.controlsRight.forEach(function (el) {
                    el.classList.add('fragmented', 'enabled');
                    el.removeAttribute('disabled');
                });
            }
        }

        if (this.deck.config.controlsTutorial) {
            let indices = this.deck.getIndices();
            // Highlight control arrows with an animation to ensure
            // that the viewer knows how to navigate
            if (!this.deck.navigationHistory.hasNavigatedVertically && routes.down) {
                this.controlsDownArrow.classList.add('highlight');
            } else {
                this.controlsDownArrow.classList.remove('highlight');
                if (!this.deck.navigationHistory.hasNavigatedHorizontally && routes.right && indices.v === 0) {
                    this.controlsRightArrow.classList.add('highlight');
                } else {
                    this.controlsRightArrow.classList.remove('highlight');
                }
            }
        }
    }

    onNavigateLeftClicked(event) {
        event.preventDefault();
        this.deck.onUserInput();
        if (this.deck.config.navigationMode === 'linear') {
            this.deck.navigatePrev();
        } else {
            this.deck.navigateLeft();
        }
    }

    onNavigateRightClicked(event) {
        event.preventDefault();
        this.deck.onUserInput();
        if (this.deck.config.navigationMode === 'linear') {
            this.deck.navigateNext();
        } else {
            this.deck.navigateRight();
        }
    }

    onNavigateUpClicked(event) {
        event.preventDefault();
        this.deck.onUserInput();
        this.deck.navigateUp();
    }

    onNavigateDownClicked(event) {
        event.preventDefault();
        this.deck.onUserInput();
        this.deck.navigateDown();
    }

    onNavigatePrevClicked(event) {
        event.preventDefault();
        this.deck.onUserInput();
        this.deck.navigatePrev();
    }

    onNavigateNextClicked(event) {
        event.preventDefault();
        this.deck.onUserInput();
        this.deck.navigateNext();
    }
}

export {Controls};
