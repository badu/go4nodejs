import {deserialize} from './utils.js';

import {Deck} from './deck.js';

class Location {

    constructor(deck) {
        if (!(deck instanceof Deck)) {
            throw new Error("expecting instance of Deck");
        }
        this.deck = deck;
        // Delays updates to the URL due to a Chrome thumbnailer bug
        this.writeURLTimeout = 0;
        this.onWindowHashChange = this.onWindowHashChange.bind(this);
        this.deck.on('slided', function (event) {
            this.writeURL();
        }.bind(this));
        this.deck.on('synced', function (event) {
            this.writeURL();
        }.bind(this));
    }

    bind() {
        window.addEventListener('hashchange', this.onWindowHashChange, false);
    }

    unbind() {
        window.removeEventListener('hashchange', this.onWindowHashChange, false);
    }

    readURL() {
        let config = this.deck.config;
        let indices = this.deck.getIndices();
        let currentSlide = this.deck.currentSlide;
        let hash = window.location.hash;
        // Attempt to parse the hash as either an index or name
        let bits = hash.slice(2).split('/'),
            name = hash.replace(/#\/?/gi, '');

        // If the first bit is not fully numeric and there is a name we
        // can assume that this is a named link
        if (!/^[0-9]*$/.test(bits[0]) && name.length) {
            let element;

            let f;

            // Parse named links with fragments (#/named-link/2)
            if (/\/[-\d]+$/g.test(name)) {
                f = parseInt(name.split('/').pop(), 10);
                f = isNaN(f) ? undefined : f;
                name = name.split('/').shift();
            }

            // Ensure the named link is a valid HTML ID attribute
            try {
                element = document.getElementById(decodeURIComponent(name));
            } catch (error) {
            }

            // Ensure that we're not already on a slide with the same name
            let isSameNameAsCurrentSlide = currentSlide ? currentSlide.getAttribute('id') === name : false;

            if (element) {
                // If the slide exists and is not the current slide...
                if (!isSameNameAsCurrentSlide || typeof f !== 'undefined') {
                    // ...find the position of the named slide and navigate to it
                    let slideIndices = this.deck.getIndices(element);
                    this.deck.slide('location', slideIndices.h, slideIndices.v, f);
                }
            }
            // If the slide doesn't exist, navigate to the current slide
            else {
                this.deck.slide('location', indices.h || 0, indices.v || 0);
            }
        } else {
            let hashIndexBase = config.hashOneBasedIndex ? 1 : 0;

            // Read the index components of the hash
            let h = (parseInt(bits[0], 10) - hashIndexBase) || 0,
                v = (parseInt(bits[1], 10) - hashIndexBase) || 0,
                f;

            if (config.fragmentInURL) {
                f = parseInt(bits[2], 10);
                if (isNaN(f)) {
                    f = undefined;
                }
            }

            if (h !== indices.h || v !== indices.v || f !== undefined) {
                this.deck.slide('location', h, v, f);
            }
        }
    }

    writeURL(delay) {
        let config = this.deck.config;
        let currentSlide = this.deck.currentSlide;
        // Make sure there's never more than one timeout running
        clearTimeout(this.writeURLTimeout);
        // If a delay is specified, timeout this call
        if (typeof delay === 'number') {
            this.writeURLTimeout = setTimeout(this.writeURL, delay);
        } else if (currentSlide) {
            let hash = this.getHash();
            // If we're configured to push to history OR the history
            // API is not avaialble.
            if (config.history) {
                window.location.hash = hash;
            }
                // If we're configured to reflect the current slide in the
            // URL without pushing to history.
            else if (config.hash) {
                // If the hash is empty, don't add it to the URL
                if (hash === '/') {
                    window.history.replaceState(null, null, window.location.pathname + window.location.search);
                } else {
                    window.history.replaceState(null, null, '#' + hash);
                }
            }
        }
    }

    getHash(slide) {

        let url = '/';

        // Attempt to create a named link based on the slide's ID
        let s = slide || this.deck.currentSlide;
        let id = s ? s.getAttribute('id') : null;
        if (id) {
            id = encodeURIComponent(id);
        }

        let index = this.deck.getIndices(slide);
        if (!this.deck.config.fragmentInURL) {
            index.f = undefined;
        }

        // If the current slide has an ID, use that as a named link,
        // but we don't support named links with a fragment index
        if (typeof id === 'string' && id.length) {
            url = '/' + id;

            // If there is also a fragment, append that at the end
            // of the named link, like: #/named-link/2
            if (index.f >= 0) url += '/' + index.f;
        }
        // Otherwise use the /h/v index
        else {
            let hashIndexBase = this.deck.config.hashOneBasedIndex ? 1 : 0;
            if (index.h > 0 || index.v > 0 || index.f >= 0) url += index.h + hashIndexBase;
            if (index.v > 0 || index.f >= 0) url += '/' + (index.v + hashIndexBase);
            if (index.f >= 0) url += '/' + index.f;
        }

        return url;
    }

    onWindowHashChange(event) {
        this.readURL();
    }

    getQueryHash() {
        let query = {};
        location.search.replace(/[A-Z0-9]+?=([\w\.%-]*)/gi, a => {
            query[a.split('=').shift()] = a.split('=').pop();
        });
        for (let i in query) { // Basic deserialization
            let value = query[i];
            query[i] = deserialize(unescape(value));
        }
        // Do not accept new dependencies via query config to avoid
        // the potential of malicious script injection
        if (typeof query['dependencies'] !== 'undefined') delete query['dependencies'];
        return query;
    }
}

export {Location};
