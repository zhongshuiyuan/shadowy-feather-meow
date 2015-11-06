/**
 * filename:loadingWidget.js
 * desc:datatable widget
 * deps:requirejs, SfModuleBase
 * authors:zc
 * time:2015-11-01 17:23:42
 * version:0.0.1
 * updatelog:
 * 0.0.1:the first version
 *
 **/

define([
    'jquery', 'underscore', 'sfModuleBase', 
    'text!./loadingWidget.html'
], function(
    $, _, SfModuleBase, 
    LoadingWidgetTpl
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

    function _css2num(el, style) {
        var n = parseFloat(el.css(style));
        if (isNaN(n)) {
            return 0;
        }

        return n;
    }

    function _calcWidth(el) {
        var w = _css2num(el, 'width');
        w += _css2num(el, 'margin-left');
        w += _css2num(el, 'margin-right');
        w += _css2num(el, 'border-left-width');
        w += _css2num(el, 'border-right-width');
        w += _css2num(el, 'padding-left');
        w += _css2num(el, 'padding-right');
        return w;
    }

    function _calcHeight(el) {
        var h = _css2num(el, 'height');
        h += _css2num(el, 'margin-top');
        h += _css2num(el, 'margin-bottom');
        h += _css2num(el, 'padding-top');
        h += _css2num(el, 'padding-bottom');
        h += _css2num(el, 'border-top-width');
        h += _css2num(el, 'border-bottom-width');
        return h;
    }

    var LoadingWidget = SfModuleBase.extend({
        constructor: function(options) {
            var me = this;
            me.base(options);
            me.dataMgr = _valueOrDefault(options, 'dataMgr', null);
            me.render();
        },
        render: function(options) {
            var me = this;

            var el = me.el = _valueOrDefault(options, 'el', null) || me.el;
            if (el.length == 0) {
                return me;
            }

            el.append(_.template(LoadingWidgetTpl)());
            me.__init__();
            me.resize();
            return me;
        },
        resize: function() {
            var me = this;
            var mh = me.ui.$m.height();
            var $l = me.ui.$l;
            var lh = 0;
            lh += _css2num($l, 'height');
            lh += _css2num($l, 'border-top-width');
            lh += _css2num($l, 'border-bottom-width');
            lh += _css2num($l, 'padding-top');
            lh += _css2num($l, 'padding-bottom');
            $l.css('margin-top', (mh - lh) / 2 + 'px');
            return me;
        },
        showLoading: function(options){
            var me = this;
            var m = _valueOrDefault(options, 'msg', '正在加载，请稍候...');
            var zi = _valueOrDefault(options, 'zIndex', null);
            var a = _valueOrDefault(options, 'opacity', null);
            if(zi != null && !isNaN(zi)){
                me.ui.$m.css('z-index', zi);
            }
            me.ui.$t.text(m);
            if(a != null && !isNaN(a)){
                me.ui.$m.fadeTo(a);
            }else{
                me.ui.$m.fadeIn();
            }
            return me;
        },
        hideLoading: function(){
            var me = this;
            me.ui.$m.fadeOut();
            return me;
        },
        __init__: function(){
            var me = this;
            me.ui = {};
            me.ui.$m = me.el.find('#loadingWidget_mask');
            me.ui.$l = me.el.find('#loadingWidget_loading');
            me.ui.$t = me.el.find('#loadingWidget_loadingMsg');
            return me;
        },
        destroy: function() {
            var me = this;
            if(me.ui.$m){
                me.ui.$m.remove();
            }
            delete me.data;
        },

        __className__: 'LoadingWidget',
        version: VERSION
    });

    return LoadingWidget;
});
