
var PageActionResourcesAdd = function(){
    return {
        defaultOption: {
            basePath:"",
            action : "",
            operCnt : 0,
            operList : [],
            operArg : [{id:"增加", name:"增加"}, {id:"修改", name:"修改"}, {id:"删除", name:"删除"}],
            actionResourcesForm : null

        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.actionResourcesForm = new mini.Form("actionResourcesFormAdd");
            $("tr[name='operlist']").hide();
            // mini.get("gender").setData([{id:0,name:"未知"},{id:1, name:"男"},{id:2, name:"女"}])
        },
        funSetData : function(data)
        {
            var row = data.row;
            this.action = data.action;
            mini.get("status").setData(data.statusFly);
            mini.get("openFlag").setData(data.openFlagFly);
            mini.get("type").setData(data.typeFly);
            mini.get("operList").setData(this.defaultOption.operArg);
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
                $("tr[name='operlist']").show();
                mini.get("status").setValue(1);
                mini.get("type").setValue(1);
                mini.get("openFlag").setValue(0);
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
                        if (me.action == "add" && obj.operList.length > 0)
                        {
                            PageActionResourcesAdd.defaultOption.operList = obj.operList.split(",");
                            var tmp = 1;
                            PageActionResourcesAdd.defaultOption.operList.forEach(function (name) {
                                obj.name = name;
                                obj.code = parseInt(obj.code) + tmp;
                                obj.leafNode = 0;
                                obj.parentId = data.data;
                                obj.type = 0;
                                obj.orderNo = tmp;
                                obj.url = "";
                                tmp += 1;
                                PageActionResourcesAdd.funAddInfo(obj);
                            });
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
        funAddInfo : function (obj)
        {
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/action/add?a="+Math.random(), obj, function (data) {
                PageActionResourcesAdd.defaultOption.operCnt += 1;
                if (PageActionResourcesAdd.defaultOption.operCnt == PageActionResourcesAdd.defaultOption.operList.length)
                {
                    mini.alert("操作成功", "提醒", function(){
                        if(true)
                        {
                            PageMain.funCloseWindow("save");
                        }
                    });
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