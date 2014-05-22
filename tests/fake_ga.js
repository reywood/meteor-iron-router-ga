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

    experiments: {},

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

    chooseVariation: function() {
        throw new Exception("chooseVariation should never be called in the context of this project");
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
    }
};
