var gaSettings = Meteor.settings.public && Meteor.settings.public.ga || {},
    createOptions, requireValue, _undefined;

if (gaSettings.id) {
    (function(i,s,o,g,r,a,m) {
        i["GoogleAnalyticsObject"]=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    }(window, document, "script", "//www.google-analytics.com/analytics.js", "ga"));

    createOptions = gaSettings.createOptions || "auto";

    window.ga("create", gaSettings.id, createOptions);

    if (gaSettings.set) {
        for (var key in gaSettings.set) {
            if (gaSettings.set.hasOwnProperty(key)) {
                window.ga("set", key, gaSettings.set[key]);
            }
        }
    }

    if (gaSettings.require) {
        for (var key in gaSettings.require) {
            if (gaSettings.require.hasOwnProperty(key)) {
                requireValue = gaSettings.require[key];
                if (typeof requireValue === "string") {
                    window.ga("require", key, requireValue);
                } else {
                    window.ga("require", key);
                }
            }
        }
    }
} else {
    window.ga = (function() {
        var hasRun = false;
        return function() {
            if (!hasRun) {
                hasRun = true;
                console.log("Analytics settings not found");
            }
        };
    }());
}
