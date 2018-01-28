
var PageCustomerTaskFlowAdd = function(){
    return {
        defaultOption: {
            basePath:"",
            action : "",
            customerTaskFlowForm : null,
            goodsSubType : []
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.customerTaskFlowForm = new mini.Form("customerTaskFlowFormAdd");
        },
        funSetData : function(data)
        {
            var row = data.row;
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
            if (row.sailingArea == 3)
            {
                row.sailingArea = "1,2";
            } else if (row.sailingArea == 5)
            {
                row.sailingArea = "1,4";
            } else if (row.sailingArea == 6)
            {
                row.sailingArea = "2,4";
            } else if (row.sailingArea == 7)
            {
                row.sailingArea = "1,2,4";
            }
            PageCustomerTaskFlowAdd.goodsSubType = row.goodsSubTypeFly;
           // row.goodsType=null;row.loadType=null;row.selfPick=null;row.status=null;row.sailingFlag=null;
            this.defaultOption.action = data.action;
        	this.customerTaskFlowForm.setData(row);
            mini.get("loadingTime").setValue(new Date(row.loadingTime));
            mini.get("dischargeTime").setValue(new Date(row.dischargeTime));
            mini.get("bigShipArriveTime").setValue(new Date(row.bigShipArriveTime));
            mini.get("bigShipDepartTime").setValue(new Date(row.bigShipDepartTime));
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
        funSave : function()
        {
        	this.customerTaskFlowForm.validate();
            if (!this.customerTaskFlowForm.isValid()) 
            {
                 var errorTexts = form.getErrorTexts();
                 for (var i in errorTexts) 
                 {
                     mini.alert(errorTexts[i]);
                     return;
                 }
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
        },funSetGoodsSubType:function () {
            var goodsVal = mini.get("goodsType").getValue();
            if(goodsVal == 2) {
                //alert(goodsVal);
                mini.get("goodsSubType").setData(PageCustomerTaskFlowAdd.goodsSubType);
                mini.get("goodsSubType").required =true;
            } else {
                mini.get("goodsSubType").setData([]);
                mini.get("goodsSubType").required =false;
            }
        }
    }
}();

$(function(){
	PageCustomerTaskFlowAdd.init();
});