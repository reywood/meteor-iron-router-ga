Package.describe({
    name: 'reywood:iron-router-ga',
    summary: 'Google analytics (universal edition) with some Iron Router sugar for tracking page views.',
    version: '2.0.0',
    git: 'https://github.com/reywood/meteor-iron-router-ga.git',
});

Package.onUse((api) => {
    api.versionsFrom('METEOR@1.4.1');
    api.use([
        'ecmascript',
        'modules',
    ], ['client', 'server']);
    api.use([
        'accounts-base',
        'templating',
        'tracker',
        'iron:router',
    ], 'client');

    api.addFiles([
        'lib/content_experiments.js',
        'lib/head.html',
        'lib/ga.js',
        'lib/router.js',
    ], 'client');

    api.addFiles([
        'lib/browser_policy.js',
    ], 'server');
});
