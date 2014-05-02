iron-router-ga
==============

Google analytics ([universal edition](https://support.google.com/analytics/answer/2790010?hl=en)) for [Meteor](https://www.meteor.com/) with some [Iron Router](https://github.com/EventedMind/iron-router) sugar.

Installation
------------

```sh
$ mrt add iron-router-ga
```

Usage
-----

Simply by installing this package, you will have access to the `ga` function anywhere you need it. You can use it just as you would on any other site. [Tracking events](https://developers.google.com/analytics/devguides/collection/analyticsjs/events) is exactly the same:

```javascript
ga("send", "event", category, action, label, value);
```

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

--------------------------------------------------------

If you find a bug or would like to see an improvement made, please [file an issue or submit a pull request on GitHub](https://github.com/reywood/meteor-iron-router-ga/issues).
