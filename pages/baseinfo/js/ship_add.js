
var PageShipAdd = function(){
    return {
        defaultOption: {
            basePath:"",
            action : "",
            shipForm : null
            
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.shipForm = new mini.Form("shipFormAdd");
            mini.get("shipType").setData([{id:1, name:"普通货船"},{id:2, name:"多用途船"}]);
            mini.get("runType").setData([{id:1, name:"集散两用"},{id:2, name:"集装箱"},{id:3, name:"砂石"},{id:99, name:"其他"}]);
            mini.get("sailingArea").setData([{id:1, name:"A级"},{id:2, name:"B级"},{id:4, name:"C级"}]);
            mini.get("fitStatus").setData([{id:1, name:"是"},{id:2, name:"否"}]);
            mini.get("status").setData([{id:1, name:"启用"},{id:2, name:"禁用"}]);
        },
        funSetData : function(data)
        {
        	var row = data.row;
        	this.action = data.action;
             if (row.sailingArea == 3)
            {
                row.sailingArea = "1,2";
            } else if (row.sailingArea == 5)
            {
                row.sailingArea = "1,4";
            } else if (row.sailingArea == 6)
            {
                row.sailingArea = "2,4";
            } else if (row.sailingArea == 7)
            {
                row.sailingArea = "1,2,4";
            }
            mini.get("shipLevel").setData(data.shipLevel);
            mini.get("shipFlag").setData(data.shipFlag);
            if(row.runType="0")
            {
                row.runType="";
            }
            if(row.shipLevel =="0"){
                row.shipLevel = "";
            }
            if(row.rebuildDate =="1900-01-01"){
                row.rebuildDate = "";
            }
            if(row.insuranceDate =="1900-01-01"){
                row.insuranceDate = "";
            }
            if(row.checkDate =="1900-01-01"){
                row.checkDate = "";
            }
            if(row.repairDate =="1900-01-01"){
                row.repairDate = "";
            }
        	this.shipForm.setData(row);
            if(this.action == "oper")
            {
                mini.get("layout_ship_add").updateRegion("south", { visible: false });//$(".mini-toolbar").hide();
                var fields = this.shipForm.getFields();
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
        	this.shipForm.validate();
            if (!this.shipForm.isValid())
            {
                 var errorTexts = form.getErrorTexts();
                 for (var i in errorTexts) 
                 {
                     mini.alert(errorTexts[i]);
                     return;
                 }
            }
            var me = this;
            var obj = this.shipForm.getData(true);
            var arr =obj.sailingArea.split(",") , sum = 0;
            for (var i=0 ; i<arr.length ; i++){
                sum += parseInt(arr[i])*1;
            }
            obj.sailingArea = sum;
            $.ajax({
               url : PageMain.defaultOption.httpUrl + "/ship/" + me.action + "?a="+Math.random(),
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
    PageShipAdd.init();
});