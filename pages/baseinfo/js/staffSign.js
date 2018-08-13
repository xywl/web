
var PageStaffSign = function(){
    return {
        defaultOption: {
            basePath:"",
            staffSignGrid : null
        },
        init :function ()
        {
            mini.parse();
            var token = $.cookie("token");
            this.basePath = PageMain.basePath;
            this.staffSignGrid = mini.get("staffSignGrid");
            this.staffSignGrid.setUrl(PageMain.defaultOption.httpUrl + "/staffSign/getPage?");
            this.funSearch();
        },
        funSearch : function()
        {
            var staffSignForm = new mini.Form("staffSignForm");
            this.staffSignGrid.load(staffSignForm.getData());
        },
        funReset : function()
        {
            var staffSignForm = new mini.Form("staffSignForm");
            staffSignForm.setData();
            mini.get("queryParamFlag").setValue("1");
            this.staffSignGrid.load(staffSignForm.getData());
        },
        funAdd : function()
        {
            var paramData = {action: "add", row:{}, title:"新增数据"};
            this.funOpenInfo(paramData);
        },
        funModify : function()
        {
            var row = this.staffSignGrid.getSelected();
            if(row)
            {
                var paramData = {action: "modify", row: row, title:"编辑数据"};
                this.funOpenInfo(paramData);
            }
            else
            {
                PageMain.funShowMessageBox("请选择一条记录");
            }
        },
        funEnlargeImage: function(obj)
        {
            var $this = $(obj);
            var src = $this.attr("src");
            var bigImages = [];
            var $imgs = $(".thumbimg");
            for(var i=0; i<$imgs.length; i++){
                var img = {};
                img.url = $imgs[i].src;
                img.index = i;
                $(".thumbimg").eq(i).attr("data-index",i);
                bigImages.push(img);
            }
            window.top.bigpic(src,obj,bigImages);
        },

        funFromDateInfo: function(e)
        {
            return PageMain.funStrToDate(e.value);
        },

        funRendererPhotoPath:function (e) {
            var token = $.cookie("token");
            return '<img style="width: 20px;height:20px;" class="thumbimg" src='+ e.value + "?token="+token +' onclick="PageStaffSign.funEnlargeImage(this)">';
            alert(e.value());
        },

        funFromDateInfo:function(e){
            return PageMain.funStrToDate(e.value);
        },

        funDelete : function()
        {
            var row = this.staffSignGrid.getSelected();
            var me = this;
            if(row)
            {
                mini.confirm("确定要删除这条记录?", "提醒", function (action) {
                    if (action == "ok")
                    {
                        PageMain.callAjax(PageMain.defaultOption.httpUrl + "/staffSign/del?a="+Math.random(), {"id": row.id}, function (data) {
                            if (data.success)
                            {
                                mini.alert("操作成功", "提醒", function(){
                                    if(data.success)
                                    {
                                        me.staffSignGrid.reload();
                                    }
                                });
                            }
                            else
                            {
                                PageMain.funShowMessageBox(data.msg);
                            }
                        });
                    }
                })
            }
            else
            {
                mini.alert("请先选择要删除的记录");
            }
        }
    }
}();

$(function(){
    PageStaffSign.init();
});