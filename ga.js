var gaSettings = Meteor.settings.public && Meteor.settings.public.ga || {};

if (gaSettings.trackingId) {
    (function(i,s,o,g,r,a,m) {
        i["GoogleAnalyticsObject"]=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    }(window, document, "script", "//www.google-analytics.com/analytics.js", "ga"));

    var options = {
        cookieDomain: gaSettings.cookieDomain || window.location.hostname,
        cookieName: gaSettings.cookieName,
        cookieExpires: gaSettings.cookieExpires
    };

    window.ga("create", gaSettings.trackingId, options);

    if (gaSettings.forceSSL) {
        window.ga("set", "forceSSL", true);
    }
    if (gaSettings.displayfeatures) {
        window.ga("require", "displayfeatures");
    }
} else {
    window.ga = (function() {
        var run = true;
        return function() {
            if (run) {
                console.log("Analytics settings not found");
                run = false;
            }
        };
    }());
}
