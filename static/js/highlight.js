import {Deck} from './deck.js';

class HighlightPlugin {

    constructor() {
        if (hljs === undefined) {
            throw new Error(`Highlight JS not loaded?`);
        }
        this.id = 'highlight'
        this.HIGHLIGHT_STEP_DELIMITER = '|'
        this.HIGHLIGHT_LINE_DELIMITER = ','
        this.HIGHLIGHT_LINE_RANGE_DELIMITER = '-'
        this.hljs = hljs
    }

    init(deck) {
        if (!(deck instanceof Deck)) {
            throw new Error("expecting instance of Deck");
        }
        this.deck = deck;
        // Read the plugin config options and provide fallbacks
        var config = deck.config.highlight || {};
        config.highlightOnLoad = typeof config.highlightOnLoad === 'boolean' ? config.highlightOnLoad : true;
        config.escapeHTML = typeof config.escapeHTML === 'boolean' ? config.escapeHTML : true;
        [].slice.call(deck.deckElement.querySelectorAll('pre code')).forEach(function (block) {
            // Code can optionally be wrapped in script template to avoid
            // HTML being parsed by the browser (i.e. when you need to
            // include <, > or & in your code).
            let substitute = block.querySelector('script[type="text/template"]');
            if (substitute) {
                // textContent handles the HTML entity escapes for us
                block.textContent = substitute.innerHTML;
            }
            // Trim whitespace if the "data-trim" attribute is present
            if (block.hasAttribute('data-trim') && typeof block.innerHTML.trim === 'function') {
                block.innerHTML = this.betterTrim(block);
            }
            // Escape HTML tags unless the "data-noescape" attrbute is present
            if (config.escapeHTML && !block.hasAttribute('data-noescape')) {
                block.innerHTML = block.innerHTML.replace(/</g, "&lt;").replace(/>/g, '&gt;');
            }
            // Re-highlight when focus is lost (for contenteditable code)
            block.addEventListener('focusout', function (event) {
                this.hljs.highlightBlock(event.currentTarget);
            }, false);
            if (config.highlightOnLoad) {
                this.highlightBlock(block);
            }
        }, this);
    }

    highlightBlock(block) {
        this.hljs.highlightBlock(block);
        // Don't generate line numbers for empty code blocks
        if (block.innerHTML.trim().length === 0) return;
        if (block.hasAttribute('data-line-numbers')) {
            this.hljs.lineNumbersBlock(block, {singleLine: true});
            var scrollState = {currentBlock: block};
            // If there is at least one highlight step, generate
            // fragments
            var highlightSteps = this.deserializeHighlightSteps(block.getAttribute('data-line-numbers'));
            if (highlightSteps.length > 1) {
                // If the original code block has a fragment-index,
                // each clone should follow in an incremental sequence
                var fragmentIndex = parseInt(block.getAttribute('data-fragment-index'), 10);
                if (typeof fragmentIndex !== 'number' || isNaN(fragmentIndex)) {
                    fragmentIndex = null;
                }
                // Generate fragments for all steps except the original block
                highlightSteps.slice(1).forEach(function (highlight) {
                    var fragmentBlock = block.cloneNode(true);
                    fragmentBlock.setAttribute('data-line-numbers', this.serializeHighlightSteps([highlight]));
                    fragmentBlock.classList.add('fragment');
                    block.parentNode.appendChild(fragmentBlock);
                    this.highlightLines(fragmentBlock);
                    if (typeof fragmentIndex === 'number') {
                        fragmentBlock.setAttribute('data-fragment-index', fragmentIndex);
                        fragmentIndex += 1;
                    } else {
                        fragmentBlock.removeAttribute('data-fragment-index');
                    }
                    // Scroll highlights into view as we step through them
                    fragmentBlock.addEventListener('visible', () => {
                        this.scrollHighlightedLineIntoView.bind(Plugin, fragmentBlock, scrollState)
                    });
                    fragmentBlock.addEventListener('hidden', () => {
                        this.scrollHighlightedLineIntoView.bind(Plugin, fragmentBlock.previousSibling, scrollState)
                    });
                }, this);
                block.removeAttribute('data-fragment-index')
                block.setAttribute('data-line-numbers', this.serializeHighlightSteps([highlightSteps[0]]));
            }
            // Scroll the first highlight into view when the slide
            // becomes visible. Note supported in IE11 since it lacks
            // support for Element.closest.
            var slide = typeof block.closest === 'function' ? block.closest('section:not(.stack)') : null;
            if (slide) {
                var scrollFirstHighlightIntoView = function () {
                    this.scrollHighlightedLineIntoView(block, scrollState, true);
                    slide.removeEventListener('visible', scrollFirstHighlightIntoView);
                }.bind(this)
                slide.addEventListener('visible', scrollFirstHighlightIntoView);
            }
            this.highlightLines(block);
        }
    }

