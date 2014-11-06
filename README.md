# iron-router-ga

[![Build Status](https://travis-ci.org/reywood/meteor-iron-router-ga.svg?branch=master)](https://travis-ci.org/reywood/meteor-iron-router-ga)

Google analytics ([universal edition](https://support.google.com/analytics/answer/2790010?hl=en)) for [Meteor](https://www.meteor.com/) with some [Iron Router](https://github.com/EventedMind/iron-router) sugar for tracking page views and doing A/B testing with [Content Experiments](https://developers.google.com/analytics/devguides/platform/experiments).

## Installation

```sh
$ meteor add reywood:iron-router-ga
```

## Meteor Settings

Configure analytics by adding a `ga` section to the `public` section of your [Meteor settings](http://docs.meteor.com/#meteor_settings). The only required property is `id` which is your Google Analytics tracking ID.

```json
{
    "public": {
        "ga": {
            "id": "UA-XXXX-Y"
        }
    }
}
```

### Advanced configuration options:

For more info on possible values for the configuration options below, check out Google's [Advanced Configuration](https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced) page.

* **`create`** -- object literal

    Options you would like to pass to `ga("create", "UA-XXXX-Y", ...)`. Should have any of `cookieDomain`, `cookieName`, `cookieExpires`, etc as properties.

* **`set`** -- object literal

    Settings to apply to the tracker with `ga("set", ...)`. These include `forceSSL`, `anonymizeIp`, etc.

* **`require`** -- object literal

    Additional tracking options to require with `ga("require", ...)` such as [Display Advertising Features](https://developers.google.com/analytics/devguides/collection/analyticsjs/display-features) or [Enhanced Link Attribution](https://support.google.com/analytics/answer/2558867). For features like `displayfeatures` that don't have a corresponding `*.js` parameter (as `linkid` does), simply set the property value to `true`.

Advanced configuration example:

```json
{
    "public": {
        "ga": {
            "id": "UA-XXXX-Y",
            "create": {
                "cookieDomain": "example.com",
                "cookieName": "my_ga_cookie",
                "cookieExpires": 3600
            },
            "set": {
                "forceSSL": true,
                "anonymizeIp": true
            },
            "require": {
                "displayfeatures": true,
                "linkid": "linkid.js"
            }
        }
    }
}
```


## Usage

Once you have installed this package and added the required configuration, you will have access to the `ga` function anywhere in your Meteor code. You can use it just as you would on any other site.

### Event Tracking

[Tracking events](https://developers.google.com/analytics/devguides/collection/analyticsjs/events) is the same as always:

```javascript
ga("send", "event", category, action, label, value);
```

### Page View Tracking

Tracking page views is accomplished by adding configuration options to Iron Router. You can enable page view tracking for every route site-wide by configuring the router like so:

```javascript
Router.configure({
    trackPageView: true
});
```

Alternately, you can enable tracking for certain routes individually like so:

```javascript
Router.route("routeName", {
    // ...
    trackPageView: true
    // ...
});

// ** or **

Router.map(function() {
    this.route("routeName", {
        // ...
        trackPageView: true
        // ...
    });
});
```

If you have enabled site-wide page view tracking but want to disable it for a certain route:

```javascript
Router.route("routeName", {
    // ...
    trackPageView: false
    // ...
});
```

### A/B Testing with Content Experiments

Each route in your app can be configured with an experiment ID and a list of templates to show for each variation. First, you must set up the experiment in your Google Analytics dashboard. Once that's done, add a `contentExperiment` configuration option to the route you want to experiment on (see snippet below for details). The number of templates specified in the `variationTemplates` array property *must* match the number of variations (including the original) configured for the experiment.

All visitors to the site are assigned to one of the variations according to the settings for your experiment (multi-arm bandit, percentage of traffic to experiment, etc). These settings are configured in your Google Analytics dashboard or via [Google's API](https://developers.google.com/analytics/devguides/config/mgmt/v3/mgmtExperimentsGuide). Returning visitors will see the same variation they saw the first time they visited.

Any route with an experiment assigned to it will also track an event. This event will show up in your analytics dashboard under the category "iron-router-ga". This is a requirement for experiments in order to record a user's chosen variation.

```javascript
Router.route("routeName", {
    // ...
    contentExperiment: {
        id: "YOUR_EXPERIMENT_ID",
        variationTemplates: [ "original", "variation1", "variation2" ]
    }
    // ...
});
```

```handlebars
<template name="original">
    Original
</template>

<template name="variation1">
    Variation 1
</template>

<template name="variation2">
    Variation 2
</template>
```

--------------------------------------------------------

If you find a bug or would like to see an improvement made, please [file an issue or submit a pull request on GitHub](https://github.com/reywood/meteor-iron-router-ga/issues).
