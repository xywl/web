
var PageShippingPlan = function(){
    return {
        defaultOption: {
            basePath:"",
            shippingPlanGrid : null,
            shipClassData:[{id:1, name:"650吨以上"},{id:2, name:"650吨以下"},{id:3, name:"碎石船"},{id:4, name:"兴能散装船"},{id:5, name:"兴能集装箱船"},{id:6, name:"兴一航运散装船"},{id:7, name:"兴一航运集装箱船"}]
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.shippingPlanGrid = mini.get("shippingPlanGrid");
            this.shippingPlanGrid.setUrl(PageMain.defaultOption.httpUrl + "/shippingPlan/getList")
            mini.get("key").setData(PageShippingPlan.defaultOption.shipClassData);
            this.funSearch();

        },
        funSearch : function()
        {
        	var shippingPlanForm = new mini.Form("shippingPlanForm");
        	this.shippingPlanGrid.load(shippingPlanForm.getData());

        },
        funOperRenderer : function(e)
        {
            return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="详情查看" href="javascript:PageShippingPlan.funDetail()"></a>';
        },
        funReset : function()
        {
        	var shippingPlanForm = new mini.Form("shippingPlanForm");
        	shippingPlanForm.setData();
        	mini.get("queryParamFlag").setValue("1");
            this.shippingPlanGrid.load(shippingPlanForm.getData());
        },
        //货物类型
        funGoodsTypeRenderer : function (e)
        {
            for(var nItem = 0; nItem < PageShippingPlan.defaultOption.shipClassData.length; nItem++)
            {
                if(e.value == PageShippingPlan.defaultOption.shipClassData[nItem].id)
                {
                    return PageShippingPlan.defaultOption.shipClassData[nItem].name;
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
        	var row = this.shippingPlanGrid.getSelected();
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
        	var row = this.shippingPlanGrid.getSelected();
        	var paramData = {action: "oper", row:row, title:"查看详细"};
        	this.funOpenInfo(paramData);
        },
        funOpenInfo : function(paramData)
        {
        	var me = this;
            paramData.row.shipClassFly = me.defaultOption.shipClassData;
        	mini.open({
                url: PageMain.funGetRootPath() + "/pages/baseinfo/shippingPlan_add.html",
                title: paramData.title,
                width: 650,
                height: 40 *  7 + 65,
                onload:function(){
                    var iframe=this.getIFrameEl();
                    iframe.contentWindow.PageShippingPlanAdd.funSetData(paramData);
                },
                ondestroy:function(action){
                	me.shippingPlanGrid.reload();
                }
            })
        },
        funDelete : function()
        {
            var row = this.shippingPlanGrid.getSelected();
            var me = this;
            if(row)
            {
                mini.confirm("确定要删除这条记录?", "提醒", function (action) {
                    if (action == "ok") 
                    {
                        $.ajax({
                            url : PageMain.defaultOption.httpUrl + "/shippingPlan/del",
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
                                        	 me.shippingPlanGrid.reload();
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
	PageShippingPlan.init();
});