
var PageShip = function(){
    return {
        defaultOption: {
            basePath:"",
            shipGrid : null,
            shipLevelFly:[{id:1, name:"650吨以上"},{id:2, name:"650吨以下"},{id:3, name:"碎石船"},{id:4, name:"兴能散装船"},{id:5, name:"兴能集装箱船"},{id:6, name:"兴一航运散装船"},{id:7, name:"兴一航运集装箱船"}],
            shipFlagFly:[{id:1, name:"自有船舶"},{id:2, name:"挂靠船舶"},{id:3, name:"临调船"}],
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
        funRendererSailingArea : function (e)
        {
            if (e.value ==1 )
            {
                return "A级";
            } else if (e.value == 2)
            {
                return "B级";
            } else if (e.value == 3)
            {
                return "A级，B级";
            } else if (e.value == 4)
            {
                return "C级";
            } else if (e.value == 5)
            {
                return "A级，C级";
            } else if (e.value == 6)
            {
                return "B级，C级";
            } else if (e.value == 7)
            {
                return "A级，B级，C级";
            } else if (e.value == 0)
            {
                return "";
            }
            return e.value;
        },
        funRendererShipType : function (e)
        {
            if (e.value ==1 )
            {
                return "干货船";
            } else if (e.value == 2)
            {
                return "多用途船";
            }

            return e.value;
        },
        funRendererShipLevel : function (e)
        {
            for(var nItem = 0; nItem < PageShip.defaultOption.shipLevelFly.length; nItem++)
            {
                if(e.value == PageShip.defaultOption.shipLevelFly[nItem].id)
                {
                    return PageShip.defaultOption.shipLevelFly[nItem].name;
                }
            }
            return e.value;
        },
        funRendererShipFlag: function (e)
        {
            for(var nItem = 0; nItem < PageShip.defaultOption.shipFlagFly.length; nItem++)
            {
                if(e.value == PageShip.defaultOption.shipFlagFly[nItem].id)
                {
                    return PageShip.defaultOption.shipFlagFly[nItem].name;
                }
            }
            return e.value;
        },
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
            paramData.shipLevel = this.defaultOption.shipLevelFly;
            paramData.shipFlag = this.defaultOption.shipFlagFly;
        	mini.open({
                url: PageMain.funGetRootPath() + "/pages/baseinfo/ship_add.html",
                title: paramData.title,
                width: 850,
                height: 50 *  10 ,
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