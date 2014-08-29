var FakeRouter = function() {
    this.routes = {};
};

FakeRouter.prototype.route = function(name, options) {
    this.routes[name] = new FakeRoute(name, options);

    return this.routes[name];
};

FakeRouter.prototype.executeRoute = function(name) {
    var route = this.routes[name];
    var args = [].slice.apply(arguments);
    args.shift();

    if (!route) {
        throw new Exception("Route not found: " + name);
    }

    route.execute.apply(route, args);
};


var FakeRoute = function(name, options) {
    this.name = this.path = name;
    this.options = options;
    this.renderedTemplate = null;

    this.route = this;
    this.router = { options: {} };
};

FakeRoute.prototype.render = function(template) {
    this.renderedTemplate = template;
};

FakeRoute.prototype.execute = function() {
    var args = [].slice.apply(arguments);
    var paused = false;

    this.options.onRun && this.options.onRun.apply(this, args);
    this.options.onBeforeAction && this.options.onBeforeAction.call(this, function pause() {
        paused = true;
    });

    if (!paused) {
        this.options.action && this.options.action.apply(this, args);
        this.options.onAfterAction && this.options.onAfterAction.apply(this, args);
    }
};

FakeRoute.prototype.run = function() {
    var args = [].slice.apply(arguments);
    this.options.onRun && this.options.onRun.apply(this, args);
};

FakeRoute.prototype.action = function() {
    var args = [].slice.apply(arguments);
    var paused = false;

    this.options.onBeforeAction && this.options.onBeforeAction.call(this, function pause() {
        paused = true;
    });

    if (!paused) {
        this.options.action && this.options.action.apply(this, args);
        this.options.onAfterAction && this.options.onAfterAction.apply(this, args);
    }
};

Router = new FakeRouter();


module.exports = {
    reset: function() {
        for (var i in Router.routes) {
            if (Router.routes.hasOwnProperty(i)) {
                delete Router.routes[i];
            }
        }
    }
};
