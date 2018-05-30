
var PageFreightPlan = function(){
    return {
        defaultOption: {
            basePath:"",
            freightPlanGrid : null,
            shdwData:[],
            goodsType:[{id:1, name:"熟料"},{id:2, name:"散装"},{id:3, name:"集装箱"}],
            goodsSubType : [{id:1, name:"碎石"},{id:2, name:"市场煤炭"},{id:3, name:"华能电煤"},{id:4, name:"浙能电煤"},{id:5, name:"铜精矿"},{id:6, name:"PAT"},{id:7, name:"经营业务"},{id:8, name:"其他业务"}],
            goodsSubTypeJzx : [{id:99, name:"集装箱"}],
            goodsSubTypeAll: [{id:1, name:"碎石"},{id:2, name:"市场煤炭"},{id:3, name:"华能电煤"},{id:4, name:"浙能电煤"},{id:5, name:"铜精矿"},{id:6, name:"PAT"},{id:7, name:"经营业务"},{id:8, name:"其他业务"},{id:99, name:"集装箱"}],
            revUnit:[],
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.freightPlanGrid = mini.get("freightPlanGrid");
            this.freightPlanGrid.setUrl(PageMain.defaultOption.httpUrl + "/freightPlan/getList");
            PageMain.callAjax(PageMain.defaultOption.httpUrl +"/gps/loadDataDict", {code:"departMent"}, function (data) {
                PageFreightPlan.defaultOption.revUnit = data;
                //  PageWaterLevel.funLoadSearchInfo();
            });
            mini.get("key").setData(PageFreightPlan.defaultOption.goodsType);
            this.funSearch();

        },
        funSearch : function()
        {
        	var freightPlanForm = new mini.Form("freightPlanForm");
        	this.freightPlanGrid.load(freightPlanForm.getData());

        },
        funOperRenderer : function(e)
        {
            return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="详情查看" href="javascript:PageFreightPlan.funDetail()"></a>';
        },
        funReset : function()
        {
        	var freightPlanForm = new mini.Form("freightPlanForm");
        	freightPlanForm.setData();
        	mini.get("queryParamFlag").setValue("1");
            this.freightPlanGrid.load(freightPlanForm.getData());
        },
        //货物类型
        funGoodsTypeRenderer : function (e)
        {
            for(var nItem = 0; nItem < PageFreightPlan.defaultOption.goodsType.length; nItem++)
            {
                if(e.value == PageFreightPlan.defaultOption.goodsType[nItem].id)
                {
                    return PageFreightPlan.defaultOption.goodsType[nItem].name;
                }
            }
            return e.value;
        },
        funRevUnitRenderer : function (e)
        {
            for(var nItem = 0; nItem < PageFreightPlan.defaultOption.revUnit.length; nItem++)
            {
                if(e.value == PageFreightPlan.defaultOption.revUnit[nItem].id)
                {
                    return PageFreightPlan.defaultOption.revUnit[nItem].name;
                }
            }
            return e.value;
        },
        funGoodsNameRenderer : function (e)
        {
            for(var nItem = 0; nItem < PageFreightPlan.defaultOption.goodsSubTypeAll.length; nItem++)
            {
                if(e.value == PageFreightPlan.defaultOption.goodsSubTypeAll[nItem].id)
                {
                    return PageFreightPlan.defaultOption.goodsSubTypeAll[nItem].name;
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
        	var row = this.freightPlanGrid.getSelected();
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
        	var row = this.freightPlanGrid.getSelected();
        	var paramData = {action: "oper", row:row, title:"查看详细"};
        	this.funOpenInfo(paramData);
        },
        funOpenInfo : function(paramData)
        {
        	var me = this;
            paramData.row.goodsTypeFly = me.defaultOption.goodsType;
            paramData.row.goodsSubTypeFly =  me.defaultOption.goodsSubType;
            paramData.row.goodsSubTypeJzxFly =  me.defaultOption.goodsSubTypeJzx;
            paramData.row.revUnitFly =  me.defaultOption.revUnit;
            console.log(paramData);
        	mini.open({
                url: PageMain.funGetRootPath() + "/pages/baseinfo/freightPlan_add.html",
                title: paramData.title,
                width: 650,
                height: 40 *  7 + 65,
                onload:function(){
                    var iframe=this.getIFrameEl();
                    iframe.contentWindow.PageFreightPlanAdd.funSetData(paramData);
                },
                ondestroy:function(action){
                	me.freightPlanGrid.reload();
                }
            })
        },
        funDelete : function()
        {
            var row = this.freightPlanGrid.getSelected();
            var me = this;
            if(row)
            {
                mini.confirm("确定要删除这条记录?", "提醒", function (action) {
                    if (action == "ok") 
                    {
                        $.ajax({
                            url : PageMain.defaultOption.httpUrl + "/freightPlan/del",
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
                                        	 me.freightPlanGrid.reload();
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
	PageFreightPlan.init();
});