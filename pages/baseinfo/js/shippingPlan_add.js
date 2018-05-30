
var PageShippingPlanAdd = function(){
    return {
        defaultOption: {
            basePath:"",
            action : "",
            shippingPlanForm : null
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.shippingPlanForm = new mini.Form("shippingPlanFormAdd");
        },
        funSetData : function(data)
        {
        	var row = data.row;
            mini.get("shipClass").setData(row.shipClassFly);
        	this.action = data.action;
        	this.shippingPlanForm.setData(row);

        	if(this.action == "oper")
        	{
        		
        		mini.get("layout_shippingPlan_add").updateRegion("south", { visible: false });//$(".mini-toolbar").hide();
        		var fields = this.shippingPlanForm.getFields();
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
        	this.shippingPlanForm.validate();
            if (!this.shippingPlanForm.isValid())
            {
                 var errorTexts = form.getErrorTexts();
                 for (var i in errorTexts) 
                 {
                     mini.alert(errorTexts[i]);
                     return;
                 }
            }
            
            var me = this;
            var obj = this.shippingPlanForm.getData(true);
            $.ajax({
               url : PageMain.defaultOption.httpUrl + "/shippingPlan/" + me.action + "?a="+Math.random(),
               type : 'POST',
               data : obj,
               dataType: 'json',
               success: function (data) 
               {
            	   if (data.success)
                   {
                       mini.alert("操作成功", "提醒", function(){
                           if(data.success)
                           {
                               PageMain.funCloseWindow("save");
                           }
                       });
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
	PageShippingPlanAdd.init();
});