require("should");

var jsdom = require("jsdom").jsdom;
window = jsdom().createWindow();
document = window.document;

require("./fake_deps");
require("./fake_ga");
require("./fake_router");
require("../lib/router");


describe("content experiments:", function() {

    beforeEach(function() {
        ga.reset();
        cxApi.reset();
        Router.reset();
    });

    it("should display a variant and send an event", function() {
        var route = Router.route("home", {
            gaContentExperiment: {
                id: "a1b2c3d4e5f6g7h8i9",
                variationTemplates: [ "template1", "template2", "template3" ]
            }
        });

        route.run();
        window.cxApi = cxApi;
        route.action();

        route.renderedTemplate.should.match(/^(template1|template2|template3)$/);

        ga.queue.length.should.equal(1);
        ga.queue[0][0].should.equal("send");
        ga.queue[0][1].should.equal("event");
        ga.queue[0][2].should.equal("iron-router-ga");
        ga.queue[0][3].should.equal("Choose experiment variation");

        gaCallStack[0].should.equal("cxApi.setChosenVariation");
        gaCallStack[1].should.equal("ga");
    });

    it("should choose a variant if none is set", function() {
        var route = Router.route("home", {
            gaContentExperiment: {
                id: "a1b2c3d4e5f6g7h8i9",
                variationTemplates: [ "template1", "template2", "template3" ]
            }
        });

        route.run();
        window.cxApi = cxApi;
        route.action();

        cxApi.chooseVariationCalled.should.be.true;
    });

    it("should display the same template if a variant has been set", function() {
        cxApi.setChosenVariation(1, "a1b2c3d4e5f6g7h8i9");

        for (var i = 0; i < 100; i++) {
            Router.reset();

            var route = Router.route("home", {
                gaContentExperiment: {
                    id: "a1b2c3d4e5f6g7h8i9",
                    variationTemplates: [ "template1", "template2", "template3" ]
                }
            });

            route.run();
            window.cxApi = cxApi;
            route.action();

            route.renderedTemplate.should.equal("template2");
        }
    });

    it("should behave normally if no experiment is configured", function() {
        var route = Router.route("home", {});

        route.execute();

        (route.renderedTemplate === null).should.be.true;
    });

});
