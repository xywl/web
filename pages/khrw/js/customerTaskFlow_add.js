
var PageCustomerTaskFlowAdd = function(){
    return {
        defaultOption: {
            basePath:"",
            action : "",
            customerTaskFlowForm : null
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
           // row.goodsType=null;row.loadType=null;row.selfPick=null;row.status=null;row.sailingFlag=null;
            this.defaultOption.action = data.action;
        	this.customerTaskFlowForm.setData(row);
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
            obj.bigShipArriveTime = mini.get("bigShipArriveTime").getValue().getTime()/1000;
            obj.bigShipDepartTime = mini.get("bigShipDepartTime").getValue().getTime()/1000;
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
                           mini.confirm("操作成功是否要继续增加合同流向", "提醒",
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
        }
    }
}();

$(function(){
	PageCustomerTaskFlowAdd.init();
});