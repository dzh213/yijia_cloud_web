layui.define('ajaxhook',function (exports) {
    hook = hookAjax({
        //拦截回调
        onreadystatechange: function (xhr) {
            var access_token = xhr.getResponseHeader("access_token")
            if(access_token != "") {
                setCookie("access_token",access_token,15);                
            }
        },
        onload: function (xhr) {
           
        },
        //拦截方法
        open: function (arg, xhr) {
              
        },
        send: function(arg,xhr) {
            xhr.setRequestHeader("contentType","application/json; charset=utf-8");
            var access_token = getCookie("access_token");
            if(access_token != "") {
                xhr.setRequestHeader("access_token", access_token)
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