    scrollHighlightedLineIntoView(block, scrollState, skipAnimation) {
        if (block.tagName === undefined) {
            return;
        }
        cancelAnimationFrame(scrollState.animationFrameID);
        // Match the scroll position of the currently visible
        // code block
        if (scrollState.currentBlock) {
            block.scrollTop = scrollState.currentBlock.scrollTop;
        }
        // Remember the current code block so that we can match
        // its scroll position when showing/hiding fragments
        scrollState.currentBlock = block;
        var highlightBounds = this.getHighlightedLineBounds(block)
        var viewportHeight = block.offsetHeight;
        // Subtract padding from the viewport height
        var blockStyles = getComputedStyle(block);
        viewportHeight -= parseInt(blockStyles.paddingTop) + parseInt(blockStyles.paddingBottom);
        // Scroll position which centers all highlights
        var startTop = block.scrollTop;
        var targetTop = highlightBounds.top + (Math.min(highlightBounds.bottom - highlightBounds.top, viewportHeight) - viewportHeight) / 2;
        // Account for offsets in position applied to the
        // <table> that holds our lines of code
        var lineTable = block.querySelector('.hljs-ln');
        if (lineTable) targetTop += lineTable.offsetTop - parseInt(blockStyles.paddingTop);
        // Make sure the scroll target is within bounds
        targetTop = Math.max(Math.min(targetTop, block.scrollHeight - viewportHeight), 0);
        if (skipAnimation === true || startTop === targetTop) {
            block.scrollTop = targetTop;
        } else {
            // Don't attempt to scroll if there is no overflow
            if (block.scrollHeight <= viewportHeight) return;
            var time = 0;
            var animate = function () {
                time = Math.min(time + 0.02, 1);
                // Update our eased scroll position
                block.scrollTop = startTop + (targetTop - startTop) * this.easeInOutQuart(time);
                // Keep animating unless we've reached the end
                if (time < 1) {
                    scrollState.animationFrameID = requestAnimationFrame(animate);
                }
            }.bind(this);
            animate();
        }
    }

    easeInOutQuart(t) {
        // easeInOutQuart
        return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    }


    getHighlightedLineBounds(block) {
        if (block.tagName === undefined) {
            return {top: 0, bottom: 0}
        }
        var highlightedLines = block.querySelectorAll('.highlight-line');
        if (highlightedLines.length === 0) {
            return {top: 0, bottom: 0};
        } else {
            var firstHighlight = highlightedLines[0];
            var lastHighlight = highlightedLines[highlightedLines.length - 1];
            return {
                top: firstHighlight.offsetTop,
                bottom: lastHighlight.offsetTop + lastHighlight.offsetHeight
            }
        }
    }

    highlightLines(block, linesToHighlight) {
        var highlightSteps = this.deserializeHighlightSteps(linesToHighlight || block.getAttribute('data-line-numbers'));
        if (highlightSteps.length) {
            highlightSteps[0].forEach(function (highlight) {
                var elementsToHighlight = [];
                // Highlight a range
                if (typeof highlight.end === 'number') {
                    elementsToHighlight = [].slice.call(block.querySelectorAll('table tr:nth-child(n+' + highlight.start + '):nth-child(-n+' + highlight.end + ')'));
                }
                // Highlight a single line
                else if (typeof highlight.start === 'number') {
                    elementsToHighlight = [].slice.call(block.querySelectorAll('table tr:nth-child(' + highlight.start + ')'));
                }
                if (elementsToHighlight.length) {
                    elementsToHighlight.forEach(function (lineElement) {
                        lineElement.classList.add('highlight-line');
                    });
                    block.classList.add('has-highlights');
                }
            });
        }
    }

    deserializeHighlightSteps(highlightSteps) {
        // Remove whitespace
        highlightSteps = highlightSteps.replace(/\s/g, '');
        // Divide up our line number groups
        highlightSteps = highlightSteps.split(this.HIGHLIGHT_STEP_DELIMITER);

        return highlightSteps.map(function (highlights) {
            return highlights.split(this.HIGHLIGHT_LINE_DELIMITER).map(function (highlight) {
                // Parse valid line numbers
                if (/^[\d-]+$/.test(highlight)) {
                    highlight = highlight.split(this.HIGHLIGHT_LINE_RANGE_DELIMITER);
                    var lineStart = parseInt(highlight[0], 10),
                        lineEnd = parseInt(highlight[1], 10);
                    if (isNaN(lineEnd)) {
                        return {
                            start: lineStart
                        };
                    } else {
                        return {
                            start: lineStart,
                            end: lineEnd
                        };
                    }
                }
                // If no line numbers are provided, no code will be highlighted
                else {
                    return {};
                }
            }.bind(this));
        }.bind(this));
    }

    serializeHighlightSteps(highlightSteps) {
        return highlightSteps.map(function (highlights) {
            return highlights.map(function (highlight) {
                // Line range
                if (typeof highlight.end === 'number') {
                    return highlight.start + this.HIGHLIGHT_LINE_RANGE_DELIMITER + highlight.end;
                }
                // Single line
                else if (typeof highlight.start === 'number') {
                    return highlight.start;
                }
                // All lines
                else {
                    return '';
                }
            }.bind(this)).join(this.HIGHLIGHT_LINE_DELIMITER);
        }.bind(this)).join(this.HIGHLIGHT_STEP_DELIMITER);
    }

    trimLeft(val) {
        // Adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill
        return val.replace(/^[\s\uFEFF\xA0]+/g, '');
    }

    trimLineBreaks(input) {
        var lines = input.split('\n');
        // Trim line-breaks from the beginning
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].trim() === '') {
                lines.splice(i--, 1);
            } else break;
        }
        // Trim line-breaks from the end
        for (var i = lines.length - 1; i >= 0; i--) {
            if (lines[i].trim() === '') {
                lines.splice(i, 1);
            } else break;
        }
        return lines.join('\n');
    }

    betterTrim(snippetEl) {
        var content = this.trimLineBreaks(snippetEl.innerHTML);
        var lines = content.split('\n');
        // Calculate the minimum amount to remove on each line start of the snippet (can be 0)
        var pad = lines.reduce(function (acc, line) {
            if (line.length > 0 && this.trimLeft(line).length > 0 && acc > line.length - this.trimLeft(line).length) {
                return line.length - this.trimLeft(line).length;
            }
            return acc;
        }.bind(this), Number.POSITIVE_INFINITY);
        // Slice each line with this amount
        return lines.map(function (line, index) {
            return line.slice(pad);
        })
            .join('\n');
    }

}

export {HighlightPlugin}
