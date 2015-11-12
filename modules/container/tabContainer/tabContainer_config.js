/**
 * filename:tabContainer_config.js
 * desc:config for tabContainer
 * deps:jquery, requirejs
 * authors:zc
 * time:2015-11-10 15:37:36
 * version:0.0.1
 * updatelog:
 * 0.0.1:the first version
 *
 **/

(function(ns){
	var config = {
		tabMaxNum: 10,

		westWidth: 300,
		eastWidth: 300
	};

	define([], function(){
		return config;
	});
})();