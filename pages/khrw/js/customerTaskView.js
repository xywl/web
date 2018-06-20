
var PageCustomerTastView = function(){
    return {
        defaultOption: {
            basePath:"",
            customerTaskViewGrid : null
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.customerTaskViewGrid = mini.get("customerTaskViewGrid");
            this.customerTaskViewGrid.setUrl(PageMain.defaultOption.httpUrl + "/customerTask/getTaskDetailList");
            PageCustomerTastView.funSearch();
        },
        funSearch : function()
        {
        	var customerTaskViewForm = new mini.Form("customerTaskViewForm");
        	this.customerTaskViewGrid.load(customerTaskViewForm.getData());
        },
        funReset : function()
        {
            var customerTaskViewForm = new mini.Form("customerTaskViewForm");
            customerTaskViewForm.setData();
            mini.get("queryParamFlag").setValue("1");
            this.customerTaskViewGrid.load(customerTaskViewForm.getData());
        },
    }
}();

$(function(){
	PageCustomerTastView.init();
});