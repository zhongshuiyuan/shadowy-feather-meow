/**
 * filename:demoHeadWidget.js
 * desc:demo head
 * deps:requirejs, SfModuleBase
 * authors:zc
 * time:2015-10-09 10:59:20
 * version:0.0.1
 * updatelog:
 * 0.0.1:the first version
 *
 **/

define([
    'jquery', 'underscore', 'sfModuleBase', 'text!./demoHeadWidget.html'
], function(
    $, _, SfModuleBase, DemoHeadWidgetTpl
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

    var DemoHeadWidget = SfModuleBase.extend({
        constructor: function(options) {
            var me = this;
            me.base(options);
            me.dataMgr = _valueOrDefault(options, 'dataMgr', null);
            me.config = _valueOrDefault(options, 'config', null);
            me.data.title = me.dataMgr.getData('sysConfig').title;
        },
        render: function(options) {
            var me = this;

            var el = me.el = _valueOrDefault(options, 'el', null) || me.el;
            if (el.length == 0) {
                return me;
            }
            $(el).html(_.template(DemoHeadWidgetTpl)({
                title: me.data.title
            }));
            me.resize();
            return me;
        },
        resize: function() {
            var me = this;
        },
        destroy: function() {
            var me = this;
            me.base();
        },

        __className__: 'DemoHeadWidget',
        version: VERSION
    });

    return DemoHeadWidget;
});
