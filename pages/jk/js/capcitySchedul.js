
var CapcitySchedul = function(){
    return {
        defaultOption: {
            basePath:"",
            portGrid : null
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.portGrid = mini.get("portGrid");
            this.portGrid.setUrl(PageMain.defaultOption.httpUrl + "/port/getList")
            this.portGrid.load();
            shipListGrid = mini.get("shipListGrid");
            shipListGrid.setUrl("/xyl/pages/jk/json/ship_list.json");
            orderDetailsGrid = mini.get("orderDetailsGrid");
            orderDetailsGrid.setUrl("/xyl/pages/jk/json/order_details.json");
            //orderDetailsGrid.load();

            orderDetailsGrid.on("celleditenter", function (e) {
                var index = orderDetailsGrid.indexOf(e.record);
                if (index == orderDetailsGrid.getData().length - 1) {
                    var row = {};
                    orderDetailsGrid.addRow(row);
                }
            });

            orderDetailsGrid.on("beforeload", function (e) {
                if (orderDetailsGrid.getChanges().length > 0) {
                    if (confirm("有增删改的数据未保存，是否取消本次操作？")) {
                        e.cancel = true;
                    }
                }
            });

            //置为删除时设置背景颜色
            orderDetailsGrid.on("drawcell", function (e) {
                var record = e.record,
                column = e.column,
                field = e.field,
                value = e.value;
                //设置行样式
                if (record.status == 3) {
                    e.rowStyle = "background: #fceee2 !important;";
                }
            });

            shipListGrid.on("select", function (e) {
                var record = e.record,
                shipId = record.shipId,
                shipType = record.shipType;
                console.log(record);
                var newRow = {shipId: shipId, shipType: shipType};
                orderDetailsGrid.addRow(newRow, 0);
            });

            shipListGrid.on("deselect", function (e) {
                var record = e.record,
                shipId = record.shipId,
                shipType = record.shipType;
                console.log(record);
                var oldRow = {shipId: shipId, shipType: shipType};
                var datas = orderDetailsGrid.getData();
                for(var i = 0; i < datas.length; i++)
                {
                    if (datas[i].shipId == oldRow.shipId) {
                        orderDetailsGrid.removeRow(datas[i], false);
                    }
                }
                //orderDetailsGrid.removeRow(oldRow, false);
            });
        },
        funSubmitData: function()  //提交方法
        {
            orderDetailsGrid.validate();
            if (orderDetailsGrid.isValid() == false) {
                //alert("请校验输入单元格内容");
                var error = orderDetailsGrid.getCellErrors()[0];
                orderDetailsGrid.beginEditCell(error.record, error.column);
                return;
            }
            var param = {};
            param.customerTaskFlowId = 111;
            var plans = [];
            var submitData = orderDetailsGrid.getChanges();
            for (var i = 0; i < submitData.length; i++) {
                var plansData = {};
                if (submitData[i].dispatchInfoId) {
                    plansData.dispatchInfoId = submitData[i].dispatchInfoId;
                }
                plansData.shipId = submitData[i].shipId;
                plansData.preWeight = submitData[i].preWeight;
                plansData.preLoad = submitData[i].preLoad;
                plansData.actualTransferPrice = submitData[i].actualTransferPrice;
                var prePaseDate = mini.parseDate(submitData[i].preArriveTime);
                plansData.preArriveTime = mini.formatDate(prePaseDate, "yyyy-MM-dd");
                plansData.preSettleAmount = submitData[i].preSettleAmount;
                plansData.settleType = submitData[i].settleType;
                if (submitData[i]._state == "added") {
                    plansData.flag = 1;
                } else if (submitData[i]._state == "modified") {
                    plansData.flag = 2;
                } else if (submitData[i].status == 3) {
                    plansData.flag = 3;
                }
                plans.push(plansData);
            }
            param.plans = plans;
            var json = mini.encode(param);

            //orderDetailsGrid.loading("保存中，请稍后......");
            alert(json);
            // $.ajax({
            //     url: "../data/AjaxService.aspx?method=SaveEmployees",
            //     data: { data: json },
            //     type: "post",
            //     success: function (text) {
            //         grid.reload();
            //     },
            //     error: function (jqXHR, textStatus, errorThrown) {
            //         alert(jqXHR.responseText);
            //     }
            // });
        },
        funOnSelectionChanged: function(e)
        {
            var portGrid = e.sender;
            var record = portGrid.getSelected();
            if (record) {
                // employee_grid.load({ dept_id: record.id });
                shipListGrid.load();
                orderDetailsGrid.load();
            }
        },
        funRendererPortType : function (e)
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
            return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="详情查看" href="javascript:CapcitySchedul.funDetail()"></a>';
        },
        funOrderOperRenderer : function(e)
        {
            var grid = e.sender;
            var record = e.record;
            var uid = record._uid;
            var rowIndex = e.rowIndex;
            var s = '<a class="Blue_Button" href="javascript:CapcitySchedul.funDelRow(\'' + uid + '\')">删除</a> '
                    + '<span class="separator"></span>'
                    + '<a class="Blue_Button" href="javascript:CapcitySchedul.funReDelRow(\'' + uid + '\')">取消删除</a> ';
            if (e.row.dispatchInfoId) {
                return s;
                //return '<input type="radio" name="deleteOrNot" /><label>删除</label><input type="radio" name="deleteOrNot" /><label>取消删除</label>';
            }
            else {
                return '';
            }
            //return '<a class="mini-button-icon mini-iconfont icon-remove" style="display: inline-block;  height:16px;padding:0 10px;" title="删除" href="javascript:CapcitySchedul.funRemoveRow()"></a>';
        },
        funStatusRenderer: function(e) {
            if (e.row.dispatchInfoId) {
                return '0';
            }
            else {
                return '1';
            }
        },
        funOnCellBeginEdit: function(e) {
            var record = e.record, field = e.field;
            if (record.status == "3") {
                e.cancel = true;    //如果置为删除状态则不允许编辑
            }
            if (field == "shipId" || field == "shipType") {
                e.cancel = true;
            }
        },
        funDelRow: function(row_uid)
        {
            var row = orderDetailsGrid.getRowByUID(row_uid);
            if (row) {
                orderDetailsGrid.updateRow(row, {status: 3});
                console.log(row);
            };
        },
        funReDelRow: function(row_uid)
        {
            var row = orderDetailsGrid.getRowByUID(row_uid);
            if (row) {
                orderDetailsGrid.updateRow(row, {status: 0});
                orderDetailsGrid.acceptRecord(row);
                console.log(row);
            };
        },
        funDetail : function()
        {
            var row = this.portGrid.getSelected();
            var paramData = {action: "oper", row:row, title:"查看详细"};
            this.funOpenInfo(paramData);
        },
        funOpenInfo : function(paramData)
        {
        	var me = this;
        	mini.open({
                url: PageMain.funGetRootPath() + "/pages/financeinfo/tariffInfo_add.html",
                title: paramData.title,
                width: 750,
                height: 30 *  11 + 65,
                onload:function(){
                    var iframe=this.getIFrameEl();
                    //iframe.contentWindow.CapcitySchedul.funSetData(paramData);
                },
                ondestroy:function(action){
                	me.portGrid.reload();
                }
            })
        }
    }
}();

$(function(){
	CapcitySchedul.init();
});