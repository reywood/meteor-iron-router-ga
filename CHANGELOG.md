## v2.0.0 (2017-05-11)

* Update for Meteor 1.4
* Use plugin architecture instead of wrapping `Router.route`

## v0.7.1 (2015-09-26)

Bug fixes:

* Use `ga('set', '&uid', Meteor.userId())` instead of `ga('set', 'userId', Meteor.userId())` per Google's instructions when setting up user ID tracking

## v0.7.0 (2015-09-26)

Features:

* Add user ID tracking via `trackUserId` configuration option
