
var PageLeftDispatchInfoAdd = function(){
    return {
        defaultOption: {
            basePath:"",
            action : "",
            leftDispatchInfoForm : null,
            infoData:[]


        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.leftDispatchInfoForm = new mini.Form("leftDispatchInfoFormAdd");
            mini.get("status").setData([{id:1, name:"待发布"},{id:2, name:"已发布"},{id:3, name:"已取消"}])
            this.funInitPortDate();
        },
        funSetData : function(data)
        {
            var row = data.row;
            this.action = data.action;
            this.leftDispatchInfoForm.setData(row);
            if(this.action == "oper")
            {
                mini.get("layout_leftDispatchInfo_add").updateRegion("south", { visible: false });//$(".mini-toolbar").hide();
                var fields = this.leftDispatchInfoForm.getFields();
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
            this.leftDispatchInfoForm.validate();
            if (!this.leftDispatchInfoForm.isValid())
            {
                var errorTexts = form.getErrorTexts();
                for (var i in errorTexts)
                {
                    mini.alert(errorTexts[i]);
                    return;
                }
            }

            var me = this;
            var obj = this.leftDispatchInfoForm.getData(true);
            obj.bookSTime = mini.get("bookSTime").getValue().getTime()/1000;
            obj.bookETime = mini.get("bookETime").getValue().getTime()/1000;
            obj.loadingTime = mini.get("loadingTime").getValue().getTime()/1000;
            $.ajax({
                url : PageMain.defaultOption.httpUrl + "/leftDispatchInfo/" + me.action + "?a="+Math.random(),
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
        funInitPortDate:function () {
            $.ajax({
                url : PageMain.defaultOption.httpUrl + "/customerTaskFlow/getList",
                type : 'POST',
                dataType: 'json',
                success: function (data)
                {
                    if (data.success)
                    {
                        PageLeftDispatchInfoAdd.infoData = data.data.list;
                        mini.get("taskNo").setData(PageLeftDispatchInfoAdd.infoData);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown)
                {
                    PageMain.funShowMessageBox("获取客户任务单号失败");
                }
            });
        }
    }
}();

$(function(){
    PageLeftDispatchInfoAdd.init();
});