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

For more info on possible values for the configuration options below, check out Google's
[Advanced Configuration](https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced)
page.

* **`create`** -- object literal

    Options you would like to pass to the `ga("create", "UA-XXXX-Y", ...)` call. It should have
    any of `cookieDomain`, `cookieName`, `cookieExpires`, etc as properties. Defaults to the
    string `"auto"`.

* **`set`** -- object literal

    Settings to apply to the tracker with `ga("set", ...)`. These include `forceSSL`, `anonymizeIp`, etc.

* **`require`** -- object literal

    Additional tracking options to require with `ga("require", ...)` such as
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

--------------------------------------------------------

If you find a bug or would like to see an improvement made, please [file an issue or submit a pull request on GitHub](https://github.com/reywood/meteor-iron-router-ga/issues).
