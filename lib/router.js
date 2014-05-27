var originalRoute = Router.constructor.prototype.route;


Router.constructor.prototype.route = function(name, options) {
    if (shouldTrackPageView.call(this, name, options)) {
        attachPageViewTrackingOption.call(this, options);
    }

    if (routeHasExperiment(options)) {
        attachExperiment.call(this, name, options);
    }

    return originalRoute.call(this, name, options);
};


var shouldTrackPageView = function(name, options) {
    if (options && typeof options.trackPageView !== "undefined") {
        return !!options.trackPageView;
    }

    return !!this.options && !!this.options.trackPageView;
};

var attachExperiment = function(routeName, options) {
    var experiment = options.gaContentExperiment;
    var experimentLoader = new ExperimentLoader(experiment.id);

    options.onRun = (function() {
        var onRun = options.onRun;

        return function() {
            experimentLoader.init();

            var args = [].slice.apply(arguments);
            return onRun && onRun.apply(this, args);
        };
    }());

    options.onBeforeAction = (function() {
        var onBeforeAction = options.onBeforeAction;

        return function(pause) {
            experimentLoader.load();

            if (!experimentLoader.isReady()) {
                renderLoadingTemplate.call(this);
                pause();
                return;
            }

            var chosenVariation = window.cxApi.getChosenVariation(experiment.id);

            if (chosenVariation === window.cxApi.NO_CHOSEN_VARIATION) {
                chosenVariation = window.cxApi.chooseVariation();
                ga("send", "event", "iron-router-ga", "Choose experiment variation", experiment.id, chosenVariation);
            }

            var args = [].slice.apply(arguments);
            return onBeforeAction && onBeforeAction.apply(this, args);
        };
    }());

    options.action = (function() {
        var action = options.action;

        return function() {
            var chosenVariation = getChosenVariationOrDefault(experiment.id);

            this.render(experiment.variationTemplates[chosenVariation]);

            var args = [].slice.apply(arguments);
            return action && action.apply(this, args);
        };
    }());
};

var attachPageViewTrackingOption = function(options) {
    var onRun = options.onRun;

    options.onRun = function() {
        var args = [].slice.apply(arguments);

        window.ga && window.ga("send", "pageview", this.path);

        return onRun && onRun.apply(this, args);
    };
};

var routeHasExperiment = function(options) {
    return !!options.gaContentExperiment;
};

var getChosenVariationOrDefault = function(experimentId) {
    var variation = window.cxApi.getChosenVariation(experimentId);

    if (variation === window.cxApi.NO_CHOSEN_VARIATION || variation === cxApi.NOT_PARTICIPATING) {
        return 0;
    }

    return variation;
};

var renderLoadingTemplate = function() {
    var template = this.route.options.loadingTemplate ||
                   this.router.options.loadingTemplate;

    if (template) {
        this.render(template);
    }
};


var ExperimentLoader = function(experimentId) {
    this.experimentId = experimentId;
    this.dep = new Deps.Dependency();
};

ExperimentLoader.prototype.init = function() {
    if (window.cxApi) {
        delete window.cxApi;
    }
    this._removeScript();
};

ExperimentLoader.prototype.load = function() {
    this._insertScriptIfNecessaryAndStartChecking();
};

ExperimentLoader.prototype.isReady = function() {
    this.dep.depend();
    return typeof window.cxApi !== "undefined";
};

ExperimentLoader.prototype._insertScriptIfNecessaryAndStartChecking = function() {
    if (document.getElementById("irga-experiment-api")) { return; }

    this._insertScript();
    this._checkCxApiLoaded();
};

ExperimentLoader.prototype._insertScript = function() {
    var script = document.createElement("script");
    script.id = "irga-experiment-api";
    script.src = "//www.google-analytics.com/cx/api.js?experiment=" + this.experimentId;
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(script);
};

ExperimentLoader.prototype._removeScript = function() {
    var script = document.getElementById("irga-experiment-api");
    if (script && script.parentNode) {
        script.parentNode.removeChild(script);
    }
};

ExperimentLoader.prototype._checkCxApiLoaded = function() {
    var self = this;
    var startTime = (new Date()).getTime();
    var TIMEOUT = 10 * 1000;

    var check = function() {
        var currentTime = (new Date()).getTime();
        if (currentTime > startTime + TIMEOUT) {
            window.cxApi = fakeCxApi;
        }

        if (typeof window.cxApi !== "undefined") {
            self._initCookie();
            self.dep.changed();
        } else {
            setTimeout(function() { check(); }, 50);
        }
    };

    check();
};

ExperimentLoader.prototype._initCookie = function() {
    var settings = getCookieSettings();

    settings.cookieDomain && window.cxApi.setDomainName(settings.cookieDomain);
    settings.cookiePath && window.cxApi.setCookiePath(settings.cookiePath);
    settings.allowHash && window.cxApi.setAllowHash(settings.allowHash);
};

var getCookieSettings = function() {
    return typeof Meteor !== "undefined" &&
           Meteor.settings &&
           Meteor.settings.public &&
           Meteor.settings.public.ga &&
           Meteor.settings.public.ga.create ||
           {};
};

var fakeCxApi = {
    NO_CHOSEN_VARIATION: -1,
    NOT_PARTICIPATING: -2,

    chooseVariation: function() {
        return 0;
    },

    getChosenVariation: function() {
        return 0;
    },

    setDomainName: function() { },
    setCookiePath: function() { },
    setAllowHash: function() { }
};
