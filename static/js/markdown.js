import { Deck } from './deck.js';

const DEFAULT_SLIDE_SEPARATOR = '^\r?\n---\r?\n$',
    DEFAULT_NOTES_SEPARATOR = 'notes?:',
    DEFAULT_ELEMENT_ATTRIBUTES_SEPARATOR = '\\\.element\\\s*?(.+?)$',
    DEFAULT_SLIDE_ATTRIBUTES_SEPARATOR = '\\\.slide:\\\s*?(\\\S.+?)$';

const SCRIPT_END_PLACEHOLDER = '__SCRIPT_END__';

const CODE_LINE_NUMBER_REGEX = /\[([\s\d,|-]*)\]/;

const HTML_ESCAPE_MAP = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
};

class MarkdownPlugin {
    id = 'markdown'
    deck = {}

    init(deck) {
        if (!(deck instanceof Deck)) {
            throw new Error("expecting instance of Deck");
        }
        this.deck = deck;

        let renderer = new marked.Renderer();

        renderer.code = (code, language) => {

            // Off by default
            let lineNumbers = '';

            // Users can opt in to show line numbers and highlight
            // specific lines.
            // ```javascript []        show line numbers
            // ```javascript [1,4-8]   highlights lines 1 and 4-8
            if (CODE_LINE_NUMBER_REGEX.test(language)) {
                lineNumbers = language.match(CODE_LINE_NUMBER_REGEX)[1].trim();
                lineNumbers = `data-line-numbers="${lineNumbers}"`;
                language = language.replace(CODE_LINE_NUMBER_REGEX, '').trim();
            }

            // Escape before this gets injected into the DOM to
            // avoid having the HTML parser alter our code before
            // highlight.js is able to read it
            code = this.escapeForHTML(code);

            return `<pre><code ${lineNumbers} class="${language}">${code}</code></pre>`;
        };

        marked.setOptions({
            renderer,
            ...deck.config.markdown
        });
        const f = function() {
            this.convertSlides()
        }.bind(this);
        return this.processSlides(deck.deckElement).then(f);

    }

    getMarkdownFromSlide(section) {

        // look for a <script> or <textarea data-template> wrapper
        var template = section.querySelector('[data-template]') || section.querySelector('script');

        // strip leading whitespace so it isn't evaluated as code
        var text = (template || section).textContent;

        // restore script end tags
        text = text.replace(new RegExp(SCRIPT_END_PLACEHOLDER, 'g'), '</script>');

        var leadingWs = text.match(/^\n?(\s*)/)[1].length,
            leadingTabs = text.match(/^\n?(\t*)/)[1].length;

        if (leadingTabs > 0) {
            text = text.replace(new RegExp('\\n?\\t{' + leadingTabs + '}', 'g'), '\n');
        } else if (leadingWs > 1) {
            text = text.replace(new RegExp('\\n? {' + leadingWs + '}', 'g'), '\n');
        }

        return text;

    }

    getForwardedAttributes(section) {

        var attributes = section.attributes;
        var result = [];

        for (var i = 0, len = attributes.length; i < len; i++) {
            var name = attributes[i].name,
                value = attributes[i].value;

            // disregard attributes that are used for markdown loading/parsing
            if (/data\-(markdown|separator|vertical|notes)/gi.test(name)) continue;

            if (value) {
                result.push(name + '="' + value + '"');
            } else {
                result.push(name);
            }
        }

        return result.join(' ');

    }

    getSlidifyOptions(options) {

        options = options || {};
        options.separator = options.separator || DEFAULT_SLIDE_SEPARATOR;
        options.notesSeparator = options.notesSeparator || DEFAULT_NOTES_SEPARATOR;
        options.attributes = options.attributes || '';

        return options;

    }

    createMarkdownSlide(content, options) {

        options = this.getSlidifyOptions(options);

        var notesMatch = content.split(new RegExp(options.notesSeparator, 'mgi'));

        if (notesMatch.length === 2) {
            content = notesMatch[0] + '<aside class="notes">' + marked(notesMatch[1].trim()) + '</aside>';
        }

        // prevent script end tags in the content from interfering
        // with parsing
        content = content.replace(/<\/script>/g, SCRIPT_END_PLACEHOLDER);

        return '<script type="text/template">' + content + '</script>';

    }

