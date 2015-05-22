var FakeRouter = function() {
    this.routes = {};
};

FakeRouter.prototype.configure = function(options) {
    this.options = options;
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
        throw new Exception('Route not found: ' + name);
    }

    route.execute.apply(route, args);
};


var FakeRoute = function(name, options) {
    this.name = this.path = name;
    this.options = options;
    this.renderedTemplate = null;
    this.nextCallCount = 0;
    this.url = 'http://localhost/' + name;

    this.route = this;
    this.router = { options: {} };
};

FakeRoute.prototype.render = function(template) {
    this.renderedTemplate = template;
};

FakeRoute.prototype.execute = function() {
    var args = [].slice.apply(arguments);

    if (!callHandlerThatRequiresNextCall.call(this, this.options.onRun, args)) {
        return;
    }

    if (!callHandlerThatRequiresNextCall.call(this, this.options.onBeforeAction, args)) {
        return;
    }

    this.options.action && this.options.action.apply(this, args);
    this.options.onAfterAction && this.options.onAfterAction.apply(this, args);
};

FakeRoute.prototype.run = function() {
    var args = [].slice.apply(arguments);
    this.options.onRun && this.options.onRun.apply(this, args);
};

FakeRoute.prototype.action = function() {
    var args = [].slice.apply(arguments);
    var nextCallCountBeforeCall;

    nextCallCountBeforeCall = this.nextCallCount;
    this.options.onBeforeAction && this.options.onBeforeAction.call(this);
    if (this.nextCallCount === nextCallCountBeforeCall) {
        return;
    }

    this.options.action && this.options.action.apply(this, args);
    this.options.onAfterAction && this.options.onAfterAction.apply(this, args);
};

FakeRoute.prototype.next = function() {
    this.nextCallCount++;
};


var callHandlerThatRequiresNextCall = function(handler, args) {
    if (!handler) { return true; }

    var nextCallCountBeforeCall = this.nextCallCount;
    handler.apply(this, args);

    if (this.nextCallCount === nextCallCountBeforeCall) {
        return false;
    } else if (this.nextCallCount - nextCallCountBeforeCall !== 1) {
        throw new Error('this.next() called too many times');
    }

    return true;
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
