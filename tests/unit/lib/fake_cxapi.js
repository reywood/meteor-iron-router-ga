var eventLog = require('./event_log');

if (typeof window === 'undefined') { window = {}; }

var DEFAULT_VARIATION = 0;

window.cxApi = cxApi = {
    NO_CHOSEN_VARIATION: -1,
    NOT_PARTICIPATING: -2,
    ORIGINAL_VARIATION: 0,

    chosenVariation: -1,
    chooseVariationCalled: false,

    getChosenVariation: function(experimentId) {
        eventLog.add('cxApi.getChosenVariation', [ experimentId ]);
        return this.chosenVariation;
    },

    chooseVariation: function() {
        this.chooseVariationCalled = true;
        this.setChosenVariationForTesting(DEFAULT_VARIATION);
        eventLog.add('cxApi.chooseVariation', []);
        return DEFAULT_VARIATION;
    },

    setDomainName: function(domainName) {
        this.domainName = domainName;
    },

    setCookiePath: function(cookiePath) {
        this.cookiePath = cookiePath;
    },

    setAllowHash: function(allowHash) {
        this.allowHash = allowHash;
    },

    setChosenVariationForTesting: function(variationIndex) {
        this.chosenVariation = variationIndex;
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
