
var PageTransferPriceAdd = function(){
    return {
        defaultOption: {
            basePath:"",
            action : "",
            transferPriceForm : null
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.transferPriceForm = new mini.Form("transferPriceFormAdd");
        },
        funSetData : function(data)
        {
        	var row = data.row;
        	this.action = data.action;
            mini.get("customerId").setData(row.customerFly);
            mini.get("contractId").setData(row.contractFly);
        	this.transferPriceForm.setData(row);
        	if(this.action == "oper")
        	{

        		mini.get("layout_transferPrice_add").updateRegion("south", { visible: false });//$(".mini-toolbar").hide();
        		var fields = this.transferPriceForm.getFields();
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
        	this.transferPriceForm.validate();
            if (!this.transferPriceForm.isValid())
            {
                 var errorTexts = form.getErrorTexts();
                 for (var i in errorTexts)
                 {
                     mini.alert(errorTexts[i]);
                     return;
                 }
            }

            var me = this;
            var obj = this.transferPriceForm.getData(true);
            $.ajax({
               url : PageMain.defaultOption.httpUrl + "/transferPrice/" + me.action + "?a="+Math.random(),
               type : 'POST',
               data : obj,
               dataType: 'json',
               success: function (data)
               {
            	   if (data.success)
                   {
                       if(me.action == "add")
                       {
                           mini.confirm("操作成功是否要继续增加合同流向", "提醒",
                               function (action, value) {
                                   if (action == "ok")
                                   {
                                       PageMain.funCloseWindow({op:"continue", transferPriceId:data.data});
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
	PageTransferPriceAdd.init();
});