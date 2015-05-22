var eventLog = require('./event_log');

if (typeof window === 'undefined') { window = {}; }

window.ga = ga = function() {
    var args = [].slice.apply(arguments);
    eventLog.add('ga', args);
};

module.exports = {
    reset: function() {
        window.ga = ga;
    }
};
