
var PageFreightPlanAdd = function(){
    return {
        defaultOption: {
            basePath:"",
            action : "",
            freightPlanForm : null,
            goodsSubType : [],
            goodsSubTypeJzx:[]
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.freightPlanForm = new mini.Form("freightPlanFormAdd");
        },
        funSetData : function(data)
        {
        	var row = data.row;
            mini.get("shipFlag").setData(row.goodsTypeFly);
            mini.get("revUnit").setData(row.revUnitFly);

            if (row.goodsSubType == 0)
            {
                row.goodsSubType = "";
            }
            PageFreightPlanAdd.defaultOption.goodsSubType = row.goodsSubTypeFly;
            PageFreightPlanAdd.defaultOption.goodsSubTypeJzx = row.goodsSubTypeJzxFly;
            if (row.goodsType == 2)
            {
                mini.get("goodsName").setData(PageFreightPlanAdd.defaultOption.goodsSubType);
            } else if(row.goodsType == 3)
            {
                mini.get("goodsName").setData(PageFreightPlanAdd.defaultOption.goodsSubTypeJzx);
            }
        	this.action = data.action;
        	this.freightPlanForm.setData(row);
            PageFreightPlanAdd.funSetGoodsSubType();

        	if(this.action == "oper")
        	{
        		
        		mini.get("layout_freightPlan_add").updateRegion("south", { visible: false });//$(".mini-toolbar").hide();
        		var fields = this.freightPlanForm.getFields();
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
        	this.freightPlanForm.validate();
            if (!this.freightPlanForm.isValid())
            {
                 var errorTexts = form.getErrorTexts();
                 for (var i in errorTexts) 
                 {
                     mini.alert(errorTexts[i]);
                     return;
                 }
            }
            
            var me = this;
            var obj = this.freightPlanForm.getData(true);
            $.ajax({
               url : PageMain.defaultOption.httpUrl + "/freightPlan/" + me.action + "?a="+Math.random(),
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
        funSetGoodsSubType:function () {
            var goodsVal = mini.get("shipFlag").getValue();
            var goodsText =  mini.get("shipFlag").getText();
            if(goodsVal == 2) {
                //alert(goodsVal);
                mini.get("goodsName").setData(PageFreightPlanAdd.defaultOption.goodsSubType);
                mini.get("revUnit").required =false;
                mini.get("revUnit").setReadOnly(true);
                mini.get("goodsName").required =true;
                mini.get("goodsName").setReadOnly(false);
                mini.get("revUnit").setValue("");
               // mini.get("revUnit").setData([]);
            } else if (goodsVal == 3) {
                mini.get("revUnit").setValue("");
                mini.get("goodsName").setData(PageFreightPlanAdd.defaultOption.goodsSubTypeJzx);
                mini.get("goodsName").setValue(99);
                mini.get("goodsName").setText("集装箱");
                mini.get("revUnit").required =false;
                mini.get("revUnit").setReadOnly(true);
                mini.get("goodsName").required =true;
                mini.get("goodsName").setReadOnly(false);
            }else if (goodsVal == 1)  {
                mini.get("goodsName").setData([]);
                mini.get("revUnit").required =true;
                mini.get("revUnit").setReadOnly(false);
                mini.get("goodsName").required =false;
                mini.get("goodsName").setReadOnly(true);
            }

        }
    }
}();

$(function(){
	PageFreightPlanAdd.init();
});