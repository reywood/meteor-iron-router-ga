var originalRoute = Router.constructor.prototype.route;

Router.constructor.prototype.route = function(name, options) {
    if (shouldTrackPageView.call(this, options)) {
        attachPageViewTrackingOption.call(this, options);
    }

    originalRoute.call(this, name, options);
};

var shouldTrackPageView = function(options) {
    if (typeof options.trackPageView !== "undefined") {
        return !!options.trackPageView;
    }
    return !!this.options.trackPageView;
};

var attachPageViewTrackingOption = function(options) {
    var onRun = options.onRun;

    options.onRun = function() {
        var args = [].slice.apply(arguments);

        window.ga && window.ga("send", "pageview", this.path);

        return onRun && onRun.apply(this, args);
    };
};