    slidify(markdown, options) {

        options = this.getSlidifyOptions(options);

        var separatorRegex = new RegExp(options.separator + (options.verticalSeparator ? '|' + options.verticalSeparator : ''), 'mg'),
            horizontalSeparatorRegex = new RegExp(options.separator);

        var matches,
            lastIndex = 0,
            isHorizontal,
            wasHorizontal = true,
            content,
            sectionStack = [];

        // iterate until all blocks between separators are stacked up
        while (matches = separatorRegex.exec(markdown)) {
            var notes = null;

            // determine direction (horizontal by default)
            isHorizontal = horizontalSeparatorRegex.test(matches[0]);

            if (!isHorizontal && wasHorizontal) {
                // create vertical stack
                sectionStack.push([]);
            }

            // pluck slide content from markdown input
            content = markdown.substring(lastIndex, matches.index);

            if (isHorizontal && wasHorizontal) {
                // add to horizontal stack
                sectionStack.push(content);
            } else {
                // add to vertical stack
                sectionStack[sectionStack.length - 1].push(content);
            }

            lastIndex = separatorRegex.lastIndex;
            wasHorizontal = isHorizontal;
        }

        // add the remaining slide
        (wasHorizontal ? sectionStack : sectionStack[sectionStack.length - 1]).push(markdown.substring(lastIndex));

        var markdownSections = '';
        // flatten the hierarchical stack, and insert <section data-markdown> tags
        sectionStack.forEach(function(stack) {
            // vertical
            if (stack instanceof Array) {
                markdownSections += '<section ' + options.attributes + '>';
                stack.forEach(function(child) {
                    markdownSections += '<section data-markdown>' + this.createMarkdownSlide(child, options) + '</section>';
                }, this);
                markdownSections += '</section>';
            } else {
                markdownSections += '<section ' + options.attributes + ' data-markdown>' + this.createMarkdownSlide(stack, options) + '</section>';
            }
        }, this)

        return markdownSections;

    }

    processSlides(scope) {
        return new Promise(function(resolve) {

            var externalPromises = [];

            [].slice.call(scope.querySelectorAll('[data-markdown]:not([data-markdown-parsed])')).forEach(function(section) {

                if (section.getAttribute('data-markdown').length) {

                    externalPromises.push(this.loadExternalMarkdown(section).then(

                        // Finished loading external file
                        function(xhr, url) {
                            section.outerHTML = this.slidify(xhr.responseText, {
                                separator: section.getAttribute('data-separator'),
                                verticalSeparator: section.getAttribute('data-separator-vertical'),
                                notesSeparator: section.getAttribute('data-separator-notes'),
                                attributes: this.getForwardedAttributes(section)
                            });
                        },

                        // Failed to load markdown
                        function(xhr, url) {
                            section.outerHTML = '<section data-state="alert">' +
                                'ERROR: The attempt to fetch ' + url + ' failed with HTTP status ' + xhr.status + '.' +
                                'Check your browser\'s JavaScript console for more details.' +
                                '<p>Remember that you need to serve the presentation HTML from a HTTP server.</p>' +
                                '</section>';
                        }

                    ));

                } else if (section.getAttribute('data-separator') || section.getAttribute('data-separator-vertical') || section.getAttribute('data-separator-notes')) {

                    section.outerHTML = this.slidify(this.getMarkdownFromSlide(section), {
                        separator: section.getAttribute('data-separator'),
                        verticalSeparator: section.getAttribute('data-separator-vertical'),
                        notesSeparator: section.getAttribute('data-separator-notes'),
                        attributes: this.getForwardedAttributes(section)
                    });

                } else {
                    section.innerHTML = this.createMarkdownSlide(this.getMarkdownFromSlide(section));
                }

            }, this);

            Promise.all(externalPromises).then(resolve);

        }.bind(this));

    }

