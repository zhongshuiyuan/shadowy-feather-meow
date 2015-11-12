/**
 * filename:dropdownMenu_config.js
 * desc:config for dropdown menu
 * deps:jquery, requirejs
 * authors:zc
 * time:2015-10-14 15:41:12
 * version:0.0.1
 * updatelog:
 * 0.0.1:the first version
 *
 **/

(function(ns){
    var config = {
    	// 子菜单打开方向
        openLeft: false,

        // 子菜单类型
        // list, panel
        dropdownType: 'list',
        addFrame: false
    };

	define([], function(){
		return config;
	});
})(window);