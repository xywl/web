
var PagePreBuckleOil = function(){
    return {
        defaultOption: {
            basePath:"",
            preBuckleOilGrid : null,
            shipNoData:[]
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.preBuckleOilGrid = mini.get("preBuckleOilGrid");
            this.preBuckleOilGrid.setUrl(PageMain.defaultOption.httpUrl + "/preBuckleOil/getList");
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/ship/getList",{pageSize:100000}, function (data) {
                PagePreBuckleOil.defaultOption.shipNoData = data.data.list;
                mini.get("key").setData(data.data.list);
                PagePreBuckleOil.funSearch();
            });
        },
        funSearch : function()
        {
            var preBuckleOilForm = new mini.Form("preBuckleOilForm");
        	this.preBuckleOilGrid.load(preBuckleOilForm.getData());
        },
        funOperRenderer : function(e)
        {
            return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="详情查看" href="javascript:PagePreBuckleOil.funDetail()"></a>';
        },
        funReset : function()
        {
        	var preBuckleOilForm = new mini.Form("preBuckleOilForm");
        	preBuckleOilForm.setData();
        	mini.get("queryParamFlag").setValue("1");
            this.preBuckleOilGrid.load(preBuckleOilForm.getData());
        },
        //船舶
        funShipRenderer : function (e)
        {
            for(var nItem = 0; nItem < PagePreBuckleOil.defaultOption.shipNoData.length; nItem++)
            {
                if(e.value == PagePreBuckleOil.defaultOption.shipNoData[nItem].id)
                {
                    return PagePreBuckleOil.defaultOption.shipNoData[nItem].shipNo;
                }
            }
            return e.value;
        },
        funAdd : function()
        {
        	var paramData = {action: "add", row:{}, title:"新增数据"};
            this.funOpenInfo(paramData);
        },
        funModify : function()
        {
        	var row = this.preBuckleOilGrid.getSelected();
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
        	var row = this.preBuckleOilGrid.getSelected();
        	var paramData = {action: "oper", row:row, title:"查看详细"};
        	this.funOpenInfo(paramData);
        },
        funOpenInfo : function(paramData)
        {
        	var me = this;
            paramData.row.shipNoData = me.defaultOption.shipNoData;
        	mini.open({
                url: PageMain.funGetRootPath() + "/pages/baseinfo/preBuckleOil_add.html",
                title: paramData.title,
                width: 650,
                height: 40 *  7 + 65,
                onload:function(){
                    var iframe=this.getIFrameEl();
                    iframe.contentWindow.PagePreBuckleOilAdd.funSetData(paramData);
                },
                ondestroy:function(action){
                	me.preBuckleOilGrid.reload();
                }
            })
        },
        funDelete : function()
        {
            var row = this.preBuckleOilGrid.getSelected();
            var me = this;
            if(row)
            {
                mini.confirm("确定要删除这条记录?", "提醒", function (action) {
                    if (action == "ok") 
                    {
                        $.ajax({
                            url : PageMain.defaultOption.httpUrl + "/preBuckleOil/del",
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
                                        	 me.preBuckleOilGrid.reload();
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
    PagePreBuckleOil.init();
});