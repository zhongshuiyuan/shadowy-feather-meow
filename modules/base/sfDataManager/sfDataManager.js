/**
 * filename:sfDataManager.js
 * desc:manage data in modules
 * deps:jquery, requirejs, SfModuleBase
 * authors:zc
 * time:2015-07-04 12:49:07
 * version:0.0.1
 * updatelog:
 * 0.0.1:the first version
 *
 **/

define(['jquery', 'underscore', 'sfModuleBase'], function($, _, SfModuleBase) {
    var VERSION = '0.0.1';

    var _data = {};
    var _helper = {};

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

    var SfDataManager = SfModuleBase.extend({
        constructor: function(options) {
            this.base(options);
        },
        setData: function(options) {
            var me = this;
            $.extend(true, _data, options);
            for (var i in _data) {
                if (_data[i] === null) {
                    delete _data[i];
                }
            }
        },
        getData: function(name) {
            return _attr(_data, name);
            var me = this;
            var d = {};
            $.extend(true, d, _data);
            if (name) {
                return _attr(d, name);
            }
            return d;
        },
        registerMethod: function(name, method, context, t) {
            var me = this;
            var m = _helper[name] = _helper[name] || [];
            m.push({
                m: method,
                c: context,
                t: t
            });
        },
        unregisterMethod: function(name, context, t) {
            var me = this;
            var m = _helper[name];
            if (!m) {
                return;
            }
            for (var i in m) {
                if (m[i].t == t && m[i].c == context) {
                    m.splice(i, 1);
                }
            }
        },
        getHelper: function(id) {
            var me = this;
            var h = {};
            for (var i in _helper) {
                h[i] = (function(i){
                    return function() {
                        for (var j in _helper[i]) {
                            if(id && id != _helper[i][j].c.getId()){
                                continue;
                            }
                            return _helper[i][j].m.apply(_helper[i][j].c, arguments);
                        }
                    }
                })(i);
            }

            var hh = {
                invoke:function(){
                    var l = arguments.length;
                    if(l == 0){
                        return;
                    }
                    var n = arguments[0];
                    if(typeof h[n] == 'function'){
                        var args = [];
                        for(var i = 1;i < l;i++){
                            args.push(arguments[i]);
                        }
                        return h[n].apply(this, args);
                    }
                },
                has: function(){
                    var l = arguments.length;
                    if(l == 0){
                        return null;
                    }
                    var n = arguments[0];
                    return (typeof h[n] == 'function');
                }
            };
            return hh;
        },
        destroy: function() {
            var me = this;

            for (var i in _data) {
                delete _data[i];
            }
            for (var i in _helper) {
                delete _helper[i];
            }

            me.base();
        },

        __className__: 'SfDataManager',
        version: VERSION
    });

    return SfDataManager;
});
