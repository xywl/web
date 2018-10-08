
var PageShipTaskInfo = function(){
    return {
        defaultOption: {
            basePath:"",
            ShipTaskInfoGrid : null,
            shipFlagFly:[{id:1, name:"自有船舶"},{id:2, name:"挂靠船舶"},{id:3, name:"临调船"}],
            sailingStatusTypeFly : [{id:0, name:"已调度"},{id:1, name:"空船到港"},{id:2, name:"空船装后"},{id:3, name:"重船离港"},{id:4, name:"重船到港"},{id:5, name:"重船卸后"}]
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.ShipTaskInfoGrid = mini.get("shipTaskInfoGrid");
            this.ShipTaskInfoGrid.setUrl(PageMain.defaultOption.httpUrl + "/sailingInfo/getDispatchShipTaskList");

            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/dispatch/getShipInfoFromDispatchInfo",{key:null}, function (data) {

                mini.get("shipId").setData(data);
            });

            PageShipTaskInfo.funSearch();
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
            for(var nItem = 0; nItem < PageShipTaskInfo.defaultOption.sailingStatusTypeFly.length; nItem++)
            {
                if(e.value == PageShipTaskInfo.defaultOption.sailingStatusTypeFly[nItem].id)
                {
                    return PageShipTaskInfo.defaultOption.sailingStatusTypeFly[nItem].name;
                }
            }
            return "";
        },
        funSearch : function()
        {
        	var ShipTaskInfoForm = new mini.Form("shipTaskInfoForm");
        	this.ShipTaskInfoGrid.load(ShipTaskInfoForm.getData());
        },
        funOperRenderer : function(e)
        {
            return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="详情查看" href="javascript:PageShipTaskInfo.funDetail()"></a>';
        },
        funReset : function()
        {
        	var ShipTaskInfoForm = new mini.Form("ShipTaskInfoForm");
        	ShipTaskInfoForm.setData();
        	mini.get("queryParamFlag").setValue("1");
            this.ShipTaskInfoGrid.load(ShipTaskInfoForm.getData());
        },
        funFromDateInfo:function(e){
            return PageMain.funStrToDate(e.value);
        },
        funRendererShipFlag: function (e)
        {
            for(var nItem = 0; nItem < PageShipTaskInfo.defaultOption.shipFlagFly.length; nItem++)
            {
                if(e.value == PageShipTaskInfo.defaultOption.shipFlagFly[nItem].id)
                {
                    return PageShipTaskInfo.defaultOption.shipFlagFly[nItem].name;
                }
            }
            return e.value;
        },
        funRendererEmptyPhoto: function(e)
        {
            var token = $.cookie("token");
            return '<img style="width: 20px;height:20px;" class="thumbimg" src='+ e.value + "?token="+token +' onclick="PageShipTaskInfo.funEnlargeImage(this)">';
        },
        funEnlargeImage: function(obj)
        {
            var $this = $(obj);
            var src = $this.attr("src");
            var bigImages = [];
            var $imgs = $(".thumbimg");
            for(var i=0; i<$imgs.length; i++){
                var img = {};
                img.url = $imgs[i].src;
                img.index = i;
                $(".thumbimg").eq(i).attr("data-index",i);
                bigImages.push(img);
            }
            window.top.bigpic(src,obj,bigImages);
        },

        //空船到港登记
        funKqdgdj : function ()
        {
            var row = this.ShipTaskInfoGrid.getSelected();
            var paramData = {action: "add", operType : arguments[0], row: row, title:arguments[1], url:"/pages/khrw/shipTask_add.html", mWidth:arguments[2], mHeight:arguments[3]};
            
            if(arguments[0] == "kcdgdj")
            {
                if(row)
                {
                    if(row.status!=0)
                    {
                        PageMain.funShowMessageBox("请选择对应状态记录进行登记");
                        return;
                    }
                    paramData.action = "add";
                    this.funOpenInfo(paramData);
                }
                else
                {
                    PageMain.funShowMessageBox("请选择一条记录");
                }
            }
            else if(arguments[0] == "kczhdj")
            {
                if(row)
                {
                    if(row.status!=1)
                    {
                        PageMain.funShowMessageBox("请选择对应状态记录进行登记");
                        return;
                    }
                    paramData.action = "modify";
                    this.funOpenInfo(paramData);
                }
                else
                {
                    PageMain.funShowMessageBox("请选择一条记录");
                }
            }
            else if(arguments[0] == "zclgdj")
            {
                if(row)
                {
                    if(row.status!=2)
                    {
                        PageMain.funShowMessageBox("请选择对应状态记录进行登记");
                        return;
                    }
                    paramData.action = "modify";
                    this.funOpenInfo(paramData);
                }
                else
                {
                    PageMain.funShowMessageBox("请选择一条记录");
                }
            }
            else if(arguments[0] == "zcdgdj")
            {
                if(row)
                {
                    if(row.status!=3)
                    {
                        PageMain.funShowMessageBox("请选择对应状态记录进行登记");
                        return;
                    }
                    paramData.action = "modify";
                    this.funOpenInfo(paramData);
                }
                else
                {
                    PageMain.funShowMessageBox("请选择一条记录");
                }
            }

            else if(arguments[0] == "zcxhdj")
            {
                if(row)
                {
                    if(row.status<4 || row.status>5)
                    {
                        PageMain.funShowMessageBox("请选择对应状态记录进行登记");
                        return;
                    }
                    paramData.action = "modify";
                    this.funOpenInfo(paramData);
                }
                else
                {
                    PageMain.funShowMessageBox("请选择一条记录");
                }
            }
        },
        funDetail : function()
        {
        	var row = this.ShipTaskInfoGrid.getSelected();
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
                    iframe.contentWindow.PageShipTaskAdd.funSetData(paramData);
                },
                ondestroy:function(action){
                	me.ShipTaskInfoGrid.reload();
                }
            })
        },
        funDelete : function()
        {
            var row = this.ShipTaskInfoGrid.getSelected();
            var me = this;
            if(row)
            {
                if(row.sailingId ==null)
                {
                    PageMain.funShowMessageBox("航次未执行，无需删除");
                    return;
                }

                mini.confirm("确定要删除这条记录?", "提醒", function (action) {
                    if (action == "ok") 
                    {
                        $.ajax({
                            url : PageMain.defaultOption.httpUrl + "/sailingInfo/del",
                            type: 'POST',
                            data: {"id": row.sailingId},
                            dataType: 'json',
                            success: function (data)
                            {
                            	
                            	 if (data.success)
                                 {
                                     mini.alert("操作成功", "提醒", function(){
                                         if(data.success)
                                         {
                                        	 me.ShipTaskInfoGrid.reload();
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
	PageShipTaskInfo.init();
});