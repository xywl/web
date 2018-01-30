
var PageCustomerTaskFlow = function(){
    return {
        defaultOption: {
            basePath:"",
            ticketStatusFly:[{id:1, name:"开"},{id:2, name:"不开"}],
            goodsType : [{id:1, name:"熟料"},{id:2, name:"散装"},{id:3, name:"集装箱"}],
            goodsSubType : [{id:1, name:"碎石"},{id:2, name:"市场煤炭"},{id:3, name:"华能电煤"},{id:4, name:"浙能电煤"},{id:5, name:"铜精矿"},{id:6, name:"PAT"},{id:7, name:"经营业务"},{id:8, name:"其他业务"}],
            loadType :[{id:2, name:"场地"},{id:1, name:"大轮"}],
            selfPick: [{id:1, name:"是"},{id:2, name:"否"}],
            status: [{id:1, name:"启用"},{id:2, name:"禁用"}],
            sailingFlag: [{id:1, name:"正常"},{id:2, name:"散装回程货"},{id:3, name:"安吉货"}],
            sailingArea: [{id:1, name:"A级"},{id:2, name:"B级"},{id:4, name:"C级"}],
            portData:[],
            customerTaskFlowGrid : null
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.customerTaskFlowGrid = PageCustomerTask.defaultOption.customerTaskFlowGrid;
            //this.customerTaskFlowGrid.setUrl(PageMain.defaultOption.httpUrl + "/customerTaskFlow/getList?id")

            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/gps/loadPortAll",{pageSize:100000}, function (data) {
                    PageCustomerTaskFlow.defaultOption.portData = data;
            });
        },
        funSearch : function()
        {
        	var customerTaskFlowForm = new mini.Form("customerTaskFlowForm");
        	this.customerTaskFlowGrid.load(customerTaskFlowForm.getData());
        },
        funOperRenderer : function(e)
        {
            return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="详情查看" href="javascript:PageCustomerTaskFlow.funDetail()"></a>';
        },
        //港口信息
        funPortNameRenderer : function (e)
        {
            for(var nItem = 0; nItem < PageCustomerTaskFlow.defaultOption.portData.length; nItem++)
            {
                if(e.value == PageCustomerTaskFlow.defaultOption.portData[nItem].id)
                {
                    return PageCustomerTaskFlow.defaultOption.portData[nItem].name;
                }
            }
            return e.value;
        },
        //航次标识
        funSailingFlagRenderer : function (e)
        {
            for(var nItem = 0; nItem < PageCustomerTaskFlow.defaultOption.sailingFlag.length; nItem++)
            {
                if(e.value == PageCustomerTaskFlow.defaultOption.sailingFlag[nItem].id)
                {
                    return PageCustomerTaskFlow.defaultOption.sailingFlag[nItem].name;
                }
            }
            return e.value;
        },
        //航次区域
        funSailingAreaRenderer : function (e)
        {
            if (e.value ==1 )
            {
                return "A级";
            } else if (e.value == 2)
            {
                return "B级";
            } else if (e.value == 3)
            {
                return "A级，B级";
            } else if (e.value == 4)
            {
                return "C级";
            } else if (e.value == 5)
            {
                return "A级，C级";
            } else if (e.value == 6)
            {
                return "B级，C级";
            } else if (e.value == 7)
            {
                return "A级，B级，C级";
            } else if (e.value == 0)
            {
                return "";
            }

            return e.value;
        },
        //状态
        funStatusRenderer : function (e)
        {
            for(var nItem = 0; nItem < PageCustomerTaskFlow.defaultOption.status.length; nItem++)
            {
                if(e.value == PageCustomerTaskFlow.defaultOption.status[nItem].id)
                {
                    return PageCustomerTaskFlow.defaultOption.status[nItem].name;
                }
            }
            return e.value;
        },
        //是否自提
        funSelfPickRenderer : function (e)
        {
            for(var nItem = 0; nItem < PageCustomerTaskFlow.defaultOption.selfPick.length; nItem++)
            {
                if(e.value == PageCustomerTaskFlow.defaultOption.selfPick[nItem].id)
                {
                    return PageCustomerTaskFlow.defaultOption.selfPick[nItem].name;
                }
            }
            return e.value;
        },
        //装货途径
        funLoadTypeRenderer : function (e)
        {
            for(var nItem = 0; nItem < PageCustomerTaskFlow.defaultOption.loadType.length; nItem++)
            {
                if(e.value == PageCustomerTaskFlow.defaultOption.loadType[nItem].id)
                {
                    return PageCustomerTaskFlow.defaultOption.loadType[nItem].name;
                }
            }
            return e.value;
        },
        //货物类型
        funGoodsTypeRenderer : function (e)
        {
            for(var nItem = 0; nItem < PageCustomerTaskFlow.defaultOption.goodsType.length; nItem++)
            {
                if(e.value == PageCustomerTaskFlow.defaultOption.goodsType[nItem].id)
                {
                    return PageCustomerTaskFlow.defaultOption.goodsType[nItem].name;
                }
            }
            return e.value;
        },
        //流向信息
        funFlowRenderer : function (e)
        {
            for(var nItem = 0; nItem < PageCustomerTask.defaultOption.flowSelect.length; nItem++)
            {
                if(e.value == PageCustomerTask.defaultOption.flowSelect[nItem].id)
                {
                    return PageCustomerTask.defaultOption.flowSelect[nItem].name;
                }
            }
            return e.value;
        },

        funReset : function()
        {
        	var customerTaskFlowForm = new mini.Form("customerTaskFlowForm");
        	customerTaskFlowForm.setData();
        	mini.get("queryParamFlag").setValue("1");
            this.customerTaskFlowGrid.load(customerTaskFlowForm.getData());
        },
        funAdd : function()
        {
        	var paramData = {action: "add", row:{taskId:PageCustomerTask.defaultOption.taskId}, title:"增加客户任务流向"};
            this.funOpenInfo(paramData);
        },
        funModify : function()
        {
        	var row = this.customerTaskFlowGrid.getSelected();
            if(row)
            {
            	var paramData = {action: "modify", row: row, title:"编辑客户任务流向"};
                this.funOpenInfo(paramData);
            }
            else
            {
            	PageMain.funShowMessageBox("请选择一条记录");
            }
        },
        funDetail : function()
        {
        	var row = this.customerTaskFlowGrid.getSelected();
        	var paramData = {action: "oper", row:row, title:"查看客户任务流向详细"};
        	this.funOpenInfo(paramData);
        },
        funOpenInfo : function(paramData)
        {
        	var me = this;
            paramData.row.ticketStatusFly = me.defaultOption.ticketStatusFly;
            paramData.row.sumLoad = PageCustomerTask.defaultOption.totalLoad;
            paramData.row.flowFly = PageCustomerTask.defaultOption.flowFly;
            paramData.row.goodsTypeFly = me.defaultOption.goodsType;
            paramData.row.loadTypeFly = me.defaultOption.loadType;
            paramData.row.selfPickFly = me.defaultOption.selfPick;
            paramData.row.statusFly = me.defaultOption.status;
            paramData.row.sailingFlagFly = me.defaultOption.sailingFlag;
            paramData.row.sailingAreaFly = me.defaultOption.sailingArea;
            paramData.row.portData = me.defaultOption.portData;
            paramData.row.goodsSubTypeFly =  me.defaultOption.goodsSubType;
            var e =[];
            e.field ="loadingTime";
            e.value = paramData.row.loadingTime;
            paramData.row.loadingTime = PageCustomerTask.formatData(e);
            var e =[];
            e.field ="dischargeTime";
            e.value = paramData.row.dischargeTime;
            paramData.row.dischargeTime = PageCustomerTask.formatData(e);
            var e =[];
            e.field ="bigShipArriveTime";
            e.value = paramData.row.bigShipArriveTime;
            paramData.row.bigShipArriveTime = PageCustomerTask.formatData(e);
            var e =[];
            e.field ="bigShipDepartTime";
            e.value = paramData.row.bigShipDepartTime;
            paramData.row.bigShipDepartTime = PageCustomerTask.formatData(e);

        	mini.open({
                url: PageMain.funGetRootPath() + "/pages/khrw/customerTaskFlow_add.html",
                title: paramData.title,
                width: 1100,
                height: 45 *  10 + 65,
                onload:function(){
                    var iframe=this.getIFrameEl();
                    iframe.contentWindow.PageCustomerTaskFlowAdd.funSetData(paramData);
                },
                ondestroy:function(action)
                {
                    if (action == "continue")
                    {
                        PageCustomerTaskFlow.funAdd();
                        me.customerTaskFlowGrid.reload();
                    }
                	me.customerTaskFlowGrid.reload();
                }
            })
        },
        funDelete : function()
        {
            var row = this.customerTaskFlowGrid.getSelected();
            var me = this;
            if(row)
            {
                mini.confirm("确定要删除这条记录?", "提醒", function (action) {
                    if (action == "ok") 
                    {
                        $.ajax({
                            url : PageMain.defaultOption.httpUrl + "/customerTaskFlow/del",
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
                                        	 me.customerTaskFlowGrid.reload();
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
	PageCustomerTaskFlow.init();
});