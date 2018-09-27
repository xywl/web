
var PageSailingInfo = function(){
    return {
        defaultOption: {
            basePath:"",
            sailingInfoGrid : null,
            sailingStatusTypeFly : [{id:1, name:"空船到港"},{id:2, name:"空船装后"},{id:3, name:"重船离港"},{id:4, name:"重船到港"},{id:5, name:"重船卸后"}]
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.sailingInfoGrid = mini.get("sailingInfoGrid");
            this.sailingInfoGrid.setUrl(PageMain.defaultOption.httpUrl + "/sailingInfo/getList");
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/dispatch/loadDispatchInfo",{key:null}, function (data) {
                PageSailingInfo.defaultOption.disIdData = data;
                mini.get("shipId").setData(data);
            });
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/ship/getList",{pageSize:100000}, function (data) {
                PageSailingInfo.defaultOption.shipNoData = data.data.list;
                PageSailingInfo.funSearch();
            });
        },
        funSetShipId:function () {
            //  mini.get("disId").setData(null);
            var shipVal = mini.get("shipId").getValue();
            //  mini.get("disId").setValue(shipVal);
            /*var shipIdData = mini.get("shipId");
            var shipId ="";
            for(var i = 0; i< shipIdData.data.length;i++){
                if(shipVal == shipIdData.data[i].id){
                    shipId =shipIdData.data[i].shipId;
                }
            }*/
            $.ajax({
                url: PageMain.defaultOption.httpUrl + "/dispatch/loadDispatchInfo",
                type: 'POST',
                data: {key: shipVal},
                dataType: 'json',
                async: false,
                success: function (data) {
                    if (data.length > 0) {
                        mini.get("disId").setValue(data[0].id)
                    }
                    mini.get("disId").setData(data);
                },
                error: function () {
                    PageMain.funShowMessageBox("获取失败");
                }
            })
        },
        funSailingStatusRenderer : function (e)
        {
            for(var nItem = 0; nItem < PageSailingInfo.defaultOption.sailingStatusTypeFly.length; nItem++)
            {
                if(e.value == PageSailingInfo.defaultOption.sailingStatusTypeFly[nItem].id)
                {
                    return PageSailingInfo.defaultOption.sailingStatusTypeFly[nItem].name;
                }
            }
            return "";
        },
        funSearch : function()
        {
        	var sailingInfoForm = new mini.Form("sailingInfoForm");
        	this.sailingInfoGrid.load(sailingInfoForm.getData());
        },
        funOperRenderer : function(e)
        {
            return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="详情查看" href="javascript:PageSailingInfo.funDetail()"></a>';
        },
        funReset : function()
        {
        	var sailingInfoForm = new mini.Form("sailingInfoForm");
        	sailingInfoForm.setData();
        	mini.get("queryParamFlag").setValue("1");
            this.sailingInfoGrid.load(sailingInfoForm.getData());
        },

        //空船到港登记
        funKqdgdj : function ()
        {
            var row = this.sailingInfoGrid.getSelected();
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
        	var row = this.sailingInfoGrid.getSelected();
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
        	var row = this.sailingInfoGrid.getSelected();
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
                    iframe.contentWindow.PageSailingInfoAdd.funSetData(paramData);
                },
                ondestroy:function(action){
                	me.sailingInfoGrid.reload();
                }
            })
        },
        funDelete : function()
        {
            var row = this.sailingInfoGrid.getSelected();
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
                                        	 me.sailingInfoGrid.reload();
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
	PageSailingInfo.init();
});