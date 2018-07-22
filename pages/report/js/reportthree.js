var PageReportthree = function(){
    return {
        defaultOption: {
            basePath:"",
            reportthreeGrid : null,
            eventIdFly:[{id:1, name:"不接电话"},{id:2, name:"停船过夜"},{id:3, name:"不服调配"},{id:4, name:"修船"},{id:5, name:"保养"},{id:6, name:"事故停航"},{id:7, name:"私事停航"},{id:8, name:"春节放假"},{id:9, name:"装卸货异常情况"}],
            shipNoData:[]
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.reportthreeGrid = mini.get("reportthreeGrid");
            this.reportthreeGrid.setUrl(PageMain.defaultOption.httpUrl + "/dispatch/getReportThreeList");
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/ship/getList",{pageSize:100000}, function (data) {
                PageReportthree.defaultOption.shipNoData = data.data.list;
            });
            var _reportThreeGrid = mini.get("reportthreeGrid");
            // _reportThreeGrid.set({
            //     columns: [
            //         { type: "indexcolumn" },
            //         { field: "loginname", width: 120, headerAlign: "center", allowSort: true, header: "员工账号"},
            //         { field: "age", width: 100, headerAlign: "center", allowSort: true, header: "年龄"},
            //         { field: "birthday", width: 100, headerAlign: "center", dateFormat: "yyyy-MM-dd H:mm", allowSort: true, header: "生日" },
            //         { field: "remarks", width: 120, headerAlign: "center", allowSort: true, header: "备注", editor: { type: "textarea"} },
            //         { field: "gender", type: "comboboxcolumn", autoShowPopup: true, width: 100, headerAlign: "center", header: "性别" },
            //         { field: "country", type: "comboboxcolumn", width: 100, headerAlign: "center", header: "国家"},
            //         { field: "married", trueValue: 1, falseValue: 0, type: "checkboxcolumn", width: 60, headerAlign: "center", header: "婚否" }
            //     ]
            // });
            _reportThreeGrid.on("load", function (e) {
                //console.log(e);
                var grid = e.data;
                var len = grid.length;
                var merges = [];
                if (len > 0) {
                    for (var i = 0; i < len/9; i++) {
                        merges.push({rowIndex: i * 9, columnIndex: 1, rowSpan: 9, colSpan: 0},
                                    {rowIndex: i * 9, columnIndex: 4, rowSpan: 9, colSpan: 0},
                                    {rowIndex: i * 9, columnIndex: 5, rowSpan: 9, colSpan: 0});
                    }
                }
                //_reportThreeGrid.mergeColumns(["shipId"]);
                _reportThreeGrid.mergeCells(merges);
            });
            this.funSearch();
        },
        funSearch : function()
        {

        	var reportthreeForm = new mini.Form("reportthreeForm");
        	var postData = reportthreeForm.getData();
            postData.key =mini.get("key").getFormValue();
            var month = (postData.key).split("-");
            this.reportthreeGrid.set({
                columns: [
                    { type: "indexcolumn", headerAlign: "center", width: 30, header: "序号" },
                    { field: "shipId", name: "shipId", headerAlign: "center", width: 120, header: "船号" },
                    { field: "eventId", name: "eventId", headerAlign: "center", width: 120, header: "反馈情况" },
                    { field: "sl", name: "sl", headerAlign: "center", width: 120, header: month[1] == undefined ? "月份" : Number(month[1]) + "月" },
                    { field: "zs", name: "zs", headerAlign: "center", width: 120, header: "航次(趟次)" },
                    { field: "bz", name: "bz", headerAlign: "center", width: 120, header: "备注" }
                ]
            });
        	this.reportthreeGrid.load(postData);
        },
        funOperRenderer : function(e)
        {
            return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="详情查看" href="javascript:PageReportfive.funDetail()"></a>';
        },
        funShipIdRenderer : function (e)//船号转码
        {
            for(var nItem = 0; nItem < PageReportthree.defaultOption.shipNoData.length; nItem++)
            {
                if(e.value == PageReportthree.defaultOption.shipNoData[nItem].id)
                {
                    return PageReportthree.defaultOption.shipNoData[nItem].shipNo;
                }
            }
            return e.value;
        },
        funRendererEventId : function (e)
        {alert(1);
            for(var nItem = 0; nItem < PageReportthree.defaultOption.eventIdFly.length; nItem++)
            {
                if(e.value == PageReportthree.defaultOption.eventIdFly[nItem].id)
                {
                    return PageReportthree.defaultOption.eventIdFly[nItem].name;
                }
            }
            return e.value;
        },
        funReset : function()
        {
        	var reportthreeForm = new mini.Form("reportthreeForm");
        	reportthreeForm.setData();
        	mini.get("queryParamFlag").setValue("1");
            this.reportthreeGrid.load(reportthreeForm.getData());
        },

        //空船到港登记
        funKqdgdj : function ()
        {
            var row = this.reportthreeGrid.getSelected();
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
        	var row = this.reportthreeGrid.getSelected();
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
        	var row = this.reportthreeGrid.getSelected();
        	var paramData = {action: "oper", row:row, title:"查看详细"};
        	this.funOpenInfo(paramData);
        },

        funDelete : function()
        {
            var row = this.reportthreeGrid.getSelected();
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
                                        	 me.reportthreeGrid.reload();
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
    PageReportthree.init();
});