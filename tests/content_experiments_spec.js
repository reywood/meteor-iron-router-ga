require("should");

var jsdom = require("jsdom").jsdom;
window = jsdom().createWindow();
document = window.document;

require("./fakes/fake_deps");
var fakeCxApi = require("./fakes/fake_cxapi");
var fakeGa = require("./fakes/fake_ga");
var fakeRouter = require("./fakes/fake_router");
require("../lib/router");


describe("content experiments:", function() {

    beforeEach(function() {
        fakeGa.reset();
        fakeCxApi.reset();
        fakeRouter.reset();
    });

    it("should display a variant and send an event", function() {
        var route = Router.route("home", {
            contentExperiment: {
                id: "a1b2c3d4e5f6g7h8i9",
                variationTemplates: [ "template1", "template2", "template3" ]
            }
        });

        route.run();
        simulateCxApiScriptLoad();
        route.action();

        route.renderedTemplate.should.match(/^(template1|template2|template3)$/);

        fakeGa.queue.length.should.equal(1);
        fakeGa.queue[0][0].should.equal("send");
        fakeGa.queue[0][1].should.equal("event");
        fakeGa.queue[0][2].should.equal("iron-router-ga");
        fakeGa.queue[0][3].should.equal("Choose experiment variation");

        fakeGa.callStack.length.should.equal(2);
        fakeGa.callStack[0].should.equal("cxApi.setChosenVariation");
        fakeGa.callStack[1].should.equal("ga");
    });

    it("should choose a variant if none is set", function() {
        var route = Router.route("home", {
            contentExperiment: {
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
        cxApi.setChosenVariation(1, "a1b2c3d4e5f6g7h8i9");

        for (var i = 0; i < 100; i++) {
            fakeRouter.reset();

            var route = Router.route("home", {
                contentExperiment: {
                    id: "a1b2c3d4e5f6g7h8i9",
                    variationTemplates: [ "template1", "template2", "template3" ]
                }
            });

            route.run();
            simulateCxApiScriptLoad();
            route.action();

            route.renderedTemplate.should.equal("template2");
        }
    });

    it("should behave normally if no experiment is configured", function() {
        var route = Router.route("home");

        route.execute();

        (route.renderedTemplate === null).should.be.true;
    });

});

var simulateCxApiScriptLoad = function() {
    window.cxApi = cxApi;
};
