
var CapcitySchedul = function(){
    return {
        defaultOption: {
            basePath:"",
            orderGrid : null,
            shipListGrid: null,
            orderDetailsGrid: null
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.orderGrid = mini.get("orderGrid");
            this.orderGrid.setUrl(PageMain.defaultOption.httpUrl + "/dispatch/getCustomerTaskFlowList");
            //this.orderGrid.load();
            this.funSearchOrderGrid();
            shipListGrid = mini.get("shipListGrid");
            shipListGrid.setUrl(PageMain.defaultOption.httpUrl + "/dispatch/getAvailableShips");
            orderDetailsGrid = mini.get("orderDetailsGrid");
            orderDetailsGrid.setUrl(PageMain.defaultOption.httpUrl + "/dispatch/getList");
            //orderDetailsGrid.load();

            orderDetailsGrid.on("celleditenter", function (e) {
                var index = orderDetailsGrid.indexOf(e.record);
                if (index == orderDetailsGrid.getData().length - 1) {
                    var row = {};
                    orderDetailsGrid.addRow(row);
                }
            });

            // orderDetailsGrid.on("beforeload", function (e) {
            //     if (orderDetailsGrid.getChanges().length > 0) {
            //         if (confirm("有增删改的数据未保存，是否取消本次操作？")) {
            //             e.cancel = true;
            //         }
            //     }
            // });

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

            shipListGrid.on("select", function (e) {  //船舶列表选中事件
                var record = e.record,
                shipId = record.shipId,
                preWeight = record.preWeight,
                shipType = record.shipType;
                //console.log(record);
                var newRow = {shipId: shipId, shipType: shipType, preWeight: preWeight};
                orderDetailsGrid.addRow(newRow, 0);
            });

            shipListGrid.on("deselect", function (e) {  //船舶列表取消选择事件
                var record = e.record,
                shipId = record.shipId;
                //console.log(record);
                var oldRow = {shipId: shipId};
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
        funSearchOrderGrid : function()
        {
            var capcitySchedulForm = new mini.Form("capcitySchedulForm");
            this.orderGrid.load(capcitySchedulForm.getData());
        },
        funSearchShipListGrid : function()
        {
            var customerTaskFlowData = this.orderGrid.getSelected();
            var shipListForm = new mini.Form("shipListForm");
            var searchParam = shipListForm.getData();
            if (customerTaskFlowData) {
                searchParam.customerTaskFlowId = customerTaskFlowData.id;
            }
            shipListGrid.load(searchParam);
            CapcitySchedul.funSearchOrderDetailsGrid();
        },
        funSearchOrderDetailsGrid : function()  //查询生成调度结果
        {
            var record = this.orderGrid.getSelected();
            orderDetailsGrid.load({customerTaskFlowId: record.id, "queryParamFlag": 1});
        },
        funOnSelectionChanged: function(e)
        {
            var orderGrid = e.sender;
            var record = orderGrid.getSelected();
            if (record) {
                //shipListGrid.load({customerTaskFlowId: record.id});
                CapcitySchedul.funSearchShipListGrid();
                CapcitySchedul.funSearchOrderDetailsGrid();
                //orderDetailsGrid.load({customerTaskFlowId: record.id, "queryParamFlag": 1});
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
        funOrderTimeRenderer: function(e)
        {
            return PageMain.funStrToDate(e.row.loadingTime);
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
            if (field == "shipId" || field == "shipType" || field == "preWeight" || field == "preSettleAmount") {
                e.cancel = true;
            }
        },
        funOnDrawCell: function(e)  //计算预结算金额
        {
            var record = e.record;

            if (e.field == "preSettleAmount") {
                var actualPrice = record.actualPrice;
                var preLoad = record.preLoad;
                if (actualPrice == undefined || preLoad == undefined) {
                    e.cellHtml = 0;
                    e.record.preSettleAmount = 0;
                } else {
                    //e.cellHtml = actualPrice * preLoad;
                    e.cellHtml = CapcitySchedul.funNumMulti(actualPrice, preLoad);
                    e.record.preSettleAmount = CapcitySchedul.funNumMulti(actualPrice, preLoad);
                }
            }
        },
        funOnDrawSummaryCell: function(e) //数据汇总
        {
            var result = e.result;
            var grid = e.sender;
            var rows = e.data;

            if (e.field == "preSettleAmount") {
                var total = 0;
                for (var i = 0, l = rows.length; i < l; i++) {
                    var row = rows[i];
                    var t = row.actualPrice * row.preLoad;
                    if (isNaN(t)) continue;
                    total += t;
                }

                e.cellHtml = '<span style="color: red;font-size: 12px;">总计: '+total+'</span>';
            }
        },
        funDelRow: function(row_uid)
        {
            var row = orderDetailsGrid.getRowByUID(row_uid);
            if (row) {
                orderDetailsGrid.updateRow(row, {status: 3});
                //console.log(row);
            };
        },
        funReDelRow: function(row_uid)
        {
            var row = orderDetailsGrid.getRowByUID(row_uid);
            if (row) {
                orderDetailsGrid.updateRow(row, {status: 0});
                orderDetailsGrid.acceptRecord(row);
                //console.log(row);
            };
        },
        funSubmitData: function()  //提交方法
        {
            orderDetailsGrid.validate();  //表格验证
            if (orderDetailsGrid.isValid() == false) {
                //alert("请校验输入单元格内容");
                var error = orderDetailsGrid.getCellErrors()[0];
                orderDetailsGrid.beginEditCell(error.record, error.column);
                return;
            }
            var param = {};
            var customerTaskFlowData = this.orderGrid.getSelected();
            param.customerTaskFlowId = customerTaskFlowData.id;
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
                plansData.preArriveTime = this.funTimeFormat(mini.formatDate(prePaseDate, "yyyy-MM-dd HH:mm:ss"));
                plansData.preSettleAmount = submitData[i].preSettleAmount;
                plansData.settleType = submitData[i].settleType;
                if (submitData[i]._state == "added") { //flag: 1.新增  2.修改  3.删除
                    plansData.flag = 1;
                } else if (submitData[i]._state == "modified" && submitData[i].status != 3) {
                    plansData.flag = 2;
                } else if (submitData[i].status == 3) {
                    plansData.flag = 3;
                }
                plans.push(plansData);
            }
            param.plans = plans;

            //orderDetailsGrid.loading("保存中，请稍后......");
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/dispatch/confirmPlan", {customerTaskFlowId: customerTaskFlowData.id, plans: JSON.stringify(param.plans)}, function (data) {
                if (data.success)
                {
                    mini.alert("操作成功", "提醒", function(){
                        if(data.success)
                        {
                            location.reload();
                        }
                    });
                }
                else
                {
                    PageMain.funShowMessageBox(data.msg);
                }
            });
        },
        /**
         * 乘法运算，避免数据相乘小数点后产生多位数和计算精度损失。
         *
         * @param num1被乘数 | num2乘数
         */
        funNumMulti: function(num1, num2)
        {
            var baseNum = 0;
            try {
                baseNum += num1.toString().split(".")[1].length;
            } catch (e) {
            }
            try {
                baseNum += num2.toString().split(".")[1].length;
            } catch (e) {
            }
            return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum);
        },
        funTimeFormat: function(date)
        {
            var formatDate = date.replace(new RegExp("-","gm"),"/");
            var secondDate = (new Date(formatDate)).getTime() / 1000;
            return secondDate;
        }
    }
}();

$(function(){
	CapcitySchedul.init();
});