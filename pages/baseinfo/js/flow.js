
var PageFlow = function(){
    return {
        defaultOption: {
            basePath:"",
            flowGrid : null
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.flowGrid = mini.get("flowGrid");
            this.flowGrid.setUrl(PageMain.defaultOption.httpUrl + "/flow/getList")
            this.funSearch();
        },
        funSearch : function()
        {
            var flowForm = new mini.Form("flowForm");
            this.flowGrid.load(flowForm.getData());
        },
        funReset : function()
        {
            var flowForm = new mini.Form("flowForm");
            flowForm.setData();
            mini.get("queryParamFlag").setValue("1");
            this.flowGrid.load(flowForm.getData());
        },
        funAdd : function()
        {
            var paramData = {action: "add", row:{}, title:"新增数据"};
            this.funOpenInfo(paramData);
        },
        funModify : function()
        {
            var row = this.flowGrid.getSelected();
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
        funRendererFlowWaterLevelPoint : function (e)
        {
            if (e.value == 1)
            {
                return "点1"
            }
            else if (e.value == 2)
            {
                return "点2"
            }
            else if (e.value == 3)
            {
                return "点3"
            }
            return e.value;
        },
        funRendererFlowSailingArea : function (e)
        {
            if (e.value == 1)
            {
                return "A级"
            }
            else if (e.value == 2)
            {
                return "B级"
            }
            else if (e.value == 3)
            {
                return "C级"
            }
            return e.value;
        },
        funRendererFlowStatus : function (e)
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
        funOperRenderer : function(e)
        {
            return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="详情查看" href="javascript:PageFlow.funDetail()"></a>';
        },
        funDetail : function()
        {
            var row = this.flowGrid.getSelected();
            var paramData = {action: "oper", row:row, title:"查看详细"};
            this.funOpenInfo(paramData);
        },
        funOpenInfo : function(paramData)
        {
            var me = this;
            mini.open({
                url: PageMain.funGetRootPath() + "/pages/baseinfo/flow_add.html",
                title: paramData.title,
                width: 650,
                height: 30 *  11 + 65,
                onload:function(){
                    var iframe=this.getIFrameEl();
                    iframe.contentWindow.PageFlowAdd.funSetData(paramData);
                },
                ondestroy:function(action){
                    me.flowGrid.reload();
                }
            })
        },
        funDelete : function()
        {
            var row = this.flowGrid.getSelected();
            var me = this;
            if(row)
            {
                mini.confirm("确定要删除这条记录?", "提醒", function (action) {
                    if (action == "ok")
                    {
                        $.ajax({
                            url : PageMain.defaultOption.httpUrl + "/flow/del",
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
                                            me.flowGrid.reload();
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
    PageFlow.init();
});