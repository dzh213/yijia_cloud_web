layui.define('ajaxhook',function (exports) {
    hook = hookAjax({
        //拦截回调
        onreadystatechange: function (xhr) {
            var access_token = xhr.getResponseHeader("access-token")
            if(access_token != "" && access_token != null) {
                setCookie("access-token",access_token,15);                
            }            
        },
        onload: function (xhr) {
        },
        //拦截方法
        open: function (arg, xhr) {
              
        },
        send: function(arg,xhr) {
            xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
            var access_token = getCookie("access-token");
            if(access_token != "") {
                xhr.setRequestHeader("access-token", access_token)
            }else{
                layer.msg("请重新登陆！");
                location.href = layui.cache.host + '/login.html';
            }
        }
    })

    function setCookie(cname,cvalue,exdays){
        var d = new Date();
        d.setTime(d.getTime()+(exdays*24*60*60*1000));
        var expires = "expires="+d.toGMTString();
        document.cookie = cname+"="+cvalue+"; "+expires;
    }
    function getCookie(cname){
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
        }
        return "";
    }

    //对外输出
    exports('ajaxaop', hook);
})