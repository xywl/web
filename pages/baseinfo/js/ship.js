
var PageShip = function(){
    return {
        defaultOption: {
            basePath:"",
            shipGrid : null
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.shipGrid = mini.get("shipGrid");
            this.shipGrid.setUrl(PageMain.defaultOption.httpUrl + "/ship/getList")
            this.funSearch();
        },
        funSearch : function()
        {
        	var shipForm = new mini.Form("shipForm");
        	this.shipGrid.load(shipForm.getData());
        },
        funReset : function()
        {
        	var shipForm = new mini.Form("shipForm");
            shipForm.setData();
            mini.get("queryParamFlag").setValue("1");
            this.shipGrid.load(shipForm.getData());
        },
        funAdd : function()
        {
        	var paramData = {action: "add", row:{}, title:"新增数据"};
            this.funOpenInfo(paramData);
        },
        funModify : function()
        {
        	var row = this.shipGrid.getSelected();
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
        /*funRendererType : function (e)
        {
            if (e.value == 1)
            {
                return "长期"
            }
            else if (e.value == 2)
            {
                return "临时"
            }
            return e.value;
        },
        funRendererGoodsType : function (e)
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
            return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="详情查看" href="javascript:PageShip.funDetail()"></a>';
        },
        funDetail : function()
        {
            var row = this.shipGrid.getSelected();
            var paramData = {action: "oper", row:row, title:"查看详细"};
            this.funOpenInfo(paramData);
        },
        funOpenInfo : function(paramData)
        {
        	var me = this;
        	mini.open({
                url: PageMain.funGetRootPath() + "/pages/baseinfo/ship_add.html",
                title: paramData.title,
                width: 850,
                height: 30 *  11 + 65,
                onload:function(){
                    var iframe=this.getIFrameEl();
                    iframe.contentWindow.PageShipAdd.funSetData(paramData);
                },
                ondestroy:function(action){
                	me.shipGrid.reload();
                }
            })
        },
        funDelete : function()
        {
            var row = this.shipGrid.getSelected();
            var me = this;
            if(row)
            {
                mini.confirm("确定要删除这条记录?", "提醒", function (action) {
                    if (action == "ok") 
                    {
                        $.ajax({
                            url : PageMain.defaultOption.httpUrl + "/ship/del",
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
                                        	 me.shipGrid.reload();
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
	PageShip.init();
});