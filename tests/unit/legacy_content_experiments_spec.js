require("should");

require("./lib/fake_deps");
require("./lib/fake_window");

var eventLog = require("./lib/event_log");
var fakeCxApi = require("./lib/fake_cxapi");
var fakeGa = require("./lib/fake_ga");
var fakeRouter = require("./lib/fake_router");

require("../../lib/router");


describe("content experiments (legacy):", function() {

    beforeEach(function() {
        eventLog.reset();
        fakeGa.reset();
        fakeCxApi.reset();
        fakeRouter.reset();
    });

    it("should display a variant and send an event", function() {
        var route = Router.route("home", {
            gaContentExperiment: {
                id: "a1b2c3d4e5f6g7h8i9",
                variationTemplates: [ "template1", "template2", "template3" ]
            }
        });

        route.run();
        simulateCxApiScriptLoad();
        route.action();

        route.renderedTemplate.should.match(/^(template1|template2|template3)$/);

        eventLog.count().should.equal(5);
        eventLog.eventAtIndexShouldBe(0, "ga", [ "set", "page", "http://localhost/home" ]);
        eventLog.eventAtIndexShouldBe(1, "cxApi.getChosenVariation", [ "a1b2c3d4e5f6g7h8i9" ]);
        eventLog.eventAtIndexShouldBe(2, "cxApi.chooseVariation", []);
        eventLog.eventAtIndexShouldBe(3, "ga", [ "send", "event", "iron-router-ga", "Choose experiment variation", "a1b2c3d4e5f6g7h8i9", 0 ]);
        eventLog.eventAtIndexShouldBe(4, "cxApi.getChosenVariation", [ "a1b2c3d4e5f6g7h8i9" ]);
    });

    it("should choose a variant if none is set", function() {
        var route = Router.route("home", {
            gaContentExperiment: {
                id: "a1b2c3d4e5f6g7h8i9",
                variationTemplates: [ "template1", "template2", "template3" ]
            }
        });

        route.run();
        simulateCxApiScriptLoad();
        route.action();

        cxApi.chooseVariationCalled.should.be.true;
    });

    it("should display the same template if a variant has been set", function() {
        cxApi.setChosenVariationForTesting(1);

        for (var i = 0; i < 100; i++) {
            eventLog.reset();
            fakeRouter.reset();

            var route = Router.route("home", {
                gaContentExperiment: {
                    id: "a1b2c3d4e5f6g7h8i9",
                    variationTemplates: [ "template1", "template2", "template3" ]
                }
            });

            route.run();
            simulateCxApiScriptLoad();
            route.action();

            route.renderedTemplate.should.equal("template2");

            eventLog.count().should.equal(3);
            eventLog.eventAtIndexShouldBe(0, "ga", [ "set", "page", "http://localhost/home" ]);
            eventLog.eventAtIndexShouldBe(1, "cxApi.getChosenVariation", [ "a1b2c3d4e5f6g7h8i9" ]);
            eventLog.eventAtIndexShouldBe(2, "cxApi.getChosenVariation", [ "a1b2c3d4e5f6g7h8i9" ]);
        }
    });

    it("should behave normally if no experiment is configured", function() {
        var route = Router.route("home", {});

        route.execute();

        (route.renderedTemplate === null).should.be.true;
    });

});

var simulateCxApiScriptLoad = function() {
    window.cxApi = cxApi;
};
