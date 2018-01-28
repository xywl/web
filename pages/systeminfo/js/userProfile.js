
var PageUserProfile = function(){
    return {
        defaultOption: {
            basePath:"",
            userProfileGrid : null
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.userProfileGrid = mini.get("userProfileGrid");
            this.userProfileGrid.setUrl(PageMain.defaultOption.httpUrl + "/user/getList");
            this.funSearch();
        },
        funSearch : function()
        {
            var userProfileForm = new mini.Form("userProfileForm");
            this.userProfileGrid.load(userProfileForm.getData());
        },
        funReset : function()
        {
            var userProfileForm = new mini.Form("userProfileForm");
            userProfileForm.setData();
            mini.get("queryParamFlag").setValue("1");
            this.userProfileGrid.load(userProfileForm.getData());
        },
        funAdd : function()
        {
            var paramData = {action: "add", row:{}, title:"新增数据"};
            this.funOpenInfo(paramData);
        },
        funModify : function()
        {
            var row = this.userProfileGrid.getSelected();
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
        funOperRenderer : function(e)
        {
            return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="详情查看" href="javascript:PageUserProfile.funDetail()"></a>';
        },
        funDetail : function()
        {
            var row = this.userProfileGrid.getSelected();
            var paramData = {action: "oper", row:row, title:"查看详细"};
            this.funOpenInfo(paramData);
        },
        funOpenInfo : function(paramData)
        {
            var me = this;
            mini.open({
                url: PageMain.funGetRootPath() + "/pages/systeminfo/userProfile_add.html",
                title: paramData.title,
                width: 650,
                height: 30 *  11 + 65,
                onload:function(){
                    var iframe=this.getIFrameEl();
                    iframe.contentWindow.PageUserProfileAdd.funSetData(paramData);
                },
                ondestroy:function(action){
                    me.userProfileGrid.reload();
                }
            })
        },
        funDelete : function()
        {
            var row = this.userProfileGrid.getSelected();
            var me = this;
            if(row)
            {
                mini.confirm("确定要删除这条记录?", "提醒", function (action) {
                    if (action == "ok")
                    {
                        $.ajax({
                            url : PageMain.defaultOption.httpUrl + "/user/del",
                            type: 'POST',
                            data: {"id": row.id},
                            dataType: 'json',
                            success: function (data)
                            {

                                if (data.success)
                                {
                                    mini.alert("操作成功", "提醒", function(){
                                        if(data.success)
                                        {
                                            me.userProfileGrid.reload();
                                        }
                                    });
                                }
                                else
                                {
                                    PageMain.funShowMessageBox(data.msg);
                                }
                            },
                            error: function ()
                            {
                                PageMain.funShowMessageBox("删除记录失败");
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


function gender(e) {
    var field = e.field;
    var value = e.value;
    var result = "--";

    //转换"状态"
    if("gender" == field){
        if(0 == e.value){
            result = "未知";
        }else if(1 == e.value){
            result = "男";
        }else if (2 == e.value){
            result = "女";
        }
    }
    return result;
}

$(function(){
    PageUserProfile.init();
});