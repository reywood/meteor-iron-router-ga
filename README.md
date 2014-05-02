# iron-router-ga

Google analytics ([universal edition](https://support.google.com/analytics/answer/2790010?hl=en)) for [Meteor](https://www.meteor.com/) with some [Iron Router](https://github.com/EventedMind/iron-router) sugar for tracking page views.

## Installation

```sh
$ mrt add iron-router-ga
```

## Configuration

Configure analytics by adding a `ga` section to the `public` section of your [Meteor settings](http://docs.meteor.com/#meteor_settings).

```json
{
    "public": {
        "ga": {
            "trackingId": "UA-XXXX-Y"
        }
    }
}
```

Available configuration options:

* **trackingId** -- string, *required*

    Your web property's Google Analytics tracking ID

* **cookieDomain** - string, *optional*

    The domain for the GA cookie, defaults to full website domain

* **cookieName** - string, *optional*

    The name used to store the GA cookie

* **cookieExpires** - integer, *optional*

    The expiration time (in seconds) of the GA cookie

* **forceSSL** - boolean, *optional*

    Force GA to use SSL for communication even if site is not using SSL, defaults to false

* **displayFeatures** - boolean, *optional*

    Enable [Display Advertising Features](https://developers.google.com/analytics/devguides/collection/analyticsjs/display-features), defaults to false

Advanced configuration example:

```json
{
    "public": {
        "ga": {
            "trackingId": "UA-XXXX-Y",
            "cookieDomain": "example.com",
            "cookieName": "my_ga_cookie",
            "cookieExpires": 3600,
            "forceSSL": true,
            "displayFeatures": true
        }
    }
}
```


## Usage

Simply by installing this package, you will have access to the `ga` function anywhere you need it. You can use it just as you would on any other site.

### Event Tracking

[Tracking events](https://developers.google.com/analytics/devguides/collection/analyticsjs/events) is exactly the same:

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

--------------------------------------------------------

If you find a bug or would like to see an improvement made, please [file an issue or submit a pull request on GitHub](https://github.com/reywood/meteor-iron-router-ga/issues).
