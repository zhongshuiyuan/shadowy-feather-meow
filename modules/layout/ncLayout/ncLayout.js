/**
 * filename:ncLayout.js
 * desc:
 * deps:jquery underscore, SfLayoutBase
 * authors:zc
 * time:2015-07-10 15:47:47
 * version:0.0.1
 * updatelog:
 * 0.0.1:the first version
 *
 **/

define([
    'jquery', 'underscore', 'sfLayoutBase', 'text!./ncLayout.html'
], function(
    $, _, SfLayoutBase, NcLayoutTpl
) {
    var VERSION = '0.0.1';

    var DEFAULT_NORTH_HEIGHT = 100;
    var DEFAULT_SOUTH_HEIGHT = 0;

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

    var NcLayout = SfLayoutBase.extend({
        constructor: function(options) {
            var me = this;
            me.base(options);
            me.dataMgr.registerMethod('layout_showPanel', me.showPanel, me, me.data.t);
            me.dataMgr.registerMethod('layout_showMask', me.showMask, me, me.data.t);
        },
        render: function(options) {
            var me = this;

            var el = me.el = _valueOrDefault(options, 'el', null) || me.el;
            if (el.length == 0) {
                return me;
            }
            $(el).html(_.template(NcLayoutTpl)());
            var cf = me.config;
            me.data.__size__ = {
                nh: cf.northHeight == null ? DEFAULT_NORTH_HEIGHT : cf.northHeight,
                sh: cf.southHeight == null ? DEFAULT_SOUTH_HEIGHT : cf.southHeight
            };
            me.data.__size__._nh = me.data.__size__.nh;
            me.data.__size__._sh = me.data.__size__.sh;
            me.resize();
            me.bindEvents();
            return me;
        },
        resize: function() {
            var me = this;
            var el = me.el;
            var cf = me.config;
            var w = el.width();
            var h = el.height();
            var nh = me.data.__size__.nh;
            var sh = me.data.__size__.sh;
            var $cp = el.find('#ncLayout_centerPanel');
            var $sp = el.find('#ncLayout_southPanel');
            $cp.height(h - nh - sh).css('top', nh + 'px');
            $sp.height(sh < 0 ? 0 : sh).css('top', (h - sh) + 'px');
        },
        showPanel: function(options) {
            var me = this;
            var el = me.el;
            var cf = me.data.options.config;
            var r = _valueOrDefault(options, 'region', null);
            var vv = _valueOrDefault(options, 'visible', true);
            if (!r) {
                return;
            }
            var w = $(el).width();
            var h = $(el).height();
            var rl = {
                north: 'nh',
                south: 'sh'
            };
            _.each(rl, function(v, k, l) {
                if (k == r || r == 'all') {
                    me.data.__size__[v] = vv ? me.data.__size__['_' + v] : 0;
                }
            });
            var nh = me.data.__size__.nh;
            var sh = me.data.__size__.sh;
            var $cp = el.find('#ncLayout_centerPanel');
            var $sp = el.find('#ncLayout_southPanel');
            var cb1 = _valueOrDefault(options, (vv ? 'onShow' : 'onHide'), null);
            if(typeof cb1 == 'function'){
                try{
                    cb1(r, vv);
                }catch(e){

                }
            }
            me.eventBus.trigger('layout_on' + (vv ? 'Show' : 'Hide'), r);
            var s = 500;
            var sch = (h - nh - sh) + 'px';
            var sct = nh + 'px';
            $cp.animate({
                height: sch,
                top: sct
            }, s);
            $sp.animate({
                height: (sh < 0 ? 0 : sh) + 'px',
                top: (h - sh) + 'px'
            }, s, function(){
                var cb2 = _valueOrDefault(options, (vv ? 'onShown' : 'onHidden'), null);
                if(typeof cb2 == 'function'){
                    try{
                        cb2(r, vv);
                    }catch(e){

                    }
                }
                me.eventBus.trigger('layout_on' + (vv ? 'Shown' : 'Hidden'), r);
            });
        },
        fullScreen: function(isFull){
            var me = this;
            me.showPanel({
                region: 'all',
                visible: !isFull
            });
        },
        showMask: function(visible){
            var me = this;
            var $m = me.el.find('#ncLayout_mask');
            if(visible){
                $m.fadeIn();
            }else{
                $m.fadeOut();
            }
        },
        bindEvents: function(){
            var me = this;
            var el = me.el;
            return me;
        },
        unbindEvents: function(){
            var me = this;
            var el = me.el;
            return me;
        },
        __init__: function(options) {
            var me = this;
            var nh = me.config && me.config.northHeight;
            nh = nh == undefined ? DEFAULT_NORTH_HEIGHT : nh;
            me.panels = [{
                id: 'ncLayout_northPanel',
                region: 'north',
                visible: true,
                disabled: false,
                height: nh
            }, {
                id: 'ncLayout_centerPanel',
                region: 'center',
                visible: true,
                disabled: false
            }, {
                id: 'ncLayout_southPanel',
                region: 'south',
                visible: true,
                disabled: false
            }];
        },
        destroy: function() {
            var me = this;
            me.unbindEvents();
            me.dataMgr.unregisterMethod('layout_showMask', me, me.data.t);
            me.dataMgr.unregisterMethod('layout_showPanel', me, me.data.t);
            me.base();
        },

        __className__: 'NcLayout',
        version: VERSION
    });

    return NcLayout;
});
