
var PageDangerZoneSpeed = function(){
    return {
        defaultOption: {
            basePath:"",
            dangerZoneSpeedGrid : null,
            selfAlarm:[{id:1, name:"是"},{id:2, name:"否"}],
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.dangerZoneSpeedGrid = mini.get("dangerZoneSpeedGrid");
            this.dangerZoneSpeedGrid.setUrl(PageMain.defaultOption.httpUrl + "/dangerZoneSpeed/getPage");
            this.funSearch();
        },
        funSearch : function()
        {
            var dangerZoneSpeedForm = new mini.Form("dangerZoneSpeedForm");
            this.dangerZoneSpeedGrid.load(dangerZoneSpeedForm.getData());
        },
        funReset : function()
        {
            var dangerZoneSpeedForm = new mini.Form("dangerZoneSpeedForm");
            dangerZoneSpeedForm.setData();
            mini.get("queryParamFlag").setValue("1");
            this.dangerZoneSpeedGrid.load(dangerZoneSpeedForm.getData());
        },
        funAdd : function()
        {
            var paramData = {action: "add", row:{}, title:"新增数据"};
            this.funOpenInfo(paramData);
        },
        funModify : function()
        {
            var row = this.dangerZoneSpeedGrid.getSelected();
            if(row)
            {
                var paramData = {action: "modify", row: row, title:"编辑数据"};
                this.funOpenInfo(paramData);
            }
            else
            {
                PageMain.funShowMessageBox("请选择一条记录");
            }
        },
        funRendererDangerZoneSpeedStatus : function (e)
        {
            if (e.value == 1)
            {
                return "启用"
            }
            else if (e.value == 2)
            {
                return "禁用"
            }
            return e.value;
        },
        funRendererSelfAlarm: function (e)
        {
            for(var nItem = 0; nItem < PageDangerZoneSpeed.defaultOption.selfAlarm.length; nItem++)
            {
                if(e.value == PageDangerZoneSpeed.defaultOption.selfAlarm[nItem].id)
                {
                    return PageDangerZoneSpeed.defaultOption.selfAlarm[nItem].name;
                }
            }
            return e.value;
        },
        funOperRenderer : function(e)
        {
            return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="详情查看" href="javascript:PageDangerZoneSpeed.funDetail()"></a>';
        },
        funDetail : function()
        {
            var row = this.dangerZoneSpeedGrid.getSelected();
            var paramData = {action: "oper", row:row, title:"查看详细"};
            this.funOpenInfo(paramData);
        },
        funOpenInfo : function(paramData)
        {
            var me = this;
            paramData.selfAlarmJson = this.defaultOption.selfAlarm;
            mini.open({
                url: PageMain.funGetRootPath() + "/pages/baseinfo/dangerZoneSpeed_add.html",
                title: paramData.title,
                width: 650,
                height: 30 *  13 + 65,
                onload:function(){
                    var iframe=this.getIFrameEl();
                    iframe.contentWindow.PageDangerZoneSpeedAdd.funSetData(paramData);
                },
                ondestroy:function(action){
                    me.dangerZoneSpeedGrid.reload();
                }
            })
        },
        funDelete : function()
        {
            var row = this.dangerZoneSpeedGrid.getSelected();
            var me = this;
            if(row)
            {
                mini.confirm("确定要删除这条记录?", "提醒", function (action) {
                    if (action == "ok")
                    {
                        $.ajax({
                            url : PageMain.defaultOption.httpUrl + "/dangerZoneSpeed/del",
                            type: 'POST',
                            data: {"id": row.id},
                            dataType: 'json',
                            success: function (data)
                            {

                                if (data.success)
                                {
                                    mini.alert("操作成功", "提醒", function(){
                                        if(data.success)
                                        {
                                            me.dangerZoneSpeedGrid.reload();
                                        }
                                    });
                                }
                                else
                                {
                                    PageMain.funShowMessageBox(data.msg);
                                }
                            },
                            error: function ()
                            {
                                PageMain.funShowMessageBox("删除记录失败");
                            }
                        });
                    }
                })
            }
            else
            {
                mini.alert("请先选择要删除的记录");
            }
        }
    }
}();

$(function(){
    PageDangerZoneSpeed.init();
});