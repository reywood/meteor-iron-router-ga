require('should');

var eventLog = [];

module.exports = {
    reset: function() {
        eventLog = [];
    },

    add: function(module, args) {
        eventLog.push({ module: module, args: args });
    },

    count: function() {
        return eventLog.length;
    },

    eventAtIndexShouldBe: function(index, module, args) {
        eventLog[index].module.should.equal(module);
        eventLog[index].args.length.should.equal(args.length);
        for (var i = 0; i < args.length; i++) {
            args[i].should.equal(eventLog[index].args[i]);
            // eventLog[index].args[i].should.equal(args[i]);
        }
    }
};
