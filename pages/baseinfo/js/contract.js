
var PageContract = function(){
    return {
        defaultOption: {
            basePath:"",
            contractStatus:[{id:1, name:"启用"},{id:2, name:"禁用"}],
            contractType:[{id:1, name:"短期"},{id:2, name:"长期"}],
            customerFly : [],
            contractGrid : null,
            contractFlowGrid : null,
            contractId:0,
            dataDictFly : [],
            detailGridForm : null
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.defaultOption.contractFlowGrid = mini.get("contractFlow_grid");
            this.defaultOption.contractFlowGrid.setUrl(PageMain.defaultOption.httpUrl + "/contractFlow/getList");
            this.defaultOption.detailGridForm  = document.getElementById("detailGrid_Form");
            this.contractGrid = mini.get("contractGrid");
            this.contractGrid.setUrl(PageMain.defaultOption.httpUrl + "/contract/getList")
            PageMain.callAjax(PageMain.defaultOption.httpUrl +"/gps/loadDataDict", {code:"departMent"}, function (data) {
                PageContract.defaultOption.dataDictFly = data;
            })

            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/gps/loadCustomer",{}, function (data) {
                PageContract.defaultOption.customerFly = data;
                PageContract.funSearch();
            });
        },
        funSearch : function()
        {
        	var contractForm = new mini.Form("contractForm");
        	this.contractGrid.load(contractForm.getData());
        },
        funTypeRenderer : function (e)
        {
            for(var nItem = 0; nItem < PageContract.defaultOption.contractType.length; nItem++)
            {
                if(e.value == PageContract.defaultOption.contractType[nItem].id)
                {
                    return PageContract.defaultOption.contractType[nItem].name;
                }
            }
            return e.value;
        },
        funDictRenderer : function (e)
        {
            for(var nItem = 0; nItem < PageContract.defaultOption.dataDictFly.length; nItem++)
            {
                if(e.value == PageContract.defaultOption.dataDictFly[nItem].id)
                {
                    return PageContract.defaultOption.dataDictFly[nItem].name;
                }
            }
            return e.value;
        },
        funARenderer : function (e) {
            for(var nItem = 0; nItem < PageContract.defaultOption.customerFly.length; nItem++)
            {
                if(e.value == PageContract.defaultOption.customerFly[nItem].id)
                {
                    return PageContract.defaultOption.customerFly[nItem].name;
                }
            }
            return e.value;
        },
        funStatueRenderer : function (e)
        {
            for(var nItem = 0; nItem < PageContract.defaultOption.contractStatus.length; nItem++)
            {
                if(e.value == PageContract.defaultOption.contractStatus[nItem].id)
                {
                    return PageContract.defaultOption.contractStatus[nItem].name;
                }
            }
            return e.value;
        },
        funOperRenderer : function(e)
        {
            return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="详情查看" href="javascript:PageContract.funDetail()"></a>';
        },
        funReset : function()
        {
        	var contractForm = new mini.Form("contractForm");
        	contractForm.setData();
        	mini.get("queryParamFlag").setValue("1");
            this.contractGrid.load(contractForm.getData());
        },
        funAdd : function()
        {
        	var paramData = {action: "add", row:{}, title:"新增数据"};
            this.funOpenInfo(paramData);
        },
        funModify : function()
        {
        	var row = this.contractGrid.getSelected();
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
        	var row = this.contractGrid.getSelected();
        	var paramData = {action: "oper", row:row, title:"查看详细"};
        	this.funOpenInfo(paramData);
        },
        onShowRowDetail : function (e)
        {
            var grid = e.sender;
            var row = e.record;
            var td = grid.getRowDetailCellEl(row);
            td.appendChild(PageContract.defaultOption.detailGridForm);
            PageContract.defaultOption.detailGridForm.style.display = "block";
            PageContract.defaultOption.contractId = row.id;
            PageContract.defaultOption.contractFlowGrid.load({ contractId: row.id, queryParamFlag: 1 });
        },
        funOpenInfo : function(paramData)
        {
            paramData.type = this.defaultOption.contractType;
            paramData.status = this.defaultOption.contractStatus;
            paramData.partyA = this.defaultOption.customerFly;
            paramData.dataDictFly = this.defaultOption.dataDictFly;
        	var me = this;
        	mini.open({
                url: PageMain.funGetRootPath() + "/pages/baseinfo/contract_add.html",
                title: paramData.title,
                width: 850,
                height: 30 *  11 + 65,
                onload:function(){
                    var iframe=this.getIFrameEl();
                    iframe.contentWindow.PageContractAdd.funSetData(paramData);
                },
                ondestroy:function(action){
                    console.log(action)
                    if(action == "close" || action == "cancel")
                    {
                        return ;
                    }
                    else if (action == "save")
                    {
                        me.contractGrid.reload();
                    }
                    else
                    {
                        PageContract.defaultOption.contractId = action.contractId;
                        PageContractFlow.funAdd();
                        me.contractGrid.reload();
                    }
                }
            })
        },
        funDelete : function()
        {
            var row = this.contractGrid.getSelected();
            var me = this;
            if(row)
            {
                mini.confirm("确定要删除这条记录?", "提醒", function (action) {
                    if (action == "ok") 
                    {
                        $.ajax({
                            url : PageMain.defaultOption.httpUrl + "/contract/del",
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
                                        	 me.contractGrid.reload();
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
	PageContract.init();
});