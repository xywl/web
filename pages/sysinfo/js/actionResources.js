
var PageActionResources = function(){
    return {
        defaultOption: {
            basePath:"",
            actionResourcesGrid : null
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.actionResourcesGrid = mini.get("actionResourcesGrid");
            this.actionResourcesGrid.setUrl(PageMain.defaultOption.httpUrl + "/action/getList")
            this.funSearch();
        },
        funSearch : function()
        {
        	var actionResourcesForm = new mini.Form("actionResourcesForm");
        	this.actionResourcesGrid.load(actionResourcesForm.getData());
        },
        funOperRenderer : function(e)
        {
            return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="详情查看" href="javascript:PageActionResources.funDetail()"></a>';
        },
        funReset : function()
        {
        	var actionResourcesForm = new mini.Form("actionResourcesForm");
        	actionResourcesForm.setData();
        	mini.get("queryParamFlag").setValue("1");
            this.actionResourcesGrid.load(actionResourcesForm.getData());
        },
        funAdd : function()
        {
        	var paramData = {action: "add", row:{}, title:"新增数据"};
            this.funOpenInfo(paramData);
        },
        funModify : function()
        {
        	var row = this.actionResourcesGrid.getSelected();
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
        funDetail : function()
        {
        	var row = this.actionResourcesGrid.getSelected();
        	var paramData = {action: "oper", row:row, title:"查看详细"};
        	this.funOpenInfo(paramData);
        },
        funOpenInfo : function(paramData)
        {
        	var me = this;
        	mini.open({
                url: PageMain.funGetRootPath() + "/pages/sysinfo/actionResources_add.html",
                title: paramData.title,
                width: 650,
                height: 30 *  17 + 65,
                onload:function(){
                    var iframe=this.getIFrameEl();
                    iframe.contentWindow.PageActionResourcesAdd.funSetData(paramData);
                },
                ondestroy:function(action){
                	me.actionResourcesGrid.reload();
                }
            })
        },
        funDelete : function()
        {
            var row = this.actionResourcesGrid.getSelected();
            var me = this;
            if(row)
            {
                mini.confirm("确定要删除这条记录?", "提醒", function (action) {
                    if (action == "ok") 
                    {
                        $.ajax({
                            url : PageMain.defaultOption.httpUrl + "/action/del",
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
                                        	 me.actionResourcesGrid.reload();
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
	PageActionResources.init();
});