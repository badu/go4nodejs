const speakerViewHTML = `<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Speaker View</title>
    <link rel="stylesheet" href="css/speaker.css?version=${Date.now()}">
</head>
<body>
    <div id="current-slide"></div>
    <div id="upcoming-slide"><span class="overlay-element label">Next</span></div>
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
            <span class="label" id="total">0 Total</span><br />
            <span class="label" id="focused">0 Focused</span><br />
            <span class="label" id="unfocused">0 Unfocused</span><br />
            <div class="pacing" style="display: none">
                <span class="hours-value">00</span><span class="minutes-value">:00</span><span class="seconds-value">:00</span>
            </div>
        </div>
        <div class="speaker-controls-notes">
            <h4 class="label">Notes</h4>
            <div class="value"></div>
        </div>
        <div class="speaker-controls-notes">
            <span class="label" id="last-message"></span>
        </div>
        <div id="ws-connect" style="connection-status">
            <span class="overlay-element label">Takeover</span>
            <input id="totpInputCode" />
            <button id="wsConnectButton">Go</button>
        </div>
    </div>    
    <div id="debugger" style="position: absolute; width: 100%; height: 35%; bottom: 0; left: 0; right: 0;">
        <textarea id="consoler" style="width: 100%;height: 100%;"></textarea>
    </div>    
    <div id="speaker-layout" class="overlay-element interactive">
        <span class="speaker-layout-label"></span>
        <select class="speaker-layout-dropdown"></select>
    </div>
    <script src="js/speaker.js?version=${Date.now()}"></script>
</body>
</html>`;

import {
    ClientStatsCommand,
    ConnectedReplyCommand,
    FragmentShownCommand,
    HideControlsCommand,
    OverviewHiddenCommand,
    OverviewShownCommand,
    PausedCommand,
    ResumedCommand,
    ShowControlsCommand,
    SlidedCommand,
    StatusReplyCommand,
    StatusRequestCommand,
} from './utils.js'

class NotesPlugin {
    popup = null;
    deck = {};
    id = 'notes';

    constructor() {
        if (marked === undefined) {
            throw new Error("Marked JS not loaded?");
        }
    }

    init(deck) {
        this.deck = deck;
        if (!/receiver/i.test(window.location.search)) {
            if (window.location.search.match(/(\?|\&)notes/gi) !== null) { // If the there's a 'notes' query set, open directly
                this.open();
            }

            this.deck.keyboard.addKeyBinding({keyCode: 83, key: 'S', description: 'Speaker notes view'}, function () { // Open the notes when the 's' key is hit
                this.open();
            }.bind(this));
        }
    }

    open() {
        if (this.popup && !this.popup.closed) {
            this.popup.focus();
            return;
        }

        this.popup = window.open('about:blank', 'Speaker Notes', `width=${window.screen.availWidth >> 1},height=${window.screen.availHeight}`);
        this.popup.marked = marked;
        this.popup.deck = this.deck;
        this.popup.HideControlsCommand = HideControlsCommand;
        this.popup.ShowControlsCommand = ShowControlsCommand;
        this.popup.SlidedCommand = SlidedCommand;
        this.popup.PausedCommand = PausedCommand;
        this.popup.ResumedCommand = ResumedCommand;
        this.popup.StatusRequestCommand = StatusRequestCommand;
        this.popup.StatusReplyCommand = StatusReplyCommand;
        this.popup.OverviewShownCommand = OverviewShownCommand;
        this.popup.OverviewHiddenCommand = OverviewHiddenCommand;
        this.popup.ConnectedReplyCommand = ConnectedReplyCommand;
        this.popup.FragmentShownCommand = FragmentShownCommand;
        this.popup.ClientStatsCommand = ClientStatsCommand;

        this.popup.document.write(speakerViewHTML);

        if (!this.popup) {
            alert('Speaker view popup failed to open. Please make sure popups are allowed and reopen the speaker view.');
            return;
        }
    }
}

export {NotesPlugin};
