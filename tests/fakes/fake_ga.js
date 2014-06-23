if (typeof window === "undefined") { window = {}; }

var callStack = [];
var queue = [];

window.ga = ga = function() {
    var args = [].slice.apply(arguments);
    callStack.push("ga");
    queue.push(args);
};

module.exports = {
    callStack: callStack,
    queue: queue,

    reset: function() {
        window.ga = ga;
        queue.length = 0;
        callStack.length = 0;
    }
};
