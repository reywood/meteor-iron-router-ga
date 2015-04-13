Meteor.startup(function() {
    if (typeof BrowserPolicy === 'undefined') { return; }

    BrowserPolicy.content.allowImageOrigin('www.google-analytics.com');
    BrowserPolicy.content.allowScriptOrigin('www.google-analytics.com');
});
