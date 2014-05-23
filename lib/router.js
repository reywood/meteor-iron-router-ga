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
    if (routeHasExperiment(options)) {
        return true;
    }

    if (options && typeof options.trackPageView !== "undefined") {
        return !!options.trackPageView;
    }

    return !!this.options && !!this.options.trackPageView;
};

var attachExperiment = function(routeName, options) {
    var onRun = options.onRun;
    var action = options.action;
    var experiment = options.gaContentExperiment;
    var variationCount = experiment.variationTemplates.length;

    options.onRun = function() {
        var args = [].slice.apply(arguments);

        var chosenVariation = getExperimentVariation(experiment.id);

        if (chosenVariation === cxApi.NO_CHOSEN_VARIATION) {
            chosenVariation = Math.floor(Math.random() * variationCount);
            setExperimentVariation(chosenVariation, experiment.id);
        }

        return onRun && onRun.apply(this, args);
    };

    options.action = function() {
        var args = [].slice.apply(arguments);
        var chosenVariation = getExperimentVariation(experiment.id);

        this.render(experiment.variationTemplates[chosenVariation]);

        return action && action.apply(this, args);
    };
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

var getExperimentVariation = function(experimentId) {
    initExperimentCookie();
    return cxApi.getChosenVariation(experimentId)
};

var setExperimentVariation = function(variation, experimentId) {
    initExperimentCookie();
    cxApi.setChosenVariation(variation, experimentId)
};

var initExperimentCookie = (function() {
    var hasRun = false;

    return function() {
        if (hasRun) { return; }
        hasRun = true;

        if (typeof cxApi === "undefined") {
            console.log("Experiments API not found. Is <script src=\"//www.google-analytics.com/cx/api.js\"></script> present?")
            return;
        }

        var settings = getCookieSettings();

        settings.cookieDomain && cxApi.setDomainName(settings.cookieDomain);
        settings.cookiePath && cxApi.setCookiePath(settings.cookiePath);
        settings.allowHash && cxApi.setAllowHash(settings.allowHash);
    };
}());

var getCookieSettings = function() {
    return typeof Meteor !== "undefined" &&
           Meteor.settings &&
           Meteor.settings.public &&
           Meteor.settings.public.ga &&
           Meteor.settings.public.ga.create ||
           {};
};
