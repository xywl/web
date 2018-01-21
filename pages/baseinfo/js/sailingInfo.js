
var PageSailingInfo = function(){
    return {
        defaultOption: {
            basePath:"",
            sailingInfoGrid : null,
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.sailingInfoGrid = mini.get("sailingInfoGrid");
            this.sailingInfoGrid.setUrl(PageMain.defaultOption.httpUrl + "/sailingInfo/getList")
            this.funSearch();
        },
        funSearch : function()
        {
        	var sailingInfoForm = new mini.Form("sailingInfoForm");
        	this.sailingInfoGrid.load(sailingInfoForm.getData());
        },
        funReset : function()
        {
        	var sailingInfoForm = new mini.Form("sailingInfoForm");
            sailingInfoForm.setData();
            mini.get("queryParamFlag").setValue("1");
            this.sailingInfoGrid.load(sailingInfoForm.getData());
        },
        funAdd : function(flag)
        {
            var form = new mini.Form("#editform"+flag);
            var editWindow = mini.get("editWindow"+flag);
            var row = this.sailingInfoGrid.getSelected();
            if(flag >1){
                if(row)
                {
                    editWindow.show();
                    form.clear();
                    form.loading();
                    $.ajax({
                        url: PageMain.defaultOption.httpUrl + "/sailingInfo/getById?id="+ row.id,
                        success: function (text) {

                            form.unmask();
                            var o = mini.decode(text);
                            form.setData(o.data);
                        },
                        error: function () {
                            alert("表单加载错误");
                            form.unmask();
                        }
                    });
                } else {
                    PageMain.funShowMessageBox("请选择一条记录");
                }
            } else{
                if(row){
                    editWindow.show();
                    form.clear();
                    form.loading();
                    $.ajax({
                        url: PageMain.defaultOption.httpUrl + "/sailingInfo/getById?id="+ row.id,
                        success: function (text) {

                            form.unmask();
                            var o = mini.decode(text);
                            form.setData(o.data);
                        },
                        error: function () {
                            alert("表单加载错误");
                            form.unmask();
                        }
                    });
                } else {
                    form.clear();
                    editWindow.show();
                }
            }
        },
        funRendererSailingInfoType : function (e)
        {
            if (e.value == 1)
            {
                return "集装箱"
            }
            else if (e.value == 2)
            {
                return "其它"
            }
            return e.value;
        },
        funOperRenderer : function(e)
        {
            return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="详情查看" href="javascript:PageSailingInfo.funDetail()"></a>';
        },
        funDetail : function()
        {
            var row = this.sailingInfoGrid.getSelected();
            var paramData = {action: "oper", row:row, title:"查看详细"};
            this.funOpenInfo(paramData);
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
        },
        funSave : function(flag)
        {
            var action = "add";
            if(flag>1){
                action ="modify";
            }
            var  sailingInfoForm = new mini.Form("editform"+flag);
            sailingInfoForm.validate();
            if (!sailingInfoForm.isValid())
            {
                var errorTexts = form.getErrorTexts();
                for (var i in errorTexts)
                {
                    mini.alert(errorTexts[i]);
                    return;
                }
            }

            var me = this;
            var obj = sailingInfoForm.getData(true);
            if(flag==1){
                obj.arriveSPortTime = mini.get("arriveSPortTime").getValue().getTime()/1000;
            } else if(flag == 2){
                obj.loadTime = mini.get("loadTime").getValue().getTime()/1000;
                obj.preArriveEPortTime = mini.get("preArriveEPortTime").getValue().getTime()/1000;
            } else if(flag == 3){
                obj.departPortTime = mini.get("departPortTime").getValue().getTime()/1000;
            } else if(flag == 4){
                obj.actualArriveEPortTime = mini.get("actualArriveEPortTime").getValue().getTime()/1000;
            } else if(flag == 5){
                obj.dischargeTime = mini.get("dischargeTime").getValue().getTime()/1000;
            }

            $.ajax({
                url : PageMain.defaultOption.httpUrl + "/sailingInfo/"+action+"?a="+Math.random(),
                type : 'POST',
                data : obj,
                dataType: 'json',
                success: function (data)
                {
                    if (data.success)
                    {
                        mini.alert("操作成功", "提醒", function(){
                            PageSailingInfo.funCancel(flag);
                            /*if(data.success)
                            {
                                PageMain.funCloseWindow("save");
                            }*/
                        });
                    }
                    else {
                        PageMain.funShowMessageBox(data.msg);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown)
                {
                    PageMain.funShowMessageBox("操作出现异常");
                }
            });
        },
        funCancel:function (flag) {
            this.sailingInfoGrid.reload();
            var editWindow = mini.get("editWindow"+flag);
            editWindow.hide();
        }
    }
}();

$(function(){
	PageSailingInfo.init();
});