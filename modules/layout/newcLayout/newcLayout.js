/**
 * filename:newcLayout.js
 * desc:
 * deps:jquery underscore, SfLayoutBase
 * authors:zc
 * time:2015-11-10 11:18:51
 * version:0.0.1
 * updatelog:
 * 0.0.1:the first version
 *
 **/

define([
    'jquery', 'underscore', 'sfLayoutBase', 'text!./newcLayout.html'
], function(
    $, _, SfLayoutBase, NewcLayoutTpl
) {
    var VERSION = '0.0.1';

    var DEFAULT_NORTH_HEIGHT = 100;
    var DEFAULT_WEST_WIDTH = 250;
    var DEFAULT_EAST_WIDTH = 250;
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

    var NewcLayout = SfLayoutBase.extend({
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
            $(el).html(_.template(NwcLayoutTpl)());
            var cf = me.data.options.config;
            me.data.__size__ = {
                nh: cf.northHeight == null ? DEFAULT_NORTH_HEIGHT : cf.northHeight,
                ww: cf.westWidth == null ? DEFAULT_WEST_WIDTH : cf.westWidth,
                sh: cf.southHeight == null ? DEFAULT_SOUTH_HEIGHT : cf.southHeight
            };
            me.data.__size__._nh = me.data.__size__.nh;
            me.data.__size__._ww = me.data.__size__.ww;
            me.data.__size__._sh = me.data.__size__.sh;
            me.resize();
            me.bindEvents();
            return me;
        },
        resize: function() {
            var me = this;
            var el = me.el;
            var cf = me.data.options.config;
            var w = $(el).width();
            var h = $(el).height();
            // $(el).find('#nwcLayout_northPanel, #nwcLayout_southPanel').width(w);
            var nh = me.data.__size__.nh;
            var sh = me.data.__size__.sh;
            var ww = me.data.__size__.ww;
            var f = me.data.__size__.hwb;
            var $wp = el.find('#nwcLayout_westPanel');
            var $cp = el.find('#nwcLayout_centerPanel');
            var $ws = el.find('#nwcLayout_westSplit');
            var $wsb = el.find('#nwcLayout_westSplitBtn');
            var $sp = el.find('#nwcLayout_southPanel');
            $wp.height(h - nh - sh - 1).css('top', nh + 'px');
            $cp.height(h - nh - sh - 1).css('top', nh + 'px');
            $ws.height(h - nh - sh - 1).css('top', nh + 'px');
            $wp.width(ww - 1);
            var wsw = _calcWidth($ws);
            wsw = cf.showSplit ? (f ? 0 : wsw) : 0;
            $wsb.css('margin-top', ((h - nh - sh - 1 - 60) / 2) + 'px');
            $ws.css('left', ww + 'px');
            $cp.width(w - ww - wsw - 1).css('left', (ww + wsw) + 'px');
            $sp.height(sh - 1 < 0 ? 0 : sh - 1).css('top', (h - sh) + 'px');
            if(ww == 0){
                $wsb.text('>');
            }else{
                $wsb.text('<');
            }
        },
        showPanel: function(options) {
            var me = this;
            var el = me.el;
            var cf = me.data.options.config;
            var r = _valueOrDefault(options, 'region', null);
            var vv = _valueOrDefault(options, 'visible', true);
            var f = me.data.__size__.hwb = _valueOrDefault(options, 'hideWestBar', false);
            if (!r) {
                return;
            }
            var w = $(el).width();
            var h = $(el).height();
            var rl = {
                north: 'nh',
                west: 'ww',
                south: 'sh'
            };
            _.each(rl, function(v, k, l) {
                if (k == r || r == 'all') {
                    me.data.__size__[v] = vv ? me.data.__size__['_' + v] : 0;
                }
            });
            var nh = me.data.__size__.nh;
            var sh = me.data.__size__.sh;
            var ww = me.data.__size__.ww;
            var $wp = el.find('#nwcLayout_westPanel');
            var $cp = el.find('#nwcLayout_centerPanel');
            var $ws = el.find('#nwcLayout_westSplit');
            var $wsb = el.find('#nwcLayout_westSplitBtn');
            var $sp = el.find('#nwcLayout_southPanel');
            var wsw = _calcWidth($ws);
            wsw = cf.showSplit ? (f ? 0 : wsw) : 0;
            var cb1 = _valueOrDefault(options, (vv ? 'onShow' : 'onHide'), null);
            if(typeof cb1 == 'function'){
                try{
                    cb1(r, vv);
                }catch(e){

                }
            }
            me.eventBus.trigger('layout_on' + (vv ? 'Show' : 'Hide'), r);
            if(ww == 0){
                $wsb.text('>');
            }else{
                $wsb.text('<');
            }
            var s = 500;
            var sch = (h - nh - sh - 1) + 'px';
            var sct = nh + 'px';
            $wp.animate({
                width: (ww - 1) + 'px',
                height: sch,
                top: sct
            }, s);
            $ws.animate({
                left: ww + 'px',
                height: sch,
                top: sct
            }, s);
            $wsb.animate({
                'margin-top': ((h - nh - sh - 1 - 60) / 2) + 'px'
            });
            $cp.animate({
                width: (w - ww - wsw - 1) + 'px',
                left: (ww + wsw) + 'px',
                height: sch,
                top: sct
            }, s);
            $sp.animate({
                height: (sh - 1 < 0 ? 0 : sh - 1) + 'px',
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
                visible: !isFull,
                hideWestBar: true
            });
        },
        showMask: function(visible){
            var me = this;
            var $m = me.el.find('#newcLayout_mask');
            if(visible){
                $m.fadeIn();
            }else{
                $m.fadeOut();
            }
        },
        bindEvents: function(){
            var me = this;
            var el = me.el;

            $(el).find('#nwcLayout_westSplit').on('click', function(){
                var ww = me.data.__size__.ww;
                if(ww == 0){
                    me.showPanel({
                        region: 'west',
                        visible: true
                    });
                }else{
                    me.showPanel({
                        region: 'west',
                        visible: false
                    });
                }
            });
        },
        unbindEvents: function(){
            var me = this;
            var el = me.el;
            $(el).find('#nwcLayout_westSplit').off('click');
        },
        __init__: function(options) {
            var me = this;
            var nh = me.config && me.config.northHeight;
            nh = nh == undefined ? 100 : nh;
            me.panels = [{
                id: 'nwcLayout_northPanel',
                region: 'north',
                visible: true,
                disabled: false,
                height: nh
            }, {
                id: 'nwcLayout_westPanel',
                region: 'west',
                visible: true,
                disabled: false
            }, {
                id: 'nwcLayout_centerPanel',
                region: 'center',
                visible: true,
                disabled: false
            }, {
                id: 'nwcLayout_southPanel',
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

        __className__: 'NewcLayout',
        version: VERSION
    });

    return NwcLayout;
});
