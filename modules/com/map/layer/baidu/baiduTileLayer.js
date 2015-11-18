(function(ns) {
    var BAIDU_AK = 'E4805d16520de693a3fe707cdc962045';
    var DEFAULT_UDT = '20151111';
    var TILEORIGIN_LON = 43.88955327932;
    var TILEORIGIN_LAT = 12.590178885765;
    var TILE_ONLINE_URLS = [
        "http://online0.map.bdimg.com/tile/",
        "http://online1.map.bdimg.com/tile/",
        "http://online2.map.bdimg.com/tile/",
        "http://online3.map.bdimg.com/tile/",
        "http://online4.map.bdimg.com/tile/"
    ];
    var TILE_STYLE = {
        dark: "dl",
        light: "ll",
        normal: "pl"
    };
    var BAIDU_GETAPI_URL = 'http://api.map.baidu.com/getscript?v=2.0&ak=' + BAIDU_AK + '&services=&t=20151113040005';

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

    OpenLayers.Layer.BaiduTile = OpenLayers.Class(OpenLayers.Layer.TileCache, {
        initialize: function(layerName, options) {
            var me = this;
            var op = OpenLayers.Util.extend({
                'format': 'image/png',
                isBaseLayer: true,
                tileOrigin: new OpenLayers.LonLat(TILEORIGIN_LON, TILEORIGIN_LAT),
                // tileOrigin: new OpenLayers.LonLat(0, 0),
                tileSize: new OpenLayers.Size(256, 256),
                numZoomLevels: 19
            }, options);
            var name = 'BaiduTile'
            var url = TILE_ONLINE_URLS;
            OpenLayers.Layer.TileCache.prototype.initialize.apply(me, [name, url, layerName, op]);
            me.extension = me.format.split('/')[1].toLowerCase();
            me.extension = (me.extension == 'jpg') ? 'jpeg' : me.extension;
            me.transitionEffect = "resize";
            me.buffer = 0;
            // me.tileOrigin = new OpenLayers.LonLat(TILEORIGIN_LON, TILEORIGIN_LAT);
            me.data = {};
            me.data._curTileStyle = _valueOrDefault(options, 'tileStyle', 'normal');
        },
        getURL: function(bounds) {
            var me = this;
            var tilez = me.map.zoom - 1;
            var res = me.map.getResolution();
            var bbox = me.map.getMaxExtent();
            var size = me.tileSize;
            var bx = Math.round((bounds.left - me.tileOrigin.lon) / (res * size.w));
            var by = Math.round((bounds.bottom - me.tileOrigin.lat) / (res * size.h));
            tilez = tilez + 1;
            var x = bx.toString().replace("-", "M");
            var y = by.toString().replace("-", "M");
            var urls = me.url;
            var un = parseInt((bx + by) % urls.length);
            var tss = TILE_STYLE;
            var ts = tss[me.data._curTileStyle];
            var udt = DEFAULT_UDT;
            var url = "";
            url = urls[un] + '?qt=tile&x=' + x + '&y=' + y + '&z=' + tilez + '&styles=' + ts + '&udt=' + udt;
            return url;
        },
        clone: function(obj) {
            var me = this;
            if (obj == null) {
                obj = new OpenLayers.Layer.BaiduTile(me.name, me.url, me.options);
            }
            obj = OpenLayers.Layer.TileCache.prototype.clone.apply(me, [obj]);
            return obj;
        },
        CLASS_NAME: "OpenLayers.Layer.BaiduTile"
    });
})(window);
