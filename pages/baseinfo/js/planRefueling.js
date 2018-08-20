
var PagePlanRefueling = function(){
    return {
        defaultOption: {
            basePath:"",
            planRefuelingGrid : null,
            disIdData:[],
            shipNoData:[]
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.planRefuelingGrid = mini.get("planRefuelingGrid");
            this.planRefuelingGrid.setUrl(PageMain.defaultOption.httpUrl + "/planRefueling/getList");

            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/dispatch/loadDispatchInfo",{key:null}, function (data) {
                PagePlanRefueling.defaultOption.disIdData = data;
                mini.get("key").setData(data);
            });
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/ship/getList",{pageSize:100000}, function (data) {
                PagePlanRefueling.defaultOption.shipNoData = data.data.list;
                PagePlanRefueling.funSearch();
            });


        },
        funSearch : function()
        {
        	var planRefuelingForm = new mini.Form("planRefuelingForm");
        	this.planRefuelingGrid.load(planRefuelingForm.getData());

        },
        funOperRenderer : function(e)
        {
            return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="详情查看" href="javascript:PagePlanRefueling.funDetail()"></a>';
        },
        funReset : function()
        {
        	var planRefuelingForm = new mini.Form("planRefuelingForm");
        	planRefuelingForm.setData();
        	mini.get("queryParamFlag").setValue("1");
            this.planRefuelingGrid.load(planRefuelingForm.getData());
        },
        //调度单号
        funDisIdDataRenderer : function (e)
        {
            for(var nItem = 0; nItem < PagePlanRefueling.defaultOption.disIdData.length; nItem++)
            {
                if(e.value == PagePlanRefueling.defaultOption.disIdData[nItem].id)
                {
                    return PagePlanRefueling.defaultOption.disIdData[nItem].name;
                }
            }
            return e.value;
        },
        //船号
        funRevUnitRenderer : function (e)
        {
            for(var nItem = 0; nItem < PagePlanRefueling.defaultOption.shipNoData.length; nItem++)
            {
                if(e.value == PagePlanRefueling.defaultOption.shipNoData[nItem].id)
                {
                    return PagePlanRefueling.defaultOption.shipNoData[nItem].shipNo;
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
        	var row = this.planRefuelingGrid.getSelected();
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
        	var row = this.planRefuelingGrid.getSelected();
        	var paramData = {action: "oper", row:row, title:"查看详细"};
        	this.funOpenInfo(paramData);
        },
        funOpenInfo : function(paramData)
        {
        	var me = this;
            paramData.row.shipNoData = me.defaultOption.shipNoData;
            paramData.row.disIdData =  me.defaultOption.disIdData;
        	mini.open({
                url: PageMain.funGetRootPath() + "/pages/baseinfo/planRefueling_add.html",
                title: paramData.title,
                width: 650,
                height: 40 *  7 + 65,
                onload:function(){
                    var iframe=this.getIFrameEl();
                    iframe.contentWindow.PagePlanRefuelingAdd.funSetData(paramData);
                },
                ondestroy:function(action){
                	me.planRefuelingGrid.reload();
                }
            })
        },
        funDelete : function()
        {
            var row = this.planRefuelingGrid.getSelected();
            var me = this;
            if(row)
            {
                mini.confirm("确定要删除这条记录?", "提醒", function (action) {
                    if (action == "ok") 
                    {
                        $.ajax({
                            url : PageMain.defaultOption.httpUrl + "/planRefueling/del",
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
                                        	 me.planRefuelingGrid.reload();
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
    PagePlanRefueling.init();
});