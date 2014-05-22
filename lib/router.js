var originalRoute = Router.constructor.prototype.route;

Router.constructor.prototype.route = function(name, options) {
    if (shouldTrackPageView.call(this, name, options)) {
        attachPageViewTrackingOption.call(this, options);
    }

    if (routeHasExperiment(name)) {
        attachExperiment.call(this, name, options);
    }

    return originalRoute.call(this, name, options);
};

var shouldTrackPageView = function(name, options) {
    if (routeHasExperiment(name)) {
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
    var experiment = getRouteExperiment(routeName);
    var variationCount = experiment.variationTemplates.length
    var chosenVariation = cxApi.getChosenVariation(experiment.experimentId);

    options.onRun = function() {
        var args = [].slice.apply(arguments);

        if (chosenVariation === cxApi.NO_CHOSEN_VARIATION) {
            chosenVariation = Math.floor(Math.random() * variationCount);
            cxApi.setChosenVariation(chosenVariation, experiment.experimentId)
        }

        return onRun && onRun.apply(this, args);
    };

    options.action = function() {
        var args = [].slice.apply(arguments);

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

var routeHasExperiment = function(routeName) {
    return !!getRouteExperiment(routeName);
};

var getRouteExperiment = function(routeName) {
    return Meteor.settings.public &&
           Meteor.settings.public.ga &&
           Meteor.settings.public.ga.contentExperiments &&
           Meteor.settings.public.ga.contentExperiments.routes &&
           Meteor.settings.public.ga.contentExperiments.routes[routeName];
};
