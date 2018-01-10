
var PagePortAdd = function(){
    return {
        defaultOption: {
            basePath:"",
            action : "",
            portForm : null
            
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.portForm = new mini.Form("portFormAdd");
            mini.get("portType").setData([{id:1, name:"集装箱"},{id:2, name:"其它"}])
        },
        funSetData : function(data)
        {
        	var row = data.row;
        	this.action = data.action;
        	this.portForm.setData(row);
            if(this.action == "oper")
            {
                mini.get("layout_port_add").updateRegion("south", { visible: false });//$(".mini-toolbar").hide();
                var fields = this.portForm.getFields();
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
                    //iframe.contentWindow.PagePortAdd.funSetData(paramData);
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
        	this.portForm.validate();
            if (!this.portForm.isValid()) 
            {
                 var errorTexts = form.getErrorTexts();
                 for (var i in errorTexts) 
                 {
                     mini.alert(errorTexts[i]);
                     return;
                 }
            }
            
            var me = this;
            var obj = this.portForm.getData(true);
            $.ajax({
               url : PageMain.defaultOption.httpUrl + "/port/" + me.action + "?a="+Math.random(),
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
	PagePortAdd.init();
});