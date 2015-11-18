/**
 * filename:sfModuleManager.js
 * desc:module manager
 * deps:requirejs, SfModuleBase
 * authors:zc
 * time:2015-09-07 11:30:59
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
     * module set
     *
     * moduleSet: {
     *     type: [{
     *         "type": type,
     *         "url": {string},
     *         "fid": {string},
     *         "mid": {string},
     *         "cid": {string},
     *         "style": {string},
     *         "module": {module},
     *         ["moduleInfo"]: {
     *             ["type"]: {string}, ['head'|'title'|'logo'|'menu'|'toolbar'|'main|...]
     *             ["region"]: {string}, ['north'|'south'|'west'|'east'|'center'|'float'|'none']
     *             ["width"]: {number},
     *             ["height"]: {number},
     *             ["left"]: {number},
     *             ["top"]: {number},
     *             ["right"]: {number},
     *             ["bottom"]: {number},
     *             ["exclusive"]: {bool},
     *         }
     *     }] ['layout'|'container'|'menu'|'toolbar'|'module']
     * }
     *
     * module count: {
     *     url: {int}
     * }
     *
     */


    /**
     *
     * config:{
     *     "layout": {
     *         "url": {string},
     *         "config": {string},
     *         "style": {string}
     *     },
     *     "container": {
     *         "url": {string},
     *         "config": {string},
     *         "style": {string}
     *     },
     *     "server": {
     *         ipk: {string}
     *     },
     *     "service": [{
     *         "name": {string},
     *         "url": {string}
     *     }],
     *     "menu": [{
     *         "url": {string},
     *         "config": {string},
     *         "style": {string},
     *         "type": {string},
     *         "region": {string},
     *         "fun": {Array<functionItem>}
     *     }],
     *     "toolbar": {Array<functionItem>}, ?
     *     "pre": {?}
     * }
     *
     *
     * functionItem: {
     *     "name": {string},
     *     "icon": {string},
     *     "url": {string},
     *     "config": {string},
     *     "style": {string},
     *     "type": {string}, ['head'|'title'|'logo'|'menu'|'toolbar'|'main'|...]
     *     "region": {string}, ['north'|'south'|'west'|'east'|'center'|'float'|'none']
     *     ["width"]: {number},
     *     ["height"]: {number},
     *     ["left"]: {number},
     *     ["top"]: {number},
     *     ["right"]: {number},
     *     ["bottom"]: {number},
     *     ["exclusive"]: {bool}, true
     *     ["max"]: {int} 1,
     *     ["group"]: {int}, for menu
     *     ["groupName"] : {string} for menu
     * }
     *
     */




    var SfModuleManager = SfModuleBase.extend({
        constructor: function(options) {
            var me = this;
            me.base(options);
            me.dataMgr = _valueOrDefault(options, 'dataMgr', null);
            me.config = _valueOrDefault(options, 'config', null);
            me.__init__(options);
            if(me.dataMgr){
                var t = me.data.t = 'sfmm_' + me.getId();
                me.dataMgr.registerMethod('resize', me.resize, me, t);
                me.dataMgr.registerMethod('getServiceUrl', me.getServiceUrl, me, t);
            }
        },
        render: function(options) {
            var me = this;

            var el = me.el = _valueOrDefault(options, 'el', null) || me.el;
            if (el.length == 0) {
                return me;
            }
            var cf = me.config = _valueOrDefault(options, 'config', me.config);
            if (!cf) {
                return me;
            }
            me.resize();
            return me;
        },
        resize: function() {
            var me = this;
            var ms = me.data.__ms__;
            var ks = ['layout', 'container', 'menu', 'toolbar', 'module'];
            for (var k = 0; k < ks.length; k++) {
                var mi = ms[ks[k]];
                if (mi) {
                    for (var i = 0; i < mi.length; i++) {
                        var m = mi[i].module;
                        if (typeof m.resize == 'function') {
                            m.resize();
                        }
                    }
                }
            }
            return me;
        },
        getServiceUrl: function(name, params){
            var me = this;
            var svc = me.data.__svc__;
            if(!svc || !name){
                return null;
            }
            for(var i = 0;i < svc.length;i++){
                var si = svc[i];
                if(si.name == name){
                    var u = si.url;
                    if(params){
                        for(var k in params){
                            var v = params[k];
                            if(v == null){
                                continue;
                            }
                            u = u.replace('{{' + k + '}}', v);
                        }
                    }
                    return u;
                }
            }
            return null;
        },
        loadLogin: function(onLogin){
            var me = this;
            var ms = me.data.__ms__;
            var cf = me.config && me.config.login;
            if (!cf) {
                return;
            }
            me.destroyModule({
                type: 'login'
            });
            var u = cf.url;
            var c = cf.config;
            var s = cf.style;
            me.__loadM__({
                url: u,
                config: c,
                style: s,
                deps: cf.deps,
                onLoaded: function(Module, config, style) {
                    var login = me.login = new Module({
                        el: $(me.el).find('body'),
                        dataMgr: me.dataMgr,
                        config: config,
                        moduleMgr: me,
                        onLogin: function(){
                            if(typeof onLogin == 'function'){
                                onLogin(login);
                            }
                        }
                    });
                    login.render();
                    ms.login = ms.login || [];
                    var lo = {
                        type: 'login',
                        url: u,
                        fid: null,
                        mid: login.getId(),
                        cid: null,
                        style: s,
                        module: login
                    };
                    ms.login.push(lo);
                    if (me.data.__mc__[u] == undefined) {
                        me.data.__mc__[u] = 0;
                    }
                    me.data.__mc__[u]++;
                    me.data.__ml__.push(lo);
                }
            });
            return me;
        },
        loadLayout: function(onLayoutLoaded) {
            var me = this;
            var ms = me.data.__ms__;
            var cf = me.config && me.config.layout;
            if (!cf) {
                return;
            }
            me.destroyModule({
                type: 'layout'
            });
            var u = cf.url;
            var c = cf.config;
            var s = cf.style;
            me.__loadM__({
                url: u,
                config: c,
                style: s,
                deps: cf.deps,
                onLoaded: function(Module, config, style) {
                    var layout = me.layout = new Module({
                        el: $(me.el).find('body'),
                        dataMgr: me.dataMgr,
                        config: config,
                        moduleMgr: me
                    });
                    layout.render();
                    ms.layout = ms.layout || [];
                    var lo = {
                        type: 'layout',
                        url: u,
                        fid: null,
                        mid: layout.getId(),
                        cid: null,
                        style: s,
                        module: layout
                    };
                    ms.layout.push(lo);
                    if (me.data.__mc__[u] == undefined) {
                        me.data.__mc__[u] = 0;
                    }
                    me.data.__mc__[u]++;
                    me.data.__ml__.push(lo);
                    if (typeof onLayoutLoaded == 'function') {
                        onLayoutLoaded(layout);
                    }
                }
            });
            return me;
        },
        loadContainer: function(panels, onContainerLoaded) {
            var me = this;
            var ms = me.data.__ms__;
            var cf = me.config && me.config.container;
            if (!cf) {
                return;
            }
            me.destroyModule({
                type: 'container'
            });
            var u = cf.url;
            var c = cf.config;
            var s = cf.style;
            me.__loadM__({
                url: u,
                config: c,
                style: s,
                deps: cf.deps,
                onLoaded: function(Module, config, style) {
                    var cntr = me.container = new Module({
                        el: $(me.el).find('body'),
                        dataMgr: me.dataMgr,
                        config: config,
                        moduleMgr: me,
                        panels: panels
                    });
                    cntr.render();
                    ms.container = ms.container || [];
                    var co = {
                        type: 'container',
                        url: u,
                        fid: null,
                        mid: cntr.getId(),
                        cid: null,
                        style: s,
                        module: cntr
                    };
                    ms.container.push(co);
                    if (me.data.__mc__[u] == undefined) {
                        me.data.__mc__[u] = 0;
                    }
                    me.data.__mc__[u]++;
                    me.data.__ml__.push(co);
                    if (typeof onContainerLoaded == 'function') {
                        onContainerLoaded(cntr);
                    }
                }
            });
            return me;
        },
        loadMenu: function(onMenuLoaded) {
            var me = this;
            var mc = me.config && me.config.menu;
            if (!mc) {
                return;
            }
            me.destroyModule({
                type: 'menu'
            });
            var lc = 0;
            for (var i = 0; i < mc.length; i++) {
                var mci = mc[i];
                var op = {};
                $.extend(true, op, mci, {
                    moduleType: 'menu'
                });
                me.loadModule(op, {
                    menuInfo: mci.fun
                }, function(module) {
                    lc++;
                    if (lc == mc.length) {
                        if (typeof onMenuLoaded == 'function') {
                            onMenuLoaded();
                        }
                    }
                });
            }
            return me;
        },
        loadToolbar: function(onToolbarLoaded) {
            var me = this;
            var cf = me.config && me.config.toolbar;
            if (!cf) {
                return;
            }
            me.destroyModule({
                type: 'toolbar'
            });
            if (typeof onToolbarLoaded == 'function') {
                onToolbarLoaded(null);
            }
            return me;
        },
        loadPre: function(onPreLoaded){
            var me = this;
            var cf = me.config && me.config.pre;
            if(!cf){
                return;
            }
            var lc1 = 0;
            var lc2 = 0;
            var gc = function(options){
                lc1++;
                if(options.children){
                    for(var i = 0;i < options.children.length;i++){
                        gc(options.children[i]);
                    }
                }
                if(options.render){
                    for(var i = 0;i < options.render.length;i++){
                        gc(options.render[i]);
                    }
                }
            };
            var lf = function(options){
                me.loadModule(options, null, function(m){
                    lc2++;
                    if(options.children){
                        for(var i = 0;i < options.children.length;i++){
                            lf(options.children[i]);
                        }
                    }
                    if(lc2 == lc1){
                        if(typeof onPreLoaded == 'function'){
                            onPreLoaded();
                        }
                    }
                }, function(m){
                    if(options.render){
                        for(var i = 0;i < options.render.length;i++){
                            lf(options.render[i]);
                        }
                    }
                    if(lc2 == lc1){
                        if(typeof onPreLoaded == 'function'){
                            onPreLoaded();
                        }
                    }
                });
            };
            for(var i = 0;i < cf.length;i++){
                gc(cf[i]);
            }
            for(var i = 0;i < cf.length;i++){
                lf(cf[i]);
            }
            return me;
        },
        loadModule: function(options, params, onModuleLoaded, onModuleRendered) {
            var me = this;
            var ms = me.data.__ms__;
            var t = _valueOrDefault(options, 'moduleType', 'module');
            var mt = _valueOrDefault(options, 'type', null);
            var r = _valueOrDefault(options, 'region', null);
            var u = _valueOrDefault(options, 'url', null);
            var cb = function(m) {
                if (typeof onModuleLoaded == 'function') {
                    onModuleLoaded(m);
                }
            };
            var cb2 = function(m){
                if(typeof onModuleRendered == 'function'){
                    onModuleRendered(m);
                }
            };
            var cmgr = me.container;
            if (!cmgr) {
                cb(null);
                return;
            }
            if (!u) {
                cb(null);
                return;
            }
            var mi = me.__findModule__({
                url: u
            });
            var nf = true;
            if(mi && mi.length > 0){
                var tmi = mi[0];
                var mn = tmi.moduleInfo.maxnum;
                mn = mn == undefined ? 1 : mn;
                nf = mi.length < mn;
                mi = mi[mi.length - 1];
            }
            if (!nf && mi) {
                if(mi.moduleInfo.region == 'none'){
                    mi.module.render();
                    return;
                }
                var op = {};
                $.extend(true, op, options, {
                    type: mi.moduleInfo.type,
                    region: mi.moduleInfo.region,
                    id: mi.cid,
                    available: _valueOrDefault(mi, 'moduleInfo.exclusive', true),
                    onShown: function(containerInfo) {
                        cb(mi.module);
                    }
                });
                cmgr.showContainer(true, op);
                return;
            } else {
                var c = _valueOrDefault(options, 'config', null);
                var s = _valueOrDefault(options, 'style', null);
                me.__loadM__({
                    url: u,
                    config: c,
                    style: s,
                    deps: _valueOrDefault(options, 'deps', null),
                    onLoaded: function(Module, config, style) {
                        var m = null;
                        if(r == 'none'){
                            var p = {
                                el: null,
                                config: config,
                                dataMgr: me.dataMgr,
                                moduleMgr: me,
                                onRendered: function(m2){
                                    cb2(m2);
                                }
                            };
                            if (params) {
                                $.extend(true, p, params);
                            }
                            m = new Module(p);
                            m.render();
                            ms[t] = ms[t] || [];
                            var mo = {
                                url: u,
                                fid: null,
                                mid: m.getId(),
                                cid: null,
                                style: s,
                                module: m,
                                moduleInfo: options
                            };
                            ms[t].push(mo);
                            if (me.data.__mc__[u] == undefined) {
                                me.data.__mc__[u] = 0;
                            }
                            me.data.__mc__[u]++;
                            me.data.__ml__.push(mo);
                            cb(m);
                            return;
                        }
                        var op = {};
                        $.extend(true, op, options, {
                            available: _valueOrDefault(options, 'exclusive', true),
                            onOpen: function(containerInfo) {
                                var cid = containerInfo.id;
                                var el = containerInfo.container;
                                var p = {
                                    el: el,
                                    config: config,
                                    dataMgr: me.dataMgr,
                                    moduleMgr: me,
                                    onRendered: function(m2){
                                        cb2(m2);
                                    }
                                };
                                $.extend(true, p, containerInfo);
                                if (params) {
                                    $.extend(true, p, params);
                                }
                                m = new Module(p);
                                m.render();
                                ms[t] = ms[t] || [];
                                var mo = {
                                    url: u,
                                    fid: null,
                                    mid: m.getId(),
                                    cid: cid,
                                    style: s,
                                    module: m,
                                    moduleInfo: options
                                };
                                ms[t].push(mo);
                                if (me.data.__mc__[u] == undefined) {
                                    me.data.__mc__[u] = 0;
                                }
                                me.data.__mc__[u]++;
                                me.data.__ml__.push(mo);
                                cb(m);
                            },
                            onOpened: function(containerInfo){
                                if(m && typeof m.show == 'function'){
                                    m.show();
                                }
                                if(m && typeof m.resize == 'function'){
                                    m.resize();
                                }
                            },
                            onClose: function(containerInfo){
                                if(m){
                                    var op = {};
                                    $.extend(true, op, {
                                        mid: m.getId()
                                    });
                                    me.destroyModule(op);
                                }
                            }
                        });
                        cmgr.openContainer(op);
                    }
                });
            }
            return me;
        },
        destroyModule: function(options, ctnr) {
            var me = this;
            var ms = me.data.__ms__;
            if (ms == null) {
                return null;
            }

            var t = _valueOrDefault(options, 'type', null);
            var u = _valueOrDefault(options, 'url', null);
            var mid = _valueOrDefault(options, 'mid', null);
            for (var i in ms) {
                if (t && t != i) {
                    continue;
                }
                var mi = ms[i];
                if (mid || u) {
                    for (var j = 0; j < mi.length; j++) {
                        var m = mi[j];
                        if (m.mid && m.mid == mid || m.url && m.url == u) {
                            me.__destroyM__(m, ctnr);
                            if (me.data.__mc__[m.url]) {
                                me.data.__mc__[m.url]--;
                            }
                            var ml = me.data.__ml__;
                            for (var k = 0; k < ml.length; k++) {
                                if (ml[k].mid == m.mid || ml[k].url == m.url) {
                                    ml.splice(k, 1);
                                    k--;
                                    break;
                                }
                            }
                            mi.splice(j, 1);
                            j--;
                            return;
                        }
                    }
                }
            }
            if (t && ms[t]) {
                while (ms[t].length > 0) {
                    var m = ms[t].pop();
                    me.__destroyM__(m, ctnr);
                    if (me.data.__mc__[m.url]) {
                        me.data.__mc__[m.url]--;
                    }
                }
            }
            return me;
        },
        __init__: function(options) {
            var me = this;
            me.data.__ms__ = {};
            me.data.__mc__ = {};
            me.data.__ml__ = [];
            me.__initService__(me.config);
            return me;
        },
        __initService__: function(config) {
            var me = this;
            var svc = config && config.service;
            var svr = config && config.server;
            if (svc == null) {
                me.data.__svc__ = null;
                return;
            }
            me.data.__svc__ = [];
            for (var i = 0; i < svc.length; i++) {
                var n = svc[i].name;
                var u = svc[i].url;
                u = u.replace(/\{\$\S+\$\}/g, function(s) {
                    var ts = s.substr(2, s.length - 4);
                    if (svr[ts] == undefined) {
                        return s;
                    }
                    return svr[ts];
                });
                me.data.__svc__.push({
                    name: n,
                    url: u
                });
            }
            return me;
        },
        __findModule__: function(options) {
            var me = this;
            var ms = me.data.__ms__;
            if (ms == null) {
                return null;
            }

            var t = _valueOrDefault(options, 'type', null);
            var u = _valueOrDefault(options, 'url', null);
            var mid = _valueOrDefault(options, 'mid', null);
            var ml = [];
            for (var i in ms) {
                if (t && t != i) {
                    continue;
                }
                var mi = ms[i];
                if (mid || u) {
                    for (var j = 0; j < mi.length; j++) {
                        var m = mi[j];
                        if (m.mid && m.mid == mid || m.url && m.url == u) {
                            // return m;
                            ml.push(m);
                        }
                    }
                }
            }
            if(ml.length > 0){
                return ml;
            }
            if (t && ms[t] && !u) {
                return ms[t];
            }
            return null;
        },
        __loadM__: function(options) {
            var me = this;
            var u = _valueOrDefault(options, 'url', null);
            var c = _valueOrDefault(options, 'config', null);
            var s = _valueOrDefault(options, 'style', null);
            var cb1 = function(m, c, sid) {
                var cb = _valueOrDefault(options, 'onLoaded', null);
                if (typeof cb == 'function') {
                    cb(m, c, sid)
                }
            };
            var cb2 = function() {
                var cb = _valueOrDefault(options, 'onLoadFault', null);
                if (typeof cb == 'function') {
                    cb(u, c, s);
                }
            };
            if (!u) {
                cb2();
                return;
            }

            /**
             *
             * [Module, config, style]
             *
             */
            
            // collect i, easy to add params
            var arr = [u];
            var arr2 = [0];
            if (c) {
                arr.push(c);
                arr2.push(arr.length - 1);
            } else {
                arr2.push(-1);
            }
            if (s) {
                arr.push('css!' + s);
                arr2.push(arr.length - 1);
            } else {
                arr2.push(-1);
            }

            /**
             *
             * deps: [{
             *     "key": {string},
             *     "path": {string},
             *     "shim": {object}
             * }]
             *
             */
            
            var deps = _valueOrDefault(options, 'deps', null);
            if(deps && deps.length > 0){
                var paths = {};
                var shim = {};
                for(var i = 0;i < deps.length;i++){
                    paths[deps[i].key] = deps[i].path;
                    if(deps[i].shim){
                        shim[deps[i].key] = deps[i].shim;
                    }
                }
                requirejs.config({
                    paths: paths,
                    shim: shim
                })
            }
            require(arr, function() {
                var M = arguments[0];
                if (!M) {
                    if (s) {
                        var el = me.el = me.el || $(document);
                        $(el).find("head link[href*='" + s + "']").remove();
                    }
                    cb2();
                    return;
                }
                var oi = arr2[1];
                var cf = oi < 0 ? null : arguments[oi];
                cb1(M, cf, s);
            });
            return me;
        },
        __destroyM__: function(moduleInfo, ctnr) {
            if (!moduleInfo) {
                return;
            }
            var me = this;
            var mi = moduleInfo;
            var m = mi.module;
            if (m && typeof m.destroy == 'function') {
                m.destroy();
            }
            var s = mi.style;
            if (s) {
                var el = me.el = me.el || $(document);
                // $(el).find("head link[href*='" + s + "']").remove();
            }
            var cid = mi.cid;
            if(cid && ctnr){
                me.container.closeContainer({
                    id: cid
                });
            }
            return me;
        },
        destroy: function() {
            var me = this;
            /*
            var ms = me.data.__ms__;
            var ks = ['layout', 'container', 'menu', 'toolbar', 'module'];
            for (var k = ks.length - 1; k >= 0; k--) {
                var mi = ms[k];
                if (mi) {
                    for (var i = 0; i < mi.length; i++) {
                        var m = mi[i].module;
                        if (typeof m.destroy == 'function') {
                            m.destroy();
                        }
                    }
                }
            }
            */

            var ml = me.data.__ml__;
            if (ml) {
                while (ml.length > 0) {
                    var mi = ml.pop();
                    if (mi && mi.module) {
                        if (typeof mi.module.destroy == 'function') {
                            mi.module.destroy();
                        }
                    }
                }
            }

            if (me.dataMgr) {
                var t = me.data.t;
                me.dataMgr.unregisterMethod('getServiceUrl', me, t);
                me.dataMgr.unregisterMethod('resize', me, t);
            }

            me.base();
        },

        __className__: 'SfModuleManager',
        version: VERSION
    });

    return SfModuleManager;
});
