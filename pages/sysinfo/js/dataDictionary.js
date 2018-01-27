
var PageDataDictionary = function(){
    return {
        defaultOption: {
            basePath:"",
            dataDictionaryGrid : null
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.dataDictionaryGrid = mini.get("dataDictionaryGrid");
            this.dataDictionaryGrid.setUrl(PageMain.defaultOption.httpUrl + "/dataDictionary/getList")
            this.funSearch();
        },
        funSearch : function()
        {
        	var dataDictionaryForm = new mini.Form("dataDictionaryForm");
        	this.dataDictionaryGrid.load(dataDictionaryForm.getData());
        },
        funOperRenderer : function(e)
        {
            return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="详情查看" href="javascript:PageDataDictionary.funDetail()"></a>';
        },
        funReset : function()
        {
        	var dataDictionaryForm = new mini.Form("dataDictionaryForm");
        	dataDictionaryForm.setData();
        	mini.get("queryParamFlag").setValue("1");
            this.dataDictionaryGrid.load(dataDictionaryForm.getData());
        },
        funAdd : function()
        {
        	var paramData = {action: "add", row:{}, title:"新增数据"};
            this.funOpenInfo(paramData);
        },
        funModify : function()
        {
        	var row = this.dataDictionaryGrid.getSelected();
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
        	var row = this.dataDictionaryGrid.getSelected();
        	var paramData = {action: "oper", row:row, title:"查看详细"};
        	this.funOpenInfo(paramData);
        },
        funOpenInfo : function(paramData)
        {
        	var me = this;
        	mini.open({
                url: PageMain.funGetRootPath() + "/pages/sysinfo/dataDictionary_add.html",
                title: paramData.title,
                width: 650,
                height: 30 *  12 + 65,
                onload:function(){
                    var iframe=this.getIFrameEl();
                    iframe.contentWindow.PageDataDictionaryAdd.funSetData(paramData);
                },
                ondestroy:function(action){
                	me.dataDictionaryGrid.reload();
                }
            })
        },
        funDelete : function()
        {
            var row = this.dataDictionaryGrid.getSelected();
            var me = this;
            if(row)
            {
                mini.confirm("确定要删除这条记录?", "提醒", function (action) {
                    if (action == "ok") 
                    {
                        $.ajax({
                            url : PageMain.defaultOption.httpUrl + "/dataDictionary/del",
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
                                        	 me.dataDictionaryGrid.reload();
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
	PageDataDictionary.init();
});