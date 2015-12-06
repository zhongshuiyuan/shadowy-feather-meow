/**
 * filename:dropdownMenu.js
 * desc:
 * deps:requirejs, SfMenuBase
 * authors:zc
 * time:2015-10-11 20:40:19
 * version:0.0.1
 * updatelog:
 * 0.0.1:the first version
 *
 **/

define([
    'jquery', 'underscore', 'sfMenuBase', 'text!./dropdownMenu_list.html', 'text!./dropdownMenu_panel.html', 
    'bootstrap'
], function(
    $, _, SfMenuBase, DropdownMenuListTpl, DropdownMenuPanelTpl
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

    var DropdownMenu = SfMenuBase.extend({
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
            var tpl = (me.config && me.config.dropdownType == 'panel') ? DropdownMenuPanelTpl : DropdownMenuListTpl;
            $(el).html(_.template(tpl)({
                menus: me.menu,
                openLeft: me.config && me.config.openLeft
            }));
            if(me.config.addFrame){
                $(el).find('.dropdown-menu').each(function(){
                    var $this = $(this);
                    var t = $this.parent().height();
                    var w = _calcWidth($this);
                    var h = _calcHeight($this);
                    var f = document.createElement('iframe');
                    f.id = this.id + '_f';
                    f.width = w;
                    f.height = h;
                    f.frameBorder = 0;
                    f.scrolling = 'no';
                    f.className = 'dropdownMenu-dropdown-frame';
                    // f.allowTransparency = "true";
                    if(me.config && me.config.openLeft){
                        f.style.left = 'auto';
                        f.style.right = '0px';
                    }
                    $this.before(f);
                });
            }
            me.base();
            return me;
        },
        resize: function() {
            var me = this;
        },
        destroy: function() {
            var me = this;
            me.base();
        },

        __className__: 'DropdownMenu',
        version: VERSION
    });

    return DropdownMenu;
});
