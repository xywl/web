
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
            this.customerTaskViewGrid = PageCustomerTask.defaultOption.customerTaskViewGrid;
            //this.customerTaskViewGrid.setUrl(PageMain.defaultOption.httpUrl + "/customerTaskFlow/getList?id")
        },
        funSearch : function()
        {
        	var customerTaskViewForm = new mini.Form("customerTaskViewForm");
        	this.customerTaskViewGrid.load(customerTaskViewForm.getData());
        }
    }
}();

$(function(){
	PageCustomerTastView.init();
});