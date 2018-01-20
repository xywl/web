
var PageContractFlowAdd = function(){
    return {
        defaultOption: {
            basePath:"",
            action : "",
            contractFlowForm : null
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.contractFlowForm = new mini.Form("contractFlowFormAdd");
        },
        funSetData : function(data)
        {
        	var row = data.row;
        	this.defaultOption.action = data.action;
            mini.get("flowId").setData(row.flowFly);
            mini.get("ticketStatus").setData(row.ticketStatusFly);
        	this.contractFlowForm.setData(row);
        	if(this.defaultOption.action == "oper")
        	{
        		
        		mini.get("layout_contractFlow_add").updateRegion("south", { visible: false });//$(".mini-toolbar").hide();
        		var fields = this.contractFlowForm.getFields();
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
        	this.contractFlowForm.validate();
            if (!this.contractFlowForm.isValid()) 
            {
                 var errorTexts = form.getErrorTexts();
                 for (var i in errorTexts) 
                 {
                     mini.alert(errorTexts[i]);
                     return;
                 }
            }
            
            var me = this;
            var obj = this.contractFlowForm.getData(true);
            $.ajax({
               url : PageMain.defaultOption.httpUrl + "/contractFlow/" + me.defaultOption.action + "?a="+Math.random(),
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
	PageContractFlowAdd.init();
});