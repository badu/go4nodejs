import { HighlightPlugin } from './highlight.js';
import { MarkdownPlugin } from './markdown.js'
import { ZoomPlugin } from './zoom.js';
import { NotesPlugin } from './notes_plugin.js';
import { Deck } from './deck.js';

const highlightPlugin = new HighlightPlugin();
const markdownPlugin = new MarkdownPlugin();
const zoomPlugin = new ZoomPlugin();
const notesPlugin = new NotesPlugin();

const deck = new Deck(document.querySelector('.reveal'))
deck.initialize({ slideNumber: true, controls: true, progress: true, center: true, hash: true, plugins: [highlightPlugin, markdownPlugin, zoomPlugin, notesPlugin] });
deck.on('customevent', function(event) {
    console.log('custom event has fired');
});