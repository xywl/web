
var PageWaterLevel = function(){
    return {
        defaultOption: {
            basePath:"",
            waterLevelGrid : null
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.waterLevelGrid = mini.get("waterLevelGrid");
            this.waterLevelGrid.setUrl(PageMain.defaultOption.httpUrl + "/waterLevel/getList");
            this.funSearch();
        },
        funSearch : function()
        {
            var waterLevelForm = new mini.Form("waterLevelForm");
            this.waterLevelGrid.load(waterLevelForm.getData());
        },
        funReset : function()
        {
            var waterLevelForm = new mini.Form("waterLevelForm");
            waterLevelForm.setData();
            mini.get("queryParamFlag").setValue("1");
            this.waterLevelGrid.load(waterLevelForm.getData());
        },
        funAdd : function()
        {
            var paramData = {action: "add", row:{}, title:"新增数据"};
            this.funOpenInfo(paramData);
        },
        funModify : function()
        {
            var row = this.waterLevelGrid.getSelected();
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
            return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="详情查看" href="javascript:PageWaterLevel.funDetail()"></a>';
        },
        funDetail : function()
        {
            var row = this.waterLevelGrid.getSelected();
            var paramData = {action: "oper", row:row, title:"查看详细"};
            this.funOpenInfo(paramData);
        },
        funOpenInfo : function(paramData)
        {
            var me = this;
            mini.open({
                url: PageMain.funGetRootPath() + "/pages/baseinfo/waterLevel_add.html",
                title: paramData.title,
                width: 650,
                height: 30 *  11 + 65,
                onload:function(){
                    var iframe=this.getIFrameEl();
                    iframe.contentWindow.PageWaterLevelAdd.funSetData(paramData);
                },
                ondestroy:function(action){
                    me.waterLevelGrid.reload();
                }
            })
        },
        funDelete : function()
        {
            var row = this.waterLevelGrid.getSelected();
            var me = this;
            if(row)
            {
                mini.confirm("确定要删除这条记录?", "提醒", function (action) {
                    if (action == "ok")
                    {
                        $.ajax({
                            url : PageMain.defaultOption.httpUrl + "/waterLevel/del",
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
                                            me.waterLevelGrid.reload();
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


function formatData(e) {
    var field = e.field;
    var value = e.value;
    var result = "--";
    //转换"是否已删除"
    if("isDeleted" == field){
        if(0 == e.value){
            result = "未删除";
        }else if(1 == e.value){
            result = "已删除";
        }
    }

    //转换"创建时间"
    if("created" == field){
        var createdTime = new Date(1000 * value);
        var year = createdTime.getFullYear();
        var mon = createdTime.getMonth() + 1;
        if(10 > mon){
            mon = "0" + mon;
        }

        var sDate = createdTime.getDate();
        if(10 > sDate){
            sDate = "0" + sDate;
        }

        var hours = createdTime.getHours();
        if(10 > hours){
            hours = "0" + hours;
        }

        var min = createdTime.getMinutes();
        if(10 > min){
            min = "0" + min;
        }

        var sec = createdTime.getSeconds();
        if(10 > sec){
            sec = "0" + sec;
        }

        result = year + "-" + mon + "-" + sDate + "  " + hours + ":" + min + ":" + sec;
    }

    //转换"状态"
    if("status" == field){
        if(1 == e.value){
            result = "启用";
        }else if(2 == e.value){
            result = "禁用";
        }
    }
    return result;
}

$(function(){
    PageWaterLevel.init();
});