
var PageContractAdd = function(){
    return {
        defaultOption: {
            basePath:"",
            action : "",
            goodsSubTypeFly:[],
            contractForm : null,
            settleTypeFly:[{id: 11, text: '实发吨位现金结算'}, {id: 12, text: '实发吨位定期结算'}, {id: 21, text: '实收吨位现金结算'}, {id: 22, text: '实收吨位定期结算'}]
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.contractForm = new mini.Form("contractFormAdd");
        },
        funSetData : function(data)
        {
            var row = data.row;
            this.defaultOption.action = data.action;
            //console.log(parseInt(7).toString(2))
            mini.get("type").setData(data.type);
            mini.get("status").setData(data.status);
            mini.get("partyA").setData(data.partyA);
            mini.get("signDepartment").setData(data.dataDictFly);
            mini.get("settleType").setData(PageContractAdd.defaultOption.settleTypeFly);
            mini.get("goodsType").setData(data.goodsTypeFly);
            PageContractAdd.defaultOption.goodsSubTypeFly = data.goodsSubTypeFly;
            if(this.defaultOption.action != "add")
            {
                if (row.goodsType == 2)
                {
                    mini.get("goodsSubType").setData(data.goodsSubTypeFly);
                }
                if (row.goodsType == 0)
                {
                    row.goodsType = "";
                }
                if (row.goodsSubType == 0)
                {
                    row.goodsSubType = "";
                }
            }
        	this.contractForm.setData(row);
            if(this.defaultOption.action == "add")
            {
                mini.get("partyB").setValue("浙江兴一物流有限公司");
                mini.get("type").setValue(1);
                mini.get("status").setValue(1);
            }

        	if(this.defaultOption.action == "oper")
        	{
        		mini.get("layout_contract_add").updateRegion("south", { visible: false });//$(".mini-toolbar").hide();
        		var fields = this.contractForm.getFields();
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
        	this.contractForm.validate();
            if (!this.contractForm.isValid()) 
            {
                 var errorTexts = form.getErrorTexts();
                 for (var i in errorTexts) 
                 {
                     mini.alert(errorTexts[i]);
                     return;
                 }
            }

            var me = this;
            var obj = this.contractForm.getData(true);
            $.ajax({
               url : PageMain.defaultOption.httpUrl + "/contract/" + me.defaultOption.action + "?a="+Math.random(),
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
                                       PageMain.funCloseWindow({op:"continue", contractId:data.data});
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
        funSetGoodsSubType:function ()
        {
            var goodsVal = mini.get("goodsType").getValue();
            if(goodsVal == 2)
            {
                mini.get("goodsSubType").setData(PageContractAdd.defaultOption.goodsSubTypeFly);
            }
            else
            {
                mini.get("goodsSubType").setData([]);
            }
        },
        funCancel : function()
        {
        	PageMain.funCloseWindow("cancel");
        }
    }
}();

$(function(){
	PageContractAdd.init();
});