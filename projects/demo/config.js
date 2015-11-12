/**
 * filename:config.js
 * desc:demo config
 * deps:
 * authors:zc
 * time:2015-10-09 09:43:50
 * version:0.0.1
 * updatelog:
 * 0.0.1:the first version
 *
 **/

(function(ns) {
    var menuConfig = [{
        "name": "demo",
        "title": "测试",
        "icon": "./images/menus/test.png",
        "url": "./modules/widget/demo/demoWidget/demoWidget",
        "config": "./modules/widget/demo/demoWidget/demoWidget_config",
        "style": "./modules/widget/demo/demoWidget/demoWidget.css",
        "type": "module",
        "region": "west",
        "group": "1",
        "groupName": "菜单"
    }, {
        "name": "",
        "title": "",
        "icon": "",
        "url": null,
        "config": "",
        "style": "",
        "type": "module",
        "region": "west",
        "group": "1",
        "groupName": "菜单"
    }, {
        "name": "菜单名",
        "title": "测试2",
        "icon": "./images/menus/test.png",
        "url": "./modules/widget/demo/demoWidget/demoWidget2",
        "config": "./modules/widget/demo/demoWidget/demoWidget_config",
        "style": "./modules/widget/demo/demoWidget/demoWidget.css",
        "type": "module",
        "region": "west",
        "group": "1",
        "groupName": "菜单"
    }, {
        "name": "demo3",
        "title": "还是测试",
        "icon": "./images/menus/test.png",
        "url": "./modules/widget/demo/demoWidget/demoWidget3",
        "config": "./modules/widget/demo/demoWidget/demoWidget_config",
        "style": "./modules/widget/demo/demoWidget/demoWidget.css",
        "type": "module",
        "region": "center",
        "group": "1",
        "groupName": "菜单1"
    }, {
        "name": "只有名称",
        "icon": "./images/menus/test.png",
        "url": "./modules/widget/demo/demoWidget/demoWidget4",
        "config": "./modules/widget/demo/demoWidget/demoWidget_config",
        "style": "./modules/widget/demo/demoWidget/demoWidget.css",
        "type": "module",
        "region": "center",
        "group": "2",
        "groupName": "菜单2"
    }, {
        "name": "半角",
        "title": "半角会有问题",
        "icon": "./images/menus/test.png",
        "url": "./modules/widget/demo/demoWidget/demoWidget5",
        "config": "./modules/widget/demo/demoWidget/demoWidget_config",
        "style": "./modules/widget/demo/demoWidget/demoWidget.css",
        "type": "module",
        "region": "east",
        "group": "2",
        "groupName": "菜单2"
    }, {
        "name": "六个",
        "title": "最长六个汉字",
        "icon": "./images/menus/test.png",
        "url": "./modules/widget/demo/demoWidget/demoWidget6",
        "config": "./modules/widget/demo/demoWidget/demoWidget_config",
        "style": "./modules/widget/demo/demoWidget/demoWidget.css",
        "type": "module",
        "region": "east",
        "group": "3",
        "groupName": "菜单3"
    }];

    var config = {
        serviceProtocol: 'http:',
        serviceIp: '192.168.1.65',
        docTitle: 'simple frame',
        title: 'I am Demo Header',
        // layout: {
        //     url: "./modules/layout/demoLayout/demoLayout",
        //     style: "./modules/layout/demoLayout/demoLayout.css"
        // },
        // layout: {
        //     url: "./modules/layout/nwcLayout/nwcLayout",
        //     config: "./modules/layout/nwcLayout/nwcLayout_config",
        //     style: "./modules/layout/nwcLayout/nwcLayout.css"
        // },
        layout: {
            url: "./modules/layout/ncLayout/ncLayout",
            config: "./modules/layout/ncLayout/ncLayout_config",
            style: "./modules/layout/ncLayout/ncLayout.css"
        },
        // container: {
        //     url: "./modules/container/demoContainer/demoContainer",
        //     config: "./modules/container/demoContainer/demoContainer_config",
        //     style: "./modules/container/demoContainer/demoContainer.css"
        // },
        // container: {
        //     url: "./modules/container/tabLeftContainer/tabLeftContainer",
        //     config: "./modules/container/tabLeftContainer/tabLeftContainer_config",
        //     style: "./modules/container/tabLeftContainer/tabLeftContainer.css"
        // },
        container: {
            url: "./modules/container/tabContainer/tabContainer",
            config: "./modules/container/tabContainer/tabContainer_config",
            style: "./modules/container/tabContainer/tabContainer.css"
        },
        server: {},
        service: {},
        // menu: [{
        //     url: "./modules/menu/demoMenu/demoMenu",
        //     style: "./modules/menu/demoMenu/demoMenu.css",
        //     type: 'menu',
        //     region: 'north',
        //     fun:menuConfig
        // }],
        menu: [{
            "url": "./modules/menu/dropdownMenu/dropdownMenu",
            "config": "./modules/menu/dropdownMenu/dropdownMenu_config",
            "style": "./modules/menu/dropdownMenu/dropdownMenu.css",
            "type": 'menu',
            "region": 'north',
            "fun":menuConfig
        }],
        toolbar: [],
        pre: [{
            "name": "title",
            "icon": "./images/menus/test.png",
            "url": "./modules/widget/head/demoHeadWidget/demoHeadWidget",
            "style": "./modules/widget/head/demoHeadWidget/demoHeadWidget.css",
            "type": "title",
            "region": "north"
        },  {
            "name": "启动",
            "title": "自启动",
            "icon": "./images/menus/test.png",
            "url": "./modules/widget/demo/demoWidget/demoWidget2",
            "config": "./modules/widget/demo/demoWidget/demoWidget_config",
            "style": "./modules/widget/demo/demoWidget/demoWidget.css",
            "type": "module",
            "region": "west",
            "group": "1",
            "groupName": "demo1",
            "closable": false
        }]
    };

    define([], function() {
        return config;
    });
})(window);