    loadExternalMarkdown(section) {

        return new Promise(function(resolve, reject) {

            var xhr = new XMLHttpRequest(),
                url = section.getAttribute('data-markdown');

            var datacharset = section.getAttribute('data-charset');

            // see https://developer.mozilla.org/en-US/docs/Web/API/element.getAttribute#Notes
            if (datacharset != null && datacharset != '') {
                xhr.overrideMimeType('text/html; charset=' + datacharset);
            }

            xhr.onreadystatechange = function(section, xhr) {
                if (xhr.readyState === 4) {
                    // file protocol yields status code 0 (useful for local debug, mobile applications etc.)
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0) {

                        resolve(xhr, url);

                    } else {

                        reject(xhr, url);

                    }
                }
            }.bind(this, section, xhr);

            xhr.open('GET', url, true);

            try {
                xhr.send();
            } catch (e) {
                console.warn('Failed to get the Markdown file ' + url + '. Make sure that the presentation and the file are served by a HTTP server and the file can be found there. ' + e);
                resolve(xhr, url);
            }

        });

    }

    addAttributeInElement(node, elementTarget, separator) {

        var mardownClassesInElementsRegex = new RegExp(separator, 'mg');
        var mardownClassRegex = new RegExp("([^\"= ]+?)=\"([^\"]+?)\"|(data-[^\"= ]+?)(?=[\" ])", 'mg');
        var nodeValue = node.nodeValue;
        var matches,
            matchesClass;
        if (matches = mardownClassesInElementsRegex.exec(nodeValue)) {

            var classes = matches[1];
            nodeValue = nodeValue.substring(0, matches.index) + nodeValue.substring(mardownClassesInElementsRegex.lastIndex);
            node.nodeValue = nodeValue;
            while (matchesClass = mardownClassRegex.exec(classes)) {
                if (matchesClass[2]) {
                    elementTarget.setAttribute(matchesClass[1], matchesClass[2]);
                } else {
                    elementTarget.setAttribute(matchesClass[3], "");
                }
            }
            return true;
        }
        return false;
    }

    addAttributes(section, element, previousElement, separatorElementAttributes, separatorSectionAttributes) {

        if (element != null && element.childNodes != undefined && element.childNodes.length > 0) {
            var previousParentElement = element;
            for (var i = 0; i < element.childNodes.length; i++) {
                var childElement = element.childNodes[i];
                if (i > 0) {
                    var j = i - 1;
                    while (j >= 0) {
                        var aPreviousChildElement = element.childNodes[j];
                        if (typeof aPreviousChildElement.setAttribute == 'function' && aPreviousChildElement.tagName != "BR") {
                            previousParentElement = aPreviousChildElement;
                            break;
                        }
                        j = j - 1;
                    }
                }
                var parentSection = section;
                if (childElement.nodeName == "section") {
                    parentSection = childElement;
                    previousParentElement = childElement;
                }
                if (typeof childElement.setAttribute == 'function' || childElement.nodeType == Node.COMMENT_NODE) {
                    this.addAttributes(parentSection, childElement, previousParentElement, separatorElementAttributes, separatorSectionAttributes);
                }
            }
        }

        if (element.nodeType == Node.COMMENT_NODE) {
            if (this.addAttributeInElement(element, previousElement, separatorElementAttributes) == false) {
                this.addAttributeInElement(element, section, separatorSectionAttributes);
            }
        }
    }

    convertSlides() {

        var sections = this.deck.deckElement.querySelectorAll('[data-markdown]:not([data-markdown-parsed])');

        [].slice.call(sections).forEach(function(section) {

            section.setAttribute('data-markdown-parsed', true)

            var notes = section.querySelector('aside.notes');
            var markdown = this.getMarkdownFromSlide(section);

            section.innerHTML = marked(markdown);
            this.addAttributes(section, section, null, section.getAttribute('data-element-attributes') ||
                section.parentNode.getAttribute('data-element-attributes') ||
                DEFAULT_ELEMENT_ATTRIBUTES_SEPARATOR,
                section.getAttribute('data-attributes') ||
                section.parentNode.getAttribute('data-attributes') ||
                DEFAULT_SLIDE_ATTRIBUTES_SEPARATOR);

            // If there were notes, we need to re-add them after having overwritten the section's HTML
            if (notes) {
                section.appendChild(notes);
            }
        }, this);
        return Promise.resolve();
    }

    escapeForHTML(input) {
        return input.replace(/([&<>'"])/g, char => HTML_ESCAPE_MAP[char]);
    }
}
export { MarkdownPlugin };