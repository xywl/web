
var PagePlanRefuelingAdd = function(){
    return {
        defaultOption: {
            basePath:"",
            action : ""
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.planRefuelingForm = new mini.Form("planRefuelingFormAdd");
        },
        funSetData : function(data)
        {
        	var row = data.row;
            /*mini.get("disId").setData(row.disIdData);
            mini.get("shipId").setData(row.shipNoData);
            mini.get("shipId").setReadOnly(true);*/
            mini.get("disId").setData(row.disIdData);
            mini.get("shipId").setData(row.disIdData);
            //mini.get("disId").setReadOnly(true)
        	this.action = data.action;
        	this.planRefuelingForm.setData(row);
        	if(this.action == "oper")
        	{
        		
        		mini.get("layout_planRefueling_add").updateRegion("south", { visible: false });//$(".mini-toolbar").hide();
        		var fields = this.planRefuelingForm.getFields();
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
        	this.planRefuelingForm.validate();
            if (!this.planRefuelingForm.isValid())
            {
                 var errorTexts = form.getErrorTexts();
                 for (var i in errorTexts) 
                 {
                     mini.alert(errorTexts[i]);
                     return;
                 }
            }
            
            var me = this;
            var obj = this.planRefuelingForm.getData(true);
            $.ajax({
               url : PageMain.defaultOption.httpUrl + "/planRefueling/" + me.action + "?a="+Math.random(),
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
            mini.get("disId").setValue(shipVal);

            var shipIdData = mini.get("shipId");
            var shipId ="";
            for(var i = 0; i< shipIdData.data.length;i++){
                if(shipVal == shipIdData.data[i].id){
                    shipId =shipIdData.data[i].shipId;
                }
            }
            $.ajax({
                url : PageMain.defaultOption.httpUrl + "/dispatch/loadDispatchInfo",
                type: 'POST',
                data:  {key:shipId},
                dataType: 'json',
                async: false,
                success: function (data)
                {
                    mini.get("disId").setData(data);
                },
                error: function ()
                {
                    PageMain.funShowMessageBox("获取失败");
                }
            });
            /*var disVal =  mini.get("disId").getValue();
            var disIdData = mini.get("disId");
            var shipId ="";
            for(var i = 0; i< disIdData.data.length;i++){
                if(disVal == disIdData.data[i].id){
                    shipId =disIdData.data[i].shipId;
                }
            }
            mini.get("shipId").setValue(shipId);*/
        }
    }
}();

$(function(){
	PagePlanRefuelingAdd.init();
});