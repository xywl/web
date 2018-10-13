
var PageCustomerTastView = function(){
    return {
        defaultOption: {
            basePath:"",
            customerTaskViewGrid : null,
            shipFlagFly:[{id:1, name:"自有船舶"},{id:2, name:"挂靠船舶"},{id:3, name:"临调船"}],
            goodsType : [{id:1, name:"熟料"},{id:2, name:"散装"},{id:3, name:"集装箱"}],
            taskStatus : [{id:0, name:"未开始"},{id:1, name:"执行中"},{id:2, name:"已完成"}],
            sailingStatusTypeFly : [{id:0, name:"已调度"},{id:1, name:"空船到港"},{id:2, name:"空船装后"},{id:3, name:"重船离港"},{id:4, name:"重船到港"},{id:5, name:"重船卸后"}]
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
            for(var nItem = 0; nItem < PageCustomerTastView.defaultOption.sailingStatusTypeFly.length; nItem++)
            {
                if(e.value == PageCustomerTastView.defaultOption.sailingStatusTypeFly[nItem].id)
                {
                    return PageCustomerTastView.defaultOption.sailingStatusTypeFly[nItem].name;
                }
            }
            return "未调度";
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
        },
        funRendererShipFlag: function (e)
        {
            for(var nItem = 0; nItem < PageCustomerTastView.defaultOption.shipFlagFly.length; nItem++)
            {
                if(e.value == PageCustomerTastView.defaultOption.shipFlagFly[nItem].id)
                {
                    return PageCustomerTastView.defaultOption.shipFlagFly[nItem].name;
                }
            }
            return e.value;
        }
    }
}();

$(function(){
	PageCustomerTastView.init();
});