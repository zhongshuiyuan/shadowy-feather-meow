/**
 * filename:nwcLayout_config.js
 * desc:config for nwcLayout
 * deps:jquery, requirejs
 * authors:zc
 * time:2015-10-09 22:32:46
 * version:0.0.1
 * updatelog:
 * 0.0.1:the first version
 *
 **/

(function(ns){
	var config = {
		northHeight: 40,
		westWidth: 350,
		southHeight: 0,

		showSplit: true
	};

	define([], function(){
		return config;
	});
})();