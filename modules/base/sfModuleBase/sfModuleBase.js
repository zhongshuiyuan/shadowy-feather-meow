/**
 * filename:sfModuleBase.js
 * desc:base module
 * deps:requirejs
 * authors:zc
 * time:2015-08-28 14:45:20
 * version:0.0.1
 * updatelog:
 * 0.0.1:the first version
 *
 **/

define(['jquery', 'underscore', 'base', 'sfEvent'], function($, _, Base, sfEvent) {
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

    var SfModuleBase = Base.extend({
        constructor: function(options) {
            var me = this;
            me.data = {};
            me.data.options = options;
            me.eventBus = sfEvent;
            me.el = _valueOrDefault(options, 'el', null);
            me.config = _valueOrDefault(options, 'config', null);
            var t = me.data.t = me.fguid() + '_' + new Date().getTime();
            me.__id__ = me.__className__ + '_' + t;
        },
        fguid: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        getId: function() {
            var me = this;
            return me.__id__;
        },
        render: function(options) {
            var me = this;

            var el = me.el = _valueOrDefault(options, 'el', null) || me.el;
            return me;
        },
        show: function(options){
            var me = this;
            return me;
        },
        destroy: function() {
            var me = this;

            if(me.el){
                $(me.el).remove();
            }

            delete me.data;
        },

        __className__: 'SfModuleBase',
        version: VERSION
    });

    return SfModuleBase;
});
