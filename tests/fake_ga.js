window = {};

gaCallStack = [];

ga = window.ga = function() {
    var args = [].slice.apply(arguments);
    gaCallStack.push("ga");
    ga.queue.push(args);
};

ga.queue = [];

ga.reset = function() {
    ga.queue = [];
    gaCallStack = [];
};


cxApi = window.cxApi = {
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
        gaCallStack.push("cxApi.setChosenVariation");
    },

    chooseVariation: function(experimentId) {
        this.chooseVariationCalled = true;
        this.setChosenVariation(0, experimentId);
        return 0;
    },

    setDomainName: function(domainName) {

    },

    setCookiePath: function(cookiePath) {

    },

    setAllowHash: function(allowHash) {

    },

    reset: function() {
        this.chosenVariation = this.NO_CHOSEN_VARIATION;
        this.experiments = {};
        this.chooseVariationCalled = false;
    }
};
