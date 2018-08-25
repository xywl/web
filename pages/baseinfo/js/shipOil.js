
var PageShipOil = function(){
    return {
        defaultOption: {
            basePath:"",
            shipOilGrid : null,
            statusFly:[{id:1, name:"预扣"},{id:2, name:"实扣"}],
            shipNoData:[],
            disIdData:[]
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.shipOilGrid = mini.get("shipOilGrid");
            this.shipOilGrid.setUrl(PageMain.defaultOption.httpUrl + "/shipOil/getList");
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/ship/getList",{pageSize:100000}, function (data) {
                PageShipOil.defaultOption.shipNoData = data.data.list;
                PageShipOil.funSearch();
            });
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/dispatch/loadDispatchInfo",{key:null}, function (data) {
                PageShipOil.defaultOption.disIdData = data;
                //mini.get("key").setData(data);
            });

        },
        funSearch : function()
        {
        	var shipOilForm = new mini.Form("shipOilForm");
        	this.shipOilGrid.load(shipOilForm.getData());
        },
        funReset : function()
        {
        	var shipOilForm = new mini.Form("shipOilForm");
            shipOilForm.setData();
            mini.get("queryParamFlag").setValue("1");
            this.shipOilGrid.load(shipOilForm.getData());
        },
        funAdd : function()
        {
        	var paramData = {action: "add", row:{}, title:"新增数据"};
            this.funOpenInfo(paramData);
        },
        funModify : function()
        {
        	var row = this.shipOilGrid.getSelected();
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
        funShipIdRenderer : function (e)//船号转码
        {
            for(var nItem = 0; nItem < PageShipOil.defaultOption.shipNoData.length; nItem++)
            {

                if(e.value == PageShipOil.defaultOption.shipNoData[nItem].id)
                {
                    return PageShipOil.defaultOption.shipNoData[nItem].shipNo;
                }
            }
            return e.value;
        },
        //调度单号
        funDisIdDataRenderer : function (e)
        {
            for(var nItem = 0; nItem < PageShipOil.defaultOption.disIdData.length; nItem++)
            {
                if(e.value == PageShipOil.defaultOption.disIdData[nItem].id)
                {
                    return PageShipOil.defaultOption.disIdData[nItem].name;
                }
            }
            return e.value;
        },
        funRendererStatus: function (e)
        {
            for(var nItem = 0; nItem < PageShipOil.defaultOption.statusFly.length; nItem++)
            {
                if(e.value == PageShipOil.defaultOption.statusFly[nItem].id)
                {
                    return PageShipOil.defaultOption.statusFly[nItem].name;
                }
            }
            return e.value;
        },
        funOperRenderer : function(e)
        {
            return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="详情查看" href="javascript:PageShipOil.funDetail()"></a>';
        },
        funDetail : function()
        {
            var row = this.shipOilGrid.getSelected();
            var paramData = {action: "oper", row:row, title:"查看详细"};
            this.funOpenInfo(paramData);
        },
        funOpenInfo : function(paramData)
        {
        	var me = this;
            paramData.row.shipIdFly = me.defaultOption.shipNoData;
            paramData.row.statusData = me.defaultOption.statusFly;
            paramData.row.disIdData =  me.defaultOption.disIdData;
        	mini.open({
                url: PageMain.funGetRootPath() + "/pages/baseinfo/shipOil_add.html",
                title: paramData.title,
                width: 650,
                height: 35 *  10  +40,
                onload:function(){
                    var iframe=this.getIFrameEl();
                    iframe.contentWindow.PageShipOilAdd.funSetData(paramData);
                },
                ondestroy:function(action){
                	me.shipOilGrid.reload();
                }
            })
        },
        funDelete : function()
        {
            var row = this.shipOilGrid.getSelected();
            var me = this;
            if(row)
            {
                mini.confirm("确定要删除这条记录?", "提醒", function (action) {
                    if (action == "ok") 
                    {
                        $.ajax({
                            url : PageMain.defaultOption.httpUrl + "/shipOil/del",
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
                                        	 me.shipOilGrid.reload();
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
	PageShipOil.init();
});