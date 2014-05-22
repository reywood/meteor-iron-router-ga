Package.describe({
    summary: "Google analytics (universal edition) with some Iron Router sugar for tracking page views."
});

Package.on_use(function(api) {
    api.use("iron-router", "client");

    api.add_files([ "lib/ga.js", "lib/router.js" ], "client");
});
