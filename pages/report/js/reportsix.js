var PageReportsix = function(){
    return {
        defaultOption: {
            basePath:"",
            reportsixGrid : null
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.reportsixGrid = mini.get("reportsixGrid");
            this.reportsixGrid.setUrl(PageMain.defaultOption.httpUrl + "/dispatch/getReportSixList");
            this.funSearch();
        },
        funSearch : function()
        {
        	var reportsixForm = new mini.Form("reportsixForm");
        	this.reportsixGrid.load(reportsixForm.getData());
        },
        funOperRenderer : function(e)
        {
            return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="详情查看" href="javascript:PageReportsix.funDetail()"></a>';
        },
        funReset : function()
        {
        	var reportsixForm = new mini.Form("reportsixForm");
        	reportsixForm.setData();
        	mini.get("queryParamFlag").setValue("1");
            this.reportsixGrid.load(reportsixForm.getData());
        },

        //空船到港登记
        funKqdgdj : function ()
        {
            var row = this.reportsixGrid.getSelected();
            var paramData = {action: "add", operType : arguments[0], row: row, title:arguments[1], url:"/pages/khrw/sailingInfo_add.html", mWidth:arguments[2], mHeight:arguments[3]};
            
            if(arguments[0] == "kqdgdj")
            {
                paramData.row = {};
                this.funOpenInfo(paramData);
            }
            else
            {
                if(row)
                {
                    paramData.action = "modify";
                    this.funOpenInfo(paramData);
                }
                else
                {
                    PageMain.funShowMessageBox("请选择一条记录");
                }
            }
        },
        funAdd : function()
        {
        	var paramData = {action: "add", row:{}, title:"空船到港登记"};
            this.funOpenInfo(paramData);
        },
        funModify : function()
        {
        	var row = this.reportsixGrid.getSelected();
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
        	var row = this.reportsixGrid.getSelected();
        	var paramData = {action: "oper", row:row, title:"查看详细"};
        	this.funOpenInfo(paramData);
        },
        funOpenInfo : function(paramData)
        {
        	var me = this;
        	mini.open({
                url: PageMain.funGetRootPath() + paramData.url,
                title: paramData.title,
                width: paramData.mWidth,
                height: paramData.mHeight,
                onload:function(){
                    var iframe=this.getIFrameEl();
                    iframe.contentWindow.PageReportsixAdd.funSetData(paramData);
                },
                ondestroy:function(action){
                	me.reportsixGrid.reload();
                }
            })
        },
        funDelete : function()
        {
            var row = this.reportsixGrid.getSelected();
            var me = this;
            if(row)
            {
                mini.confirm("确定要删除这条记录?", "提醒", function (action) {
                    if (action == "ok") 
                    {
                        $.ajax({
                            url : PageMain.defaultOption.httpUrl + "/sailingInfo/del",
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
                                        	 me.reportsixGrid.reload();
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
	PageReportsix.init();
});