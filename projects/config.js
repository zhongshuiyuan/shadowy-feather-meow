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
    var userAuth = 'http://{$serviceIp$}/SimpleSpace/SSService/SimpleSpace_Service_UserAuthorization/REST/UserAuthorizationREST.svc/';

    var config = {
        project: 'demo',
        appType: 'local',
        login: {
            mode: 0
        },

        serviceProtocol: 'http:',
        serviceIp: '127.0.0.1',
        server: {
            serviceIp: '127.0.0.1'
        },
        service: [{
            name: 'userLogin',
            url: userAuth + 'UserLogin?userName={{userName}}&pwd={{pwd}}&token={{token}}'
        }, {
            name: 'userLogin',
            url: userAuth + 'UserLogout?userID={{userID}}&token={{token}}'
        }]
    };

    if (typeof ns.SF == 'undefined') {
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
