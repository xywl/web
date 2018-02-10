/**
 * Created by WCL on 2018/2/3.
 */
PageModifySelfPwd =  function(){
    return {
        defaultOption: {
            basePath:"",
            action : "",
            modifyForm : null

        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.defaultOption.modifyForm = new mini.Form("modifyForm");
        },
        funSetData : function(data)
        {
            var row = data.row;
            this.defaultOption.action = data.action;
        },
        funSave : function()
        {
            if (PageMain.funDealSubmitValidate(this.defaultOption.modifyForm))
            {
                return ;
            }

            var me = this;
            var obj = this.defaultOption.modifyForm.getData(true);
            $.ajax({
                url : PageMain.defaultOption.httpUrl + "/roles/" + me.action + "?a="+Math.random(),
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
    PageModifySelfPwd.init();
});