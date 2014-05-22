require("should");
require("./fake_ga");
require("./fake_router");
require("../lib/router");

Meteor = {
    settings: {}
};

describe("content experiments:", function() {

    var settings = {
        "public": {
            "ga": {
                "contentExperiments": {
                    "routes": {
                        "home": {
                            "experimentId" : "a1b2c3d4e5f6g7h8i9",
                            "variationTemplates": [ "template1", "template2", "template3" ]
                        }
                    }
                }
            }
        }
    };

    beforeEach(function() {
        ga.reset();
        cxApi.reset();
        Router.reset();
        Meteor.settings = {};
    });

    it("should display a variant and track page view", function() {
        Meteor.settings = settings;

        var route = Router.route("home", {});

        route.execute();

        route.renderedTemplate.should.match(/^(template1|template2|template3)$/);

        ga.queue.length.should.equal(1);
        ga.queue[0][0].should.equal("send");
        ga.queue[0][1].should.equal("pageview");
        ga.queue[0][2].should.equal("home");

        gaCallStack[0].should.equal("cxApi.setChosenVariation");
        gaCallStack[1].should.equal("ga");
    });

    it("should behave normally", function() {
        Meteor.settings = {};

        var route = Router.route("home", {});

        route.execute();

        (route.renderedTemplate === null).should.be.true;
    });

});
