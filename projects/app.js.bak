/**
 * filename:app.js
 * desc:frame app
 * deps:requirejs
 * authors:zc
 * time:2015-07-02 18:06:44
 * version:0.0.1
 * updatelog:
 * 0.0.1:the first version
 *
 **/

requirejs.config({
    baseUrl: "./",
    paths: {
        'jquery': './base/jquery/jquery.min',
        'json': './base/json/json2',
        'text': './base/require/text',
        'css': './base/require/css.min',
        'underscore': './base/underscore/underscore',
        'xml2json': './base/jquery/plugins/jquery.xml2json',
        'bootstrap': './base/bootstrap/bootstrap',

        'jquery_zTree': './base/jquery/plugins/jquery.ztree.all-3.5.min',
        'jquery_nanoScroller': './base/jquery/plugins/jquery.nanoscroller.min',

        'bootstrap_select': './base/bootstrap/plugins/bootstrap-select',
        'bootstrap_contextmenu': './base/bootstrap/plugins/bootstrap-contextmenu',
        'bootstrap_popover': './base/bootstrap/plugins/bootstrap-popover',

        /*===================================
        =            base module            =
        ===================================*/
        'base': './modules/base/base/base',
        'sfModuleBase': './modules/base/sfModuleBase/sfModuleBase',
        'sfEvent': './modules/base/sfEvent/sfEvent',
        'sfDataManager': './modules/base/sfDataManager/sfDataManager',
        'sfModuleManager': './modules/base/sfModuleManager/sfModuleManager',
        'sfLayoutBase': './modules/base/sfLayoutBase/sfLayoutBase',
        'sfContainerBase': './modules/base/sfContainerBase/sfContainerBase',
        'sfMenuBase': './modules/base/sfMenuBase/sfMenuBase',
        'sfAppBase': './modules/base/sfAppBase/sfAppBase',
        /*=====  End of base module  ======*/

        'systemConfig': './projects/config',

        'projectConfig': './projects/' + SF.config.project + '/config',
        'projectApp': './projects/' + SF.config.project + '/app'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'xml2json': ['jquery'],
        'bootstrap': ['jquery']
    }
});

require([
    'systemConfig', 'projectConfig', 'projectApp', 'css!./projects/' + SF.config.project + '/app.css'
], function(
    systemConfig, projectConfig, SfApp
) {
    var ns = window;

    var config = {};
    $.extend(true, config, systemConfig, projectConfig);
    var app = new SfApp({
        config: config,
        el: ns
    });
    app.render();
    $(ns).on('unload', function() {
        app.destroy();
    });
    $(ns).on('resize', function() {
        app.resize();
    });
});
