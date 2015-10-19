/**
 * filename:demoLayout.js
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
    'jquery', 'underscore', 'sfLayoutBase', 'text!./demoLayout.html'
], function(
    $, _, SfLayoutBase, DemoLayoutTpl
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

    var DemoLayout = SfLayoutBase.extend({
        constructor: function(options) {
            var me = this;
            me.base(options);
        },
        render: function(options) {
            var me = this;

            var el = me.el = _valueOrDefault(options, 'el', null) || me.el;
            if (el.length == 0) {
                return me;
            }
            $(el).html(_.template(DemoLayoutTpl)());
            me.resize();
            return me;
        },
        resize: function() {
            var me = this;
            var el = me.el;
            var w = $(el).width();
            var h = $(el).height();
            $('#demoLayout_northPanel, #demoLayout_southPanel').width(w);
            var nh = _calcHeight($('#demoLayout_northPanel'));
            var sh = _calcHeight($('#demoLayout_southPanel'));
            $('#demoLayout_westPanel, #demoLayout_centerPanel').height(h - nh - sh).css('top', nh + 'px');
            var ww = _calcWidth($('#demoLayout_westPanel'));
            $('#demoLayout_centerPanel').width(w - ww).css('left', ww + 'px');
            $('#demoLayout_southPanel').css('top', (h - sh) + 'px');
        },
        __init__: function(options) {
            var me = this;
            me.panels = [{
                id: 'demoLayout_northPanel',
                region: 'north',
                visible: true,
                disabled: false
            }, {
                id: 'demoLayout_westPanel',
                region: 'west',
                visible: true,
                disabled: false
            }, {
                id: 'demoLayout_centerPanel',
                region: 'center',
                visible: true,
                disabled: false
            }, {
                id: 'demoLayout_southPanel',
                region: 'south',
                visible: true,
                disabled: false
            }];
        },
        destroy: function() {
            var me = this;
            me.base();
        },

        __className__: 'DemoLayout',
        version: VERSION
    });

    return DemoLayout;
});
