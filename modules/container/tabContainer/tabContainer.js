/**
 * filename:tabContainer.js
 * desc:
 * deps:jquery, requirejs
 * authors:zc
 * time:2015-10-10 17:08:29
 * version:0.0.1
 * updatelog:
 * 0.0.1:the first version
 *
 **/

define([
    'jquery', 'underscore', 'sfContainerBase',
    'text!./tabContainer.html',
    'bootstrap'
], function(
    $, _, SfContainerBase,
    TabContainerTpl
) {
    var VERSION = '0.0.1';

    var DEFAULT_TAB_MAX_NUM = 2;
    var DEFAULT_WEST_WIDTH = 300;
    var DEFAULT_EAST_WIDTH = 300;

    var _scbList = ['onShow', 'onShown', 'onHide', 'onHidden'];

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

    var TabContainer = SfContainerBase.extend({
        constructor: function(options) {
            var me = this;
            me.base(options);
            me.moduleMgr = _valueOrDefault(options, 'moduleMgr', null);
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
            me._bindEvents();
            me.resize();
            me.expand({
                region: 'west',
                visible: false,
                animate: false
            });
            return me;
        },
        resize: function() {
            var me = this;

            var np = me.__getPanel__('north');
            var $ch = me.data.ui.$head;
            if (np.width != null) {
                $ch.css('width', np.width + 'px');
            }
            if (np.height != null) {
                $ch.css('height', np.height + 'px');
            }
            np = np.panel;

            var hnw = $ch.width();
            var hnh = $ch.height();
            var $ct = me.data.ui.$title;
            $ct.height(hnh);
            var tcw = _calcWidth($ct);
            var $menu = me.data.ui.$menu;
            $menu.css('left', tcw)
                .css('width', (hnw - tcw) + 'px')
                .height(hnh);

            var cp = me.__getPanel__('center');
            var $tcc = cp.panel.find('#tabContainer_center');
            var $navbar = $tcc.find('#tabContainer_center_navbar');
            var $nblbd = $tcc.find('#tabContainer_center_lbtn_div');
            var $nbrbd = $tcc.find('#tabContainer_center_rbtn_div');
            var $nav = me.data.ui.$nav;
            var $tcs = $tcc.find('#tabContainer_center_contents');
            var $cw = me.data.ui.$cwest;
            var $cc = me.data.ui.$ccenter;
            var $ce = me.data.ui.$ceast;
            var nbw = $navbar.width();
            var w1 = _calcWidth($nblbd);
            var w2 = _calcWidth($nbrbd);
            $nav.width(nbw - w1 - w2);
            var ch = $tcc.height();
            var nbh = _calcHeight($navbar);
            $tcs.height(ch - nbh);
            var tcsw = $tcs.width();
            var cw = me.data._size.ww;
            var ew = me.data._size.ew;
            $cw.width(cw);
            $cc.width(tcsw - cw - ew - 2);
            $ce.width(ew);
        },
        __initContainer__: function() {
            var me = this;
            var cf = me.config;

            var np = me.__getPanel__('north').panel;
            np.html(_.template(TabContainerTpl)({
                region: 'north'
            }));

            var cp = me.__getPanel__('center').panel;
            cp.html(_.template(TabContainerTpl)({
                region: 'center'
            }));

            me.data.ui = {};
            me.data.ui.$head = np.find('#tabContainer_head');
            me.data.ui.$title = np.find('#tabContainer_title');
            me.data.ui.$menu = np.find('#tabContainer_menu');
            me.data.ui.$center = cp.find('#tabContainer_center');
            me.data.ui.$nav = cp.find('#tabContainer_center_nav');
            me.data.ui.$cwest = cp.find('#tabContainer_cwest');
            me.data.ui.$ccenter = cp.find('#tabContainer_ccenter');
            me.data.ui.$ceast = cp.find('#tabContainer_ceast');
            var $lb = me.data.ui.$lb = me.data.ui.$center.find('#tabContainer_center_lbtn_div');
            var $rb = me.data.ui.$rb = me.data.ui.$center.find('#tabContainer_center_rbtn_div');
            me.data.ui.$lbi = $lb.find('#tabContainer_center_il');
            me.data.ui.$rbi = $rb.find('#tabContainer_center_ir');

            me.data._size = {
                ww: cf.westWidth == null ? DEFAULT_WEST_WIDTH : cf.westWidth,
                ew: cf.eastWidth == null ? DEFAULT_EAST_WIDTH : cf.eastWidth
            };
            me.data._size._ww = me.data._size.ww;
            me.data._size._ew = me.data._size.ew;
            return me;
        },
        __initCD__: function() {
            var me = this;
            me.__containerDesc__ = {
                head: [{
                    type: 'head',
                    region: 'north',
                    state: 0,
                    id: 'tabContainer_head'
                }],
                title: [{
                    type: 'title',
                    region: 'north',
                    state: 0,
                    id: 'tabContainer_title'
                }],
                menu: [{
                    type: 'menu',
                    region: 'north',
                    state: 0,
                    id: 'tabContainer_menu'
                }],
                main: [{
                    type: 'main',
                    region: 'center',
                    state: 0,
                    id: 'tabContainer_main'
                }],
                map: [{
                    type: 'map',
                    region: 'center',
                    state: 0,
                    id: 'tabContainer_map'
                }],
                module: []
            };
            me.data._tabNum = 0;
            return me;
        },
        openContainer: function(options) {
            var me = this;
            var t = _valueOrDefault(options, 'type', 'module');
            var r = _valueOrDefault(options, 'region', 'center');
            if (t == 'module' && (r == 'west' || r == 'center' || r == 'east')) {
                me._openTab(options);
            } else {
                me.base(options);
            }
            return me;
        },
        closeContainer: function(options) {
            var me = this;
            var cid = _valueOrDefault(options, 'id', null);
            if (!cid) {
                return;
            }
            var cd = me.__findContainerByCid__(cid);
            if (cd) {
                if (cd.type == 'module' && (cd.region == 'west' || cd.region == 'center' || cd.region == 'east')) {
                    me._closeTab({
                        id: cid
                    });
                    return;
                } else {
                    me.base(options);
                }
            }
        },
        showContainer: function(visible, options) {
            var me = this;
            var cd = null;
            var cid = _valueOrDefault(options, 'id', null);
            if (cid) {
                cd = me.__findContainerByCid__(cid);
            }
            if (!cd) {
                cd = me.__findContainer__(options);
            }
            if (cd && cd.container) {
                for (var i = 0; i < _scbList.length; i++) {
                    var tcb = _valueOrDefault(options, _scbList[i], null);
                    if (typeof tcb == 'function') {
                        cd[_scbList[i]] = tcb;
                    }
                }
                if (cd.type == 'module' && cd.region == 'west') {
                    me._showTab({
                        id: cid
                    });
                    return me;
                }
                me.base(visible, options);
            }
            return me;
        },
        expand: function(options){
            var me = this;
            var r = _valueOrDefault(options, 'region', null);
            var vv = _valueOrDefault(options, 'visible', true);
            var a = _valueOrDefault(options, 'animate', true);
            if (!r) {
                return;
            }
            var w = me.data.ui.$center.width();
            var rl = {
                west: 'ww',
                east: 'ew'
            };
            _.each(rl, function(v, k, l) {
                if (k == r || r == 'all') {
                    me.data._size[v] = vv ? me.data._size['_' + v] : 0;
                }
            });
            var ww = me.data._size.ww;
            var ew = me.data._size.ew;
            var cw = w - ww - ew - 2;
            if(a){
                var s = 500;
                me.data.ui.$cwest.animate({
                    width: ww + 'px'
                }, s);
                me.data.ui.$ccenter.animate({
                    width: cw + 'px'
                }, s);
                me.data.ui.$ceast.animate({
                    width: ew + 'px'
                }, s);
            }else{
                me.data.ui.$cwest.css({
                    width: ww + 'px'
                });
                me.data.ui.$ccenter.css({
                    width: cw + 'px'
                });
                me.data.ui.$ceast.css({
                    width: ew + 'px'
                });
            }

            var cnl = 'icon-chevron-left';
            var cnr = 'icon-chevron-right';
            if(ww == 0){
                me.data.ui.$lbi.removeClass(cnl).addClass(cnr);
            }else{
                me.data.ui.$lbi.removeClass(cnr).addClass(cnl);
            }
            if(ew == 0){
                me.data.ui.$rbi.removeClass(cnr).addClass(cnl);
            }else{
                me.data.ui.$rbi.removeClass(cnl).addClass(cnr);
            }
            me.moduleMgr.resize();
            return me;
        },
        _openTab: function(options) {
            var me = this;
            var cd = me.__containerDesc__ && me.__containerDesc__.module;
            if (!cd) {
                return me;
            }
            var r = _valueOrDefault(options, 'region', null);
            if (!r) {
                return me;
            }
            // var $pc = me.__getPanel__('center').panel.find('#tabContainer_c' + r);
            var $pc = me.data.ui['$c' + r];
            if (!$pc || $pc.length == 0) {
                return me;
            }

            // show close button, or not
            var c = _valueOrDefault(options, 'closable', true);
            // active the tab when open, or not
            var a = _valueOrDefault(options, 'active', true);
            // show a tab, or not
            var t = _valueOrDefault(options, 'tab', true);

            var pre = 'tabContainer_';
            var cid = pre + 'tab_' + me.fguid() + '_' + new Date().getTime();
            var $nav = me.data.ui.$nav;
            if (t) {
                // if reach max, close the last one
                var tc = 0;
                var tid = null;
                var mn = me.config && me.config.tabMaxNum;
                if (mn == 0) {
                    return me;
                }
                mn = mn || DEFAULT_WEST_MAX_NUM;
                if (me.data._tabNum >= mn) {
                    for (var i = 0; i < cd.length; i++) {
                        if (cd[i].region != 'west' && cd[i].region != 'center' && cd[i].region != 'east') {
                            continue;
                        }
                        if (cd[i].tab === false) {
                            // container without tab
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
                }

                if ($nav.find('#tabContainer_center_nav_ul').length == 0) {
                    var th = '';
                    th += '<ul id="tabContainer_center_nav_ul" class="tabContainer-nav-tabs"></ul>';
                    $nav.html(th);
                }
                var title = _valueOrDefault(options, 'title', _valueOrDefault(options, 'name', '新面板'));
                var sli = "<li id='" + cid + "_l' data-tabContainer-region='" + r + "'><a id='" + 
                    cid + "_a'><span class='tabContainer-tabTitle'>" + title + "</span>" +
                    (c ? "<span id='" + cid + "_c' class='tabContainer-tabClose'>&times;</span>" : "") + "</a></li>";
                $nav.find('#tabContainer_center_nav_ul').append(sli);

                $nav.find('#' + cid + '_c').on('click', function(e) {
                    me._closeTab({
                        id: cid
                    });
                });
                $nav.find('#' + cid + '_a').parent('li').on('click', function() {
                    me._showTab({
                        id: cid
                    });
                });
            }

            var stab = "<div id='" + cid + "_p' data-tabContainer-region='" + 
                r + "' class='tabContainer-tab-pane' style='display:none;'></div>";
            var sdiv = "<div id='" + cid + "' class='tabContainer-tabContainer'></div>";

            var $tcs = $pc.find('.tabContainer-tab-contents');
            $tcs.append(stab);
            var $tp = $tcs.find('#' + cid + '_p');
            $tp.html(sdiv);

            me.resize();

            // 当前宽高，暂未使用
            var cw = $tp.width();
            var ch = $tp.height();
            var cbOpen = _valueOrDefault(options, 'onOpen', null);
            var tcd = {
                type: options.type,
                region: r,
                state: 1,
                tab: t,
                id: cid + '_p',
                container: $tcs.find('#' + cid),
                cid: cid,
                width: cw,
                height: ch
            };
            for (var k in options) {
                if (typeof options[k] == 'function') {
                    tcd[k] = options[k];
                }
            }
            cd.push(tcd);

            var tci = me.__getCtnrInfo__(tcd);
            if (typeof cbOpen == 'function') {
                cbOpen(tci);
            }
            if (a) {
                me._showTab({
                    id: cid
                });
            }
            var cbOpened = _valueOrDefault(options, 'onOpened', null);
            if (typeof cbOpened == 'function') {
                cbOpened(tci);
            }
        },
        _showTab: function(options) {
            var me = this;
            var cid = _valueOrDefault(options, 'id', null);
            if(!cid){
                return me;
            }
            var t = _valueOrDefault(options, 'type', null);
            var r = _valueOrDefault(options, 'region', null);
            var cd = me.__findContainerByCid__(cid, t, r);
            if(!cd){
                return me;
            }
            r = cd.region;
            var $nav = me.data.ui.$nav;
            var $pc = me.data.ui['$c' + r];
            if (!$pc || $pc.length == 0) {
                return me;
            }
            $nav.find('#tabContainer_center_nav_ul li').each(function(i, d) {
                var a = $(this).find('a');
                if (a.attr('id') == cid + '_a') {
                    a.addClass('tabContainer-active');
                } else {
                    a.removeClass('tabContainer-active');
                }
            });
            $pc.find('.tabContainer-tab-pane').each(function(i, d) {
                var cbShow = cd.onShow;
                var cbShown = cd.onShown;
                var cbHide = cd.onHide;
                var cbHidden = cd.onHidden;
                var $this = $(this);
                var cinfo = me.__getCtnrInfo__(cd);
                if (this.id == cid + '_p') {
                    if (typeof cbShow == 'function') {
                        cbShow(cinfo);
                    }
                    $this.show();
                    if (typeof cbShown == 'function') {
                        cbShown(cinfo);
                    }
                } else {
                    if($this.attr('data-tabContainer-region') == cd.region){
                        if (typeof cbHide == 'function') {
                            cbHide(cinfo);
                        }
                        $this.hide();
                        if (typeof cbHidden == 'function') {
                            cbHidden(cinfo);
                        }
                    }
                }
            });

            return me;
        },
        _closeTab: function(options) {
            var me = this;
            var cid = _valueOrDefault(options, 'id', null);
            if (!cid) {
                return;
            }
            var cd = me.__containerDesc__ && me.__containerDesc__.module;
            if (!cd) {
                return;
            }
            var tc = 0;
            var tcd = null
            for (var i = 0; i < cd.length; i++) {
                if (cd[i].region != 'west' && cd[i].region != 'center' && cd[i].region != 'east') {
                    continue;
                }
                var ctc = cd[i].tab === false ? 0 : 1;
                tc += ctc;
                if (cd[i].cid == cid) {
                    var cbClose = cd[i].onClose;
                    if (typeof cbClose == 'function') {
                        cbClose(me.__getCtnrInfo__(cd[i]));
                    }
                    tcd = cd.splice(i, 1);
                    tc -= ctc;
                    i--;
                }
            }

            for(var i = cd.length - 1;i >= 0;i--){
                if(cd[i].region == tcd[0].region){
                    me._showTab({
                        id: cd[i].cid
                    });
                    break;
                }
            }

            var $nav = me.data.ui.$nav;
            var $pc = me.data.ui['$c' + tcd[0].region];
            if (!$pc || $pc.length == 0) {
                return me;
            }
            var $tab = $pc.find('#' + cid + '_p');
            $tab.remove();

            if(tcd[0].tab !== false){
                var $ul = $nav.find('#tabContainer_center_nav_ul');
                var $a = $ul.find('#' + cid + '_a');
                var $li = $ul.find('#' + cid + '_l')

                var $sp = $li.find('#' + cid + '_c');
                if ($sp.length > 0) {
                    $sp.remove();
                }
                $a.remove();
                $li.remove();
            }
            var cbClosed = tcd && tcd[0] && tcd[0].onClosed;
            if (typeof cbClosed == 'function') {
                cbClosed(me.__getCtnrInfo__(tcd[0]));
            }

            var $ali = $nav.find('#tabContainer_center_nav_ul li.active');
            if ($ali.length == 0) {
                if (tc > 0) {
                    // var tcid = pc.find('#tabLeftContainer_west_nav_ul li a:eq(' + (tc - 1) + ')').attr('id');
                    var tcid = $nav.find('#tabContainer_center_nav_ul li')[tc - 1].id;
                    tcid = tcid.substr(0, tcid.length - 2);
                    me._showTab({
                        id: tcid
                    });
                } else {
                    $nav.empty();
                }
            }
            return me;
        },
        _bindEvents: function(){
            var me = this;
            var cnl = 'icon-chevron-left';
            var cnr = 'icon-chevron-right';
            me.data.ui.$lb.on('click', function(){
                var s = me.data.ui.$lbi.hasClass(cnl);
                me.expand({
                    region: 'west',
                    visible: !s
                });
            });
            me.data.ui.$rb.on('click', function(){
                var s = me.data.ui.$rbi.hasClass(cnr);
                me.expand({
                    region: 'east',
                    visible: !s
                });
            });
            return me;
        },
        _unbindEvents: function(){
            var me = this;
            me.data.ui.$center.find('.tabContainer-btn-div').off('click');
            return me;
        },
        destroy: function() {
            var me = this;
            me._unbindEvents();
            var t = me.data.t;
            me.dataMgr.unregisterMethod('showContainer', me, t);
            me.dataMgr.unregisterMethod('openContainer', me, t);
            me.dataMgr.unregisterMethod('closeContainer', me, t);

            me.base();
        },
        __className__: 'TabContainer',
        version: VERSION
    });

    return TabContainer;
});
