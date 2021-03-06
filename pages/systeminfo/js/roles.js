
var PageRoles = function(){
    return {
        defaultOption: {
            basePath:"",
            resourcesFly : [],
            powerTree:null,
            rolesGrid : null
        },
        init :function ()
        {
            mini.parse();
            this.defaultOption.powerTree = mini.get("powerTree");
            this.basePath = PageMain.basePath;
            this.rolesGrid = mini.get("rolesGrid");
            this.rolesGrid.setUrl(PageMain.defaultOption.httpUrl + "/roles/getList");
            this.defaultOption.powerTree.setUrl(PageMain.defaultOption.httpUrl + "/action/loadResources");
            this.defaultOption.powerTree.load();
            this.funSearch();
        },
        funSearch : function()
        { 
            var rolesForm = new mini.Form("rolesForm");
            this.rolesGrid.load(rolesForm.getData());
        },
        funReset : function()
        {
            var rolesForm = new mini.Form("rolesForm");
            rolesForm.setData();
            mini.get("queryParamFlag").setValue("1");
            this.rolesGrid.load(rolesForm.getData());
        },
        funAdd : function()
        {
            var paramData = {action: "add", row:{}, title:"新增数据"};
            this.funOpenInfo(paramData);
        },
        funModify : function()
        {
            var row = PageRoles.rolesGrid.getSelected();
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
        funSetPrower : function ()
        {
            var row = this.rolesGrid.getSelected();
            if(row)
            {
                var pids = this.defaultOption.powerTree.getValue();
                PageMain.callAjax(PageMain.defaultOption.httpUrl + "/roleResources/addfly", {pids:pids, roleId:row.id}, function (data) {
                    if (data.success)
                    {
                        PageMain.funShowMessageBox("分配成功")
                    }
                });
            }
            else
            {
                PageMain.funShowMessageBox("请选择一条角色记录")
            }
        },
        funSelectionChanged : function ()
        {
            var record = PageRoles.rolesGrid.getSelected();
            if(record)
            {
                PageMain.callAjax(PageMain.defaultOption.httpUrl + "/roleResources/loadResourceByRole", {roleId:record.id}, function (data) {
                    var tmp = "";
                    for(var nItem=0; nItem<data.length; nItem ++)
                    {
                        if(tmp != "")
                        {
                            tmp += ",";
                        }
                        tmp += data[nItem].resourceId;
                    }
                    PageRoles.defaultOption.powerTree.setValue(tmp);
                });
            }
        },
        funOperRenderer : function(e)
        {
            return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="详情查看" href="javascript:PageRoles.funDetail()"></a>';
        },
        funDetail : function()
        {
            var row = this.rolesGrid.getSelected();
            var paramData = {action: "oper", row:row, title:"查看详细"};
            this.funOpenInfo(paramData);
        },
        funOpenInfo : function(paramData)
        {
            var me = this;
            mini.open({
                url: PageMain.funGetRootPath() + "/pages/systeminfo/roles_add.html",
                title: paramData.title,
                width: 600,
                height: 30 *  6 + 65,
                onload:function(){
                    var iframe=this.getIFrameEl();
                    iframe.contentWindow.PageRolesAdd.funSetData(paramData);
                },
                ondestroy:function(action){
                    me.rolesGrid.reload();
                }
            })
        },
        funDelete : function()
        {
            var row = this.rolesGrid.getSelected();
            var me = this;
            if(row)
            {
                mini.confirm("确定要删除这条记录?", "提醒", function (action) {
                    if (action == "ok")
                    {
                        $.ajax({
                            url : PageMain.defaultOption.httpUrl + "/roles/del",
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
                                            me.rolesGrid.reload();
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
    PageRoles.init();
});