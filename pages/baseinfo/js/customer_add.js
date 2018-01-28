
var PageCustomerAdd = function(){
    return {
        defaultOption: {
            basePath:"",
            action : "",
            zero :"000000000",
            customerForm : null
            
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.customerForm = new mini.Form("customerFormAdd");
            mini.get("type").setData([{id:1, name:"长期"},{id:2, name:"临时"}]);
            mini.get("goodsType").setData([{id:1, name:"孰料"},{id:2, name:"电煤"},{id:4, name:"集装箱"},{id:256, name:"其他"}])
        },
        funSetData : function(data)
        {
        	var row = data.row;
        	this.action = data.action;
            var mgoodsType = parseInt(row.goodsType).toString(2);
            mgoodsType = this.defaultOption.zero.substring(mgoodsType.length) + mgoodsType;
            var tmp = "";
            for(var nItem=0; nItem < 9; nItem++)
            {
                if(mgoodsType.charAt(nItem) == 1)
                {
                    if (tmp != "")
                    {
                        tmp += ",";
                    }
                    tmp += Math.pow(2, 8-nItem);
                }
            }
            row.goodsType = tmp;
        	this.customerForm.setData(row);
            if(this.action == "oper")
            {
                mini.get("layout_customer_add").updateRegion("south", { visible: false });//$(".mini-toolbar").hide();
                var fields = this.customerForm.getFields();
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
        	this.customerForm.validate();
            if (!this.customerForm.isValid())
            {
                 var errorTexts = this.customerForm.getErrorTexts();
                 for (var i in errorTexts) 
                 {
                     mini.alert(errorTexts[i]);
                     return;
                 }
            }
            var me = this;
            var obj = this.customerForm.getData(true);
            var goodsTypeFly = obj.goodsType.split(",");
            var tmp = 0;
            goodsTypeFly.forEach(function (obj) {
                tmp += parseInt(obj);
            });

            obj.goodsType = tmp;
            $.ajax({
               url : PageMain.defaultOption.httpUrl + "/customer/" + me.action + "?a="+Math.random(),
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
    PageCustomerAdd.init();
});