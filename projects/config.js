/**
 * filename:config.js
 * desc:frame config
 * deps:requirejs
 * authors:zc
 * time:2015-07-02 18:06:44
 * version:0.0.1
 * updatelog:
 * 0.0.1:the first version
 *
 **/

(function(ns) {
    var config = {
        project: 'demo',
        appType: 'local',

        serviceProtocol:'http:',
        serviceIp: '127.0.0.1',
        service: {}
    };

    if(typeof ns.SF == 'undefined'){
        ns.SF = {};
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = config;
    } else if (typeof define === 'function' && define.amd) {
        define([], function() {
            return config;
        });
    } else {
        ns.SF.config = config;
    }

})(window);
