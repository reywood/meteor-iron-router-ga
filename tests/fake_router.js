FakeRouter = function() {
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

FakeRouter.prototype.reset = function() {
    this.routes = {};
};


FakeRoute = function(name, options) {
    this.name = this.path = name;
    this.options = options;
    this.renderedTemplate = null;
};

FakeRoute.prototype.render = function(template) {
    this.renderedTemplate = template;
};

FakeRoute.prototype.execute = function() {
    var args = [].slice.apply(arguments);

    this.options.onRun && this.options.onRun.apply(this, args);
    this.options.onBeforeAction && this.options.onBeforeAction.apply(this, args);
    this.options.action && this.options.action.apply(this, args);
    this.options.onAfterAction && this.options.onAfterAction.apply(this, args);
};


Router = new FakeRouter();
