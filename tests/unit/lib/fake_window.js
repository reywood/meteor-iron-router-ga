window = {
    document: {
        createElement: function() {
            return {};
        },

        getElementById: function() {
            return {};
        },

        getElementsByTagName: function() {
            return [
                {
                    appendChild: function() { }
                }
            ];
        }
    }
};

document = window.document;
