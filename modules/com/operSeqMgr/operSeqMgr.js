/**
 * filename:operSeqMgr.js
 * desc:operate sequence manager
 * deps:
 * authors:zc
 * time:2015-10-07 16:20:22
 * version:0.0.1
 * updatelog:
 * 0.0.1:the first version
 *
 **/

(function(ns) {
    var VERSION = '0.0.1';

    function OperSeqMgr(options) {
        this.info = {
            fnArray: [],
            timer: -1,
            abort: false
        };
    }

    OperSeqMgr.prototype = {
        push: function(fn) {
            var me = this;
            if (typeof fn == 'function') {
                me.info.fnArray.push(fn);
            } else if ($.isArray(fn)) {
                for (var i in fn) {
                    if (typeof fn[i] == 'function') {
                        me.info.fnArray.push(fn[i]);
                    }
                }
            }
        },
        start: function(interval, abortWhenError, callback) {
            var me = this;
            var info = me.info;
            var fns = info.fnArray;
            if (interval == null) {
                interval = 30;
            }
            if (abortWhenError == null) {
                abortWhenError = true;
            }

            function _exec() {
                if (info.timer > 0) {
                    clearTimeout(info.timer);
                    info.timer = -1;
                }
                if (fns.length > 0) {
                    var f = fns.shift();
                    try {
                        f();
                    } catch (e) {
                        if (abortWhenError) {
                            info.abort = true;
                        }
                    }
                    if (!info.abort) {
                        info.timer = setTimeout(_exec, interval);
                    }
                } else {
                    if (typeof callback == 'function') {
                        callback();
                    }
                }
            }

            if (info.timer <= 0) {
                _exec();
            }
        },
        abort: function(clearSeq) {
            var me = this;
            var info = me.info;
            if (info.timer > 0) {
                clearTimeout(info.timer);
                info.timer = -1;
            }
            if (clearSeq) {
                var fns = info.fnArray;
                while (fns.length > 0) {
                    fns.shift();
                }
            }
        },

        version: VERSION
    };
    

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = OperSeqMgr;
    } else if (typeof define === 'function' && define.amd) {
        define([], function() {
            return OperSeqMgr;
        });
    } else {
        if (typeof ns.SF == 'undefined') {
            ns.SF = {};
        }
        ns.SF.OperSeqMgr = OperSeqMgr;
    }
})(window);
