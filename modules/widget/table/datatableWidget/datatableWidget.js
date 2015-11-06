/**
 * filename:datatableWidget.js
 * desc:datatable widget
 * deps:requirejs, SfModuleBase
 * authors:zc
 * time:2015-10-29 22:03:18
 * version:0.0.1
 * updatelog:
 * 0.0.1:the first version
 *
 **/

define([
    'jquery', 'underscore', 'sfModuleBase', 'loadingWidget',
    'text!./datatableWidget.html', 'text!./datatableWidget_tbody.html', 'text!./datatableWidget_pagination.html',
    'jquery_nanoScroller'
], function(
    $, _, SfModuleBase, LoadingWidget,
    DatatableWidgetTpl, TbodyTpl, PaginationTpl
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

    var DatatableWidget = SfModuleBase.extend({
        constructor: function(options) {
            var me = this;
            me.base(options);
            me.dataMgr = _valueOrDefault(options, 'dataMgr', null);
            me._options = _valueOrDefault(options, 'options', {});
        },
        render: function(options) {
            var me = this;

            var el = me.el = _valueOrDefault(options, 'el', null) || me.el;
            if (el.length == 0) {
                return me;
            }

            /**
             *
             * options: {
             *     [striped]: {bool} true,
             *     [bordered]: {bool} true,
             *     [hover]: {bool} true,
             *     [condensed]: {bool} true,
             *     [caption]: {string},
             *     columns: {Array<column>},
             *     rows: {Array<row>}
             * }
             *
             * column: {
             *     "field": {string},
             *     "text": {string},
             *     ["width"]: {number},
             *     ["align"]: {string} vr: "center", "left", "right",
             *     ["formatter"]: {function(value, rowData, rowIndex){}}
             * }
             *
             * columns: [{
             *     "field": "a",
             *     "text": "A"
             * }, {
             *     "field": "b",
             *     "text": "B",
             *     formatter: function(value, rowData, rowIndex){
             *         if(value == null){
             *             return "";
             *         }
             *         return value;
             *     }
             * }]
             *
             * row: {
             *     a:1,
             *     b:2,
             *     c:3
             * }
             *
             */


            var op = me._options;
            var op2 = {};
            op2.striped = _valueOrDefault(op, 'striped', true);
            op2.bordered = _valueOrDefault(op, 'bordered', true);
            op2.hover = _valueOrDefault(op, 'hover', true);
            op2.condensed = _valueOrDefault(op, 'condensed', true);
            op2.caption = _valueOrDefault(op, 'caption', null);
            op2.columns = _valueOrDefault(op, 'columns', []);
            op2.rows = me.data.rows = _valueOrDefault(op, 'rows', []);
            op2.pageSize = _valueOrDefault(op, 'pageSize', 10);
            op2.pageNum = _valueOrDefault(op, 'pageNum', 1);
            op2.loadingMsg = _valueOrDefault(op, 'loadingMsg', '加载中，请稍候...');
            op2.captionStyle = _valueOrDefault(op, 'captionStyle', null);
            var sp = _valueOrDefault(op, 'pagination', false);
            op2.total = me.data.total = _valueOrDefault(op, 'total', op2.rows.length);

            el.html(_.template(DatatableWidgetTpl)(op2));
            el.find('#datatableWidget_pagination').html(_.template(PaginationTpl)());
            me.__init__().__bindEvents__();
            var $p = me.ui.$pg;
            if (sp) {
                $p.show();
            } else {
                $p.hide();
            }
            me.loadData(op2);

            me.resize();
            return me;
        },
        resize: function() {
            var me = this;
            var $c = me.ui.$c;
            var $dth = me.ui.$dth;
            var $dtb = me.ui.$dtb;
            var $p = me.ui.$pg;
            var h = $c.height();
            var h1 = _calcHeight($dth);
            var h3 = me._options.pagination ? _calcHeight($p) : 0;
            $dtb.height(h - h1 - h3);
            if (me.data.rows.length > 0) {
                var $th = $dth.find('th');
                var $td0 = me.ui.$tb.find('tr:eq(0) > td');
                $th.each(function(i) {
                    if (i == $th.length - 1) {
                        $(this).width($td0.eq(i).width() + 16);
                    } else {
                        $(this).width($td0.eq(i).width());
                    }
                });
            }
            me.cp.loading.resize();
            me.el.find('.nano').nanoScroller();
            return me;
        },
        loadData: function(options) {
            var me = this;
            var op = me._options;
            var rs = me.data.rows = _valueOrDefault(options, 'rows', []);
            var tt = me.data.total = _valueOrDefault(options, 'total', rs.length);
            var cols = op.columns || [];
            var op2 = {
                columns: cols,
                rows: rs,
                rowStyle: op.rowStyle
            };

            me.ui.$tb.find('tr').off('click dblclick');
            me.ui.$tb.find('td').off('click dblclick');
            me.ui.$tb.html(_.template(TbodyTpl)(op2));
            me.resize();
            me.ui.$tb.find('tr').on('click', function(e) {
                var cb = _valueOrDefault(op, 'onRowClick', null);
                if (typeof cb == 'function') {
                    var ri = $(this).attr('datatable-data-ri');
                    cb(ri, rs[ri]);
                }
            }).on('dblclick', function(e) {
                var cb = _valueOrDefault(op, 'onRowDblClick', null);
                if (typeof cb == 'function') {
                    var ri = $(this).attr('datatable-data-ri');
                    cb(ri, rs[ri]);
                }
            });
            me.ui.$tb.find('td').on('click', function(e) {
                var cb = _valueOrDefault(op, 'onCellClick', null);
                if (typeof cb == 'function') {
                    var $this = $(this);
                    var ri = $this.attr('datatable-data-ri');
                    var ci = $this.attr('datatable-data-ci');
                    cb(rs[ri][cols[ci].field], ri, ci, rs[ri], cols[ci]);
                }
            }).on('dblclick', function(e) {
                var cb = _valueOrDefault(op, 'onCellDblClick', null);
                if (typeof cb == 'function') {
                    var $this = $(this);
                    var ri = $this.attr('datatable-data-ri');
                    var ci = $this.attr('datatable-data-ci');
                    cb(rs[ri][cols[ci].field], ri, ci, rs[ri], cols[ci]);
                }
            });

            return me;
        },
        setPage: function(options) {
            var me = this;
            var op = me._options;
            var cn = me.data.curNum = _valueOrDefault(options, 'pageNum', 1);
            var tt = me.data.total = _valueOrDefault(options, 'total', me.data.total);
            var ps = op.pageSize;
            var tp = Math.ceil(tt / ps);
            me.ui.$pgpn.val(cn);
            me.ui.$pgpt.text('/' + tp);
            me.__updateUi__();
            return me;
        },
        showLoading: function() {
            var me = this;
            me.cp.loading.resize().showLoading({
                msg: me._options.loadingMsg
            });
            return me;
        },
        hideLoading: function() {
            var me = this;
            me.cp.loading.hideLoading();
            return me;
        },
        __init__: function() {
            var me = this;
            me.ui = {};
            me.ui.$c = me.el.find('#datatableWidget_container');
            me.ui.$dth = me.el.find('#datatableWidget_divth');
            me.ui.$dtb = me.el.find('#datatableWidget_divtb');
            me.ui.$tb = me.el.find('#datatableWidget_tbody');
            me.ui.$pg = me.el.find('#datatableWidget_pagination');
            me.ui.$pgjp = me.el.find('#datatableWidget_btnJp');
            me.ui.$pgpn = me.el.find('#datatableWidget_iptPn');
            me.ui.$pgpt = me.el.find('#datatableWidget_pt');
            me.ui.$pgft = me.el.find('#datatableWidget_btnft');
            me.ui.$pgpre = me.el.find('#datatableWidget_btnPre');
            me.ui.$pgnext = me.el.find('#datatableWidget_btnNext');
            me.ui.$pglt = me.el.find('#datatableWidget_btnlt');
            me.cp = {};
            me.cp.loading = new LoadingWidget({
                el: me.el
            });
            return me;
        },
        __updateUi__: function() {
            var me = this;
            var cn = me.data.curNum;
            var ps = me._options.pageSize;
            var tt = me.data.total;
            var tp = Math.ceil(tt / ps);
            if (cn <= 1) {
                me.ui.$pgft.addClass('disabled');
                me.ui.$pgpre.addClass('disabled');
            } else {
                me.ui.$pgft.removeClass('disabled');
                me.ui.$pgpre.removeClass('disabled');
            }
            if (cn >= tp) {
                me.ui.$pgnext.addClass('disabled');
                me.ui.$pglt.addClass('disabled');
            } else {
                me.ui.$pgnext.removeClass('disabled');
                me.ui.$pglt.removeClass('disabled');
            }
            return me;
        },
        __bindEvents__: function() {
            var me = this;

            var cb = function(pn) {
                var op = me._options;
                var ps = op.pageSize;
                var tt = me.data.total;
                var tp = Math.ceil(tt / ps);
                if (pn < 1) {
                    pn = 1;
                } else if (pn > tp) {
                    pn = tp;
                }
                me.data.curNum = pn;
                me.setPage({
                    pageNum: pn,
                    total: tt
                }).__updateUi__();
                var _cb = _valueOrDefault(op, 'onSelectPage', null);
                if (typeof _cb == 'function') {
                    _cb(pn, ps);
                }
            };

            me.ui.$pgft.on('click', function() {
                if ($(this).hasClass('disabled')) {
                    return;
                }
                cb(me.data.curNum = 1);
            });
            me.ui.$pgpre.on('click', function() {
                if ($(this).hasClass('disabled')) {
                    return;
                }
                cb(--me.data.curNum);
            });
            me.ui.$pgnext.on('click', function() {
                if ($(this).hasClass('disabled')) {
                    return;
                }
                cb(++me.data.curNum);
            });
            me.ui.$pglt.on('click', function() {
                if ($(this).hasClass('disabled')) {
                    return;
                }
                cb(me.data.curNum = 9999);
            });
            me.ui.$pgjp.on('click', function() {
                if ($(this).hasClass('disabled')) {
                    return;
                }
                var cn = parseInt(me.ui.$pgpn.val());
                cn = isNaN(cn) ? 1 : cn;
                me.data.curNum = cn;
                cb(cn);
            });

            return me;
        },
        __unbindEvents__: function() {
            var me = this;
            me.ui.$pgft.off('click');
            me.ui.$pgpre.off('click');
            me.ui.$pgnext.off('click');
            me.ui.$pgjp.off('click');
            me.ui.$pglt.off('click');
            return me;
        },
        destroy: function() {
            var me = this;
            me.__unbindEvents__();
            me.cp.loading.destroy();
            delete me.ui;
            delete me.cp;
            me.base();
        },

        __className__: 'DatatableWidget',
        version: VERSION
    });

    return DatatableWidget;
});
