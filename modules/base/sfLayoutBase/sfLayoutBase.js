/**
 * filename:sfLayoutBase.js
 * desc:layout base module
 * deps:jquery, SfModuleBase
 * authors:zc
 * time:2015-07-04 12:49:07
 * version:0.0.1
 * updatelog:
 * 0.0.1:the first version
 *
 **/

define(['jquery', 'underscore', 'sfModuleBase'], function($, _, SfModuleBase) {
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

    var SfLayoutBase = SfModuleBase.extend({
        constructor: function(options) {
            var me = this;
            me.base(options);
            me.dataMgr = _valueOrDefault(options, 'dataMgr', null);
            if (me.dataMgr) {
                var t = me.data.t = 'sflb_' + me.getId();
                me.dataMgr.registerMethod('layout_getHandle', me.getId, me, me.data.t);
                me.dataMgr.registerMethod('resize', me.resize, me, t);
            }
            if(typeof me.__init__ == 'function'){
                me.__init__(options);
            }
        },
        render: function(options){
            var me = this;

            var el = me.el = _valueOrDefault(options, 'el', null) || me.el;
            if (el.length == 0) {
                return me;
            }
            me.resize();
            return me;
        },
        resize: function(){
            var me = this;
            var el = me.el;
        },
        getPanels: function() {
            var me = this;
            if(!me.panels){
                return null;
            }
            var hf = ['disabled'];
            var panels = [];
            for (var i = 0;i < me.panels.length;i++) {
                if (!me.panels[i].disabled) {
                    var p = {};
                    for(var k in me.panels[i]){
                        if($.inArray(k, hf) >= 0){
                            continue;
                        }
                        p[k] = me.panels[i][k];
                    }
                    p.panel = $(me.el).find('#' + me.panels[i].id);
                    panels.push(p);
                }
            }
            return panels;
        },
        __init__: function(options){
            /*
            panels: [{
                id: {string},
                region: {string}
                visible: {bool},
                disabled: {bool},
                [width]: {number},
                [height]: {number}
            }]
            */
        },
        destroy: function() {
            var me = this;

            if (me.dataMgr) {
                var t = me.data.t;
                me.dataMgr.unregisterMethod('resize', me, t);
                me.dataMgr.unregisterMethod('layout_getHandle', me, me.data.t);
            }

            for (var i = 0;i < me.panels.length;i++){
                $(me.el).find('#' + me.panels[i].id).remove();
            }
            delete me.panels;

            me.base();
        },

        __className__: 'SfLayoutBase',
        version: VERSION
    });

    return SfLayoutBase;
});
