/**
 * filename:app.js
 * desc:demo app
 * deps:jquery, SfAppBase
 * authors:zc
 * time:2015-10-09 09:44:17
 * version:0.0.1
 * updatelog:
 * 0.0.1:the first version
 *
 **/

requirejs.config({
    baseUrl: "./",
    paths: {
        "openLayers2": "./modules/com/map/OpenLayers/OpenLayers",

        "baiduTileLayer": "./modules/com/map/layer/baidu/baiduTileLayer"
    },
    shim: {
        'baiduTileLayer': ['openLayers2']
    }
});

define(['jquery', 'underscore', 'sfAppBase'], function($, _, SfAppBase) {
    var VERSION = '0.0.1';

    var DemoApp = SfAppBase.extend({
        constructor: function(options) {
            var me = this;
            me.base(options);
            // me.el.document.oncontextmenu = function() {
            //     return false;
            // };
        },
        start: function() {
            var me = this;
            return me;
        },
        destroy: function() {
            var me = this;
            me.base();
        },

        __className__: 'DemoApp',
        version: VERSION
    });

    return DemoApp;
});
