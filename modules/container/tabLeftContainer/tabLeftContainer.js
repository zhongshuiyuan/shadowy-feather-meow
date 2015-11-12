/**
 * filename:tabLeftContainer.js
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
    'text!./tabLeftContainer_north.html', 'text!./tabLeftContainer_west.html', 'text!./tabLeftContainer_center.html',
    'bootstrap'
], function(
    $, _, SfContainerBase,
    NorthTpl, WestTpl, CenterTpl
) {
    var VERSION = '0.0.1';

    var DEFAULT_WEST_MAX_NUM = 2;

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

    var TabLeftContainer = SfContainerBase.extend({
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

            var np = me.__getPanel__('north');
            var ch = np.panel.find('#tabLeftContainer_head')
            if (np.width != null) {
                ch.css('width', np.width + 'px');
            }
            if (np.height != null) {
                ch.css('height', np.height + 'px');
            }
            np = np.panel;
            // var hnh = ch.height();
            // var tch = _calcHeight(np.find('#tabLeftContainer_title'));
            // var mch = hnh - tch;
            // $(np).find('#tabLeftContainer_menu').height(mch);
            
            // var hnw = ch.width();
            // var tcw = _calcWidth(np.find('#tabLeftContainer_title'));
            // np.find('#tabLeftContainer_menu').width(hnw - tcw);
            
            var hnw = ch.width();
            var hnh = ch.height();
            var ct = np.find('#tabLeftContainer_title');
            ct.height(hnh);
            var tcw = _calcWidth(ct);
            np.find('#tabLeftContainer_menu')
                .css('left', tcw)
                .css('width', (hnw - tcw) + 'px')
                .height(hnh);

            var wp = me.__getPanel__('west');
            var cw = wp.panel.find('#tabLeftContainer_west');
            if (wp.width != null) {
                cw.css('width', wp.width + 'px');
            }
            if (wp.height != null) {
                cw.css('height', wp.height + 'px');
            }
            wp = wp.panel;
            var wcw = cw.width();
            var wch = cw.height();
            var cwn = wp.find('#tabLeftContainer_west_nav');
            var cwc = wp.find('#tabLeftContainer_west_contents');
            var ncw = _calcWidth(cwn);
            cwc.width(wcw - ncw);
            cwn.height(wch);
            cwc.height(wch);

            var cp = me.__getPanel__('center');
            var cc = cp.panel.find('#tabLeftContainer_center');
            if (cp.width != null) {
                cc.css('width', cp.width + 'px');
            }
            if (cp.height != null) {
                cc.css('height', cp.height + 'px');
            }
        },
        __initContainer__: function() {
            var me = this;

            var np = me.__getPanel__('north').panel;
            $(np).html(_.template(NorthTpl)());

            var wp = me.__getPanel__('west').panel;
            $(wp).html(_.template(WestTpl)());

            var cp = me.__getPanel__('center').panel;
            $(cp).html(_.template(CenterTpl)());
            // $(cp).find('#tabLeftContainer_earth').hide();
        },
        __initCD__: function() {
            var me = this;
            me.__containerDesc__ = {
                head: [{
                    type: 'head',
                    region: 'north',
                    state: 0,
                    id: 'tabLeftContainer_head'
                }],
                title: [{
                    type: 'title',
                    region: 'north',
                    state: 0,
                    id: 'tabLeftContainer_title'
                }],
                menu: [{
                    type: 'menu',
                    region: 'north',
                    state: 0,
                    id: 'tabLeftContainer_menu'
                }],
                main: [{
                    type: 'main',
                    region: 'center',
                    state: 0,
                    id: 'tabLeftContainer_main'
                }],
                earth: [{
                    type: 'earth',
                    region: 'center',
                    state: 0,
                    id: 'tabLeftContainer_earth'
                }],
                module: []
            };
        },
        openContainer: function(options) {
            var me = this;
            var t = _valueOrDefault(options, 'type', 'module');
            var r = _valueOrDefault(options, 'region', 'west');
            if (t == 'module' && r == 'west') {
                me._openTab(options);
            } else if(r == 'center'){
                var me = this;
                var cd = me.getContainer(options);
                if(!cd){
                    return;
                }
                var ts = ['main', 'earth'];
                for(var i = 0;i < ts.length;i++){
                    if(ts[i] == cd.type){
                        continue;
                    }
                    var tcd = me.__findContainer__({
                        region: 'center',
                        type: ts[i]
                    });
                    $('#tabLeftContainer_' + ts[i]).addClass('tabLeftContainer-contaner-hide');
                    if(tcd && tcd.container){
                        var tci = me.__getCtnrInfo__(tcd);
                        if(typeof tcd.onHide == 'function'){
                            tcd.onHide(tci);
                        }
                        tcd.container.hide();
                        if(typeof tcd.onHidden == 'function'){
                            tcd.onHidden(tci);
                        }
                    }
                }
                var cb = cd.onOpen = _valueOrDefault(options, 'onOpen', null);
                cd.onOpened = _valueOrDefault(options, 'onOpened', null);
                cd.onClose = _valueOrDefault(options, 'onClose', null);
                cd.onClosed = _valueOrDefault(options, 'onClosed', null);
                cd.onShow = _valueOrDefault(options, 'onShow', null);
                cd.onShown = _valueOrDefault(options, 'onShown', null);
                cd.onHide = _valueOrDefault(options, 'onHide', null);
                cd.onHidden = _valueOrDefault(options, 'onHidden', null);
                var ci = me.__getCtnrInfo__(cd);
                if(typeof cb == 'function'){
                    cb(ci);
                }
                $('#tabLeftContainer_' + cd.type).removeClass('tabLeftContainer-contaner-hide');
                cd.container.show();
                if(typeof cd.onOpened == 'function'){
                    cd.onOpened(ci);
                }
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
                if (cd.type == 'module' && cd.region == 'west') {
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
            if(cid){
                cd = me.__findContainerByCid__(cid);
            }
            if(!cd){
                cd = me.__findContainer__(options);
            }
            if(cd && cd.container){
                for(var i = 0;i < _scbList.length;i++){
                    var tcb = _valueOrDefault(options, _scbList[i], null);
                    if(typeof tcb == 'function'){
                        cd[_scbList[i]] = tcb;
                    }
                }
                if(cd.type == 'module' && cd.region == 'west'){
                    me._showTab({
                        id: cid
                    });
                    return me;
                }
                if(cd.region == 'center'){
                    var ts = ['main', 'earth'];
                    for(var i = 0;i < ts.length;i++){
                        if(ts[i] == cd.type){
                            continue;
                        }
                        var tcd = me.__findContainer__({
                            region: 'center',
                            type: ts[i]
                        });
                        $('#tabLeftContainer_' + ts[i]).addClass('tabLeftContainer-contaner-hide');
                        if(tcd && tcd.container){
                            var tci = me.__getCtnrInfo__(tcd);
                            if(typeof tcd.onHide == 'function'){
                                tcd.onHide(tci);
                            }
                            tcd.container.hide();
                            if(typeof tcd.onHidden == 'function'){
                                tcd.onHidden(tci);
                            }
                        }
                    }
                    var fn1 = visible ? 'onShow' : 'onHide';
                    var fn2 = visible ? 'onShown' : 'onHidden';
                    var cb1 = cd[fn1] || _valueOrDefault(options, fn1, null);
                    var cb2 = cd[fn2] || _valueOrDefault(options, fn2, null);
                    var ci = me.__getCtnrInfo__(cd);
                    if(typeof cb1 == 'function'){
                        cb1(ci);
                    }
                    if(visible){
                        $('#tabLeftContainer_' + cd.type).removeClass('tabLeftContainer-contaner-hide');
                        cd.container.show();
                    }else{
                        $('#tabLeftContainer_' + cd.type).addClass('tabLeftContainer-contaner-hide');
                        cd.container.hide();
                    }
                    if(typeof cb2 == 'function'){
                        cb2(ci);
                    }
                }else{
                    me.base(visible, options);
                }
            }
            return me;

            if (cid) {
                cd = me.__findContainerByCid__(cid);
                if (cd) {
                    if (cd.type == 'module' && cd.region == 'west') {
                        me._showTab({
                            id: cid
                        });
                    } else {
                    	if(cd.region == 'center'){
                            var fn1 = visible ? 'onShow' : 'onHide';
                            var fn2 = visible ? 'onShown' : 'onHidden';
                            var cb1 = cd[fn1] || _valueOrDefault(options, fn1, null);
                            var cb2 = tcd[fn2] || _valueOrDefault(options, fn2, null);
                            var ci = me.__getCtnrInfo__(cd);
                            if(typeof cb1 == 'function'){
                                cb1(ci);
                            }
                    		if(visible){
                    			$('#tabLeftContainer_' + cd.type).removeClass('tabLeftContainer-contaner-hide');
                    		}else{
                    			$('#tabLeftContainer_' + cd.type).addClass('tabLeftContainer-contaner-hide');
                    		}
                            if(typeof cb2 == 'function'){
                                cb2(ci);
                            }
                    	}
                        me.base(visible, options);
                    }
                }
            } else {
            	if(options.region == 'center'){
            		if(visible){
            			$('#tabLeftContainer_' + options.type).removeClass('tabLeftContainer-contaner-hide');
            		}else{
            			$('#tabLeftContainer_' + options.type).addClass('tabLeftContainer-contaner-hide');
            		}
            	}
                me.base(visible, options);
            }
        },
        _openTab: function(options) {
            var me = this;
            var cd = me.__containerDesc__ && me.__containerDesc__.module;
            if (!cd) {
                return;
            }
            var pc = me.__getPanel__('west').panel.find('#tabLeftContainer_west');
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

            if (pc.find('#tabLeftContainer_west_nav_ul').length == 0) {
                var th = '';
                th += '<ul id="tabLeftContainer_west_nav_ul" class="tabLeftContainer-nav-tabs"></ul>';
                pc.find('#tabLeftContainer_west_nav').html(th);
            }

            //nav & tab content
            var pre = 'tabLeftContainer_';
            var cid = pre + 'tab_' + me.fguid() + '_' + new Date().getTime();
            var title = _valueOrDefault(options, 'title', _valueOrDefault(options, 'name', '新面板'));
            var stab = "<div id='" + cid + "_p' class='tabLeftContainer-tab-pane' style='display:none;'></div>";
            var sli = "<li id='" + cid + "_l'><a id='" + cid + "_a'><span>" + title + "</span>" +
                (c ? "<button id='" + cid + "_c' class='close'>&times;</button>" : "") + "</a></li>";
            sli = "<li id='" + cid + "_l'><a id='" + cid + "_a'><span class='tabLeftContainer-tabTitle'>" + title + "</span>" +
                (c ? "<span id='" + cid + "_c' class='tabLeftContainer-tabClose'>&times;</span>" : "") + "</a></li>";

            var sdiv = "<div id='" + cid + "' class='tabLeftContainer-tabContainer'></div>";

            var wcs = pc.find('#tabLeftContainer_west_contents');
            wcs.append(stab);
            pc.find('#tabLeftContainer_west_nav_ul').append(sli);
            wcs.find('#' + cid + '_p').html(sdiv);
            pc.find('#' + cid + '_a > span:eq(0)').css('line-height', (84 / title.length) + 'px');

            me.resize();

            var wcp = pc.find('#' + cid + '_p');
            var cw = wcp.width();
            var ch = wcp.height();
            var cbOpen = _valueOrDefault(options, 'onOpen', null);
            var tcd = {
                type: options.type,
                region: 'west',
                state: 1,
                id: cid + '_p',
                container: wcs.find('#' + cid),
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


            pc.find('#' + cid + '_c').on('click', function(e) {
                me._closeTab({
                    id: cid
                });
            });
            pc.find('#' + cid + '_a').parent('li').on('click', function() {
                me._showTab({
                    id: cid
                });
            });

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
            var pc = me.__getPanel__('west').panel.find('#tabLeftContainer_west');
            var cid = _valueOrDefault(options, 'id', null);
            if (!pc || pc.length == 0 || !cid) {
                return;
            }
            pc.find('#tabLeftContainer_west_nav_ul li').each(function(i, d) {
                var a = $(this).find('a');
                if (a.attr('id') == cid + '_a') {
                    a.addClass('tabLeftContainer-active');
                } else {
                    a.removeClass('tabLeftContainer-active');
                }
            });
            pc.find('#tabLeftContainer_west_contents .tabLeftContainer-tab-pane').each(function(i, d) {
                var tcd = me.__findContainerByCid__(cid);
                if (!tcd) {
                    return;
                }
                var cbShow = tcd.onShow;
                var cbShown = tcd.onShown;
                var cbHide = tcd.onHide;
                var cbHidden = tcd.onHidden;
                var $this = $(this);
                if (this.id == cid + '_p') {
                    if (typeof cbShow == 'function') {
                        cbShow(me.__getCtnrInfo__(tcd));
                    }
                    $this.show();
                    if (typeof cbShown == 'function') {
                        cbShown(me.__getCtnrInfo__(tcd));
                    }
                } else {
                    if (typeof cbHide == 'function') {
                        cbHide(me.__getCtnrInfo__(tcd));
                    }
                    $this.hide();
                    if (typeof cbHidden == 'function') {
                        cbHidden(me.__getCtnrInfo__(tcd));
                    }
                }
            });
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
                if (cd[i].region != 'west') {
                    continue;
                }
                tc++;
                if (cd[i].cid == cid) {
                    var cbClose = cd[i].onClose;
                    if (typeof cbClose == 'function') {
                        cbClose(me.__getCtnrInfo__(cd[i]));
                    }
                    tcd = cd.splice(i, 1);
                    tc--;
                    i--;
                }
            }

            var pc = me.__getPanel__('west').panel.find('#tabLeftContainer_west');
            if (!pc || pc.length == 0) {
                return;
            }
            var tab = pc.find('#tabLeftContainer_west_contents').find('#' + cid + '_p');
            tab.remove();

            var ul = pc.find('#tabLeftContainer_west_nav_ul');
            var a = ul.find('a#' + cid + '_a');
            var li = ul.find('#' + cid + '_l')

            var sp = li.find('#' + cid + '_c');
            if (sp.length > 0) {
                sp.remove();
            }
            a.remove();
            li.remove();
            var cbClosed = tcd && tcd[0] && tcd[0].onClosed;
            if (typeof cbClosed == 'function') {
                cbClosed(me.__getCtnrInfo__(tcd[0]));
            }

            var ali = pc.find('#tabLeftContainer_west_nav_ul li.active');
            if (ali.length == 0) {
                if (tc > 0) {
                    // var tcid = pc.find('#tabLeftContainer_west_nav_ul li a:eq(' + (tc - 1) + ')').attr('id');
                    var tcid = pc.find('#tabLeftContainer_west_nav_ul li')[tc - 1].id;
                    tcid = tcid.substr(0, tcid.length - 2);
                    me._showTab({
                        id: tcid
                    });
                } else {
                    pc.find('#tabLeftContainer_west_nav').empty();
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
        __className__: 'TabLeftContainer',
        version: VERSION
    });

    return TabLeftContainer;
});
