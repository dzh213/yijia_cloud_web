layui.define(['element', 'common','tab'], function (exports) {
    "use strict";
    var $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : parent.layer,
        element = layui.element,
        common = layui.common,
        tab = layui.tab,
        cacheName = 'tb_navbar';

    var Navbar = function () {
        /**
         *  默认配置
         */
        this.config = {
            elem: undefined, //容器
            data: undefined, //数据源
            url: undefined, //数据源地址
            type: 'GET', //读取方式
            cached: false, //是否使用缓存
            spreadOne: false //设置是否只展开一个二级菜单
        };
        this.v = '1.0.0';
    };
    //渲染
    Navbar.prototype.render = function () {
        var _that = this;
        var _config = _that.config;
        if (typeof (_config.elem) !== 'string' && typeof (_config.elem) !== 'object') {
            common.throwError('Navbar error: elem参数未定义或设置出错，具体设置格式请参考文档API.');
        }
        var $container;
        if (typeof (_config.elem) === 'string') {
            $container = $('' + _config.elem + '');
        }
        if (typeof (_config.elem) === 'object') {
            $container = _config.elem;
        }
        if ($container.length === 0) {
            common.throwError('Navbar error:找不到elem参数配置的容器，请检查.');
        }
        if (_config.data === undefined && _config.url === undefined) {
            common.throwError('Navbar error:请为Navbar配置数据源.')
        }
        if (_config.data !== undefined && typeof (_config.data) === 'object') {
            var html = getHtml(_config.data);
            $container.html(html);
            element.init();
            _that.config.elem = $container;
        } else {
            if (_config.cached) {
                var cacheNavbar = layui.data(cacheName);
                if (cacheNavbar.navbar === undefined) {
                    $.ajax({
                        type: _config.type,
                        url: _config.url,
                        async: false, //_config.async,
                        dataType: 'json',
                        success: function (result, status, xhr) {
                            if(result.code != 200) {
                                layer.msg(result.message);
                                location.href = layui.cache.host + '/login.html';
                            }
                            //添加缓存
                            layui.data(cacheName, {
                                key: 'navbar',
                                value: result.data
                            });
                            var html = getHtml(result.data);
                            $container.html(html);
                            element.init();
                        },
                        error: function (xhr, status, error) {
                            common.msgError('Navbar error:' + error);
                        },
                        complete: function (xhr, status) {
                            _that.config.elem = $container;
                        }
                    });
                } else {
                    var html = getHtml(cacheNavbar.navbar);
                    $container.html(html);
                    element.init();
                    _that.config.elem = $container;
                }
            } else {
                //清空缓存
                layui.data(cacheName, null);
                $.ajax({
                    type: _config.type,
                    url: _config.url,
                    async: false, //_config.async, 必须同步，但是响应aop不拦截了
                    dataType: 'json',
                    success: function (result, status, xhr) {
                        if(result.code != 200) {
                            layer.msg(result.message);
                            location.href = layui.cache.host + '/login.html';
                        }
                        var html = getHtml(result.data);
                        $container.html(html);
                        element.init();
                    },
                    error: function (xhr, status, error) {
                        common.msgError('Navbar error:' + error);
                    },
                    complete: function (xhr, status) {
                        _that.config.elem = $container;
                    }
                });
            }
        }

        //只展开一个二级菜单
        if (_config.spreadOne) {
            var $ul = $container.children('ul');
            $ul.find('li.layui-nav-item').each(function () {
                $(this).on('click', function () {
                    $(this).siblings().removeClass('layui-nav-itemed');
                });
            });
        }
        return _that;
    };
    /**
     * 配置Navbar
     * @param {Object} options
     */
    Navbar.prototype.set = function (options) {
        var that = this;
        that.config.data = undefined;
        $.extend(true, that.config, options);
        return that;
    };
    /**
     * 绑定事件
     * @param {String} events
     * @param {Function} callback
     */
    Navbar.prototype.on = function (events, callback) {
        var that = this;
        var _con = that.config.elem;
        if (typeof (events) !== 'string') {
            common.throwError('Navbar error:事件名配置出错，请参考API文档.');
        }
        var lIndex = events.indexOf('(');
        var eventName = events.substr(0, lIndex);
        var filter = events.substring(lIndex + 1, events.indexOf(')'));
        if (eventName === 'click') {
            if (_con.attr('lay-filter') !== undefined) {
                _con.children('ul').find('li').each(function () {
                    var $this = $(this);
                    //二三级点击
                    if ($this.find('dl').length > 0) {
                        var $dd = $this.find('dd').each(function () {
                            $(this).on('click', function () {
                                var $a = $(this).children('a');
                                var href = $a.data('url');
                                var id = $a.data('id');
                                var icon = $a.children('i:first').data('icon');
                                var title = $a.children('cite').text();
                                var data = {
                                    elem: $a,
                                    field: {
                                        href: href,
                                        icon: icon,
                                        title: title.trim(),
                                        id: id
                                    }
                                }
                                callback(data);
                            });
                        });
                    } else {
                        //一级点击
                        $this.on('click', function () {
                            var $a = $this.children('a');
                            var href = $a.data('url');
                            var id = $a.data('id');
                            var icon = $a.children('i:first').data('icon');
                            var title = $a.children('cite').text();
                            var data = {
                                elem: $a,
                                field: {
                                    href: href,
                                    icon: icon,
                                    title: title.trim(),
                                    id: id
                                }
                            }
                            callback(data);
                        });
                    }
                });
            }
        }
    };


    /**
     * 点击菜单回调
     */
    Navbar.prototype.clickCallBack = function (data) {
        var layid = data.field.title + "|" + data.field.id;

        //这时会判断右侧.layui-tab-title属性下的有lay-id属性的li的数目，即已经打开的tab项数目
        if ($(".layui-tab-title li[lay-id]").length <= 0) {
          //如果比零小，则直接打开新的tab项
          tab.tabAdd(data.field.href, layid, data.field.title);
        } else {
          //否则判断该tab项是否以及存在
          var isData = false; //初始化一个标志，为false说明未打开该tab项 为true则说明已有
          $.each($(".layui-tab-title li[lay-id]"), function () {
            //如果点击左侧菜单栏所传入的id 在右侧tab项中的lay-id属性可以找到，则说明该tab项已经打开
            if ($(this).attr("lay-id") == layid) {
              isData = true;
            }
          })

          if (isData == false) {
            //标志为false 新增一个tab项
            tab.tabAdd(data.field.href, layid, data.field.title);
          }
        }
        //最后不管是否新增tab，最后都转到要打开的选项页面上
        tab.tabChange(layid);

        //菜单选中
        element.on('tab(pagetabs)', function () {
          var lay_id = this.getAttribute('lay-id');
          var id = lay_id.split("|")[1];
          // location.hash = 'pagetabs='+ this.getAttribute('lay-id');
          //移除选中
          $(".layui-nav-tree .layui-this").removeClass("layui-this");
          //添加选中
          $(".layui-nav-tree a").each(function () {
            var that = this;
            if ($(that).data("id") == id) {
              $(that).parent().addClass("layui-this");
              return;
            }
          });

        });
    }    
    /**
     * 清除缓存
     */
    Navbar.prototype.cleanCached = function () {
        layui.data(cacheName, null);
    };
    /**
     * 获取html字符串
     * @param {Object} data
     */
    function getHtml(data) {
        var ulHtml = '<ul class="layui-nav layui-nav-tree beg-navbar">';
        for (var i = 0; i < data.length; i++) {
            if (data[i].spread) {
                ulHtml += '<li class="layui-nav-item layui-nav-itemed">';
            } else {
                ulHtml += '<li class="layui-nav-item">';
            }
            if (data[i].children !== undefined && data[i].children !== null && data[i].children.length > 0) {
                ulHtml += '<a href="javascript:;">' + '<i class= "layui-icon ' + data[i].icon + '" ></i> ' + data[i].title;
                ulHtml += '<span class="layui-nav-more"></span>';
                ulHtml += '</a>';
                ulHtml += '<dl class="layui-nav-child">';
                //二级菜单
                for (var j = 0; j < data[i].children.length; j++) {
                    //是否有孙子节点(暂时没用到三级菜单，用到的话仿造二级修改)
                    if (data[i].children[j].children !== undefined && data[i].children[j].children !== null && data[i].children[j].children.length > 0) {
                        ulHtml += '<dd>';
                        ulHtml += '<a href="javascript:;" style="margin-left:20px">' + data[i].children[j].title;
                        ulHtml += '<span class="layui-nav-more"></span>';
                        ulHtml += '</a>';
                        //三级菜单
                        ulHtml += '<dl class="layui-nav-child">';
                        var grandsonNodes = data[i].children[j].children;
                        for (var k = 0; k < grandsonNodes.length; k++) {
                            ulHtml += '<dd>';
                            ulHtml += '<a data-url="' + grandsonNodes[k].href + '">' + grandsonNodes[k].title + '</a>';
                            ulHtml += '</dd>';
                        }
                        ulHtml += '</dl>';
                        ulHtml += '</dd>';
                    } else {
                        ulHtml += '<dd>';
                        ulHtml += '<a data-id="' + data[i].children[j].id + '" data-url="' + data[i].children[j].href + '" style="margin-left:20px">' + '<cite> ' + data[i].children[j].title + '</cite>';;
                        ulHtml += '</a>';
                        ulHtml += '</dd>';
                    }
                    //ulHtml += '<dd title="' + data[i].children[j].title + '">'; 
                }
                ulHtml += '</dl>';
            } else {
                var dataUrl = (data[i].href !== undefined && data[i].href !== '') ? 'data-url="' + data[i].href + '"' : '';
                //ulHtml += '<a href="javascript:;" ' + dataUrl + '>';
                ulHtml += '<a data-id="' + data[i].id + '" href="javascript:;" ' + dataUrl + '>';
                if (data[i].icon !== undefined && data[i].icon !== '') {
                    // if (data[i].icon.indexOf('fa-') !== -1) {
                    //     ulHtml += '<i class="fa ' + data[i].icon + '" aria-hidden="true" data-icon="' + data[i].icon + '"></i>';
                    // } else {
                    //     ulHtml += '<i class="layui-icon" data-icon="' + data[i].icon + '">' + data[i].icon + '</i>';
                    // }
                    ulHtml += '<i class= "layui-icon ' + data[i].icon + '" ></i>';
                }
                ulHtml += '<cite> ' + data[i].title + '</cite>';
                ulHtml += '</a>';
            }
            ulHtml += '</li>';
        }
        ulHtml += '</ul>';

        return ulHtml;
    }

    var navbar = new Navbar();

    exports('navbar', function (options) {
        return navbar.set(options);
    });
});