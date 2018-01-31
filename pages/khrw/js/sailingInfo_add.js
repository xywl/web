
var PageSailingInfoAdd = function(){
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
            sailingInfoForm : null
            
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.sailingInfoForm = new mini.Form("sailingInfoFormAdd");
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/sailingInfo/loadDsipatchShip", {}, function (data) {
                PageSailingInfoAdd.defaultOption.dispatchShipFly = data;
                mini.get("shipId").setData(data);
            });



            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/gps/loadPortAll",{}, function (data) {
                PageSailingInfoAdd.defaultOption.PortFly = data;
            });
        },
        funSetData : function(data)
        {
        	var row = data.row;
            this.operType = data.operType;
        	this.action = data.action;
            if (this.action != "add")
            {
                row.arriveSPortTime = PageMain.funStrToDate(row.arriveSPortTime);
                row.loadTime = PageMain.funStrToDate(row.loadTime);
                row.preArriveEPortTime = PageMain.funStrToDate(row.preArriveEPortTime);
                row.departPortTime = PageMain.funStrToDate(row.departPortTime);
                row.actualArriveEPortTime = PageMain.funStrToDate(row.actualArriveEPortTime);
                row.dischargeTime = PageMain.funStrToDate(row.dischargeTime);
            }
            else
            {
                console.log("-----------------")
                console.log(PageSailingInfoAdd.defaultOption.dispatchUnDealShipFly)
                mini.get("shipId").setData(PageSailingInfoAdd.defaultOption.dispatchUnDealShipFly);
            }

            PageSailingInfoAdd.defaultOption.globelRow = row;
            if (this.action == "add")
            {
                PageMain.callAjax(PageMain.defaultOption.httpUrl + "/sailingInfo/loadUnDealDsipatchShip", {}, function (data) {
                    PageSailingInfoAdd.defaultOption.dispatchUnDealShipFly = data;
                    mini.get("shipId").setData(data);
                    PageSailingInfoAdd.funDealSetDataInfo();
                });
            }
            else
            {
                this.funDealSetDataInfo();
            }
        },
        funDealSetDataInfo: function ()
        {
            this.sailingInfoForm.setData(PageSailingInfoAdd.defaultOption.globelRow);
            if (this.action != "add")
            {
                window.setTimeout(function () {
                    PageSailingInfoAdd.funDealShipNoChangeInfo(PageSailingInfoAdd.defaultOption.globelRow.shipId);
                },1000)
            }

            var fields = this.sailingInfoForm.getFields();
            for (var i = 0, l = fields.length; i < l; i++)
            {
                var c = fields[i];
                if (c.setReadOnly) c.setReadOnly(true);     //只读
            }
            if (this.operType == "kqdgdj" || this.operType == "bjkqdgdj")
            {
                mini.get("shipId").setReadOnly(false);
                mini.get("arriveSPortTime").setReadOnly(false);
                mini.get("shipId").required =true;
                mini.get("arriveSPortTime").required =true;
                $("tr[name='kqzhdj']").hide();
                $("tr[name='zqxhsj']").hide();
                $("tr[name='zqdgsj']").hide();
            }
            else if(this.operType == "kqzhdj")
            {
                mini.get("loadTime").setReadOnly(false);
                mini.get("loadWeight").setReadOnly(false);
                mini.get("preArriveEPortTime").setReadOnly(false);
                mini.get("loadTime").required =true;
                mini.get("loadWeight").required =true;
                mini.get("preArriveEPortTime").required =true;
                $("td[name='zqlgsj']").hide();
                $("tr[name='zqdgsj']").hide();
                $("tr[name='zqxhsj']").hide();
            }
            else if (this.operType == "zqlgsj")
            {
                mini.get("departPortTime").setReadOnly(false);
                mini.get("departPortTime").required =true;
                $("tr[name='zqdgsj']").hide();
                $("tr[name='zqxhsj']").hide();
            }
            else if(this.operType == "zqdgsj")
            {
                mini.get("actualArriveEPortTime").setReadOnly(false);
                mini.get("actualArriveEPortTime").required =true;
                $("tr[name='zqxhsj']").hide();
            }
            else if(this.operType == "zqxhsj")
            {
                mini.get("dischargeTime").setReadOnly(false);
                mini.get("dischargeWeight").setReadOnly(false);
                mini.get("dischargeDelayFee").setReadOnly(false);
                mini.get("allowance").setReadOnly(false);
                mini.get("description").setReadOnly(false);

                mini.get("dischargeTime").required =true;
                mini.get("dischargeWeight").required =true;
                mini.get("dischargeDelayFee").required =true;
                mini.get("allowance").required =true;
            }
        },
        funShipNoChangeInfo : function ()
        {
            var shipId = mini.get("shipId").getValue();
            PageSailingInfoAdd.funDealShipNoChangeInfo(shipId);
        },
        funDealShipNoChangeInfo : function (shipId)
        {
            PageSailingInfoAdd.defaultOption.dispatchShipFly.forEach(function (obj)
            {
                if(obj.shipId == shipId)
                {
                    obj.preArriveTime = PageMain.funStrToDate(obj.preArriveTime);
                    PageSailingInfoAdd.defaultOption.goodsTypeFly.forEach(function (goodObj) {
                        if (goodObj.id == obj.goodsType)
                        {
                            obj.goodsType = goodObj.name;
                        }
                    });

                    PageSailingInfoAdd.defaultOption.PortFly.forEach(function (portObj) {
                        if (portObj.id == obj.startPortId)
                        {
                            obj.startPortId = portObj.name;
                        }
                        else if (portObj.id == obj.endPortId)
                        {
                            obj.endPortId = portObj.name;
                        }
                    })
                    obj.loadTime = mini.get("loadTime").getValue();
                    obj.loadWeight = mini.get("loadWeight").getValue();
                    obj.preArriveEPortTime = mini.get("preArriveEPortTime").getValue();
                    obj.arriveSPortTime = mini.get("arriveSPortTime").getValue();
                    obj.departPortTime = mini.get("departPortTime").getValue();
                    obj.actualArriveEPortTime = mini.get("actualArriveEPortTime").getValue();
                    obj.dischargeTime = mini.get("dischargeTime").getValue();
                    obj.dischargeWeight = mini.get("dischargeWeight").getValue();
                    obj.dischargeDelayFee = mini.get("dischargeDelayFee").getValue();
                    obj.allowance = mini.get("allowance").getValue();
                    obj.description = mini.get("description").getValue();
                    obj.id = mini.get("id").getValue();
                    PageSailingInfoAdd.sailingInfoForm.setData(obj)
                    return;
                }
            })
        },
        funSave : function()
        {
        	this.sailingInfoForm.validate();
            if (!this.sailingInfoForm.isValid()) 
            {
                 var errorTexts = form.getErrorTexts();
                 for (var i in errorTexts) 
                 {
                     mini.alert(errorTexts[i]);
                     return;
                 }
            }
            
            var me = this;
            var obj = this.sailingInfoForm.getData(true);
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
	PageSailingInfoAdd.init();
});