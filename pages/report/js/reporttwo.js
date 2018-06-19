var PageReporttwo = function(){
    return {
        defaultOption: {
            basePath:"",
            reporttwoGrid : null,
            shipNoData:[],
            headerData:[],
            searchCount : 0
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.reporttwoGrid = mini.get("reporttwoGrid");
            this.reporttwoGrid.setUrl(PageMain.defaultOption.httpUrl + "/dispatch/getReportTwoList");
            /*PageMain.callAjax(PageMain.defaultOption.httpUrl + "/ship/getList",{pageSize:100000}, function (data) {
                PageReporttwo.defaultOption.shipNoData = data.data.list;
            });*/
           this.funSearch();
        },
        funSearch : function()
        {

        	var reporttwoForm = new mini.Form("reporttwoForm");
        	var postData = reporttwoForm.getData();
        	if( PageReporttwo.defaultOption.searchCount != 0 && (mini.get("key").getFormValue() == null || mini.get("key").getFormValue() == "") ){
                PageMain.funShowMessageBox("请填写统计年月");
                return;
            }
            postData.key =mini.get("key").getFormValue();
            $.ajax({
                url : PageMain.defaultOption.httpUrl + "/dispatch/getReportTwoHeader",
                type: 'POST',
                data:  postData,
                dataType: 'json',
                async: false,
                success: function (data)
                {
                    PageReporttwo.defaultOption.headerData=data;
                },
                error: function ()
                {
                    PageMain.funShowMessageBox("删除记录失败");
                }
            });
            PageReporttwo.defaultOption.searchCount += 1 ;
            this.reporttwoGrid.set({
                columns: PageReporttwo.defaultOption.headerData
            });

        	this.reporttwoGrid.load(postData);
        },
        funOperRenderer : function(e)
        {
            return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="详情查看" href="javascript:PageReportfive.funDetail()"></a>';
        },
        funShipIdRenderer : function (e)//船号转码
        {
            for(var nItem = 0; nItem < PageReporttwo.defaultOption.shipNoData.length; nItem++)
            {
                if(e.value == PageReporttwo.defaultOption.shipNoData[nItem].id)
                {
                    return PageReporttwo.defaultOption.shipNoData[nItem].shipNo;
                }
            }
            return e.value;
        },
        funReset : function()
        {
        	var reporttwoForm = new mini.Form("reporttwoForm");
        	reporttwoForm.setData();
        	mini.get("queryParamFlag").setValue("1");
            this.reporttwoGrid.load(reporttwoForm.getData());
        },

        //空船到港登记
        funKqdgdj : function ()
        {
            var row = this.reporttwoGrid.getSelected();
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
        	var row = this.reporttwoGrid.getSelected();
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
        	var row = this.reporttwoGrid.getSelected();
        	var paramData = {action: "oper", row:row, title:"查看详细"};
        	this.funOpenInfo(paramData);
        },

        funDelete : function()
        {
            var row = this.reporttwoGrid.getSelected();
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
                                        	 me.reporttwoGrid.reload();
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
    PageReporttwo.init();
});