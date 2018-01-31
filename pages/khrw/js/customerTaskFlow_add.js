
var PageCustomerTaskFlowAdd = function(){
    return {
        defaultOption: {
            basePath:"",
            action : "",
            sumLoad:0,
            customerId:0,
            contractId:0,
            customerTaskFlowForm : null,
            goodsSubType : [],
            currentWeight:0
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.customerTaskFlowForm = new mini.Form("customerTaskFlowFormAdd");
            $("tr[name='dr']").hide();
        },
        funLoadTypeInfo : function ()
        {
            if (mini.get("loadType").getValue() == 1)
            {
                $("tr[name='dr']").show();
                mini.get("bigShipPC").required =true;
                mini.get("totalLoad").required =true;
                mini.get("arriveLocation").required =true;
                mini.get("bigShipArriveTime").required =true;
                mini.get("bigShipDepartTime").required =true;
            }
            else
            {
                mini.get("bigShipPC").required =false;
                mini.get("totalLoad").required =false;
                mini.get("arriveLocation").required =false;
                mini.get("bigShipArriveTime").required =false;
                mini.get("bigShipDepartTime").required =false;
                $("tr[name='dr']").hide();
            }
        },
        funSetData : function(data)
        {
            var row = data.row;
            this.defaultOption.contractId = row.contractId;
            this.defaultOption.customerId = row.customerId;
            mini.get("flowId").setData(row.flowFly);
            mini.get("goodsType").setData(row.goodsTypeFly);
            mini.get("loadType").setData(row.loadTypeFly);
            mini.get("selfPick").setData(row.selfPickFly);
            mini.get("status").setData(row.statusFly);
            mini.get("sailingFlag").setData(row.sailingFlagFly);
            mini.get("startPortId").setData(row.portData);
            mini.get("endPortId").setData(row.portData);
            mini.get("sailingArea").setData(row.sailingAreaFly);
            mini.get("selfBuckle").setData(row.selfPickFly);
            if (row.goodsSubType == 0)
            {
                row.goodsSubType = "";
            }
            this.defaultOption.currentWeight = row.totalWeight;
            this.defaultOption.sumLoad = row.sumLoad;
            PageCustomerTaskFlowAdd.funLoadDwInfo(row.taskId);

            row.sailingArea = PageMain.funDealComBitInfo(row.sailingArea, 4);
            PageCustomerTaskFlowAdd.goodsSubType = row.goodsSubTypeFly;
           // row.goodsType=null;row.loadType=null;row.selfPick=null;row.status=null;row.sailingFlag=null;
            this.defaultOption.action = data.action;

            if(this.defaultOption.action != "add")
            {
                row.loadingTime = PageMain.funStrToDate(row.loadingTime);
                row.dischargeTime = PageMain.funStrToDate(row.dischargeTime);//new Date(row.dischargeTime);
                row.bigShipArriveTime = PageMain.funStrToDate(row.bigShipArriveTime);//new Date(row.bigShipArriveTime);
                row.bigShipDepartTime = PageMain.funStrToDate(row.bigShipDepartTime);//new Date(row.bigShipDepartTime);
                if(row.loadType == 1)
                {
                    $("tr[name='dr']").show();
                }
            }

            this.customerTaskFlowForm.setData(row);
            if (this.defaultOption.action == "add")
            {
                mini.get("selfBuckle").select(0);
                mini.get("selfPick").select(0);
                mini.get("status").select(0);
            }
        	if(this.defaultOption.action == "oper")
        	{
        		
        		mini.get("layout_customerTaskFlow_add").updateRegion("south", { visible: false });//$(".mini-toolbar").hide();
        		var fields = this.customerTaskFlowForm.getFields();
                for (var i = 0, l = fields.length; i < l; i++)
                {
                    var c = fields[i];
                    if (c.setReadOnly) c.setReadOnly(true);     //只读
                    if (c.setIsValid) c.setIsValid(true);      //去除错误提示
                }
        	}
        },
        funLoadUnitPriceInfo : function ()
        {
            console.log(mini.get("loadingTime").getValue())
            if (mini.get("flowId").getValue() != "" && mini.get("loadingTime").getValue() != null)
            {
                PageMain.callAjax(PageMain.defaultOption.httpUrl + "/customerTaskFlow/loadUnitPrice", {flowId:mini.get("flowId").getValue(), customerId:this.defaultOption.customerId, contractId:this.defaultOption.contractId, loadingTime:mini.get("loadingTime").getValue().getTime()/1000}, function (data) {
                   console.log(data)
                    if (data.length > 0)
                    {
                        mini.get("shipSuggestUnitPrice").setValue(data[0].id);
                    }
                })
            }
        },
        funDischargeTime : function (e)
        {
            var date = e.date;
            var zhData = mini.get("loadingTime").getValue();
            if (zhData == null)
            {
                e.allowSelect = true;
            }
            else if (Math.ceil(date.getTime()/3600000/24) < Math.ceil(zhData.getTime()/3600000/24))
            {
                e.allowSelect = false;
            }
        },
        funLoadingTime : function (e)
        {
            var date = e.date;
            var zhData = mini.get("dischargeTime").getValue();
            if (zhData == null)
            {
                e.allowSelect = true;
            }
            else if (Math.ceil(date.getTime()/3600000/24) > Math.ceil(zhData.getTime()/3600000/24))
            {
                e.allowSelect = false;
            }
        },
        funSave : function()
        {
        	this.customerTaskFlowForm.validate();
            if (!this.customerTaskFlowForm.isValid()) 
            {
                 var errorTexts = this.customerTaskFlowForm.getErrorTexts();
                 for (var i in errorTexts) 
                 {
                     mini.alert(errorTexts[i]);
                     return;
                 }
            }
            if (mini.get("loadingTime").getValue() > mini.get("dischargeTime").getValue())
            {
                PageMain.funShowMessageBox("装货时间不能大于卸货时间");
                return ;
            }
            
            var me = this;
            var obj = this.customerTaskFlowForm.getData(true);
            if(mini.get("bigShipArriveTime").getValue() != null && mini.get("bigShipArriveTime").getValue() != ""){
                obj.bigShipArriveTime = mini.get("bigShipArriveTime").getValue().getTime()/1000;
            }
            if(mini.get("bigShipDepartTime").getValue() != null && mini.get("bigShipDepartTime").getValue() != ""){
                obj.bigShipDepartTime = mini.get("bigShipDepartTime").getValue().getTime()/1000;
            }
            if(mini.get("loadingTime").getValue() != null && mini.get("loadingTime").getValue() != ""){
                obj.loadingTime = mini.get("loadingTime").getValue().getTime()/1000;
            }
            if(mini.get("dischargeTime").getValue() != null && mini.get("dischargeTime").getValue() != ""){
                obj.dischargeTime = mini.get("dischargeTime").getValue().getTime()/1000;
            }
            var arr =obj.sailingArea.split(",") , sum = 0;
            for (var i=0 ; i<arr.length ; i++){
                sum += parseInt(arr[i])*1;
            }
            obj.sailingArea = sum;
            $.ajax({
               url : PageMain.defaultOption.httpUrl + "/customerTaskFlow/" + me.defaultOption.action + "?a="+Math.random(),
               type : 'POST',
               data : obj,
               dataType: 'json',
               success: function (data) 
               {
            	   if (data.success)
                   {
                       if(me.defaultOption.action == "add")
                       {
                           mini.confirm("操作成功是否要继续增加客户任务流向", "提醒",
                               function (action, value) {
                                   if (action == "ok")
                                   {
                                       PageMain.funCloseWindow("continue");
                                   }
                                   else
                                   {
                                       PageMain.funCloseWindow("save");
                                   }
                               }
                           );
                       }
                       else
                       {
                           mini.alert("操作成功", "提醒", function(){
                               if(data.success)
                               {
                                   PageMain.funCloseWindow("save");
                               }
                           });
                       }
                   }
                   else
                   {
                       PageMain.funShowMessageBox(data.msg);
                   }
               },
               error: function (jqXHR, textStatus, errorThrown) 
               {
            	   PageMain.funShowMessageBox("操作出现异常");
               }
           });
        },
        funCancel : function()
        {
        	PageMain.funCloseWindow("cancel");
        },
        funSetGoodsSubType:function () {
            var goodsVal = mini.get("goodsType").getValue();
            var goodsText =  mini.get("goodsType").getText();
            if(goodsVal == 2) {
                //alert(goodsVal);
                mini.get("goodsSubType").setData(PageCustomerTaskFlowAdd.goodsSubType);
                //mini.get("goodsSubType").required =true;
            } else {
                mini.get("goodsSubType").setData([]);
                //mini.get("goodsSubType").required =false;
            }
            mini.get("goodsName").setValue(goodsText);
        },
        //加载总吨位
        funLoadDwInfo : function (taskId)
        {
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/customerTaskFlow/loadWeight", {taskId:taskId}, function (data) {
                if (PageCustomerTaskFlowAdd.defaultOption.action == "add")
                {
                    mini.get("totalWeight").setMaxValue(PageCustomerTaskFlowAdd.defaultOption.sumLoad - data.data);
                }
                else if (PageCustomerTaskFlowAdd.defaultOption.action == "modify")
                {
                    mini.get("totalWeight").setMaxValue(PageCustomerTaskFlowAdd.defaultOption.sumLoad - data.data + PageCustomerTaskFlowAdd.defaultOption.currentWeight);
                }
            });
        },
        funPortNameCustomer:function ()
        {
            this.funLoadUnitPriceInfo();
            
            var flowId = mini.get("flowId").getValue();
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/flow/getById?id="+flowId,{pageSize:1000000}, function (result) {
                if(result.success)
                {
                    var data = result.data;
                    mini.get("startPortId").setValue(data.startPortId);
                    mini.get("endPortId").setValue(data.endPortId);

                    mini.get("sailingArea").setValue(PageMain.funDealComBitInfo(data.sailingArea, 4));
                }
            });
        }
    }
}();

$(function(){
	PageCustomerTaskFlowAdd.init();
});