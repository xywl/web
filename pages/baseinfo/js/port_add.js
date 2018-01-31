
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
                PageMain.funDealDetailInfo("layout_port_add", this.portForm);
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
                    var iframe=this.getIFrameEl();
                    iframe.contentWindow.PageCircle.funSetData({lng:mini.get("longitude").getValue(), lat:mini.get("latitude").getValue(), radius:mini.get("radius").getValue()});
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
            if (PageMain.funDealSubmitValidate(this.portForm))
            {
                return ;
            }

            var me = this;
            var obj = this.portForm.getData(true);
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/port/" + me.action + "?a="+Math.random(), obj, function (data) {
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