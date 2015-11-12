/**
 * filename:newcLayout_config.js
 * desc:config for newcLayout
 * deps:jquery, requirejs
 * authors:zc
 * time:2015-11-10 11:19:05
 * version:0.0.1
 * updatelog:
 * 0.0.1:the first version
 *
 **/

(function(ns){
	var config = {
		northHeight: 80,
		eastWidth: 300,
		westWidth: 350,
		southHeight: 0,

		showSplit: true
	};

	define([], function(){
		return config;
	});
})();