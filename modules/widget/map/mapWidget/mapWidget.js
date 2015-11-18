/**
 * filename:mapWidget.js
 * desc:map widget
 * deps:requirejs, SfModuleBase
 * authors:zc
 * time:2015-11-14 11:37:38
 * version:0.0.1
 * updatelog:
 * 0.0.1:the first version
 *
 **/

define([
    'jquery', 'underscore', 'sfModuleBase', 'text!./mapWidget.html', 
    'openLayers2', 'baiduTileLayer'
], function(
    $, _, SfModuleBase, MapWidgetTpl
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

    var MapWidget = SfModuleBase.extend({
        constructor: function(options) {
            var me = this;
            me.base(options);
            me.dataMgr = _valueOrDefault(options, 'dataMgr', null);
            me.config = _valueOrDefault(options, 'config', null);
        },
        render: function(options) {
            var me = this;

            var el = me.el = _valueOrDefault(options, 'el', null) || me.el;
            if (el.length == 0) {
                return me;
            }
            
            $(el).html(_.template(MapWidgetTpl)());
            me.data.ui = {};
            me.data.ui.$c = el.find('#mapWidget_container');
            me.data.ui.$map = el.find('#mapWidget_mapContainer');
            
            me.resize();
            // me.__init__();
            return me;
        },
        show: function(){
            var me = this;
            me.resize();
            me.__init__();
            me.data._map.setCenter([114.42257,30.506637], 15);
            return me;
        },
        resize: function() {
            var me = this;
            var cw = me.data.ui.$c.width();
            var ch = me.data.ui.$c.height();
            me.data.ui.$map.width(cw).height(ch);
            return me;
        },
        __init__: function(){
            var me = this;
            var map = me.data._map = new OpenLayers.Map('mapWidget_mapContainer');
            var btl = new OpenLayers.Layer.BaiduTile('basic');
            map.addLayer(btl);
            return me;
        },
        destroy: function() {
            var me = this;
            me.base();
        },

        __className__: 'MapWidget',
        version: VERSION
    });

    return MapWidget;
});
