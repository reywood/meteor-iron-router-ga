module.exports = function(grunt) {
    "use strict";

    grunt.loadNpmTasks('grunt-simple-mocha');

    grunt.initConfig({
        simplemocha: {
            options: {
                ignoreLeaks: false,
                ui: "bdd",
                useColors: !grunt.option("no-color")
            },

            all: {
                src: [
                    "tests/**/*_spec.js"
                ]
            }
        }
    });

    grunt.registerTask("default", [ "simplemocha" ]);
};
