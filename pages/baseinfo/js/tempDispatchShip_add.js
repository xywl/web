
var PageTempDispatchShipAdd = function(){
    return {
        defaultOption: {
            basePath:"",
            action : "",
            tempDispatchShipForm : null,

        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.tempDispatchShipForm = new mini.Form("tempDispatchShipFormAdd");
            mini.get("status").setData([{id:1, name:"启用"},{id:2, name:"禁用"}]);

        },
        funSetData : function(data)
        {
        	var row = data.row;
        	row.from="1";
        	this.action = data.action;
        	this.tempDispatchShipForm.setData(row);
            if(this.action == "add")
            {
                mini.get("status").select(0)
            }
            if(this.action == "oper")
            {
                mini.get("layout_tempDispatchShip_add").updateRegion("south", { visible: false });//$(".mini-toolbar").hide();
                var fields = this.tempDispatchShipForm.getFields();
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
        	this.tempDispatchShipForm.validate();
            if (!this.tempDispatchShipForm.isValid())
            {
                 var errorTexts = form.getErrorTexts();
                 for (var i in errorTexts) 
                 {
                     mini.alert(errorTexts[i]);
                     return;
                 }
            }
            
            var me = this;
            var obj = this.tempDispatchShipForm.getData(true);
            $.ajax({
               url : PageMain.defaultOption.httpUrl + "/tempDispatchShip/" + me.action + "?a="+Math.random(),
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
    PageTempDispatchShipAdd.init();
});