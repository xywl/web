
var PageLeftDispatchInfoAdd = function(){
    return {
        defaultOption: {
            basePath:"",
            action : "",
            leftDispatchInfoForm : null

        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.leftDispatchInfoForm = new mini.Form("leftDispatchInfoFormAdd");
            mini.get("status").setData([{id:1, name:"启用"},{id:2, name:"禁用"}])
        },
        funSetData : function(data)
        {
            var row = data.row;
            row.bookSTime = new Date(parseInt(row.bookSTime) * 1000);
            row.bookETime = new Date(parseInt(row.bookETime) * 1000);
            row.loadingTime = new Date(parseInt(row.loadingTime) * 1000);
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
        }
    }
}();

$(function(){
    PageLeftDispatchInfoAdd.init();
});