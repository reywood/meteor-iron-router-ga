import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

const experimentLoaderCache = {};

export const initContentExperiements = function initContentExperiements(router) {
    router.onRun(function onRun() {
        removePreviousExperiment.call(this);
        this.next();
    });

    router.onBeforeAction(function onBeforeAction() {
        const experiment = this.lookupOption('contentExperiment');
        const experimentId = experiment && experiment.id;

        if (!experimentId) {
            this.next();
            return;
        }

        const experimentLoader = getExperimentLoader(experimentId);
        experimentLoader.load();

        if (!experimentLoader.isReady()) {
            renderLoadingTemplate.call(this);
            return;
        }

        selectVariationTemplateToShow.call(this, experiment);

        this.next();
    });
};


function removePreviousExperiment() {
    removeExperimentWindowApi();
    removeExperimentScript();
}

function getExperimentLoader(experimentId) {
    if (!experimentId) {
        return undefined;
    }

    if (!experimentLoaderCache[experimentId]) {
        experimentLoaderCache[experimentId] = new ExperimentLoader(experimentId);
    }

    return experimentLoaderCache[experimentId];
}

function selectVariationTemplateToShow(experiment) {
    const chosenVariation = chooseExperimentVariation(experiment.id);
    this.route.options.template = experiment.variationTemplates[chosenVariation];
}

function chooseExperimentVariation(experimentId) {
    let chosenVariation = window.cxApi.getChosenVariation(experimentId);

    if (chosenVariation === window.cxApi.NO_CHOSEN_VARIATION) {
        chosenVariation = window.cxApi.chooseVariation();
        window.ga('send', 'event', 'iron-router-ga', 'Choose experiment variation', experimentId, chosenVariation);
    }

    return chosenVariation;
}

function removeExperimentWindowApi() {
    if (window.cxApi) {
        delete window.cxApi;
    }
}

function removeExperimentScript() {
    const script = document.getElementById('irga-experiment-api');
    if (script && script.parentNode) {
        script.parentNode.removeChild(script);
    }
}

function renderLoadingTemplate() {
    const template = this.lookupOption('loadingTemplate');

    if (template) {
        this.render(template);
    }
}


const fakeCxApi = {
    NO_CHOSEN_VARIATION: -1,
    NOT_PARTICIPATING: -2,
    ORIGINAL_VARIATION: 0,

    chooseVariation() {
        return this.ORIGINAL_VARIATION;
    },

    getChosenVariation() {
        return this.ORIGINAL_VARIATION;
    },

    setDomainName() { },
    setCookiePath() { },
    setAllowHash() { },
};


class ExperimentLoader {
    constructor(experimentId) {
        this.experimentId = experimentId;
        this.dep = new Tracker.Dependency();
    }

    load() {
        this._insertScriptIfNecessaryAndStartChecking();
    }

    isReady() {
        this.dep.depend();
        return typeof window.cxApi !== 'undefined';
    }

    _insertScriptIfNecessaryAndStartChecking() {
        if (document.getElementById('irga-experiment-api')) { return; }

        this._insertScript();
        this._checkCxApiLoaded();
    }

    _insertScript() {
        const script = document.createElement('script');
        script.id = 'irga-experiment-api';
        script.src = `//www.google-analytics.com/cx/api.js?experiment=${this.experimentId}`;
        const head = document.querySelector('head');
        head.appendChild(script);
    }

    _checkCxApiLoaded() {
        const startTime = (new Date()).getTime();
        const TIMEOUT = 10 * 1000;

        const check = () => {
            const currentTime = (new Date()).getTime();
            if (currentTime > startTime + TIMEOUT) {
                console.warn(`iron-router-ga: timed out loading content experiment ${this.experimentId}`);
                window.cxApi = fakeCxApi;
            }

            if (typeof window.cxApi !== 'undefined') {
                ExperimentLoader._initCookie();
                this.dep.changed();
            } else {
                setTimeout(() => { check(); }, 50);
            }
        };

        check();
    }

    static _initCookie() {
        const settings = getCookieSettings();

        if (settings.cookieDomain) {
            window.cxApi.setDomainName(settings.cookieDomain);
        }
        if (settings.cookiePath) {
            window.cxApi.setCookiePath(settings.cookiePath);
        }
        if (settings.allowHash) {
            window.cxApi.setAllowHash(settings.allowHash);
        }
    }
}

function getCookieSettings() {
    return (Meteor.settings &&
            Meteor.settings.public &&
            Meteor.settings.public.ga &&
            Meteor.settings.public.ga.create) || {};
}
