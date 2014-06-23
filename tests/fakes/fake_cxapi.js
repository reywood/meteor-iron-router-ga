var fakeGa = require("./fake_ga");

if (typeof window === "undefined") { window = {}; }

window.cxApi = cxApi = {
    NO_CHOSEN_VARIATION: -1,
    NOT_PARTICIPATING: -2,
    ORIGINAL_VARIATION: 0,

    experiments: {},
    chooseVariationCalled: false,

    getChosenVariation: function(experimentId) {
        if (this.experiments[experimentId]) {
            return this.experiments[experimentId].chosenVariation;
        }
        return this.NO_CHOSEN_VARIATION;
    },

    setChosenVariation: function(variationIndex, experimentId) {
        this.experiments[experimentId] = { chosenVariation: variationIndex };
        fakeGa.callStack.push("cxApi.setChosenVariation");
    },

    chooseVariation: function(experimentId) {
        this.chooseVariationCalled = true;
        this.setChosenVariation(0, experimentId);
        return 0;
    },

    setDomainName: function(domainName) {
        this.domainName = domainName;
    },

    setCookiePath: function(cookiePath) {
        this.cookiePath = cookiePath;
    },

    setAllowHash: function(allowHash) {
        this.allowHash = allowHash;
    }
};


module.exports = {
    reset: function() {
        window.cxApi = cxApi;
        cxApi.chosenVariation = cxApi.NO_CHOSEN_VARIATION;
        cxApi.experiments = {};
        cxApi.chooseVariationCalled = false;
    }
};
