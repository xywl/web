var PageMain = function(){
    return {
        defaultOption: {
            basePath:"",
            httpUrl : "http://xingyi.nandasoft-its.com:8080/xyl"
        },
        init :function (basePath){
            this.basePath = basePath;
        },
        funShowMessageBox : function(msg)
        {
            mini.showMessageBox({
                showModal: false,
                width: 250,
                title: "提醒",
                iconCls: "mini-messagebox-warning",
                message: msg,
                timeout: 2000
            });
        },
        funShowLoading : function ()
        {
            var tmp = '加载中...';
            if (arguments.length  > 0)
            {
                tmp = arguments[0];
            }
            mini.mask({
                el: document.body,
                cls: 'mini-mask-loading',
                html: tmp
            });
        },
        IsNull:function (paramId, paramTip)
        {
            var tmp = "";
            if (arguments.length == 3)
            {
                tmp = $("#"+paramId).val();
            }
            else
            {
                tmp = mini.get(paramId).getValue();
            }
            if(tmp == null || tmp == "" || $.trim(tmp).length == 0)
            {
                PageMain.funShowMessageBox(paramTip + "内容为空");
                return true;
            }
            return false;
        },
        funStrToDate :function ()
        {
            if (arguments[0] == "0"
                || arguments[0] == 0
                || arguments[0] == null
                || arguments[0] == "null")
            {
                return "";
            }
            var paramFormat = "yyyy-MM-dd HH:mm:ss";
            if (arguments.length > 1)
            {
                paramFormat = arguments[1];
            }
            var tmp = parseInt(arguments[0]) * 1000;
            return mini.formatDate(new Date(tmp), paramFormat);
        },
        funStrinfo : function (text)
        {
            if (text == null || text == "null")
            {
                return "";
            }
            return text;
        },
        funCloseLoading : function ()
        {
            mini.unmask(document.body);
        },
        funCloseWindow : function(action)
        {
            if(window.CloseOwnerWindow) return window.CloseOwnerWindow(action);
            else window.close();
        },
        funGetRootPath : function()
        {
            var pathName = window.location.pathname.substring(1);
            var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
            var path = "";
            if (webName == "") {
                path = window.location.protocol + '//' + window.location.host;
            }
            else {
                path = window.location.protocol + '//' + window.location.host + '/' + webName;
            }
            return path;
        },
        funGetUrlInfo : function ()
        {
            var pathName = window.location.pathname.substring(1);
            var webName = pathName == '' ? '' : pathName.substring(pathName.indexOf('/'));
            return webName;
        },
        funTipInfo : function (txt)
        {
            mini.showMessageBox({
                showModal: false,
                width: 250,
                height:120,
                title: "提示",
                iconCls: "mini-messagebox-warning",
                message: txt,
                x: "right",
                y: "bottom",
                timeout: 10000
            });
        },
        //
        callAjax : function (paramUrl, paramData, callback)
        {
            var contentType = "application/x-www-form-urlencoded";
            if (arguments.length == 4)
            {
                contentType =  arguments[3];
            }
            $.ajax({
                url : paramUrl,
                type: 'POST',
                data: paramData,
                async: true, //同步
                dataType: 'json',
                contentType:contentType,
                success: function (data)
                {
                    callback(data);
                },
                error: function ()
                {
                    PageMain.funShowMessageBox("操作出现异常");
                }
            });
        }
    }
}();

$(function () {
    if( typeof  $.cookie('token') === "undefined" && PageMain.funGetUrlInfo() != "/pages/login/login.html")
    {
       window.location.href = PageMain.funGetRootPath() + "/pages/login/login.html"
    }
})