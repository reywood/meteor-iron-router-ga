import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';


const gaSettings = (Meteor.settings &&
                    Meteor.settings.public &&
                    Meteor.settings.public.ga) || {};

if (gaSettings.id) {
    initPreloadAnalyticsHelper();
    initTracker();
    applySettings();
    applyRequires();
} else {
    initFakeTracker();
}


function initPreloadAnalyticsHelper() {
    window.ga = window.ga || function ga(...args) {
        (window.ga.q = window.ga.q || []).push(args);
    };
    window.ga.l = +new Date();
}

function initTracker() {
    const createOptions = gaSettings.create || 'auto';
    window.ga('create', gaSettings.id, createOptions);

    if (gaSettings.trackUserId) {
        Tracker.autorun(() => {
            if (Meteor.loggingIn()) { return; }
            window.ga('set', '&uid', Meteor.userId());
        });
    }
}

function initFakeTracker() {
    let hasRun = false;
    window.ga = function ga() {
        if (!hasRun) {
            hasRun = true;
            console.warn('iron-router-ga: settings not found');
        }
    };
}

function applySettings() {
    if (!gaSettings.set) { return; }

    Object.keys(gaSettings.set).forEach((key) => {
        window.ga('set', key, gaSettings.set[key]);
    });
}

function applyRequires() {
    if (!gaSettings.require) { return; }

    Object.keys(gaSettings.require).forEach((key) => {
        if (typeof gaSettings.require[key] === 'string') {
            window.ga('require', key, gaSettings.require[key]);
        } else {
            window.ga('require', key);
        }
    });
}
