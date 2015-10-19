/**
 * filename:sfUtil.js
 * desc:util
 * deps:requirejs
 * authors:zc
 * time:2015-09-16 22:05:35
 * version:0.0.1
 * updatelog:
 * 0.0.1:the first version
 *
 **/

define([], function() {
    var sfUtil = {};

    var _attr = function(o, k, v) {
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
    };

    var _valueOrDefault = function(obj, property, defaultValue) {
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
    };

    var _fguid = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    sfUtil.attr = _attr;
    sfUtil.valueOrDefault = _valueOrDefault;
    sfUtil.fguid = _fguid;

    return sfUtil;
});
