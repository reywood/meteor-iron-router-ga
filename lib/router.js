import { Iron } from 'meteor/iron:core';

import { initContentExperiements } from './content_experiments';

Iron.Router.plugins.ironRouterGA = function ironRouterGA(router) {
    router.onRun(function onRun() {
        setPage.call(this);
        trackPageView.call(this);
        this.next();
    });

    initContentExperiements(router);
};

function setPage() {
    if (window.ga) {
        window.ga('set', 'page', this.url);
    }
}

function trackPageView() {
    const shouldTrackPageView = !!this.lookupOption('trackPageView');
    if (shouldTrackPageView && window.ga) {
        window.ga('send', 'pageview');
    }
}
