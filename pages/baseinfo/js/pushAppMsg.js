
var pushAppMsg = function(){
    return {
        defaultOption: {
            basePath:"",
            pushAppMsgGrid : null,
            shipNoData:[],
            disIdData:[]
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.pushAppMsgGrid = mini.get("pushAppMsgGrid");
            this.pushAppMsgGrid.setUrl(PageMain.defaultOption.httpUrl + "/PushAppMsg/getPage");
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/dispatch/loadDispatchInfo",{key:null}, function (data) {
                pushAppMsg.defaultOption.disIdData = data;
                mini.get("key").setData(data);
            });
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/ship/getList",{pageSize:100000}, function (data) {
                pushAppMsg.defaultOption.shipNoData = data.data.list;
                pushAppMsg.funSearch();
            });

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