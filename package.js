Package.describe({
    name: "reywood:iron-router-ga",
    summary: "Google analytics (universal edition) with some Iron Router sugar for tracking page views.",
    version: "0.5.3",
    git: "https://github.com/reywood/meteor-iron-router-ga.git"
});

Package.onUse(function(api) {
    api.versionsFrom("METEOR@1.0.1");
    api.use([ "templating", "iron:router@1.0.0" ], "client");

    api.addFiles([
        "lib/head.html",
        "lib/ga.js",
        "lib/router.js"
    ], "client");
});
