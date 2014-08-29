module.exports = function(grunt) {
    "use strict";

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks('grunt-simple-mocha');

    grunt.initConfig({
        jshint: {
            options: {
                "jshintrc": true
            },

            all: {
                files: {
                    src: [
                        "Gruntfile.js",
                        "lib/**/*.js",
                        "tests/**/*.js"
                    ]
                }
            }
        },

        simplemocha: {
            options: {
                ignoreLeaks: false,
                ui: "bdd",
                useColors: !grunt.option("no-color")
            },

            all: {
                src: [
                    "tests/unit/**/*_spec.js"
                ]
            }
        }
    });

    grunt.registerTask("default", [ "jshint", "simplemocha" ]);
};
