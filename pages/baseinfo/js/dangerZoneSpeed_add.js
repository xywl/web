
var PageDangerZoneSpeedAdd = function(){
    return {
        defaultOption: {
            basePath:"",
            action : "",
            msgTemplateFly:[],
            dangerZoneSpeedForm : null

        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.dangerZoneSpeedForm = new mini.Form("dangerZoneSpeedFormAdd");
            mini.get("status").setData([{id:1, name:"启用"},{id:2, name:"禁用"}])
            PageMain.callAjax(PageMain.defaultOption.httpUrl +"/msgTemplate/getList", {pageIndex:0, pageSize:1000000000, queryParamFlag:1}, function (data) {
                if (data.success)
                {
                    PageDangerZoneSpeedAdd.defaultOption.msgTemplateFly = data.data;
                    mini.get("msgId").setData(PageDangerZoneSpeedAdd.defaultOption.msgTemplateFly);
                }
            });
        },
        funMsgChangeInfo : function ()
        {
            var id = mini.get("msgId").getValue();
            PageDangerZoneSpeedAdd.defaultOption.msgTemplateFly.forEach(function (obj) {
                if(obj.id == id)
                {
                    mini.get("msgTemplate").setValue(obj.content);
                    return ;
                }
            })
        },
        funSetData : function(data)
        {
            var row = data.row;
            this.action = data.action;
            mini.get("selfalarmMin").setData(data.selfAlarmJson);
            mini.get("selfalarmMax").setData(data.selfAlarmJson);
            this.dangerZoneSpeedForm.setData(row);
            if(this.action == "add")
            {
                mini.get("status").select(0)
            }

            if(this.action == "oper")
            {
                mini.get("layout_dangerZoneSpeed_add").updateRegion("south", { visible: false });//$(".mini-toolbar").hide();
                var fields = this.dangerZoneSpeedForm.getFields();
                for (var i = 0, l = fields.length; i < l; i++)
                {
                    var c = fields[i];
                    if (c.setReadOnly) c.setReadOnly(true);     //只读
                    if (c.setIsValid) c.setIsValid(true);      //去除错误提示
                }
            }
        },
        funOpenLngLat : function ()
        {
            var me = this;
            mini.open({
                url: PageMain.funGetRootPath() + "/pages/jk/polyline.html",
                title: "地图",
                width: 950,
                height: 500,
                onload:function(){
                    var iframe=this.getIFrameEl();
                    iframe.contentWindow.PageLine.funSetData({coordinate:mini.get("coordinate").getValue()});
                },
                ondestroy:function(action){
                    if(action != "close")
                    {
                        var iframe = this.getIFrameEl();
                        mini.get("coordinate").focus();
                        mini.get("coordinate").setValue(action.lnglats);
                        mini.get("description").focus();
                    }
                }
            })
        },
        funSave : function()
        {
            this.dangerZoneSpeedForm.validate();
            if (!this.dangerZoneSpeedForm.isValid())
            {
                var errorTexts = form.getErrorTexts();
                for (var i in errorTexts)
                {
                    mini.alert(errorTexts[i]);
                    return;
                }
            }

            var me = this;
            var obj = this.dangerZoneSpeedForm.getData(true);
            $.ajax({
                url : PageMain.defaultOption.httpUrl + "/dangerZoneSpeed/" + me.action + "?a="+Math.random(),
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
    PageDangerZoneSpeedAdd.init();
});