
var PageCustomerTask = function(){
    return {
        defaultOption: {
            basePath:"",
            customerFly : [],//合同JSON
            contractFly : [],//客户JSON
            customerTaskGrid : null,
            customerTaskFlowGrid : null,
            taskId:0,
            flowFly :[], //流向JSON
            flowSelect : [], //流向选择
            detailGridForm : null
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.defaultOption.customerTaskFlowGrid = mini.get("customerTaskFlow_grid");
            this.defaultOption.customerTaskFlowGrid.setUrl(PageMain.defaultOption.httpUrl + "/customerTaskFlow/getList");
            this.defaultOption.detailGridForm  = document.getElementById("detailGrid_Form");
            this.customerTaskGrid = mini.get("customerTaskGrid");
            this.customerTaskGrid.setUrl(PageMain.defaultOption.httpUrl + "/customerTask/getList");
            //加载合同
                PageMain.callAjax(PageMain.defaultOption.httpUrl + "/customerTask/loadCustomer",{pageSize:10000}, function (data) {
                PageCustomerTask.defaultOption.customerFly = data;
            });
            //加载所有客户信息
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/gps/loadCustomer",{pageSize:10000}, function (data) {
                PageCustomerTask.defaultOption.contractFly = data;
            });
            PageCustomerTask.funSearch();
        },
        funSearch : function()
        {
        	var customerTaskForm = new mini.Form("customerTaskForm");
        	this.customerTaskGrid.load(customerTaskForm.getData());
        },
        funOperRenderer : function(e)
        {
            return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="详情查看" href="javascript:PageCustomerTask.funDetail()"></a>';
        },
        funReset : function()
        {
        	var customerTaskForm = new mini.Form("customerTaskForm");
        	customerTaskForm.setData();
        	mini.get("queryParamFlag").setValue("1");
            this.customerTaskGrid.load(customerTaskForm.getData());
        },
        funAdd : function()
        {
        	var paramData = {action: "add", row:{}, title:"新增数据"};
            this.funOpenInfo(paramData);
        },
        funModify : function()
        {
        	var row = this.customerTaskGrid.getSelected();
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
        	var row = this.customerTaskGrid.getSelected();
        	var paramData = {action: "oper", row:row, title:"查看详细"};
        	this.funOpenInfo(paramData);
        },
        onShowRowDetail : function (e)
        {
            var grid = e.sender;
            var row = e.record;
            var td = grid.getRowDetailCellEl(row);
            td.appendChild(PageCustomerTask.defaultOption.detailGridForm);
            PageCustomerTask.defaultOption.detailGridForm.style.display = "block";
            PageCustomerTask.defaultOption.taskId = row.id;
            PageCustomerTask.defaultOption.customerTaskFlowGrid.load({ key: row.id, queryParamFlag: 1 });

            //根据合同id加载流向信息
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/customerTask/loadContractFlowByContractId?key=" + row.contractId,{customerId:row.id,pageSize:100000}, function (data) {
                PageCustomerTask.defaultOption.flowSelect = data;
            });
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/customerTask/loadContractFlowByContractId?key=" + row.contractId,{pageSize:100000}, function (data) {
                PageCustomerTask.defaultOption.flowFly = data;
            });
        },
        funOpenInfo : function(paramData)
        {
            paramData.contractId = this.defaultOption.customerFly;
        	var me = this;
        	mini.open({
                url: PageMain.funGetRootPath() + "/pages/khrw/customerTask_add.html",
                title: paramData.title,
                width: 650,
                height: 20 *  10 + 65,
                onload:function(){
                    var iframe=this.getIFrameEl();
                    iframe.contentWindow.PageCustomerTaskAdd.funSetData(paramData);
                },
                ondestroy:function(action){
                    if(action == "close" || action == "cancel")
                    {
                        return ;
                    }
                    else if (action == "save")
                    {
                        me.customerTaskGrid.reload();
                    }
                    else
                    {
                        PageCustomerTask.defaultOption.taskId = action.taskId;
                        PageCustomerTaskFlow.funAdd();
                        me.customerTaskGrid.reload();
                    }
                }
            })
        },
        funCustomerRenderer : function (e)//客户转码
        {
            for(var nItem = 0; nItem < PageCustomerTask.defaultOption.contractFly.length; nItem++)
            {
                if(e.value == PageCustomerTask.defaultOption.contractFly[nItem].id)
                {
                    return PageCustomerTask.defaultOption.contractFly[nItem].name;
                }
            }
            return e.value;
        },
        funContractRenderer : function (e)//合同转码
        {
            for(var nItem = 0; nItem < PageCustomerTask.defaultOption.customerFly.length; nItem++)
            {
                if(e.value == PageCustomerTask.defaultOption.customerFly[nItem].id)
                {
                    return PageCustomerTask.defaultOption.customerFly[nItem].name;
                }
            }
            return e.value;
        },
        funDelete : function()
        {
            var row = this.customerTaskGrid.getSelected();
            var me = this;
            if(row)
            {
                mini.confirm("确定要删除这条记录?", "提醒", function (action) {
                    if (action == "ok") 
                    {
                        $.ajax({
                            url : PageMain.defaultOption.httpUrl + "/customerTask/del",
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
                                        	 me.customerTaskGrid.reload();
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
        formatData : function(e) {

            var field = e.field;
            var value = e.value;
            var result = "--";
            //转换"创建时间"
            if("loadingTime" == field || "dischargeTime" == field ||"bigShipArriveTime" == field|| "bigShipDepartTime" == field){
                var createdTime = new Date(1000 * value);
                var year = createdTime.getFullYear();
                var mon = createdTime.getMonth() + 1;
                if(10 > mon){
                    mon = "0" + mon;
                }

                var sDate = createdTime.getDate();
                if(10 > sDate){
                    sDate = "0" + sDate;
                }

                var hours = createdTime.getHours();
                if(10 > hours){
                    hours = "0" + hours;
                }

                var min = createdTime.getMinutes();
                if(10 > min){
                    min = "0" + min;
                }

                var sec = createdTime.getSeconds();
                if(10 > sec){
                    sec = "0" + sec;
                }

                result = year + "-" + mon + "-" + sDate + "  " + hours + ":" + min + ":" + sec;
            }
            return result;
        }
    }
}();

$(function(){
	PageCustomerTask.init();
});