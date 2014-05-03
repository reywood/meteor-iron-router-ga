# iron-router-ga

Google analytics ([universal edition](https://support.google.com/analytics/answer/2790010?hl=en)) for [Meteor](https://www.meteor.com/) with some [Iron Router](https://github.com/EventedMind/iron-router) sugar for tracking page views.

## Installation

```sh
$ mrt add iron-router-ga
```

## Configuration

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

* **`createOptions`** -- string or object literal

    Options you would like to pass to the `ga("create", "UA-XXXX-Y", ...)` call. If this is
    a string, it should be the domain you would like to use for the GA cookie. If this is an
    object literal, it should have any of `cookieDomain`, `cookieName`, `cookieExpires`, etc
    as properties. Details at Google's
    [Advanced Configuration](https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced)
    page. See advanced example below. Defaults to `"auto"`.

* **`set`** -- object literal

    Settings to apply to the tracker. These include `forceSSL`, `anonymizeIp`, etc. Details at
    Google's [Advanced Configuration](https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced)
    page. See advanced example below.

* **`require`** -- object literal

    Additional tracking options to require such as
    [Display Advertising Features](https://developers.google.com/analytics/devguides/collection/analyticsjs/display-features) or
    [Enhanced Link Attribution](https://support.google.com/analytics/answer/2558867).
    For features like `displayfeatures` that don't have a corresponding `*.js` parameter (as
    `linkid` does), simply set the property value to `true`.

Advanced configuration example:

```json
{
    "public": {
        "ga": {
            "id": "UA-XXXX-Y",
            "createOptions": {
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
