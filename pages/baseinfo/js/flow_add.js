
var PageFlowAdd = function(){
    return {
        defaultOption: {
            basePath:"",
            action : "",
            flowForm : null,
            portData:[]
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.flowForm = new mini.Form("flowFormAdd");
            mini.get("status").setData([{id:1, name:"启用"},{id:2, name:"禁用"}])
            mini.get("sailingArea").setData([{id:1, name:"A级"},{id:2, name:"B级"},{id:4, name:"C级"}])
            this.funInitPortDate();
        },
        funSetData : function(data)
        {
        	var row = data.row;
        	this.action = data.action;
            mini.get("waterLevelPoint").setData(row.waterFly)
            row.sailingArea = PageMain.funDealComBitInfo(row.sailingArea, 4);
        	this.flowForm.setData(row);
            if(this.action == "oper")
            {
                mini.get("layout_flow_add").updateRegion("south", { visible: false });//$(".mini-toolbar").hide();
                var fields = this.flowForm.getFields();
                for (var i = 0, l = fields.length; i < l; i++)
                {
                    var c = fields[i];
                    if (c.setReadOnly) c.setReadOnly(true);     //只读
                    if (c.setIsValid) c.setIsValid(true);      //去除错误提示
                }
            }
        },
        funOpenLngLat : function ()
        {
            var me = this;
            mini.open({
                url: PageMain.funGetRootPath() + "/pages/jk/circle.html",
                title: "地图",
                width: 950,
                height: 500,
                onload:function(){
                    //var iframe=this.getIFrameEl();
                    //iframe.contentWindow.PageFlowAdd.funSetData(paramData);
                },
                ondestroy:function(action){
                    if(action != "close")
                    {
                        var iframe = this.getIFrameEl();
                        mini.get("longitude").focus();
                        mini.get("longitude").setValue(action.lng);
                        mini.get("latitude").setValue(action.lat);
                        mini.get("radius").setValue(action.radius);
                        mini.get("description").focus();
                    }
                }
            })
        },
        funSave : function()
        {
        	this.flowForm.validate();
            if (!this.flowForm.isValid())
            {
                 var errorTexts = form.getErrorTexts();
                 for (var i in errorTexts) 
                 {
                     mini.alert(errorTexts[i]);
                     return;
                 }
            }
            
            var me = this;
            var obj = this.flowForm.getData(true);
            var sailingArea = obj.sailingArea.split(",");
            var tmp = 0;
            sailingArea.forEach(function (obj) {
                tmp += parseInt(obj);
            });

            obj.sailingArea = tmp;

            $.ajax({
               url : PageMain.defaultOption.httpUrl + "/flow/" + me.action + "?a="+Math.random(),
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
        },
        funInitPortDate:function () {
            $.ajax({
                url : PageMain.defaultOption.httpUrl + "/port/getList",
                type : 'POST',
                dataType: 'json',
                success: function (data)
                {
                    if (data.success)
                    {
                        PageFlowAdd.portData = data.data.list;
                        mini.get("startPortId").setData(PageFlowAdd.portData);
                        mini.get("endPortId").setData(PageFlowAdd.portData);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown)
                {
                    PageMain.funShowMessageBox("获取船号失败");
                }
            });
        }
    }
}();

$(function(){
	PageFlowAdd.init();
});