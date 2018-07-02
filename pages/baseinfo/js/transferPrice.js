
var PageTransferPrice = function(){
    return {
        defaultOption: {
            basePath:"",
            transferFlowPriceGrid:null,
            transferPriceGrid : null,
            customerFly : null,
            contractFly : null,
            transferPriceId:0,
            contractId:0,
            customerCombox:null,
            priceTypeFly : [{id:1, name:"客户"},{id:2, name:"船户"}],
            detailGridForm:null
        },
        init :function ()
        {
            mini.parse();
            this.defaultOption.transferFlowPriceGrid = mini.get("transferFlowPriceGrid");
            this.defaultOption.transferFlowPriceGrid.setUrl(PageMain.defaultOption.httpUrl + "/transferFlowPrice/getList");
            this.defaultOption.detailGridForm  = document.getElementById("detailGrid_Form");
            //this.defaultOption.customerCombox = mini.get("customerId");

            this.basePath = PageMain.basePath;
            this.transferPriceGrid = mini.get("transferPriceGrid");
            this.defaultOption.customerCombox = mini.get("customerId");
            this.transferPriceGrid.setUrl(PageMain.defaultOption.httpUrl + "/transferPrice/getList");

            PageMain.funUserProfileInfo();
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/customer/getList", {queryParamFlag: 1, pageIndex:0, pageSize:1000000000}, function (data) {
                if(data.success)
                {
                    PageTransferPrice.defaultOption.customerFly = data.data;
                    PageTransferPrice.defaultOption.customerCombox.setData(data.data);
                }
            });
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/contract/getList", {queryParamFlag: 1, pageIndex:0, pageSize:1000000000}, function (data) {
                if(data.success)
                {
                    PageTransferPrice.defaultOption.contractFly = data.data;
                }
            });

            this.funSearch();
        },
        funSearch : function()
        {
        	var transferPriceForm = new mini.Form("transferPriceForm");
        	this.transferPriceGrid.load(transferPriceForm.getData());
        },
        funCustomerRenderer : function (e)
        {
            for(var nItem = 0; nItem < PageTransferPrice.defaultOption.customerFly.length; nItem++)
            {
                if(e.value == PageTransferPrice.defaultOption.customerFly[nItem].id)
                {
                    return PageTransferPrice.defaultOption.customerFly[nItem].fullName;
                }
            }
            return e.value;
        },
        funContractRenderer : function (e)
        {
            for(var nItem = 0; nItem < PageTransferPrice.defaultOption.contractFly.length; nItem++)
            {
                if(e.value == PageTransferPrice.defaultOption.contractFly[nItem].id)
                {
                    return PageTransferPrice.defaultOption.contractFly[nItem].name;
                }
            }
            return e.value;
        },
        funPriceTypeRenderer : function (e)
        {
            for(var nItem = 0; nItem < PageTransferPrice.defaultOption.priceTypeFly.length; nItem++)
            {
                if(e.value == PageTransferPrice.defaultOption.priceTypeFly[nItem].id)
                {
                    return PageTransferPrice.defaultOption.priceTypeFly[nItem].name;
                }
            }
            return e.value;
        },
        funOperRenderer : function(e)
        {
            return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="详情查看" href="javascript:PageTransferPrice.funDetail()"></a>';
        },
        funReset : function()
        {
        	var transferPriceForm = new mini.Form("transferPriceForm");
        	transferPriceForm.setData();
        	mini.get("queryParamFlag").setValue("1");
            this.transferPriceGrid.load(transferPriceForm.getData());
        },
        funAdd : function()
        {
        	var paramData = {action: "add", row:{}, title:"新增数据"};
            this.funOpenInfo(paramData);
        },
        funModify : function()
        {
        	var row = this.transferPriceGrid.getSelected();
            if(row)
            {
            	var paramData = {action: "modify", row: row, title:"编辑数据"};
                this.funOpenInfo(paramData);
            }
            else
            {
            	PageMain.funShowMessageBox("请选择一条记录");
            }
        },
        funDetail : function()
        {
        	var row = this.transferPriceGrid.getSelected();
        	var paramData = {action: "oper", row:row, title:"查看详细"};
        	this.funOpenInfo(paramData);
        },
        funOpenInfo : function(paramData)
        {
        	var me = this;
            paramData.row.customerFly = this.defaultOption.customerFly;
            paramData.row.contractFly = this.defaultOption.contractFly;
            paramData.row.priceTypeFly = this.defaultOption.priceTypeFly;
        	mini.open({
                url: PageMain.funGetRootPath() + "/pages/baseinfo/transferPrice_add.html",
                title: paramData.title,
                width: 650,
                height: 30 *  5 + 65,
                onload:function(){
                    var iframe=this.getIFrameEl();
                    iframe.contentWindow.PageTransferPriceAdd.funSetData(paramData);
                },
                ondestroy:function(action){
                    if(action == "close" || action == "cancel")
                    {
                        return ;
                    }
                    else if (action == "save")
                    {
                        me.transferPriceGrid.reload();
                    }
                    else
                    {
                        PageTransferPrice.defaultOption.transferPriceId = action.transferPriceId;
                        PageTransferFlowPrice.funAdd();
                        me.transferPriceGrid.reload();
                    }

                }
            })
        },
        funDelete : function()
        {
            var row = this.transferPriceGrid.getSelected();
            var me = this;
            if(row)
            {
                mini.confirm("确定要删除这条记录?", "提醒", function (action) {
                    if (action == "ok") 
                    {
                        $.ajax({
                            url : PageMain.defaultOption.httpUrl + "/transferPrice/del",
                            type: 'POST',
                            data: {"id": row.id},
                            dataType: 'json',
                            success: function (data)
                            {
                            	
                            	 if (data.success)
                                 {
                                     mini.alert("操作成功", "提醒", function(){
                                         if(data.success)
                                         {
                                        	 me.transferPriceGrid.reload();
                                         }
                                     });
                                 }
                                 else
                                 {
                                     PageMain.funShowMessageBox(data.msg);
                                 }
                            },
                            error: function ()
                            {
                                PageMain.funShowMessageBox("删除记录失败");
                            }
                        });
                    }
                })
            }
            else
            {
                mini.alert("请先选择要删除的记录");
            }
        },
        onShowRowDetail : function (e)
        {
            var grid = e.sender;
            var row = e.record;
            var td = grid.getRowDetailCellEl(row);
            td.appendChild(PageTransferPrice.defaultOption.detailGridForm);
            PageTransferPrice.defaultOption.detailGridForm.style.display = "block";
            PageTransferPrice.defaultOption.transferPriceId = row.id;
            PageTransferPrice.defaultOption.contractId = row.contractId;
            PageTransferPrice.defaultOption.transferFlowPriceGrid.load({transferPriceId:row.id, queryParamFlag: 1 });
        },
    }
}();

$(function(){
	PageTransferPrice.init();
});