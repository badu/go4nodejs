const extend = (a, b) => {
    for (let i in b) {
        a[i] = b[i];
    }
    return a;
}

const queryAll = (el, selector) => {
    return Array.from(el.querySelectorAll(selector));
}

const deserialize = function (value) {
    if (typeof value === 'string') {
        if (value === 'null') return null;
        else if (value === 'true') return true;
        else if (value === 'false') return false;
        else if (value.match(/^-?[\d\.]+$/)) return parseFloat(value);
    }
    return value;
}

const transformElement = (element, transform) => {
    element.style.transform = transform;
}

const matches = (target, selector) => {
    let matchesMethod = target.matches || target.matchesSelector || target.msMatchesSelector;
    return !!(matchesMethod && matchesMethod.call(target, selector));
}

const closest = (target, selector) => {
    // Native Element.closest
    if (typeof target.closest === 'function') {
        return target.closest(selector);
    }
    // Polyfill
    while (target) {
        if (matches(target, selector)) {
            return target;
        }
        // Keep searching
        target = target.parentNode;
    }
    return null;
}

const createStyleSheet = (value) => {
    let tag = document.createElement('style');
    tag.type = 'text/css';
    if (value && value.length > 0) {
        if (tag.styleSheet) {
            tag.styleSheet.cssText = value;
        } else {
            tag.appendChild(document.createTextNode(value));
        }
    }
    document.head.appendChild(tag);
    return tag;
}

const SLIDES_SELECTOR = '.slides section';

const isMobile = /(iphone|ipod|ipad|android)/gi.test(navigator.userAgentUA) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPadOS

const isChrome = /chrome/i.test(navigator.userAgent) && !/edge/i.test(navigator.userAgent);

const supportsZoom = 'zoom' in document.createElement('div').style && !isMobile && (isChrome || /Version\/[\d\.]+.*Safari/.test(navigator.userAgent));

const HideControlsCommand = 1;
const ShowControlsCommand = 2;
const SlidedCommand = 3;
const PausedCommand = 4;
const ResumedCommand = 5;
const StatusRequestCommand = 6;
const StatusReplyCommand = 7;
const OverviewShownCommand = 8;
const OverviewHiddenCommand = 9;
const ConnectedReplyCommand = 10;
const FragmentShownCommand = 11;
const ClientStatsCommand = 12;
const DisplayNotificationCommand = 13;

const decodeWSMessageType = function (message) {
    switch (message.com) {
        case HideControlsCommand:
            return 'hideControls';
        case ShowControlsCommand:
            return 'showControls';
        case SlidedCommand:
            return 'slided';
        case PausedCommand:
            return 'paused';
        case ResumedCommand:
            return 'resumed';
        case StatusRequestCommand:
            return 'statusRequest';
        case StatusReplyCommand:
            return 'statusReply';
        case OverviewShownCommand:
            return 'overviewShown';
        case OverviewHiddenCommand:
            return 'overviewHidden';
        case ConnectedReplyCommand:
            return 'connected';
        case FragmentShownCommand:
            return 'fragmentShown';
        case ClientStatsCommand:
            return 'clientStatus';
        case DisplayNotificationCommand:
            return 'displayNotification';
    }
}

export {
    createStyleSheet,
    closest,
    matches,
    transformElement,
    deserialize,
    queryAll,
    extend,
    SLIDES_SELECTOR,
    isMobile,
    supportsZoom,
    HideControlsCommand,
    ShowControlsCommand,
    SlidedCommand,
    PausedCommand,
    ResumedCommand,
    StatusRequestCommand,
    StatusReplyCommand,
    OverviewShownCommand,
    OverviewHiddenCommand,
    ConnectedReplyCommand,
    FragmentShownCommand,
    ClientStatsCommand,
    DisplayNotificationCommand,
    decodeWSMessageType,
}
