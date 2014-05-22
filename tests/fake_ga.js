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
    NO_CHOSEN_VARIATION: 1000000000,

    getChosenVariation: function(experimentId) {
        return this.chosenVariation || this.NO_CHOSEN_VARIATION;
    },

    setChosenVariation: function(variationIndex, experimentId) {
        this.chosenVariation = variationIndex;
        gaCallStack.push("cxApi.setChosenVariation");
    },

    chooseVariation: function() {

    },

    setDomainName: function(domainName) {

    },

    setCookiePath: function(cookiePath) {

    },

    setAllowHash: function(allowHash) {

    },

    reset: function() {
        this.chosenVariation = this.NO_CHOSEN_VARIATION;
    }
};
