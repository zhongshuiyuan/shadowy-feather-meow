/**
 * filename:loginWidget.js
 * desc:login widget
 * deps:requirejs, SfModuleBase
 * authors:zc
 * time:2015-11-17 22:28:22
 * version:0.0.1
 * updatelog:
 * 0.0.1:the first version
 *
 **/

define([
    'jquery', 'underscore', 'sfModuleBase', 'text!./loginWidget.html', 
    'bootstrap'
], function(
    $, _, SfModuleBase, LoginWidgetTpl
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

    var LoginWidget = SfModuleBase.extend({
        constructor: function(options) {
            var me = this;
            me.base(options);
            me.dataMgr = _valueOrDefault(options, 'dataMgr', null);
            me.config = _valueOrDefault(options, 'config', null);
            me.moduleMgr = _valueOrDefault(options, 'moduleMgr', null);
            me.data.callback = {};
            me.data.callback.onLogin = _valueOrDefault(options, 'onLogin', null);
        },
        render: function(options) {
            var me = this;

            var el = me.el = _valueOrDefault(options, 'el', null) || me.el;
            if (el.length == 0) {
                return me;
            }

            var t = me.config.title;
            $(el).html(_.template(LoginWidgetTpl)({
                title: t
            }));

            me.data.ui = {};
            me.data.ui.$user = el.find('#loginWidget_iptUser');
            me.data.ui.$pwd = el.find('#loginWidget_iptPwd');
            me.data.ui.$login = el.find('#loginWidget_btnLogin');

            me._bindEvents();
            me.resize();
            return me;
        },
        resize: function() {
            var me = this;
            return me;
        },
        _bindEvents: function() {
            var me = this;
            me.data.ui.$login.on('click', function() {
                var $u = me.data.ui.$user;
                var $p = me.data.ui.$pwd;
                var u = $u.val();
                var p = $p.val();
                if (u == '') {
                    alert('用户名不能为空');
                    return;
                }
                if (p == '') {
                    alert('密码不能为空');
                    return;
                }
                var $b = me.data.ui.$login;
                $b.button('loading');
                var url = me.moduleMgr.getServiceUrl('userLogin', {
                    userName: escape(u),
                    pwd: escape(p),
                    token: ''
                });
                $.ajax({
                    type: 'GET',
                    dataType: 'json',
                    url: url,
                    async: true,
                    cache: false,
                    success: function(data, textStatus, jqXHR) {
                        $b.button('reset');
                        if (data && data.Say.StatusCode == 0000) {
                            if(data.GetMe.length > 0){
                                me.dataMgr.setData({
                                    data: {
                                        globalData: {
                                            userInfo: data.GetMe[0]
                                        }
                                    }
                                });
                            }
                            var cb = me.data.callback.onLogin;
                            if(typeof cb == 'function'){
                                cb();
                            }
                        } else {
                            alert(data.Say.Message);
                        }
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        $b.button('reset');
                    }
                });
            });
            return me;
        },
        _unbindEvents: function() {
            var me = this;
            me.data.ui.$login.off('click');
            return me;
        },
        destroy: function() {
            var me = this;
            me._unbindEvents();
            if (me.el) {
                $(me.el).empty();
            }
            delete me.data;
        },

        __className__: 'LoginWidget',
        version: VERSION
    });

    return LoginWidget;
});
