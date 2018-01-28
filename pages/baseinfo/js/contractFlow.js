
var PageContractFlow = function(){
    return {
        defaultOption: {
            basePath:"",
            ticketStatusFly:[{id:1, name:"开"},{id:2, name:"不开"}],
            flowFly : [],
            contractFlowGrid : null
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.contractFlowGrid = PageContract.defaultOption.contractFlowGrid;
            this.contractFlowGrid.setUrl(PageMain.defaultOption.httpUrl + "/contractFlow/getList?id=1")
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/flow/getList?pageIndex=0&pageSize=1000000000&queryParamFlag=1",{}, function (data) {
                console.log(data);
                if (data.total > 0)
                {
                    PageContractFlow.defaultOption.flowFly = data.data;
                }
            });
        },
        funSearch : function()
        {
        	var contractFlowForm = new mini.Form("contractFlowForm");
        	this.contractFlowGrid.load(contractFlowForm.getData());
        },
        funOperRenderer : function(e)
        {
            return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="详情查看" href="javascript:PageContractFlow.funDetail()"></a>';
        },
        funTicketStatusRenderer : function (e)
        {
            for(var nItem = 0; nItem < PageContractFlow.defaultOption.ticketStatusFly.length; nItem++)
            {
                if(e.value == PageContractFlow.defaultOption.ticketStatusFly[nItem].id)
                {
                    return PageContractFlow.defaultOption.ticketStatusFly[nItem].name;
                }
            }
            return e.value;
        },
        funFlowRenderer : function (e)
        {
            for(var nItem = 0; nItem < PageContractFlow.defaultOption.flowFly.length; nItem++)
            {
                if(e.value == PageContractFlow.defaultOption.flowFly[nItem].id)
                {
                    return PageContractFlow.defaultOption.flowFly[nItem].name;
                }
            }
            return e.value;
        },
        funReset : function()
        {
        	var contractFlowForm = new mini.Form("contractFlowForm");
        	contractFlowForm.setData();
        	mini.get("queryParamFlag").setValue("1");
            this.contractFlowGrid.load(contractFlowForm.getData());
        },
        funAdd : function()
        {
        	var paramData = {action: "add", row:{contractId:PageContract.defaultOption.contractId}, title:"增加合同流向"};
            this.funOpenInfo(paramData);
        },
        funModify : function()
        {
        	var row = this.contractFlowGrid.getSelected();
            if(row)
            {
            	var paramData = {action: "modify", row: row, title:"编辑合同流向"};
                this.funOpenInfo(paramData);
            }
            else
            {
            	PageMain.funShowMessageBox("请选择一条记录");
            }
        },
        funDetail : function()
        {
        	var row = this.contractFlowGrid.getSelected();
        	var paramData = {action: "oper", row:row, title:"查看合同流向详细"};
        	this.funOpenInfo(paramData);
        },
        funOpenInfo : function(paramData)
        {
        	var me = this;
            paramData.row.ticketStatusFly = me.defaultOption.ticketStatusFly;
            paramData.row.flowFly = me.defaultOption.flowFly;
        	mini.open({
                url: PageMain.funGetRootPath() + "/pages/baseinfo/contractFlow_add.html",
                title: paramData.title,
                width: 650,
                height: 30 *  6 + 65,
                onload:function(){
                    var iframe=this.getIFrameEl();
                    iframe.contentWindow.PageContractFlowAdd.funSetData(paramData);
                },
                ondestroy:function(action)
                {
                    if (action == "continue")
                    {
                        PageContractFlow.funAdd();
                        me.contractFlowGrid.reload();
                    }
                	me.contractFlowGrid.reload();
                }
            })
        },
        funDelete : function()
        {
            var row = this.contractFlowGrid.getSelected();
            var me = this;
            if(row)
            {
                mini.confirm("确定要删除这条记录?", "提醒", function (action) {
                    if (action == "ok") 
                    {
                        $.ajax({
                            url : PageMain.defaultOption.httpUrl + "/contractFlow/del",
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
                                        	 me.contractFlowGrid.reload();
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
	PageContractFlow.init();
});