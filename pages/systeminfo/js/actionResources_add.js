
var PageActionResourcesAdd = function(){
    return {
        defaultOption: {
            basePath:"",
            action : "",
            actionResourcesForm : null

        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.actionResourcesForm = new mini.Form("actionResourcesFormAdd");
            // mini.get("gender").setData([{id:0,name:"未知"},{id:1, name:"男"},{id:2, name:"女"}])
        },
        funSetData : function(data)
        {
            var row = data.row;
            this.action = data.action;
            mini.get("status").setData(data.statusFly);
            mini.get("type").setData(data.typeFly);
            this.actionResourcesForm.setData(row);
            if(this.action == "oper")
            {
                mini.get("layout_actionResources_add").updateRegion("south", { visible: false });//$(".mini-toolbar").hide();
                var fields = this.actionResourcesForm.getFields();
                for (var i = 0, l = fields.length; i < l; i++)
                {
                    var c = fields[i];
                    if (c.setReadOnly) c.setReadOnly(true);     //只读
                    if (c.setIsValid) c.setIsValid(true);      //去除错误提示
                }
            }
            else if (this.action == "add")
            {
                mini.get("status").setValue(1);
                mini.get("type").setValue(0);
            }
        },
        funSave : function()
        {
            this.actionResourcesForm.validate();
            if (!this.actionResourcesForm.isValid())
            {
                var errorTexts = this.actionResourcesForm.getErrorTexts();
                for (var i in errorTexts)
                {
                    mini.alert(errorTexts[i]);
                    return;
                }
            }

            var me = this;
            var obj = this.actionResourcesForm.getData(true);
            $.ajax({
                url : PageMain.defaultOption.httpUrl + "/action/" + me.action + "?a="+Math.random(),
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
    PageActionResourcesAdd.init();
});