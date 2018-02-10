
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
                if (record.localstatus == 2) {
                    e.rowStyle = "background: #fceee2 !important;";
                }
                if ((field == "shipType" || field == "shipNo" || field == "shipStatus" || field == "shipFlag" || field == "preWeight" || field == "preSettleAmount" || field == "status") && record.localstatus != 2) {
                    e.cellStyle = "background: #eee;";
                } else {
                    e.cellStyle = "background: transparent;"
                }
            });

            shipListGrid.on("select", function (e) {  //船舶列表选中事件
                var record = e.record,
                shipId = record.shipId,
                shipNo = record.shipNo,
                preWeight = record.preWeight,
                shipFlag = record.shipFlag;
                var shipSuggestUnitPrice = $("#shipSuggestUnitPrice").val();
                var datas = orderDetailsGrid.getData();
                var idArray = [];
                //console.log(record);
                var newRow = {shipId: shipId, shipNo: shipNo, shipFlag: shipFlag, preWeight: preWeight, actualTransferPrice: shipSuggestUnitPrice};
                for(var i = 0; i < datas.length; i++)
                {
                    idArray.push(datas[i].shipId);
                }
                if(!CapcitySchedul.funInArray(idArray, newRow.shipId))
                {
                    orderDetailsGrid.addRow(newRow, 0);
                }
                //orderDetailsGrid.addRow(newRow, 0);
                // if(datas.length == 0)
                // {
                //     orderDetailsGrid.addRow(newRow, 0);
                // } else {
                //     for(var i = 0; i < datas.length; i++)
                //     {
                //         if (newRow.shipId != datas[i].shipId) {
                //             orderDetailsGrid.addRow(newRow, 0);
                //         } else {
                //             //continue;
                //         }
                //     }
                // }
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
        funShipListOnLoad: function(e)
        {
            var shipListData = e.data;
            var orderDetailsData = orderDetailsGrid.getData();
            for(var j = 0; j < shipListData.length; j++)
            {
                for(var i = 0; i < orderDetailsData.length; i++)
                {
                    if (shipListData[j].shipId == orderDetailsData[i].shipId) {
                        shipListGrid.setSelected(shipListData[j]);
                    }
                }
            }
        },
        funOrderDetailsOnLoad: function(e)
        {
            CapcitySchedul.funSearchShipListGrid();
        },
        funSearchShipListGrid : function()
        {
            var customerTaskFlowData = this.orderGrid.getSelected();
            var shipListForm = new mini.Form("shipListForm");
            var searchParam = shipListForm.getData();
            var shipFlagList = $("input[name='shipFlag']:checked");
            var shipFlag = '';
            if (shipFlagList.length > 0) {
                for (var i =0; i < shipFlagList.length; i++) {
                    shipFlag += shipFlagList[i].value + ",";
                }
                var shipFlags = shipFlag.substring(0, shipFlag.length - 1);
                searchParam.shipFlag = shipFlags;
            }
            if (customerTaskFlowData) {
                searchParam.customerTaskFlowId = customerTaskFlowData.id;
            }
            shipListGrid.load(searchParam);
            //CapcitySchedul.funSearchOrderDetailsGrid();
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
                //CapcitySchedul.funSearchShipListGrid();
                CapcitySchedul.funSearchOrderDetailsGrid();
                $("#leftWeight").val(record.leftWeight);
                $("#totalLoad").val(record.totalLoad);
                $("#shipSuggestUnitPrice").val(record.shipSuggestUnitPrice);
                //orderDetailsGrid.load({customerTaskFlowId: record.id, "queryParamFlag": 1});
            }
        },
        funShipStatusRenderer: function(e)
        {
            var record = e.record;
            if(record.customerTaskFlowId)
            {
                return '已调度';
            } else {
                return '未调度';
            }
        },
        funShipFlagRenderer: function(e) //船舶类型
        {
            if(e.value == 1)
            {
                return '自有船舶';
            } else if(e.value == 2) 
            {
                return '挂靠船舶';
            } else if(e.value == 3)
            {
                return '临调船舶';
            }
        },
        funShipTypeRenderer: function(e) //船舶类型
        {
            if(e.value == 1)
            {
                return '自有船舶';
            } else if(e.value == 2) 
            {
                return '挂靠船舶';
            } else if(e.value == 3)
            {
                return '临调船舶';
            }
        },
        funOrderOperRenderer : function(e)
        {
            var grid = e.sender;
            var record = e.record;
            var uid = record._uid;
            var rowIndex = e.rowIndex;
            if (e.row.id && e.row.localstatus == 2) {
                return '<a class="Blue_Button" href="javascript:CapcitySchedul.funReDelRow(\'' + uid + '\')">取消删除</a>';
            } else {
                return '<a class="Blue_Button" href="javascript:CapcitySchedul.funDelRow(\'' + uid + '\')">删除</a> ';
            }
        },
        funOrderTimeRenderer: function(e)
        {
            return PageMain.funStrToDate(e.row.loadingTime);
        },
        funPreArriveTimeRenderer: function(e)
        {
            return PageMain.funStrToDate(e.row.preArriveTime);
        },
        funOrderDetailsTimeRenderer: function(e)
        {
            if (typeof(e.row.preArriveTime) == "number") {
                return PageMain.funStrToDate(e.row.preArriveTime);
            } else {
                return mini.formatDate(e.row.preArriveTime, "yyyy-MM-dd HH:mm:ss");
            }
        },
        funStatusRenderer: function(e) {
            if (e.row.id) {
                return '0';
            }
            else {
                return '1';
            }
        },
        funOnCellBeginEdit: function(e) {  //行编辑开始事件
            var record = e.record, field = e.field;
            if (record.localstatus == "2") {
                e.cancel = true;    //如果置为删除状态则不允许编辑
            }
            if (record.localstatus != -1) {
                e.cancel = true;
            }
            if (field == "shipType" || field == "shipId" || field == "shipFlag" || field == "preWeight" || field == "preSettleAmount") {
                e.cancel = true;
            }
        },
        funOnCellCommitEdit: function(e)  //行编辑提交前事件
        {
            var leftWeight = Number($("#leftWeight").val());
            var  record = e.record, field = e.field, preLoadTotal = 0, rows = e.sender.data;
            if (rows) {
                for (var i = 0, l = rows.length; i < l; i++) {
                    var row = rows[i];
                    var t = Number(row.preLoad);
                    if (isNaN(t)) continue;
                    preLoadTotal += t;
                }
            }
            if (field == "preLoad") { 
                // if (e.value > record.preWeight) {  //预发吨位不能大于预报吨位
                //     mini.alert("预发吨位不得大于预报吨位，请重新输入");
                //     e.value = e.oldValue == undefined ? '' : e.oldValue;
                //     e.editor._IsValid = false;
                // }
                preLoadTotal += Number(e.value);
                if (preLoadTotal > leftWeight) {  //当前调度吨位不能大于余调吨位
                    mini.alert("当前调度吨位大于余调吨位,请重新编编辑");
                    e.value = e.oldValue == undefined ? '' : e.oldValue;
                    e.editor._IsValid = false;
                }
                
            }
        },
        // funOnCellEndEdit: function(e)  //行编辑结束事件
        // {
        //     var leftWeight = $("#leftWeight").val();
        //     var record = e.record, field = e.field, preLoadTotal = 0, rows = e.sender.data;
        //     if (rows) {
        //         for (var i = 0, l = rows.length; i < l; i++) {
        //             var row = rows[i];
        //             var t = Number(row.preLoad);
        //             if (isNaN(t)) continue;
        //             preLoadTotal += t;
        //         }
        //     }
        //     if (preLoadTotal > leftWeight) {
        //         mini.alert("当前调度吨位大于余调吨位,请重新编编辑");
        //         // mini.alert("当前调度吨位大于余调吨位,请重新编编辑", "提示",
        //         //     function (action, value) {
        //         //         if (action == "ok") {
        //         //             alert(value);
        //         //         } else {
        //         //             alert("取消");
        //         //         }
        //         //     }
        //         // );
        //         return;
        //     }
        // },
        funOnDrawCell: function(e)  //计算预结算金额
        {
            var record = e.record;
            var grid = e.sender;

            if (e.field == "preSettleAmount") {
                var actualTransferPrice = record.actualTransferPrice;
                var preLoad = record.preLoad;
                if (actualTransferPrice == undefined || preLoad == undefined) {
                    e.cellHtml = '';
                    e.record.preSettleAmount = '';
                } else {
                    //e.cellHtml = actualTransferPrice * preLoad;
                    e.cellHtml = CapcitySchedul.funNumMulti(actualTransferPrice, preLoad);
                    e.record.preSettleAmount = CapcitySchedul.funNumMulti(actualTransferPrice, preLoad);
                }
            }
        },
        funOnDrawSummaryCell: function(e) //数据汇总
        {
            var result = e.result;
            var grid = e.sender;
            var rows = e.data;

            // if (e.field == "preSettleAmount") {
            //     var total = 0;
            //     for (var i = 0, l = rows.length; i < l; i++) {
            //         var row = rows[i];
            //         var t = Number(row.actualTransferPrice) * Number(row.preLoad);
            //         if (isNaN(t)) continue;
            //         total += t;
            //     }

            //     e.cellHtml = '<span style="color: red;font-size: 12px;">总计: '+total+'</span>';
            // }
            if (e.field == "preLoad") {
                var leftWeight = $("#leftWeight").val();
                var totalLoad = $("#totalLoad").val();              
                var preLoadTotal = 0;
                for (var i = 0, l = rows.length; i < l; i++) {
                    var row = rows[i];
                    var preLoad = Number(row.preLoad);
                    if (isNaN(preLoad)) continue;
                    if (row.localstatus != 2) {
                        preLoadTotal += preLoad;
                    } else {
                        preLoadTotal += 0;
                    }
                }
                var hasLeftWeight = totalLoad - preLoadTotal;
                $("#hasLeftWeight").val(hasLeftWeight);
                e.cellHtml = '<span style="color: red;font-size: 12px;">剩余未调度吨位数: '+hasLeftWeight+'</span>';
            }
        },
        funDelRow: function(row_uid)
        {
            var row = orderDetailsGrid.getRowByUID(row_uid);
            if (row) {
                if(!row.customerTaskFlowId) {
                    var shipListData = shipListGrid.getData();
                    for(var i = 0; i < shipListData.length; i++)
                    {
                        if(shipListData[i].shipId == row.shipId)
                        {
                            orderDetailsGrid.removeRow(row,true);
                            orderDetailsGrid.rejectRecord(row);
                            shipListGrid.deselect(shipListData[i], true);
                        }
                    }
                } else {
                    orderDetailsGrid.rejectRecord(row);
                    orderDetailsGrid.updateRow(row, {localstatus: 2});
                }
                //console.log(row);
            };
        },
        funReDelRow: function(row_uid)
        {
            var row = orderDetailsGrid.getRowByUID(row_uid);
            if (row) {
                orderDetailsGrid.updateRow(row, {localstatus: 0});
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
            if (customerTaskFlowData)
            {
                param.customerTaskFlowId = customerTaskFlowData.id;
            }
            else
            {
                mini.alert("请选择客户订单");
                return;
            }
            var plans = [];
            var submitData = orderDetailsGrid.getChanges();
            var totalPreLoad = 0;
            var leftWeight = $("#leftWeight").val();
            for (var i = 0; i < submitData.length; i++) {
                var plansData = {};
                if (submitData[i].id) {
                    plansData.id = submitData[i].id;
                }
                plansData.shipId = submitData[i].shipId;
                plansData.shipFlag = submitData[i].shipFlag;
                plansData.preWeight = submitData[i].preWeight;
                plansData.preLoad = submitData[i].preLoad;
                totalPreLoad += Number(submitData[i].preLoad);
                plansData.actualTransferPrice = submitData[i].actualTransferPrice;
                if (submitData[i].id) {
                    plansData.preArriveTime = submitData[i].preArriveTime
                } else {
                    var prePaseDate = mini.parseDate(submitData[i].preArriveTime);
                    plansData.preArriveTime = this.funTimeFormat(mini.formatDate(prePaseDate, "yyyy-MM-dd HH:mm:ss"));
                    plansData.preSettleAmount = submitData[i].preSettleAmount;
                }
                plansData.settleType = submitData[i].settleType;
                if (submitData[i]._state == "added") { //flag: 1.修改  2.删除  3.新增
                    plansData.flag = 3;
                } else if (submitData[i]._state == "modified" && submitData[i].localstatus != 2) {
                    plansData.flag = 1;
                } else if (submitData[i].localstatus == 2) {
                    plansData.flag = 2;
                }
                plans.push(plansData);
            }
            param.plans = plans;
            if (totalPreLoad > leftWeight) {
                mini.alert("当前调度吨位大于余调吨位,请重新编编辑");
                return;
            }

            //orderDetailsGrid.loading("保存中，请稍后......");
            if (plans.length > 0)
            {
                mini.confirm("是否确定提交订单?", "提醒", function (action) {
                    if (action == "ok")
                    {
                        PageMain.callAjax(PageMain.defaultOption.httpUrl + "/dispatch/confirmPlan", {"customerTaskFlowId": customerTaskFlowData.id, "plans": JSON.stringify(param.plans)}, function (data) {
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
                    }
                });
            }
            else
            {
                mini.alert("没有可以提交的数据");
            }
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
            var secondDate = (new Date(date)).getTime() / 1000;
            return secondDate;
        },
        funInArray: function(arr,obj){
            if(arr){
                var i = arr.length;
                while (i--) {
                    if (arr[i] === obj) {
                        return true;
                    }
                }
            }
            return false;
        }
    }
}();

$(function(){
	CapcitySchedul.init();
});