
var PageShipStaff = function(){
    return {
        defaultOption: {
            basePath:"",
            shipStaffGrid : null
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.shipStaffGrid = mini.get("shipStaffGrid");
            this.shipStaffGrid.setUrl(PageMain.defaultOption.httpUrl + "/shipStaff/getList")
            this.funSearch();
        },
        funSearch : function()
        {
            var shipStaffForm = new mini.Form("shipStaffForm");
            this.shipStaffGrid.load(shipStaffForm.getData());
        },
        funReset : function()
        {
            var shipStaffForm = new mini.Form("shipStaffForm");
            shipStaffForm.setData();
            mini.get("queryParamFlag").setValue("1");
            this.shipStaffGrid.load(shipStaffForm.getData());
        },
        funAdd : function()
        {
            var paramData = {action: "add", row:{}, title:"新增数据"};
            this.funOpenInfo(paramData);
        },
        funModify : function()
        {
            var row = this.shipStaffGrid.getSelected();
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
        funRendererShipStaffGender : function (e)
        {
            if (e.value == 1)
            {
                return "男"
            }
            else if (e.value == 2)
            {
                return "女"
            }
            return e.value;
        },
        funRendererShipStaffTitle : function (e)
        {
            if (e.value == 1)
            {
                return "船长"
            }
            else if (e.value == 2)
            {
                return "驾驶员"
            }
            else if (e.value == 3)
            {
                return "轮机员"
            }
            else if (e.value == 4)
            {
                return "水手"
            }
            return e.value;
        },
        funRendererShipStaffLongitude : function (e)
        {
            if (e.value == 1)
            {
                return "男"
            }
            else if (e.value == 2)
            {
                return "女"
            }
            return e.value;
        },
        funOperRenderer : function(e)
        {
            return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="详情查看" href="javascript:PageShipStaff.funDetail()"></a>';
        },
        funDetail : function()
        {
            var row = this.shipStaffGrid.getSelected();
            var paramData = {action: "oper", row:row, title:"查看详细"};
            this.funOpenInfo(paramData);
        },
        funOpenInfo : function(paramData)
        {
            var me = this;
            mini.open({
                url: PageMain.funGetRootPath() + "/pages/baseinfo/shipStaff_add.html",
                title: paramData.title,
                width: 850,
                height: 30 *  11 + 65,
                onload:function(){
                    var iframe=this.getIFrameEl();
                    iframe.contentWindow.PageShipStaffAdd.funSetData(paramData);
                },
                ondestroy:function(action){
                    me.shipStaffGrid.reload();
                }
            })
        },
        funDelete : function()
        {
            var row = this.shipStaffGrid.getSelected();
            var me = this;
            if(row)
            {
                mini.confirm("确定要删除这条记录?", "提醒", function (action) {
                    if (action == "ok")
                    {
                        $.ajax({
                            url : PageMain.defaultOption.httpUrl + "/shipStaff/del",
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
                                            me.shipStaffGrid.reload();
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
    PageShipStaff.init();
});