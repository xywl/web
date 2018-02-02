
var PageLeftDispatchInfoAdd = function(){
    return {
        defaultOption: {
            basePath:"",
            action : "",
            leftDispatchInfoForm : null,
            infoData:[]


        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.leftDispatchInfoForm = new mini.Form("leftDispatchInfoFormAdd");
            mini.get("status").setData([{id:1, name:"待发布"},{id:2, name:"已发布"},{id:3, name:"已取消"}])
            mini.get("taskStatus").setData([{id:0, name:"未开始"},{id:1, name:"部分完成"},{id:2, name:"已完成"}])
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/dispatch/getCustomerTaskFlowList", {pageIndex:0, pageSize:1000000000, queryParamFlag:1} , function (data) {
                if(data.success)
                {
                    PageLeftDispatchInfoAdd.defaultOption.infoData = data.data;
                    mini.get("customerTaskFlowId").setData(data.data);
                }
            });
            //this.funInitPortDate();
        },
        funBookSTime : function (e)
        {
            PageMain.funDateOperInfo(e, "bookETime", "gt");
        },
        funBookETime : function (e)
        {
            PageMain.funDateOperInfo(e, "bookSTime", "lt");
        },
        funCustomerTaskFlowIdInfo : function (customerTaskFlowId)
        {
            PageLeftDispatchInfoAdd.defaultOption.infoData.forEach(function (mObj) {
                if(customerTaskFlowId == mObj.id)
                {
                    mini.get("loadingTime").setValue(PageMain.funStrToDate(mObj.loadingTime));
                    mini.get("goodsName").setValue(mObj.goodsName);
                    mini.get("leftWeight").setValue(mObj.leftWeight);
                    mini.get("startPortName").setValue(mObj.startPortName);
                    mini.get("endPortName").setValue(mObj.endPortName);
                    mini.get("customerName").setValue(mObj.customerName);
                    mini.get("flowName").setValue(mObj.flowName);
                    mini.get("loadingTime").setValue(mObj.loadingTime);
                    return;
                }
            });
        },
        funCustomerTaskFlowId : function ()
        {
            var customerTaskFlowId = mini.get("customerTaskFlowId").getValue();
            PageLeftDispatchInfoAdd.funCustomerTaskFlowIdInfo(customerTaskFlowId);
        },
        funSetData : function(data)
        {
            var row = data.row;
            this.action = data.action;

            if (this.action != "add")
            {
                row.bookSTime = PageMain.funStrToDate(row.bookSTime);
                row.bookETime = PageMain.funStrToDate(row.bookETime);

                window.setTimeout(function () {
                    PageLeftDispatchInfoAdd.funCustomerTaskFlowIdInfo(row.customerTaskFlowId);
                }, 500);
            }

            this.leftDispatchInfoForm.setData(row);
            if (this.action == "add")
            {
                mini.get("status").select(1)
                mini.get("taskStatus").select(0)
            }
            if(this.action == "oper")
            {
                mini.get("layout_leftDispatchInfo_add").updateRegion("south", { visible: false });//$(".mini-toolbar").hide();
                var fields = this.leftDispatchInfoForm.getFields();
                for (var i = 0, l = fields.length; i < l; i++)
                {
                    var c = fields[i];
                    if (c.setReadOnly) c.setReadOnly(true);     //只读
                    if (c.setIsValid) c.setIsValid(true);      //去除错误提示
                }
            }
        },
        funSave : function()
        {
            if (PageMain.funDealSubmitValidate(this.leftDispatchInfoForm))
            {
                return;
            }

            if(mini.get("bookSTime").getValue().getTime() > mini.get("bookETime").getValue().getTime())
            {
                PageMain.funShowMessageBox("预约抢单有效开始时间不能大于截止时间");
                return ;
            }
            else if (mini.get("minShipWeight").getValue() > mini.get("maxShipWeight").getValue())
            {
                PageMain.funShowMessageBox("最小船舶吨位不能大于最大船舶吨位");
                return ;
            }

            var me = this;
            var obj = this.leftDispatchInfoForm.getData(true);
            obj.bookSTime = mini.get("bookSTime").getValue().getTime()/1000;
            obj.bookETime = mini.get("bookETime").getValue().getTime()/1000;
            $.ajax({
                url : PageMain.defaultOption.httpUrl + "/leftDispatchInfo/" + me.action + "?a="+Math.random(),
                type : 'POST',
                data : obj,
                dataType: 'json',
                success: function (data)
                {
                    if (data.success)
                    {
                        mini.alert("操作成功", "提醒", function(){
                            if(data.success)
                            {
                                PageMain.funCloseWindow("save");
                            }
                        });
                    }
                    else
                    {
                        PageMain.funShowMessageBox(data.msg);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown)
                {
                    PageMain.funShowMessageBox("操作出现异常");
                }
            });
        },
        funCancel : function()
        {
            PageMain.funCloseWindow("cancel");
        }/*,
        funInitPortDate:function () {
            $.ajax({
                url : PageMain.defaultOption.httpUrl + "/customerTaskFlow/getList",
                type : 'POST',
                dataType: 'json',
                success: function (data)
                {
                    if (data.success)
                    {
                        PageLeftDispatchInfoAdd.infoData = data.data.list;
                        mini.get("taskNo").setData(PageLeftDispatchInfoAdd.infoData);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown)
                {
                    PageMain.funShowMessageBox("获取客户任务单号失败");
                }
            });
        }*/
    }
}();

$(function(){
    PageLeftDispatchInfoAdd.init();
});