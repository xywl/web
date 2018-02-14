var PageGrapInfoAudit = function(){
    return {
        defaultOption: {
            basePath:"",
            grapListGrid : null,
            checkListGrid: null
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.grapListGrid = mini.get("grapListGrid");
            this.checkListGrid = mini.get("checkListGrid");
            this.grapListGrid.setUrl(PageMain.defaultOption.httpUrl + "/leftDispatchInfo/getList");
            this.checkListGrid.setUrl(PageMain.defaultOption.httpUrl + "/reservation/getList");
            this.funSearch();
        },
        funSearch : function()
        {
            var customerForm = new mini.Form("customerForm");
            this.grapListGrid.load(customerForm.getData());
        },
        funReset : function()
        {
            var customerForm = new mini.Form("customerForm");
            customerForm.setData();
            mini.get("queryParamFlag").setValue("1");
            this.grapListGrid.load(customerForm.getData());
        },
        funRendererBookETime: function(e)
        {
            return PageMain.funStrToDate(e.value);
        },
        funRendererPreArriveTime: function(e)
        {
            return PageMain.funStrToDate(e.value);
        },
        funOnDrawCell: function(e)  //计算预结算金额
        {
            var record = e.record;
            var grid = e.sender;

            if (e.field == "preSettleAmount") {
                var actualTransferPrice = record.actualTransferPrice;
                var preActualLoad = record.preActualLoad;
                if (actualTransferPrice == undefined || preActualLoad == undefined) {
                    e.cellHtml = '';
                    e.record.preSettleAmount = '';
                } else {
                    //e.cellHtml = actualTransferPrice * preActualLoad;
                    e.cellHtml = PageGrapInfoAudit.funNumMulti(actualTransferPrice, preActualLoad);
                    e.record.preSettleAmount = PageGrapInfoAudit.funNumMulti(actualTransferPrice, preActualLoad);
                }
            }
        },
        // funOperRenderer : function(e)
        // {
        //     return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="审核" href="javascript:PageGrapInfoAudit.funAudit()"></a>';
        // },
        // funAudit : function()
        // {
        //     var row = this.grapListGrid.getSelected();
        //     this.funSearchDispatchInfo(row.customerTaskFlowId);
        //     this.checkListGrid.load({leftDispatchId: row.id, status: row.status});
        //     //var paramData = {action: "oper", row:row, title:"审核详细"};
        //     //this.funOpenInfo(paramData);
        // },
        funOnSelectionChanged: function(e)
        {
            var grapListGrid = e.sender;
            var row = grapListGrid.getSelected();
            PageGrapInfoAudit.funSearchDispatchInfo(row.customerTaskFlowId);
            PageGrapInfoAudit.checkListGrid.load({leftDispatchId: row.id, status: row.status, queryParamFlag: 1});
        },
        funSearchDispatchInfo: function(id)
        {
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/leftDispatchInfo/getLeftDispatch4Check", {"customerTaskFlowId": id}, function (data) {
                if (data.success)
                {
                    console.log(data);
                    var result = data.data.list[0];
                    $('#goodsName').html(result.goodsName);
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
        funSubmitData: function()
        {
            var checkListGrid = PageGrapInfoAudit.checkListGrid
            checkListGrid.validate();  //表格验证
            if (checkListGrid.isValid() == false) {
                //alert("请校验输入单元格内容");
                var error = checkListGrid.getCellErrors()[0];
                checkListGrid.beginEditCell(error.record, error.column);
                return;
            }
            var param = {};
            var orderListData = this.grapListGrid.getSelected();
            if (!orderListData)
            {
                mini.alert("请选择临调订单");
                return;
            }
            var plans = [];
            var submitData = checkListGrid.getChanges();
            for (var i = 0; i < submitData.length; i++) {
                var plansData = {};
                plansData.id = submitData[i].id;
                plansData.preActualLoad = submitData[i].preActualLoad;
                plansData.actualTransferPrice = submitData[i].actualTransferPrice;
                plansData.preSettleAmount = submitData[i].preSettleAmount;
                plansData.leftDispatchId = submitData[i].leftDispatchId;
                plansData.dispatchId = submitData[i].dispatchId;
                plansData.customerTaskFlowId = submitData[i].customerTaskFlowId;
                plansData.checkStatus = submitData[i].checkStatus;
            }
            plans.push(plansData);
            param.leftDispatchId = submitData.leftDispatchId;
            param.plans = plans;
            console.log(param);
            
        }
        // funOpenInfo : function(paramData)  // 弹框审核
        // {
        //     var me = this;
        //     mini.open({
        //         url: PageMain.funGetRootPath() + "/pages/jk/grabinfoAudit_details.html",
        //         title: paramData.title,
        //         width: 850,
        //         height: 570,
        //         onload:function(){
        //             var iframe=this.getIFrameEl();
        //             iframe.contentWindow.PageGrapInfoAuditAdd.funSetData(paramData);
        //         },
        //         ondestroy:function(action){
        //             me.grapListGrid.reload();
        //         }
        //     })
        // }
    }
}();

$(function(){
    PageGrapInfoAudit.init();
});