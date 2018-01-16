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
    }
}();