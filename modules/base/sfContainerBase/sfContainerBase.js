/**
 * filename:sfContainerBase.js
 * desc:container base module
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

    /**
     *
     * containerInfo: {
     *     id: {string} cid,
     *     container: {$dom},
     *     width: {number},
     *     height: {number}
     * }
     *
     */
    

    var SfContainerBase = SfModuleBase.extend({
        constructor: function(options) {
            var me = this;
            me.base(options);
            me.dataMgr = _valueOrDefault(options, 'dataMgr', null);
            me.panels = _valueOrDefault(options, 'panels', null);
            if (me.dataMgr) {
                var t = me.data.t = 'sfcb_' + me.getId();
                me.dataMgr.registerMethod('resize', me.resize, me, t);
                me.dataMgr.registerMethod('container_getHandle', me.getId, me, t);
            }
        },
        render: function(options){
            var me = this;

            var el = me.el = _valueOrDefault(options, 'el', null) || me.el;
            if (el.length == 0) {
                return me;
            }
            if(typeof me.__init__ == 'function'){
                me.__init__(options);
            }
            me.resize();
            return me;
        },
        resize: function(){
            var me = this;
        },
        getContainer: function(options){
            var me = this;
            var t = _valueOrDefault(options, 'type', null);
            var r = _valueOrDefault(options, 'region', null);
            var id = _valueOrDefault(options, 'id', null);
            var a = _valueOrDefault(options, 'available', true);
            var cd = me.__containerDesc__;
            if(!t || !r || !cd){
                return null;
            }
            var tcd = me.__findContainer__(options);
            if(!tcd){
                return null;
            }
            if(id){
                return tcd;
            }else{
                if(tcd.cid && tcd.container && a){
                    tcd.container.remove();
                }
                if(!tcd.cid || !tcd.container){
                    var cid = tcd.id + '_' + me.fguid() + '_' + new Date().getTime();
                    var w = tcd.width == null ? '100%' : tcd.width + 'px';
                    var h = tcd.height == null ? '100%' : tcd.height + 'px';
                    var c = $('<div id="' + cid + '"></div>');
                    c.css('width', w).css('height', h).addClass('sf-viewContainer');
                    c.appendTo($(me.el).find('#' + tcd.id));
                    tcd.cid = cid;
                    tcd.container = c;
                    tcd.state |= 1;
                }

                if(tcd.count == undefined){
                    tcd.count = 0;
                }
                tcd.count++;
                return tcd;
            }
        },
        showContainer: function(visible, options){
            var me = this;
            var op = {};
            $.extend(true, op, options, {
                available: false
            })
            var tcd = me.__findContainer__(op);
            if(tcd && tcd.container){
                var fn1 = visible ? 'onShow' : 'onHide';
                var fn2 = visible ? 'onShown' : 'onHidden';
                var cb1 = tcd[fn1] || _valueOrDefault(options, fn1, null);
                var tci = me.__getCtnrInfo__(tcd);
                if(typeof cb1 == 'function'){
                    cb1(tci);
                }
                if(visible){
                    tcd.container.show();
                }else{
                    tcd.container.hide();
                }
                var cb2 = tcd[fn2] || _valueOrDefault(options, fn2, null);
                if(typeof cb2 == 'function'){
                    cb2(tci);
                }
            }
        },
        __init__: function(options){
            var me =  this;
            var panels = me.panels = me.panels || _valueOrDefault(options, 'panels', null);
            if(panels == null){
                me.__containerDesc__ = null;
                return me;
            }
            if(typeof me.__initContainer__ == 'function'){
                me.__initContainer__();
            }
            if(typeof me.__initCD__ == 'function'){
                me.__initCD__();
            }
            return me;
        },
        __initContainer__: function(){
            var me = this;
        },
        __initCD__: function(){
            /**
            *
            * containerDesc:{
            *     {type}: [{
            *         type: {string},
            *         region: {string},
            *         state: {int},
            *         id: {string},
            *         container: {$dom},
            *         cid: {string},
            *         onOpen: function(containerInfo){},
            *         onClose: function(containerInfo){}
            *     }]
            * }
            *
            * have container filled when rendered
            *
            **/

            var me = this;
            me.__containerDesc__ = {};
        },
        __findContainer__: function(options){
            var me = this;
            var t = _valueOrDefault(options, 'type', null);
            var r = _valueOrDefault(options, 'region', null);
            var id = _valueOrDefault(options, 'id', null);
            var a = _valueOrDefault(options, 'available', true);
            var cd = me.__containerDesc__;
            if(!t || !r || !cd){
                return null;
            }
            var ts = t.split(',');
            var rs = r.split(',');
            for(var k in cd){
                for(var i = 0;i < ts.length;i++){
                    if(k != ts[i]){
                        continue;
                    }
                    for(var j = 0;j < cd[k].length;j++){
                        for(var l = 0;l < rs.length;l++){
                            var tcd = cd[k][j];
                            if(tcd.region != rs[l]){
                                continue;
                            }

                            if(id){
                                if(id == tcd.cid){
                                    return tcd;
                                }
                            }else{
                                if(!a || (cd[k][j].state & 1) == 0){
                                    return tcd;
                                }
                            }
                        }
                    }
                }
            }

            return null;
        },
        __findContainerByCid__: function(cid, type, region){
            var me = this;
            var cd = me.__containerDesc__;
            if(!cd || !cid){
                return null;
            }
            for(var k in cd){
                if(type && k != type){
                    continue;
                }
                for(var i = 0;i < cd[k].length;i++){
                    var tcd = cd[k][i];
                    if(region && region != tcd.region){
                        continue;
                    }
                    if(tcd.cid == cid){
                        return tcd;
                    }
                }
            }
            return null;
        },
        __getCtnrInfo__: function(cd){
            var ci = {};
            for(var i in cd){
                if(i == 'id'){
                    continue;
                }
                if(typeof i == 'function'){
                    continue;
                }
                if(i == 'cid'){
                    ci['id'] = cd[i];
                }
                ci[i] = cd[i];
            }
            return ci;
        },
        openContainer: function(options){
            var me = this;
            var cd = me.getContainer(options);
            if(!cd){
                return;
            }
            var cb = cd.onOpen = _valueOrDefault(options, 'onOpen', null);
            cd.onOpened = _valueOrDefault(options, 'onOpened', null);
            cd.onClose = _valueOrDefault(options, 'onClose', null);
            cd.onClosed = _valueOrDefault(options, 'onClosed', null);
            cd.onShow = _valueOrDefault(options, 'onShow', null);
            cd.onShown = _valueOrDefault(options, 'onShown', null);
            cd.onHide = _valueOrDefault(options, 'onHide', null);
            cd.onHidden = _valueOrDefault(options, 'onHidden', null);
            var ci = me.__getCtnrInfo__(cd);
            if(typeof cb == 'function'){
                cb(ci);
            }
            if(typeof cd.onOpened == 'function'){
                cd.onOpened(ci);
            }
        },
        closeContainer: function(options){
            var me = this;
            var t = _valueOrDefault(options, 'type', null);
            var r = _valueOrDefault(options, 'region', null);
            var id = _valueOrDefault(options, 'id', null);
            var a = _valueOrDefault(options, 'available', true);
            var cd = me.__containerDesc__;
            if(!cd || !id){
                return;
            }
            for(var k in cd){
                if(t && t != k){
                    continue;
                }
                for(var i = 0;i < cd[k].length;i++){
                    var cdi = cd[k][i];
                    if(cdi.cid == id){
                        var cb1 = cdi.onClose;
                        if(typeof cb1 == 'function'){
                            cb1(me.__getCtnrInfo__(cdi));
                        }
                        if(cdi.container){
                            cdi.container.remove();
                        }
                        var cb2 = cdi.onClosed;
                        if(typeof cb2 == 'function'){
                            cb2(me.__getCtnrInfo__(cdi));
                        }
                        cdi.state &= 0;
                    }
                }
            }
        },
        __getPanel__: function(region){
            var me = this;
            var p = null;
            if(p = me.panels){
                for(var i = 0;i < p.length;i++){
                    if(p[i].region == region){
                        return p[i];
                    }
                }
            }
            return null;
        },
        destroy: function() {
            var me = this;

            if (me.dataMgr) {
                var t = me.data.t;
                me.dataMgr.unregisterMethod('resize', me, t);
                me.dataMgr.unregisterMethod('container_getHandle', me, t);
            }

            me.base();
        },

        __className__: 'SfContainerBase',
        version: VERSION
    });

    return SfContainerBase;
});
