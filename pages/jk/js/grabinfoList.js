
var PageGrapInfoAudit = function(){
    return {
        defaultOption: {
            basePath:"",
            grapListGrid : null,
            checkListGrid: null
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.grapListGrid = mini.get("grapListGrid");
            this.checkListGrid = mini.get("checkListGrid");
            this.grapListGrid.setUrl(PageMain.defaultOption.httpUrl + "/leftDispatchInfo/getList");
            this.checkListGrid.setUrl(PageMain.defaultOption.httpUrl + "/reservation/getList");
            this.funSearch();
        },
        funSearch : function()
        {
            var customerForm = new mini.Form("customerForm");
            this.grapListGrid.load(customerForm.getData());
        },
        funReset : function()
        {
            var customerForm = new mini.Form("customerForm");
            customerForm.setData();
            mini.get("queryParamFlag").setValue("1");
            this.grapListGrid.load(customerForm.getData());
        },
        funRendererBookETime: function(e)
        {
            return PageMain.funStrToDate(e.value);
        },
        funRendererType : function (e)
        {
            if (e.value == 1)
            {
                return "长期"
            }
            else if (e.value == 2)
            {
                return "临时"
            }
            return e.value;
        },
        funRendererGoodsType : function (e)
        {
            if (e.value == 1)
            {
                return "孰料"
            }
            else if (e.value == 2)
            {
                return "电煤"
            }
            else if (e.value == 3)
            {
                return "集装箱"
            }
            else if (e.value == 4)
            {
                return "其他"
            }
            return e.value;
        },
        funOperRenderer : function(e)
        {
            return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="审核" href="javascript:PageGrapInfoAudit.funAudit()"></a>';
        },
        funAudit : function()
        {
            var row = this.grapListGrid.getSelected();
            this.funSearchDispatchInfo(row.customerTaskFlowId);
            this.checkListGrid.load({leftDispatchId: row.id, status: row.status});
            //var paramData = {action: "oper", row:row, title:"审核详细"};
            //this.funOpenInfo(paramData);
        },
        funSearchDispatchInfo: function(id)
        {
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/leftDispatchInfo/getLeftDispatch4Check", {"customerTaskFlowId": id}, function (data) {
                if (data.success)
                {
                    console.log(data);
                    var result = data.data.list[0];
                    $('#goodsName').html(result.goodsName);
                }
                else
                {
                    PageMain.funShowMessageBox(data.msg);
                }
            });
        }
        // funOpenInfo : function(paramData)  // 弹框审核
        // {
        //     var me = this;
        //     mini.open({
        //         url: PageMain.funGetRootPath() + "/pages/jk/grabinfoAudit_details.html",
        //         title: paramData.title,
        //         width: 850,
        //         height: 570,
        //         onload:function(){
        //             var iframe=this.getIFrameEl();
        //             iframe.contentWindow.PageGrapInfoAuditAdd.funSetData(paramData);
        //         },
        //         ondestroy:function(action){
        //             me.grapListGrid.reload();
        //         }
        //     })
        // }
    }
}();

$(function(){
    PageGrapInfoAudit.init();
});