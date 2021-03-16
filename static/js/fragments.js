import { queryAll } from './utils.js';
import { Deck } from './deck.js';
class Fragments {
    constructor(deck) {
        if (!(deck instanceof Deck)) {
            throw new Error("expecting instance of Deck");
        }
        this.deck = deck;

        this.sync = this.sync.bind(this);
        this.goto = this.goto.bind(this);
        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);
        this.availableRoutes = this.availableRoutes.bind(this);
        this.deck.on('slided', function(event) {
            this.update();
        }.bind(this));
        this.deck.on('synced', function(event) {
            this.sortAll();
        }.bind(this));
        this.deck.on('syncSlide', function(event) {
            this.sync(event.data);
        }.bind(this))
    }

    configure(config, oldConfig) {
        if (config.fragments === false) {
            this.disable();
        } else if (oldConfig.fragments === false) {
            this.enable();
        }
    }

    disable() {
        queryAll(this.deck.dom.slides, '.fragment').forEach(function(element) {
            element.classList.add('visible');
            element.classList.remove('current-fragment');
        });
    }

    enable() {
        queryAll(this.deck.dom.slides, '.fragment').forEach(function(element) {
            element.classList.remove('visible');
            element.classList.remove('current-fragment');
        });
    }

    availableRoutes() {
        let currentSlide = this.deck.currentSlide;
        if (currentSlide && this.deck.config.fragments) {
            let fragments = currentSlide.querySelectorAll('.fragment:not(.disabled)');
            let hiddenFragments = currentSlide.querySelectorAll('.fragment:not(.disabled):not(.visible)');
            return {
                prev: fragments.length - hiddenFragments.length > 0,
                next: !!hiddenFragments.length
            };
        } else {
            return { prev: false, next: false };
        }
    }

    sort(fragments, grouped = false) {
        fragments = Array.from(fragments);
        let ordered = [],
            unordered = [],
            sorted = [];

        // Group ordered and unordered elements
        fragments.forEach(function(fragment) {
            if (fragment.hasAttribute('data-fragment-index')) {
                let index = parseInt(fragment.getAttribute('data-fragment-index'), 10);
                if (!ordered[index]) {
                    ordered[index] = [];
                }
                ordered[index].push(fragment);
            } else {
                unordered.push([fragment]);
            }
        });

        // Append fragments without explicit indices in their
        // DOM order
        ordered = ordered.concat(unordered);

        // Manually count the index up per group to ensure there
        // are no gaps
        let index = 0;

        // Push all fragments in their sorted order to an array,
        // this flattens the groups
        ordered.forEach(function(group) {
            group.forEach(function(fragment) {
                sorted.push(fragment);
                fragment.setAttribute('data-fragment-index', index);
            });
            index++;
        });

        return grouped === true ? ordered : sorted;

    }

    sortAll() {
        this.deck.getHorizontalSlides().forEach(function(horizontalSlide) {
            let verticalSlides = queryAll(horizontalSlide, 'section');
            verticalSlides.forEach(function(verticalSlide, y) {
                this.sort(verticalSlide.querySelectorAll('.fragment'));
            }, this);
            if (verticalSlides.length === 0) this.sort(horizontalSlide.querySelectorAll('.fragment'));
        }, this);
    }

    update(index, fragments) {
        let changedFragments = {
            shown: [],
            hidden: []
        };
        let currentSlide = this.deck.currentSlide;
        if (currentSlide && this.deck.config.fragments) {
            fragments = fragments || this.sort(currentSlide.querySelectorAll('.fragment'));
            if (fragments.length) {
                let maxIndex = 0;
                if (typeof index !== 'number') {
                    let currentFragment = this.sort(currentSlide.querySelectorAll('.fragment.visible')).pop();
                    if (currentFragment) {
                        index = parseInt(currentFragment.getAttribute('data-fragment-index') || 0, 10);
                    }
                }
                Array.from(fragments).forEach(function(el, i) {
                    if (el.hasAttribute('data-fragment-index')) {
                        i = parseInt(el.getAttribute('data-fragment-index'), 10);
                    }
                    maxIndex = Math.max(maxIndex, i);
                    // Visible fragments
                    if (i <= index) {
                        let wasVisible = el.classList.contains('visible')
                        el.classList.add('visible');
                        el.classList.remove('current-fragment');
                        if (i === index) {
                            // Announce the fragments one by one to the Screen Reader
                            this.deck.announceStatus(this.deck.getStatusText(el));
                            el.classList.add('current-fragment');
                            this.deck.slideContent.startEmbeddedContent(el);
                        }
                        if (!wasVisible) {
                            changedFragments.shown.push(el)
                            this.deck.dispatchEvent({
                                target: el,
                                type: 'visible',
                                bubbles: false
                            });
                        }
                    }
                    // Hidden fragments
                    else {
                        let wasVisible = el.classList.contains('visible')
                        el.classList.remove('visible');
                        el.classList.remove('current-fragment');

                        if (wasVisible) {
                            changedFragments.hidden.push(el);
                            this.deck.dispatchEvent({
                                target: el,
                                type: 'hidden',
                                bubbles: false
                            });
                        }
                    }
                }, this);
                // Write the current fragment index to the slide <section>.
                // This can be used by end users to apply styles based on
                // the current fragment index.
                index = typeof index === 'number' ? index : -1;
                index = Math.max(Math.min(index, maxIndex), -1);
                currentSlide.setAttribute('data-fragment', index);
            }
        }
        return changedFragments;
    }

    sync(slide = this.deck.currentSlide) {
        return this.sort(slide.querySelectorAll('.fragment'));
    }

    goto(index, offset = 0) {
        let currentSlide = this.deck.currentSlide;
        if (currentSlide && this.deck.config.fragments) {
            let fragments = this.sort(currentSlide.querySelectorAll('.fragment:not(.disabled)'));
            if (fragments.length) {
                // If no index is specified, find the current
                if (typeof index !== 'number') {
                    let lastVisibleFragment = this.sort(currentSlide.querySelectorAll('.fragment:not(.disabled).visible')).pop();
                    if (lastVisibleFragment) {
                        index = parseInt(lastVisibleFragment.getAttribute('data-fragment-index') || 0, 10);
                    } else {
                        index = -1;
                    }
                }

                // Apply the offset if there is one
                index += offset;

                let changedFragments = this.update(index, fragments);

                if (changedFragments.hidden.length) {
                    this.deck.dispatchEvent({
                        type: 'fragmenthidden',
                        data: {
                            fragment: changedFragments.hidden[0],
                            fragments: changedFragments.hidden
                        }
                    });
                }

                if (changedFragments.shown.length) {
                    this.deck.dispatchEvent({
                        type: 'fragmentshown',
                        data: {
                            fragment: changedFragments.shown[0],
                            fragments: changedFragments.shown
                        }
                    });
                }

                this.deck.controls.update();
                this.deck.progress.update();

                if (this.deck.config.fragmentInURL) {
                    this.deck.location.writeURL();
                }
                return !!(changedFragments.shown.length || changedFragments.hidden.length);
            }
        }
        return false;
    }

    next() {
        return this.goto(null, 1);

    }

    prev() {
        return this.goto(null, -1);
    }
}

export { Fragments };