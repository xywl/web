
var PageTransferFlowPrice = function(){
    return {
        defaultOption: {
            basePath:"",
            flowFly : null,
            transferFlowPriceGrid : null
        },
        init :function ()
        {
            this.basePath = PageMain.basePath;
            this.transferFlowPriceGrid = PageTransferPrice.defaultOption.transferFlowPriceGrid;
            this.transferFlowPriceGrid.setUrl(PageMain.defaultOption.httpUrl + "/transferFlowPrice/getList")
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/flow/getList", {queryParamFlag: 1, pageIndex:0, pageSize:1000000000}, function (data) {
                if(data.success)
                {
                    PageTransferFlowPrice.defaultOption.flowFly = data.data;
                }
            });
        },
        funSearch : function()
        {
        	var transferFlowPriceForm = new mini.Form("transferFlowPriceForm");
        	this.transferFlowPriceGrid.load(transferFlowPriceForm.getData());
        },
        funOperRenderer : function(e)
        {
            return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="详情查看" href="javascript:PageTransferFlowPrice.funDetail()"></a>';
        },
       /* funFlowRenderer : function (e)
        {
            for(var nItem = 0; nItem < PageTransferFlowPrice.defaultOption.flowFly.length; nItem++)
            {
                if(e.value == PageTransferFlowPrice.defaultOption.flowFly[nItem].id)
                {
                    return PageTransferFlowPrice.defaultOption.flowFly[nItem].name;
                }
            }
            return e.value;
        },*/
        funReset : function()
        {
        	var transferFlowPriceForm = new mini.Form("transferFlowPriceForm");
        	transferFlowPriceForm.setData();
        	mini.get("queryParamFlag").setValue("1");
            this.transferFlowPriceGrid.load(transferFlowPriceForm.getData());
        },
        funAdd : function()
        {
        	var paramData = {action: "add", row:{transferPriceId:PageTransferPrice.defaultOption.transferPriceId,contractId:PageTransferPrice.defaultOption.contractId}, title:"新增运价流向信息数据"};
            this.funOpenInfo(paramData);
        },
        funModify : function()
        {
        	var row = this.transferFlowPriceGrid.getSelected();
            if(row)
            {
            	var paramData = {action: "modify", row: row, title:"编辑运价流向信息数据"};
                this.funOpenInfo(paramData);
            }
            else
            {
            	PageMain.funShowMessageBox("请选择一条记录");
            }
        },
        funDetail : function()
        {
        	var row = this.transferFlowPriceGrid.getSelected();
        	var paramData = {action: "oper", row:row, title:"查看运价流向信息详细"};
        	this.funOpenInfo(paramData);
        },
        funOpenInfo : function(paramData)
        {
            paramData.row.flowFly = this.defaultOption.flowFly;
        	var me = this;
        	mini.open({
                url: PageMain.funGetRootPath() + "/pages/baseinfo/transferFlowPrice_add.html",
                title: paramData.title,
                width: 650,
                height: 30 *  8 + 65,
                onload:function(){
                    var iframe=this.getIFrameEl();
                    iframe.contentWindow.PageTransferFlowPriceAdd.funSetData(paramData);
                },
                ondestroy:function(action){

                    if (action == "continue")
                    {
                        PageTransferFlowPrice.funAdd();
                    }
                    me.transferFlowPriceGrid.reload();
                }
            })
        },
        funDelete : function()
        {
            var row = this.transferFlowPriceGrid.getSelected();
            var me = this;
            if(row)
            {
                mini.confirm("确定要删除这条记录?", "提醒", function (action) {
                    if (action == "ok") 
                    {
                        $.ajax({
                            url : PageMain.defaultOption.httpUrl + "/transferFlowPrice/del",
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
                                        	 me.transferFlowPriceGrid.reload();
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
        }
    }
}();

$(function(){
	PageTransferFlowPrice.init();
});