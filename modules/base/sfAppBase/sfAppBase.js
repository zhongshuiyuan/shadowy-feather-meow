/**
 * filename:sfAppBase.js
 * desc:app base module
 * deps:jquery, SfModuleBase
 * authors:zc
 * time:2015-07-04 12:49:07
 * version:0.0.1
 * updatelog:
 * 0.0.1:the first version
 *
 **/

define([
    'jquery', 'underscore', 'sfModuleBase', 'sfDataManager', 'sfModuleManager'
], function(
    $, _, SfModuleBase, SfDataManager, SfModuleManager
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

    var SfAppBase = SfModuleBase.extend({
        constructor: function(options) {
            var me = this;
            me.base(options);
            me.__init__(options);
        },
        render: function(options) {
            var me = this;

            var el = me.el = _valueOrDefault(options, 'el', null) || me.el;
            if (!el) {
                return me;
            }
            el.document.title = me.config.docTitle;
            if (me.config.login.mode == -1) {
                me._loadMain();
            }else{
                me.moduleMgr.loadLogin(function(login){
                    login.destroy();
                    me._loadMain();
                });
            }
            return me;
        },
        resize: function() {
            var me = this;
            if (me.moduleMgr) {
                me.moduleMgr.resize();
            }
        },
        __init__: function(options) {
            var me = this;
            var cf = me.config = _valueOrDefault(options, 'config', null);
            if (!cf) {
                return;
            }
            var dataMgr = me.dataMgr = new SfDataManager();
            var mMgr = me.moduleMgr = new SfModuleManager({
                el: me.el.document,
                dataMgr: dataMgr,
                config: cf
            });
            dataMgr.setData({
                sysConfig: cf
            });
        },
        start: function() {
            var me = this;
        },
        _loadMain: function() {
            var me = this;
            me.moduleMgr.loadLayout(function(layout) {
                var panels = layout.getPanels();
                me.moduleMgr.loadContainer(panels, function(container) {
                    me.moduleMgr.loadMenu(function() {
                        me.moduleMgr.loadToolbar(function() {
                            me.moduleMgr.loadPre(function() {
                                me.start();
                            });
                        });
                    });
                });
            });
            return me;
        },
        destroy: function() {
            var me = this;

            if (me.moduleMgr) {
                me.moduleMgr.destroy();
            }

            me.base();
        },

        __className__: 'SfAppBase',
        version: VERSION
    });

    return SfAppBase;
});
