var techs = {
    levels          : require('enb/techs/levels'),
    files           : require('enb/techs/files'),
    provider        : require('enb/techs/file-provider'),
    bemdecl         : require('enb/techs/bemdecl-from-bemjson'),
    css             : require('enb-stylus/techs/css-stylus'),
    autoprefixer    : require('enb-autoprefixer/techs/css-autoprefixer'),
    js              : require('enb-diverse-js/techs/browser-js'),
    prepend         : require('enb-modules/techs/prepend-modules'),
    bemhtml         : require('enb-bemxjst/techs/bemhtml'),
    html            : require('enb/techs/html-from-bemjson'),
    borschik        : require('enb-borschik/techs/borschik'),
    'deps-modules'  : require('enb-modules/techs/deps-with-modules')
};

module.exports = function(config) {

    config.nodes('desktop.bundles/*', function(nodeConfig) {
        nodeConfig.addTechs([
            use('levels', { levels: getLevels(config) }),
            use('provider', { target: '?.bemjson.js' }),
            use('bemdecl'),
            use('deps-modules'),
            use('files'),

            use('css', { target : '?.noprefix.css' }),
            use('autoprefixer', { sourceTarget : '?.noprefix.css', destTarget : '?.css', browserSupport : getDesktopBrowsers() }),
            use('borschik', { sourceTarget: '?.css', destTarget: '?.min.css', minify: true, freeze: true }),

            use('js', { target: '?.browser.js' }),
            use('prepend', { source: '?.browser.js', target: '?.js' }),
            use('borschik', { sourceTarget: '?.js', destTarget: '?.min.js', minify: true, freeze: true }),

            use('bemhtml', { devMode: false }),
            use('html', { destTarget: '?.src.html' }),
            use('borschik', { sourceTarget: '?.src.html', destTarget: '?.html', minify: true, freeze: true }),

        ]);
        nodeConfig.addTargets(['?.min.css', '?.min.js', '?.html']);
    });

};

function getLevels(config) {
    return [
        { 'path':'libs/bem-core/common.blocks','check':false },
        { 'path':'libs/bem-core/desktop.blocks','check':false },
        { 'path':'libs/bem-components/common.blocks','check':false },
        { 'path':'libs/bem-components/desktop.blocks','check':false },
        { 'path':'libs/bem-components/design/common.blocks','check':false },
        { 'path':'libs/bem-components/design/desktop.blocks','check':false },
        { 'path':'common.blocks','check':true },
        { 'path':'desktop.blocks','check':true }
    ].map(function(level) { return config.resolvePath(level); });
}

function use(tech, params) {
    return [
        techs[tech],
            params || {}
    ];
}

function getDesktopBrowsers() {
    return [
        'last 2 versions',
        'ie 10',
        'ff 24',
        'opera 12.16'
    ];
}
