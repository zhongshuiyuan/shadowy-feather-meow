/**
 * filename:demoMenu.js
 * desc:
 * deps:requirejs, SfMenuBase
 * authors:zc
 * time:2015-10-09 08:54:07
 * version:0.0.1
 * updatelog:
 * 0.0.1:the first version
 *
 **/

define([
    'jquery', 'underscore', 'sfMenuBase', 'text!./demoMenu.html', 'bootstrap'
], function(
    $, _, SfMenuBase, DemoMenuTpl
) {
    var VERSION = '0.0.1';

    function _attr(o, k, v) {
        try {
            var ks = k.split('.');
            if (!o) {
                o = {};
            }
            var ot = o;
            var i = 0;
            for (i = 0; i < ks.length - 1; i++) {
                if (!ot[ks[i]]) {
                    ot[ks[i]] = {};
                }
                ot = ot[ks[i]];
            }
            if (typeof v != 'undefined') {
                ot[ks[i]] = v;
            }
            return ot[ks[i]];
        } catch (e) {

        }

        return undefined;
    }

    function _valueOrDefault(obj, property, defaultValue) {
        try {
            if (!obj) {
                return defaultValue;
            }
            var val = _attr(obj, property);
            if (typeof val == 'undefined') {
                return defaultValue;
            }
            return val;
        } catch (e) {
            return defaultValue;
        }
    }

    var DemoMenu = SfMenuBase.extend({
        constructor: function(options) {
            var me = this;
            me.base(options);
        },
        render: function(options) {
            var me = this;

            var el = me.el = _valueOrDefault(options, 'el', null) || me.el;
            if (el.length == 0) {
                return me;
            }
            $(el).html(_.template(DemoMenuTpl)({
                menus: me.menu
            }));
            me.base();
            return me;
        },
        resize: function() {
            var me = this;
        },
        destroy: function() {
            var me = this;
            me.base();
        },

        __className__: 'DemoMenu',
        version: VERSION
    });

    return DemoMenu;
});
