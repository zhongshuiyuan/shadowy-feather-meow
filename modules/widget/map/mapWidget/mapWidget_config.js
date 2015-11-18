/**
 * filename:mapWidget_config.js
 * desc:config for map widget
 * deps:jquery, requirejs
 * authors:zc
 * time:2015-11-14 11:38:27
 * version:0.0.1
 * updatelog:
 * 0.0.1:the first version
 *
 **/

(function(ns){
    var config = {
        init: {
        	center: {
        		lon: null,
        		lat: null,
        	},
        	zoom: null
        }
    };

	define([], function(){
		return config;
	});
})(window);