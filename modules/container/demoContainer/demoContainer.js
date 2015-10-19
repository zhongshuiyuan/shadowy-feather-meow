/**
 * filename:demoContainer.js
 * desc:demo container
 * deps:jquery, requirejs
 * authors:zc
 * time:2015-10-08 09:40:31
 * version:0.0.1
 * updatelog:
 * 0.0.1:the first version
 *
 **/

define(['jquery', 'underscore', 'sfContainerBase', 'bootstrap'], function($, _, SfContainerBase) {
    var VERSION = '0.0.1';

    var DEFAULT_WEST_MAX_NUM = 2;

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

    function _vcWidth(container) {
        if ($(container).find('.demoContainer-tabContainer').length == 0) {
            return;
        }
        var cw = $(container).width();
        var pl = _css2num($(container).find('.demoContainer-tabContainer'), 'padding-left');
        var pr = _css2num($(container).find('.demoContainer-tabContainer'), 'padding-right');
        var ml = _css2num($(container).find('.demoContainer-tabContainer'), 'margin-left');
        var mr = _css2num($(container).find('.demoContainer-tabContainer'), 'margin-right');
        var bl = _css2num($(container).find('.demoContainer-tabContainer'), 'border-left-width');
        var br = _css2num($(container).find('.demoContainer-tabContainer'), 'border-right-width');
        var w = cw - pl - pr - ml - mr - bl - br;
        $(container).find('.demoContainer-tabContainer').width(w);
    }

    function _vcHeight(container) {
        if ($(container).find('.demoContainer-tabContainer').length == 0) {
            return;
        }
        var ch = $(container).height();
        // var tnh = $(container).find('#demoContainer').height();
        var tnh = _calcHeight($(container).find('#demoContainer_tab_nav'));
        $(container).find('#con_tab_content').height(ch - tnh);
        var pt = _css2num($(container).find('.demoContainer-tabContainer'), 'padding-top');
        var pb = _css2num($(container).find('.demoContainer-tabContainer'), 'padding-bottom');
        var mt = _css2num($(container).find('.demoContainer-tabContainer'), 'margin-top');
        var mb = _css2num($(container).find('.demoContainer-tabContainer'), 'margin-bottom');
        var bt = _css2num($(container).find('.demoContainer-tabContainer'), 'border-top-width');
        var bb = _css2num($(container).find('.demoContainer-tabContainer'), 'border-bottom-width');
        var h = ch - tnh - pt - pb - mt - mb - bt - bb;
        $(container).find('.demoContainer-tabContainer').height(h);
    }

    var DemoContainer = SfContainerBase.extend({
        constructor: function(options) {
            var me = this;
            me.base(options);
            var t = me.data.t;
            me.dataMgr.registerMethod('showContainer', me.showContainer, me, t);
            me.dataMgr.registerMethod('openContainer', me.openContainer, me, t);
            me.dataMgr.registerMethod('closeContainer', me.closeContainer, me, t);
        },
        render: function(options) {
            var me = this;

            var el = me.el = _valueOrDefault(options, 'el', null) || me.el;
            if (el.length == 0) {
                return me;
            }
            if (typeof me.__init__ == 'function') {
                me.__init__(options);
            }
            me.resize();
            return me;
        },
        resize: function() {
            var me = this;
            var c = me.__getPanel__('west').panel.find('#demoContainer_west');
            _vcWidth(c);
            _vcHeight(c);
        },
        __initContainer__: function() {
            var me = this;
            var np = me.__getPanel__('north').panel;
            var hch = '<div id="demoContainer_head" class="demoContainer-contaner demoContainer-head"></div>';
            hch = $(hch);
            $(hch).appendTo(np);
            var tch = '<div id="demoContainer_title" class="demoContainer-contaner demoContainer-title"></div>';
            tch = $(tch);
            $(tch).appendTo($(hch));
            var mch = '<div id="demoContainer_menu" class="demoContainer-contaner demoContainer-menu"></div>';
            mch = $(mch);
            $(mch).appendTo($(hch));
            var mh = $(hch).height() - $(tch).height();
            $(mch).css('height', mh + 'px');
            var wp = me.__getPanel__('west').panel;
            var wch = '<div id="demoContainer_west" class="demoContainer-contaner"></div>';
            wch = $(wch);
            $(wch).appendTo(wp);
            var cp = me.__getPanel__('center').panel;
            var cch = '<div id="demoContainer_center" class="demoContainer-contaner"></div>';
            cch = $(cch);
            $(cch).appendTo(cp);
            var cmch = '<div id="demoContainer_main" class="demoContainer-contaner"></div>';
            cmch = $(cmch);
            $(cmch).appendTo($(cch));
            var cech = '<div id="demoContainer_earth" class="demoContainer-contaner"></div>';
            cech = $(cech);
            $(cech).appendTo($(cch));
            $(cmch).hide();
        },
        __initCD__: function() {
            var me = this;
            me.__containerDesc__ = {
                title: [{
                    region: 'north',
                    state: 0,
                    id: 'demoContainer_title'
                }],
                menu: [{
                    region: 'north',
                    state: 0,
                    id: 'demoContainer_menu'
                }],
                main: [{
                    region: 'center',
                    state: 0,
                    id: 'demoContainer_main'
                }],
                earth: [{
                    region: 'center',
                    state: 0,
                    id: 'demoContainer_earth'
                }],
                module: []
            };
        },
        openContainer: function(options) {
            var me = this;
            var t = _valueOrDefault(options, 'type', 'module');
            var r = _valueOrDefault(options, 'region', 'west');
            if(t == 'module' && r == 'west'){
                me._openTab(options);
                return;
            }else{
                me.base(options);
                return;
            }
        },
        closeContainer: function(options) {
            var me = this;
            var cid = _valueOrDefault(options, 'id', null);
            if(!cid){
                return;
            }
            var cd = me.__findContainerByCid__(cid);
            if(cd){
                if(cd.type == 'module' && cd.region == 'west'){
                    me._closeTab({
                        id: cid
                    });
                    return;
                }else{
                    me.base(options);
                }
            }
        },
        showContainer: function(visibile, options){
            var me = this;
            var cd = null;
            var cid = _valueOrDefault(options, 'id', null);
            if(cid){
                cd = me.__findContainerByCid__(cid);
                if(cd){
                    if(cd.type == 'module' && cd.region == 'west'){
                        var pc = me.__getPanel__('west').panel.find('#demoContainer_west');
                        $(pc).find('#demoContainer_tab_nav li a[href="#' + cid + '_p"]').tab('show');
                    }else{
                        me.base(visibile, options);
                    }
                }
            }else{
                me.base(visibile, options);
            }
        },
        _openTab: function(options) {
            var me = this;
            var cd = me.__containerDesc__ && me.__containerDesc__.module;
            if (!cd) {
                return;
            }
            var pc = me.__getPanel__('west').panel.find('#demoContainer_west');
            if (!pc || pc.length == 0) {
                return;
            }

            // show close button, or not
            var c = _valueOrDefault(options, 'closable', true);
            // active the tab when open, or not
            var a = _valueOrDefault(options, 'active', true);

            // if reach max, close the last one
            var tc = 0;
            var tid = null;
            var mn = me.config && me.config.westMaxNum;
            if (mn == 0) {
                return;
            }
            mn = mn || DEFAULT_WEST_MAX_NUM;
            for (var i = 0; i < cd.length; i++) {
                if (cd[i].region != 'west') {
                    continue;
                }
                tc++;
                tid = cd[i].cid;
                if (tc >= mn) {
                    me._closeTab({
                        id: tid
                    });
                    break;
                }
            }

            if(pc.find('#demoContainer_tab_nav').length == 0){
            	var th = '';
                th += '<div id="demoContainer_tabContainer" class="tabbable tabs-below">';
                th += '<div id="demoContainer_tab_content" class="tab-content"></div>';
                th += '<ul id="demoContainer_tab_nav" class="nav nav-tabs"></ul>';
                th += '</div>'
                $(pc).html(th);
            }

            //nav & tab content
            var pre = 'demoContainer_';
            var cid = pre + 'tab_' + me.fguid() + '_' + new Date().getTime();
            var title = _valueOrDefault(options, 'name', '新面板');
            var stab = "<div id='" + cid + "_p' class='tab-pane fade'></div>";
            var sli = "<li><a id='" + cid + "_a' href='#" + cid + "_p' data-toggle='tab'>" +
                title + "&nbsp;" + (c ? "<button id='" + cid + "_c' class='close'>&times;</button>" : "") + "</a></li>";
            sli = "<li><a id='" + cid + "_a' href='#" + cid + "_p' data-toggle='tab'>" +
                title + "&nbsp;" + (c ? "<span id='" + cid + "_c' class='tabClose'>&times;</span>" : "") + "</a></li>";

            var sdiv = "<div id='" + cid + "' class='demoContainer-tabContainer'></div>";

            $(pc).find('#demoContainer_tab_content').append(stab);
            $(pc).find('#demoContainer_tab_nav').append(sli);
            $(pc).find('#demoContainer_tab_content').find('#' + cid + '_p').html(sdiv);

            me.resize();

            var cw = $(pc).find('#demoContainer_tab_content').find('#' + cid + '_p').width();
            var ch = $(pc).find('#demoContainer_tab_content').find('#' + cid + '_p').height();
            var cbOpen = _valueOrDefault(options, 'onOpen', null);
            var tcd = {
                region: 'west',
                state: 1,
                id: cid + '_p',
                container: $(pc).find('#demoContainer_tab_content').find('#' + cid),
                cid: cid,
                width: cw,
                height: ch,
                onOpen: cbOpen,
                onClose: _valueOrDefault(options, 'onClose', null)
            };
            cd.push(tcd);

            $(pc).find('a[data-toggle="tab"]').on('shown', function(e) {
                /**
                
                	TODO:
                	- set size if allowed(supported by layout)
					tips:getLayoutHandle, setSize
                
                 */
            });

            if (c) {
                //bind close event
                $(pc).find('#demoContainer_tab_nav').find('#' + cid + '_c').bind('click', function(e) {
                    me._closeTab({
                        id: cid
                    });
                });
            }
            if (a) {
                $(pc).find('#demoContainer_tab_nav li a[href="#' + cid + '_p"]').tab('show');
            }

            var tci = me.__getCtnrInfo__(tcd);
            if(typeof cbOpen == 'function'){
                cbOpen(tci);
            }
        },
        _closeTab: function(options) {
            var me = this;
            var cid = _valueOrDefault(options, 'id', null);
            if(!cid){
                return;
            }
            var cd = me.__containerDesc__ && me.__containerDesc__.module;
            if(!cd){
                return;
            }
            var tc = 0;
            for(var i = 0;i < cd.length;i++){
                if(cd[i].region != 'west'){
                    continue;
                }
                tc++;
                if(cd[i].cid == cid){
                    var cbClose = cd[i].onClose;
                    if(typeof cbClose == 'function'){
                        cbClose(me.__getCtnrInfo__(cd[i]));
                    }
                    cd.splice(i, 1);
                    tc--;
                    i--;
                }
            }

            var pc = me.__getPanel__('west').panel.find('#demoContainer_west');
            if (!pc || pc.length == 0) {
                return;
            }
            var tab = $(pc).find('#demoContainer_tab_content').find('#' + cid + '_p');
            tab.remove();

            var ul = $(pc).find('#demoContainer_tab_nav');
            var a = ul.find('a#' + cid + '_a');
            var li = ul.find('a#' + cid + '_a').parent('li');

            var sp = li.find('#' + cid + '_c');
            if (sp.length > 0) {
                sp.remove();
            }
            a.remove();
            li.remove();

            var ali = $(pc).find('#demoContainer_tab_nav li.active');
            if (ali.length == 0) {
                if (tc > 0) {
                    $(pc).find('#demoContainer_tab_nav li a:eq(' + (tc - 1) + ')').tab('show');
                } else {
                    pc.empty();
                }
            }
        },
        destroy: function() {
            var me = this;

            var t = me.data.t;
            me.dataMgr.unregisterMethod('showContainer', me, t);
            me.dataMgr.unregisterMethod('openContainer', me, t);
            me.dataMgr.unregisterMethod('closeContainer', me, t);

            me.base();
        },
        __className__: 'DemoContainer',
        version: VERSION
    });

    return DemoContainer;
});
