require("should");
var fakeGa = require("./lib/fake_ga");
var fakeRouter = require("./lib/fake_router");
var eventLog = require("./lib/event_log");
require("../../lib/router");

describe("page view:", function() {

    beforeEach(function() {
        eventLog.reset();
        fakeGa.reset();
        fakeRouter.reset();
    });

    it("should set page and track page view if trackPageView is globally configured", function() {
        Router.configure({
            trackPageView: true
        });
        Router.route("test-route");

        Router.executeRoute("test-route");

        eventLog.count().should.equal(2);
        eventLog.eventAtIndexShouldBe(0, "ga", [ "set", "page", "http://localhost/test-route" ]);
        eventLog.eventAtIndexShouldBe(1, "ga", [ "send", "pageview" ]);
    });

    it("should set page and track page view", function() {
        Router.route("test-route", {
            trackPageView: true
        });

        Router.executeRoute("test-route");

        eventLog.count().should.equal(2);
        eventLog.eventAtIndexShouldBe(0, "ga", [ "set", "page", "http://localhost/test-route" ]);
        eventLog.eventAtIndexShouldBe(1, "ga", [ "send", "pageview" ]);
    });

    it("should not track page view but should set page", function() {
        Router.configure({
            trackPageView: true
        });
        Router.route("test-route", {
            trackPageView: false
        });

        Router.executeRoute("test-route");

        eventLog.count().should.equal(1);
        eventLog.eventAtIndexShouldBe(0, "ga", [ "set", "page", "http://localhost/test-route" ]);
    });

    it("should call route's onRun handler and pass along arguments if tracking is enabled", function() {
        var arg1Value = null;

        Router.route("test-route", {
            trackPageView: true,
            onRun: function(arg1) {
                arg1Value = arg1;
                this.next();
            }
        });

        Router.executeRoute("test-route", "foo");

        arg1Value.should.equal("foo");
    });

    it("should not interfere with route's onRun handler if tracking is disabled", function() {
        var arg1Value = null;

        Router.route("test-route", {
            trackPageView: false,
            onRun: function(arg1) {
                arg1Value = arg1;
                this.next();
            }
        });

        Router.executeRoute("test-route", "foo");

        arg1Value.should.equal("foo");
    });

    it("should call next() after tracking the page view", function() {
        Router.route("test-route", {
            trackPageView: true
        });

        Router.executeRoute("test-route");

        Router.routes["test-route"].nextCallCount.should.equal(1);
    });

    it("should handle routes with no options", function() {
        Router.route("no-options");
    });
});
