
var PageShipEvent = function(){
    return {
        defaultOption: {
            basePath:"",
            shipEventGrid : null
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.shipEventGrid = mini.get("shipEventGrid");
            this.shipEventGrid.setUrl(PageMain.defaultOption.httpUrl + "/shipEvent/getList")
            this.funSearch();
        },
        funSearch : function()
        {
        	var shipEventForm = new mini.Form("shipEventForm");
        	this.shipEventGrid.load(shipEventForm.getData());
        },
        funOperRenderer : function(e)
        {
            return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="详情查看" href="javascript:PageShipEvent.funDetail()"></a>';
        },
        funReset : function()
        {
        	var shipEventForm = new mini.Form("shipEventForm");
        	shipEventForm.setData();
        	mini.get("queryParamFlag").setValue("1");
            this.shipEventGrid.load(shipEventForm.getData());
        },
        funAdd : function()
        {
        	var paramData = {action: "add", row:{}, title:"新增数据"};
            this.funOpenInfo(paramData);
        },
        funModify : function()
        {
        	var row = this.shipEventGrid.getSelected();
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
        	var row = this.terminalMsgGrid.getSelected();
        	var paramData = {action: "oper", row:row, title:"查看详细"};
        	this.funOpenInfo(paramData);
        },
        funOpenInfo : function(paramData)
        {
        	var me = this;
        	mini.open({
                url: PageMain.funGetRootPath() + "/pages/baseinfo/shipEvent_add.html",
                title: paramData.title,
                width: 650,
                height: 30 *  9 + 65,
                onload:function(){
                    var iframe=this.getIFrameEl();
                    iframe.contentWindow.PageShipEventAdd.funSetData(paramData);
                },
                ondestroy:function(action){
                	me.shipEventGrid.reload();
                }
            })
        },
        funDelete : function()
        {
            var row = this.shipEventGrid.getSelected();
            var me = this;
            if(row)
            {
                mini.confirm("确定要删除这条记录?", "提醒", function (action) {
                    if (action == "ok") 
                    {
                        $.ajax({
                            url : PageMain.defaultOption.httpUrl + "/shipEvent/del",
                            type: 'POST',
                            data: {"int": row.int},
                            dataType: 'json',
                            success: function (data)
                            {
                            	
                            	 if (data.success)
                                 {
                                     mini.alert("操作成功", "提醒", function(){
                                         if(data.success)
                                         {
                                        	 me.shipEventGrid.reload();
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
	PageShipEvent.init();
});