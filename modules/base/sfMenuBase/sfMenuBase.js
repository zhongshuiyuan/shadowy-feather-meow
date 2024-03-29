/**
 * filename:sfMenuBase.js
 * desc:menu base module
 * deps:requirejs, SfModuleBase
 * authors:zc
 * time:2015-09-07 11:31:10
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

    var SfMenuBase = SfModuleBase.extend({
        constructor: function(options) {
            var me = this;
            me.base(options);
            me.dataMgr = _valueOrDefault(options, 'dataMgr', null);
            me.__init__(options);
            if (me.dataMgr) {
                var t = me.data.t = 'sfmb_' + me.getId();
                me.dataMgr.registerMethod('resize', me.resize, me, t);
            }
        },
        render: function(options) {
            var me = this;
            me.resize();
            me.__bindEvents__();
            return me;
        },
        resize: function() {
            var me = this;
        },
        __init__: function(options) {
            var me = this;
            me.moduleMgr = _valueOrDefault(options, 'moduleMgr', null);
            var menus = me.menu = [];
            var mi = _valueOrDefault(options, 'menuInfo', null);
            if (!mi) {
                return;
            }
            for (var i = 0; i < mi.length; i++) {
                var gp = mi[i].group;
                var mg = null;
                for (var j = 0; j < menus.length; j++) {
                    if (menus[j].id == gp) {
                        mg = menus[j];
                        break;
                    }
                }
                if (mg == null) {
                    mg = {
                        id: gp,
                        name: mi[i].groupName,
                        mid: me.__className__ + '_m0_' + me.fguid() + '_' + new Date().getTime(),
                        children: []
                    };
                    menus.push(mg);
                }
                var m = {};
                $.extend(true, m, mi[i], {
                    mid: me.__className__ + '_m1_' + me.fguid() + '_' + new Date().getTime()
                });
                mg.children.push(m);
                // if(m.url){
                //     $(me.el).find('#' + m.mid).on('click', function() {
                //         me.moduleMgr.loadModule(m);
                //     });
                // }
            }
        },
        __bindEvents__: function(){
            var me = this;
            var menus = me.menu;
            for(var i = 0;i < menus.length;i++){
                for(var j = 0;j < menus[i].children.length;j++){
                    var m = menus[i].children[j];
                    if(m.url){
                        var $m = me.el.find('#' + m.mid);
                        if(m.menuType == 'toggle' & m.checked == true){
                            $m.addClass('sf-menubase-checked');
                        }
                        $m.on('click', (function(m, md) {
                            return function(){
                                var p = m.param || null;
                                var cb = function(m2){
                                    m.module = m2;
                                };
                                if(m.menuType == 'toggle'){
                                    var $md = $(md);
                                    if($md.hasClass('sf-menubase-checked')){
                                        $md.removeClass('sf-menubase-checked');
                                        if(m.module){
                                            me.moduleMgr.destroyModule({
                                                mid: m.module.getId()
                                            }, m.type != 'none');
                                        }
                                    }else{
                                        $md.addClass('sf-menubase-checked');
                                        me.moduleMgr.loadModule(m, p, cb);
                                    }
                                    return;
                                }
                                me.moduleMgr.loadModule(m, p, cb);
                            };
                        })(m, this));
                    }
                }
            }
        },
        destroy: function() {
            var me = this;

            if (me.dataMgr) {
                var t = me.data.t;
                me.dataMgr.unregisterMethod('resize', me, t);
            }

            me.base();
        },

        __className__: 'SfMenuBase',
        version: VERSION
    });

    return SfMenuBase;
});
