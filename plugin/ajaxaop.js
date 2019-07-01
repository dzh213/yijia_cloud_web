layui.define('ajaxhook',function (exports) {
    hook = hookAjax({
        //拦截回调
        onreadystatechange: function (xhr) {
            console.log("onreadystatechange called: %O", xhr)
        },
        onload: function (xhr) {
            console.log("onload called: %O", xhr)
        },
        //拦截方法
        open: function (arg, xhr) {
            console.log("open called: method:%s,url:%s,async:%s", arg[0], arg[1], arg[2])
        }
    })

    //对外输出
    exports('ajaxaop', hook);
})