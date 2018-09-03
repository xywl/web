
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
            this.sailingInfoGrid.setUrl(PageMain.defaultOption.httpUrl + "/sailingInfo/getDispatchShipTaskList");
            this.funSearch();
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
        funFromDateInfo:function(e){
            return PageMain.funStrToDate(e.value);
        },
        funRendererEmptyPhoto: function(e)
        {
            var token = $.cookie("token");
            return '<img style="width: 20px;height:20px;" class="thumbimg" src='+ e.value + "?token="+token +' onclick="PageSailingInfo.funEnlargeImage(this)">';
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