if (typeof window === "undefined") { window = {}; }

if (!window.ga) {
    gaCallStack = [];

    ga = window.ga = function() {
        var args = [].slice.apply(arguments);
        gaCallStack.push("ga");
        ga.queue.push(args);
    };

    ga.queue = [];
}

module.exports = {
    reset: function() {
        window.ga = ga;
        ga.queue = [];
        gaCallStack = [];
    }
};
