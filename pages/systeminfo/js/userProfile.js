
var PageUserProfile = function(){
    return {
        defaultOption: {
            basePath:"",
            roleTree:null,
            dataDictFly:[],
            userProfileGrid : null
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.defaultOption.roleTree = mini.get("roleTree");
            this.userProfileGrid = mini.get("userProfileGrid");
            this.userProfileGrid.setUrl(PageMain.defaultOption.httpUrl + "/user/getList");
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/roles/getList", {pageIndex:0, pageSize:1000000000, queryParamFlag:1}, function (data) {
                if (data.success)
                {
                    PageUserProfile.defaultOption.roleTree.setData(data.data);
                }
            });
            PageMain.callAjax(PageMain.defaultOption.httpUrl +"/gps/loadDataDict", {code:"departMent"}, function (data) {
                PageUserProfile.defaultOption.dataDictFly = data;
            })
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
            paramData.row.dataDictFly = this.defaultOption.dataDictFly;
            mini.open({
                url: PageMain.funGetRootPath() + "/pages/systeminfo/userProfile_add.html",
                title: paramData.title,
                width: 650,
                height: 30 *  9 + 65,
                onload:function(){
                    var iframe=this.getIFrameEl();
                    iframe.contentWindow.PageUserProfileAdd.funSetData(paramData);
                },
                ondestroy:function(action){
                    me.userProfileGrid.reload();
                }
            })
        },
        funSetRole : function ()
        {
            var row = this.userProfileGrid.getSelected();
            if(row)
            {
                var roleIds = this.defaultOption.roleTree.getValue();
                PageMain.callAjax(PageMain.defaultOption.httpUrl + "/userRoles/addfly", {roleIds:roleIds, userId:row.id}, function (data) {
                    if (data.success)
                    {
                        PageMain.funShowMessageBox("分配成功")
                    }
                });
            }
            else
            {
                PageMain.funShowMessageBox("请选择一条角色记录")
            }
        },
        funSelectionChanged : function ()
        {
            var record = PageUserProfile.userProfileGrid.getSelected();
            if(record)
            {
                PageMain.callAjax(PageMain.defaultOption.httpUrl + "/userRoles/loadRolesByUserId", {userId:record.id}, function (data) {
                    var tmp = "";
                    for(var nItem=0; nItem<data.length; nItem ++)
                    {
                        if(tmp != "")
                        {
                            tmp += ",";
                        }
                        tmp += data[nItem].roleId;
                    }
                    PageUserProfile.defaultOption.roleTree.setValue(tmp);
                });
            }
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
                            url : PageMain.defaultOption.httpUrl + "/user/delUser",
                            type: 'POST',
                            data: row,
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

    //转换部门
    if("department" == field){
        for(var nItem =0; nItem < PageUserProfile.defaultOption.dataDictFly.length; nItem++)
        {
            if(e.value == PageUserProfile.defaultOption.dataDictFly[nItem].id)
            {
                return PageUserProfile.defaultOption.dataDictFly[nItem].name;
            }
        }
        return "";
    }
    return result;
}

$(function(){
    PageUserProfile.init();
});