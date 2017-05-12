import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
    if (typeof BrowserPolicy === 'undefined') { return; }

    BrowserPolicy.content.allowImageOrigin('www.google-analytics.com');
    BrowserPolicy.content.allowScriptOrigin('www.google-analytics.com');
});
