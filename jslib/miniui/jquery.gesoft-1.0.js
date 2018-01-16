var PageMain = function(){
    return {
        defaultOption: {
            basePath:"",
            httpUrl : "http://127.0.0.1:16721/xyl"
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
        
        callAjax : function (paramUrl, paramData, callback) 
        {
            $.ajax({
                url : paramUrl,
                type: 'POST',
                data: paramData,
                dataType: 'json',
                success: function (data)
                {
                    callback(data);
                },
                error: function ()
                {
                    PageMain.funShowMessageBox("加载数据失败");
                }
            });
        }
    }
}();