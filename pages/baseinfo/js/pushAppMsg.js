
var pushAppMsg = function(){
    return {
        defaultOption: {
            basePath:"",
            pushAppMsgGrid : null
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.pushAppMsgGrid = mini.get("pushAppMsgGrid");
            this.pushAppMsgGrid.setUrl(PageMain.defaultOption.httpUrl + "/PushAppMsg/getPage");
            pushAppMsg.funSearch();

        },
        funFromDateInfo:function(e){
            return PageMain.funStrToDate(e.value);
        },
        funSearch : function()
        {
            var pushAppMsgForm = new mini.Form("pushAppMsgForm");
            this.pushAppMsgGrid.load(pushAppMsgForm.getData());
        },
        funReset : function()
        {
            var pushAppMsgForm = new mini.Form("pushAppMsgForm");
            pushAppMsgForm.setData();
            mini.get("queryParamFlag").setValue("1");
            this.pushAppMsgGrid.load(pushAppMsgForm.getData());
        }
    }
}();

$(function(){
    pushAppMsg.init();
});