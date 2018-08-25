
var PagePreBuckleOilAdd = function(){
    return {
        defaultOption: {
            basePath:"",
            action : ""
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.preBuckleOilForm = new mini.Form("preBuckleOilFormAdd");
        },
        funSetData : function(data)
        {
        	var row = data.row;
          //  mini.get("shipId").setData(row.shipNoData);
            mini.get("disId").setData(row.disIdData);
            mini.get("shipId").setData(row.disIdData);
        	this.action = data.action;
            if(this.defaultOption.action != "add")
            {
                row.preBuckleTime = PageMain.funStrToDate(row.preBuckleTime);
            }
        	this.preBuckleOilForm.setData(row);

        	if(this.action == "oper")
        	{
        		
        		mini.get("layout_preBuckleOil_add").updateRegion("south", { visible: false });//$(".mini-toolbar").hide();
        		var fields = this.preBuckleOilForm.getFields();
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
        	this.preBuckleOilForm.validate();
            if (!this.preBuckleOilForm.isValid())
            {
                 var errorTexts = form.getErrorTexts();
                 for (var i in errorTexts) 
                 {
                     mini.alert(errorTexts[i]);
                     return;
                 }
            }
            
            var me = this;
            var obj = this.preBuckleOilForm.getData(true);
            if(mini.get("preBuckleTime").getValue() != null && mini.get("preBuckleTime").getValue() != ""){
                obj.preBuckleTime = mini.get("preBuckleTime").getValue().getTime()/1000;
            }
            $.ajax({
               url : PageMain.defaultOption.httpUrl + "/preBuckleOil/" + me.action + "?a="+Math.random(),
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
        },
        funSetShipId:function () {
            var shipVal =  mini.get("shipId").getValue();
            $.ajax({
                url : PageMain.defaultOption.httpUrl + "/dispatch/loadDispatchInfo",
                type: 'POST',
                data:  {key:shipVal},
                dataType: 'json',
                async: false,
                success: function (data)
                {
                    if(data.length>0){
                        mini.get("disId").setValue(data[0].id)
                    }
                    mini.get("disId").setData(data);
                },
                error: function ()
                {
                    PageMain.funShowMessageBox("获取失败");
                }
            });
        }

    }
}();

$(function(){
    PagePreBuckleOilAdd.init();
});