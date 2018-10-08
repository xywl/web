
var PageShipTaskAdd = function(){
    return {
        defaultOption: {
            basePath:"",
            action : "",
            dispatchShipFly:[],
            dispatchUnDealShipFly:[],
            PortFly:[],
            globelRow : [],
            operType:"",
            goodsTypeFly : [{id:1, name:"熟料"},{id:2, name:"散装"},{id:3, name:"集装箱"}],
            sailingStatusTypeFly : [{id:1, name:"空船到港"},{id:2, name:"空船装后"},{id:3, name:"重船离港"},{id:4, name:"重船到港"},{id:5, name:"重船卸后"}],
            sailingInfoForm : null

        },
        init :function ()
        {
            mini.parse();

            this.basePath = PageMain.basePath;
            this.shipTaskFormAdd = new mini.Form("shipTaskFormAdd");
        },
        funSetData : function(data)
        {
            var row = data.row;
            this.operType = data.operType;
            this.action = data.action;
            mini.get("orderId").setValue(row.dispatchId);
            mini.get("shipNo").setValue(row.shipNo);
            mini.get("shipId").setValue(row.shipId);
            if (this.operType == "kcdgdj")
            {
                mini.get("status").setValue("1");
                $("tr[name='kczhdj']").hide();
                $("tr[name='zclgdj']").hide();
                $("tr[name='zcdgdj']").hide();
                $("tr[name='zcxhdj']").hide();
            }
            else if(this.operType == "kczhdj")
            {
                mini.get("status").setValue("2");
                mini.get("id").setValue(row.sailingId);
                mini.get("arriveSPortTime").setValue(PageMain.funStrToDate(row.actualArriveSPortTime));
                $("tr[name='zclgdj']").hide();
                $("tr[name='zcdgdj']").hide();
                $("tr[name='zcxhdj']").hide();
            }
            else if(this.operType == "zclgdj")
            {
                mini.get("status").setValue("3");
                mini.get("id").setValue(row.sailingId);
                mini.get("arriveSPortTime").setValue(PageMain.funStrToDate(row.actualArriveSPortTime));

                mini.get("loadTime").setValue(PageMain.funStrToDate(row.actualLoadTime));
                mini.get("loadWeight").setValue(row.actualLoadWeight);
                mini.get("loadCentiPic").setValue(row.loadCentiPic);
                mini.get("bucklePrice").setValue(row.bucklePrice);
                mini.get("cutWire").setValue(row.cutWire);
                mini.get("cutOther").setValue(row.cutOther);
                mini.get("cutOtherDes").setValue(row.cutOtherDes);
                mini.get("loadExPic").setValue(row.loadExPic);
                mini.get("loadExDes").setValue(row.loadExDes);

                $("tr[name='zcdgdj']").hide();
                $("tr[name='zcxhdj']").hide();
            }
            else if (this.operType == "zcdgdj")
            {
                mini.get("status").setValue("4");
                mini.get("id").setValue(row.sailingId);

                mini.get("arriveSPortTime").setValue(PageMain.funStrToDate(row.actualArriveSPortTime));

                mini.get("loadTime").setValue(PageMain.funStrToDate(row.actualLoadTime));
                mini.get("loadWeight").setValue(row.actualLoadWeight);
                mini.get("loadCentiPic").setValue(row.loadCentiPic);
                mini.get("bucklePrice").setValue(row.bucklePrice);
                mini.get("cutWire").setValue(row.cutWire);
                mini.get("cutOther").setValue(row.cutOther);
                mini.get("cutOtherDes").setValue(row.cutOtherDes);
                mini.get("loadExPic").setValue(row.loadExPic);
                mini.get("loadExDes").setValue(row.loadExDes);

                mini.get("departPortTime").setValue(PageMain.funStrToDate(row.leaveSPortTime));
                mini.get("preArriveEPortTime").setValue(PageMain.funStrToDate(row.preArriveEPortTime));


                $("tr[name='zcxhdj']").hide();

            }
            else if (this.operType == "zcxhdj")
            {
                mini.get("status").setValue("5");
                mini.get("id").setValue(row.sailingId);

                mini.get("id").setValue(row.sailingId);

                mini.get("arriveSPortTime").setValue(PageMain.funStrToDate(row.actualArriveSPortTime));

                mini.get("loadTime").setValue(PageMain.funStrToDate(row.actualLoadTime));
                mini.get("loadWeight").setValue(row.actualLoadWeight);
                mini.get("loadCentiPic").setValue(row.loadCentiPic);
                mini.get("bucklePrice").setValue(row.bucklePrice);
                mini.get("cutWire").setValue(row.cutWire);
                mini.get("cutOther").setValue(row.cutOther);
                mini.get("cutOtherDes").setValue(row.cutOtherDes);
                mini.get("loadExPic").setValue(row.loadExPic);
                mini.get("loadExDes").setValue(row.loadExDes);

                mini.get("departPortTime").setValue(PageMain.funStrToDate(row.leaveSPortTime));
                mini.get("preArriveEPortTime").setValue(PageMain.funStrToDate(row.preArriveEPortTime));

                mini.get("actualArriveEPortTime").setValue(PageMain.funStrToDate(row.actualArriveEPortTime));

                mini.get("dischargeTime").setValue(PageMain.funStrToDate(row.dischargeTime));
                mini.get("dischargeWeight").setValue(row.dischargeWeight);
                mini.get("dischargeDelayFee").setValue(row.dischargeDelayFee);
                mini.get("allowance").setValue(row.allowance);
                mini.get("dischargeCentiPic").setValue(row.dischargeCentiPic);
                mini.get("dischargeExpic").setValue(row.dischargeExpic);
                mini.get("dischargeExDes").setValue(row.dischargeExDes);

            }

            PageShipTaskAdd.defaultOption.globelRow = row;
        },
        funSave : function()
        {
            this.shipTaskFormAdd.validate();
            if (!this.shipTaskFormAdd.isValid())
            {
                var errorTexts = form.getErrorTexts();
                for (var i in errorTexts)
                {
                    mini.alert(errorTexts[i]);
                    return;
                }
            }

            var me = this;
            var obj = this.shipTaskFormAdd.getData(true);

            obj.arriveSPortTime = PageMain.funGetTimeMiniInfo("arriveSPortTime");
            obj.loadTime = PageMain.funGetTimeMiniInfo("loadTime");
            obj.preArriveEPortTime = PageMain.funGetTimeMiniInfo("preArriveEPortTime");
            obj.departPortTime = PageMain.funGetTimeMiniInfo("departPortTime");
            obj.actualArriveEPortTime = PageMain.funGetTimeMiniInfo("actualArriveEPortTime");
            obj.dischargeTime = PageMain.funGetTimeMiniInfo("dischargeTime");

            $.ajax({
                url : PageMain.defaultOption.httpUrl + "/sailingInfo/" + me.action + "?a="+Math.random(),
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
        }
    }
}();

$(function(){
    PageShipTaskAdd.init();
});