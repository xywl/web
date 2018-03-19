var PageShipOilAdd = function(){
    return {
        defaultOption: {
            basePath:"",
            action : "",
            shipForm : null
            
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.shipForm = new mini.Form("shipOilFormAdd");
        },
        funSetData : function(data)
        {
        	var row = data.row;
        	this.action = data.action;
        	this.shipForm.setData(row);
            if(this.action == "oper")
            {
                mini.get("layout_ship_add").updateRegion("south", { visible: false });//$(".mini-toolbar").hide();
                var fields = this.shipForm.getFields();
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
        	this.shipForm.validate();
            if (!this.shipForm.isValid())
            {
                 var errorTexts = form.getErrorTexts();
                 for (var i in errorTexts) 
                 {
                     mini.alert(errorTexts[i]);
                     return;
                 }
            }
            var me = this;
            var obj = this.shipForm.getData(true);
            if(mini.get("refuelingTime").getValue() != null && mini.get("refuelingTime").getValue() != ""){
                obj.refuelingTime = mini.get("refuelingTime").getValue().getTime()/1000;
            }
            $.ajax({
               url : PageMain.defaultOption.httpUrl + "/shipOil/" + me.action + "?a="+Math.random(),
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
    PageShipOilAdd.init();
});