
var PageMsgTemplate = function(){
    return {
        defaultOption: {
            basePath:"",
            msgTemplateGrid : null
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.msgTemplateGrid = mini.get("msgTemplateGrid");
            this.msgTemplateGrid.setUrl(PageMain.defaultOption.httpUrl + "/msgTemplate/getList")
            this.funSearch();
        },
        funSearch : function()
        {
        	var msgTemplateForm = new mini.Form("msgTemplateForm");
        	this.msgTemplateGrid.load(msgTemplateForm.getData());
        },
        funReset : function()
        {
        	var msgTemplateForm = new mini.Form("msgTemplateForm");
            msgTemplateForm.setData();
            mini.get("queryParamFlag").setValue("1");
            this.msgTemplateGrid.load(msgTemplateForm.getData());
        },
        funAdd : function()
        {
        	var paramData = {action: "add", row:{}, title:"新增数据"};
            this.funOpenInfo(paramData);
        },
        funModify : function()
        {
        	var row = this.msgTemplateGrid.getSelected();
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
        funRendererMsgTemplateStatus : function (e)
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
        /*funRendererGoodsType : function (e)
        {
            if (e.value == 1)
            {
                return "孰料"
            }
            else if (e.value == 2)
            {
                return "电煤"
            }
            else if (e.value == 3)
            {
                return "集装箱"
            }
            else if (e.value == 4)
            {
                return "其他"
            }
            return e.value;
        },*/
        funOperRenderer : function(e)
        {
            return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="详情查看" href="javascript:PageMsgTemplate.funDetail()"></a>';
        },
        funDetail : function()
        {
            var row = this.msgTemplateGrid.getSelected();
            var paramData = {action: "oper", row:row, title:"查看详细"};
            this.funOpenInfo(paramData);
        },
        funOpenInfo : function(paramData)
        {
        	var me = this;
        	mini.open({
                url: PageMain.funGetRootPath() + "/pages/baseinfo/msgTemplate_add.html",
                title: paramData.title,
                width: 850,
                height: 30 *  11 + 65,
                onload:function(){
                    var iframe=this.getIFrameEl();
                    iframe.contentWindow.PageMsgTemplateAdd.funSetData(paramData);
                },
                ondestroy:function(action){
                	me.msgTemplateGrid.reload();
                }
            })
        },
        funDelete : function()
        {
            var row = this.msgTemplateGrid.getSelected();
            var me = this;
            if(row)
            {
                mini.confirm("确定要删除这条记录?", "提醒", function (action) {
                    if (action == "ok") 
                    {
                        $.ajax({
                            url : PageMain.defaultOption.httpUrl + "/msgTemplate/del",
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
                                        	 me.msgTemplateGrid.reload();
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
	PageMsgTemplate.init();
});