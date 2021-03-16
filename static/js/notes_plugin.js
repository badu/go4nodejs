const speakerViewHTML = `<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Speaker View</title>
    <link rel="stylesheet" href="css/speaker.css">
</head>
<body>
    <div id="connection-status">Loading speaker view...</div>
    <div id="current-slide"></div>
    <div id="upcoming-slide"><span class="overlay-element label">Upcoming</span></div>
    <div id="speaker-controls">
        <div class="speaker-controls-time">
            <h4 class="label">Time <span class="reset-button">Click to Reset</span></h4>
            <div class="clock">
                <span class="clock-value">0:00 AM</span>
            </div>
            <div class="timer">
                <span class="hours-value">00</span><span class="minutes-value">:00</span><span class="seconds-value">:00</span>
            </div>
            <div class="clear"></div>
            <h4 class="label pacing-title" style="display: none">Pacing – Time to finish current slide</h4>
            <div class="pacing" style="display: none">
                <span class="hours-value">00</span><span class="minutes-value">:00</span><span class="seconds-value">:00</span>
            </div>
        </div>
        <div class="speaker-controls-notes hidden">
            <h4 class="label">Notes</h4>
            <div class="value"></div>
        </div>
    </div>
    <div id="speaker-layout" class="overlay-element interactive">
        <span class="speaker-layout-label"></span>
        <select class="speaker-layout-dropdown"></select>
    </div>
    <script src="js/speaker.js"></script>
</body>
</html>`;
class NotesPlugin {
    popup = null;
    deck = {};
    id = 'notes';

    constructor() {
        if (marked === undefined) {
            throw new Error("Marked JS not loaded?");
        }
        this.post = this.post.bind(this);
    }

    init(deck) {
        this.deck = deck;
        if (!/receiver/i.test(window.location.search)) {
            if (window.location.search.match(/(\?|\&)notes/gi) !== null) { // If the there's a 'notes' query set, open directly
                this.open();
            }

            this.deck.keyboard.addKeyBinding({ keyCode: 83, key: 'S', description: 'Speaker notes view' }, function() { // Open the notes when the 's' key is hit
                this.open();
            }.bind(this));
        }
        this.callAPI = this.callAPI.bind(this);
        this.post = this.post.bind(this);
    }

    open() {
        if (this.popup && !this.popup.closed) {
            this.popup.focus();
            return;
        }
        this.popup = window.open('about:blank', 'Speaker Notes', 'width=1100,height=700');
        this.popup.marked = marked;
        this.popup.document.write(speakerViewHTML);

        if (!this.popup) {
            alert('Speaker view popup failed to open. Please make sure popups are allowed and reopen the speaker view.');
            return;
        }
        this.connect();

    }

    onConnected() {
        this.deck.on('slidechanged', this.post); // Monitor events that trigger a change in state
        this.deck.on('fragmentshown', this.post);
        this.deck.on('fragmenthidden', this.post);
        this.deck.on('overviewhidden', this.post);
        this.deck.on('overviewshown', this.post);
        this.deck.on('paused', this.post);
        this.deck.on('resumed', this.post);
        this.post(); // Post the initial state
    }

    post() {
        let slideElement = this.deck.currentSlide,
            notesElement = slideElement.querySelector('aside.notes'),
            fragmentElement = slideElement.querySelector('.current-fragment');

        let messageData = {
            namespace: 'speaker-notes',
            type: 'state',
            notes: '',
            markdown: false,
            whitespace: 'normal',
            state: this.deck.getState()
        };

        if (slideElement.hasAttribute('data-notes')) { // Look for notes defined in a slide attribute
            messageData.notes = slideElement.getAttribute('data-notes');
            messageData.whitespace = 'pre-wrap';
        }

        if (fragmentElement) { // Look for notes defined in a fragment
            let fragmentNotes = fragmentElement.querySelector('aside.notes');
            if (fragmentNotes) {
                notesElement = fragmentNotes;
            } else if (fragmentElement.hasAttribute('data-notes')) {
                messageData.notes = fragmentElement.getAttribute('data-notes');
                messageData.whitespace = 'pre-wrap';
                notesElement = null; // In case there are slide notes
            }
        }

        if (notesElement) { // Look for notes defined in an aside element
            messageData.notes = notesElement.innerHTML;
            messageData.markdown = typeof notesElement.getAttribute('data-markdown') === 'string';
        }
        const message = JSON.stringify(messageData);
        this.popup.postMessage(message, '*');
    }

    connect() {
        let connectInterval = setInterval(function() { // Keep trying to connect until we get a 'connected' message back
            this.popup.postMessage(JSON.stringify({
                namespace: 'speaker-notes',
                type: 'connect',
                url: window.location.protocol + '//' + window.location.host + window.location.pathname + window.location.search,
                state: this.deck.getState()
            }), '*');
        }.bind(this), 500);

        window.addEventListener('message', function(event) {
            let data = JSON.parse(event.data);
            if (!data) {
                return;
            }
            switch (data.namespace) {
                case 'speaker-notes':
                    switch (data.type) {
                        case 'connected':
                            clearInterval(connectInterval);
                            this.onConnected();
                            break;
                        case 'call':
                            this.callAPI(data.methodName, data.arguments, data.callId);
                            break;
                    }
                    break;
            }
        }.bind(this));
    }

    callAPI(method, args, callID) {
        let result = this.deck[method].apply(this.deck, args);
        if (result !== undefined && result.plugins !== undefined) {
            result.plugins = undefined;
        }
        this.popup.postMessage(JSON.stringify({
            namespace: 'speaker-notes',
            type: 'return',
            result: result,
            callId: callID
        }), '*');

    }
}
export { NotesPlugin };