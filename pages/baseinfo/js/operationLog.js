
var PageOperationLog = function(){
    return {
        defaultOption: {
            basePath:"",
            operationLogGrid : null
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.operationLogGrid = mini.get("operationLogGrid");
            this.operationLogGrid.setUrl(PageMain.defaultOption.httpUrl + "/operationLog/getList");
            this.funSearch();
        },
        funSearch : function()
        {
        	var operationLogForm = new mini.Form("operationLogForm");
        	this.operationLogGrid.load(operationLogForm.getData());
        },
        funReset : function()
        {
        	var operationLogForm = new mini.Form("operationLogForm");
            operationLogForm.setData();
            mini.get("queryParamFlag").setValue("1");
            this.operationLogGrid.load(operationLogForm.getData());
        },
        funFromDateInfo: function(e)
        {
            return PageMain.funStrToDate(e.value);
        }
    }
}();

$(function(){
    PageOperationLog.init();
});