
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
        funRendererLoadDate: function(e)
        {
            return PageMain.funStrToDate(e.value);
        },
        funRendererDischargeDate: function(e)
        {
            return PageMain.funStrToDate(e.value);
        },
        funRendererPreArriveTime: function(e)
        {
            return PageMain.funStrToDate(e.value);
        },
        funRendererLoadTime: function(e)
        {
            return PageMain.funStrToDate(e.value);
        },
        funRendererDischargeTime: function(e)
        {
            return PageMain.funStrToDate(e.value);
        },
        funRendererLoadWeight: function(e)
        {
            return PageMain.funStrToDate(e.value);
        },
        funRendererPreArriveTime: function(e)
        {
            return PageMain.funStrToDate(e.value);
        },
        funRendererPreArriveEPortTime: function(e)
        {
            return PageMain.funStrToDate(e.value);
        },
        funRendererDischargeWeight: function(e)
        {
            return PageMain.funStrToDate(e.value);
        },
        funRendererArriveSPortTime: function(e)
        {
            return PageMain.funStrToDate(e.value);
        },
        funRendererActualArriveEPortTime: function(e)
        {
            return PageMain.funStrToDate(e.value);
        }
    }
}();

$(function(){
	PageCustomerTastView.init();
});