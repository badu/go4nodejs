import {HighlightPlugin} from './highlight.js';
import {MarkdownPlugin} from './markdown.js'
import {ZoomPlugin} from './zoom.js';
import {NotesPlugin} from './notes_plugin.js';
import {Deck} from './deck.js';

window.onload = function () {
    const highlightPlugin = new HighlightPlugin();
    const markdownPlugin = new MarkdownPlugin();
    const zoomPlugin = new ZoomPlugin();
    const notesPlugin = new NotesPlugin();

    const deck = new Deck(document.querySelector('.reveal'))
    let notificationsAllowed = false;
    if (!("Notification" in window)) { // Check if the browser supports notifications

    } else if (Notification.permission === "granted") { // Check whether notification permissions have already been granted;
        notificationsAllowed = true
    } else if (Notification.permission !== "denied") {
        // We need to ask the user for permission
        Notification.requestPermission().then((permission) => { // If the user accepts, let's create a notification
            if (permission === "granted") {
                notificationsAllowed = true

            }
        });
    }

    deck.initialize({
        slideNumber: true,
        controls: true,
        progress: true,
        center: true,
        hash: true,
        plugins: [highlightPlugin, markdownPlugin, zoomPlugin, notesPlugin],
        notificationsAllowed: notificationsAllowed,
    });

    deck.on('customevent', function (event) {
        console.log('custom event has fired');
    });


    window.theDeck = deck;
};
