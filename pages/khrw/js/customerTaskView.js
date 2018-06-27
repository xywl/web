
var PageCustomerTastView = function(){
    return {
        defaultOption: {
            basePath:"",
            customerTaskViewGrid : null,
            goodsType : [{id:1, name:"熟料"},{id:2, name:"散装"},{id:3, name:"集装箱"}],
            taskStatus : [{id:0, name:"未开始"},{id:1, name:"执行中"},{id:2, name:"已完成"}]
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.customerTaskViewGrid = mini.get("customerTaskViewGrid");
            this.customerTaskViewGrid.setUrl(PageMain.defaultOption.httpUrl + "/customerTask/getTaskDetailList");
            PageCustomerTastView.funSearch();

            // var grid = mini.get("customerTaskViewGrid");
            // grid.on("load", function () {
            //     grid.mergeColumns(["taskStatus", "taskNo", "fullName", "contractName", "totalLoad", "flowName", "goodsName", "goodsType"]);
            // });
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
        funRendererTaskStatus : function (e)
        {
            for(var nItem = 0; nItem < PageCustomerTastView.defaultOption.taskStatus.length; nItem++)
            {
                if(e.value == PageCustomerTastView.defaultOption.taskStatus[nItem].id)
                {
                    return PageCustomerTastView.defaultOption.taskStatus[nItem].name;
                }
            }
            return "";
        },
        funRendererGoodsType : function (e)
        {
            for(var nItem = 0; nItem < PageCustomerTastView.defaultOption.goodsType.length; nItem++)
            {
                if(e.value == PageCustomerTastView.defaultOption.goodsType[nItem].id)
                {
                    return PageCustomerTastView.defaultOption.goodsType[nItem].name;
                }
            }
            return "";
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