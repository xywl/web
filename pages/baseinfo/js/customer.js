
var PageCustomer = function(){
    return {
        defaultOption: {
            basePath:"",
            zero :"000000000",
            customerGrid : null
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.customerGrid = mini.get("customerGrid");
            this.customerGrid.setUrl(PageMain.defaultOption.httpUrl + "/customer/getList")
            this.funSearch();
        },
        funSearch : function()
        {
        	var customerForm = new mini.Form("customerForm");
        	this.customerGrid.load(customerForm.getData());
        },
        funReset : function()
        {
        	var customerForm = new mini.Form("customerForm");
            customerForm.setData();
            mini.get("queryParamFlag").setValue("1");
            this.customerGrid.load(customerForm.getData());
        },
        funAdd : function()
        {
        	var paramData = {action: "add", row:{}, title:"新增数据"};
            this.funOpenInfo(paramData);
        },
        funModify : function()
        {
        	var row = this.customerGrid.getSelected();
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
           var mgoodsType = parseInt(e.value).toString(2);
            mgoodsType = PageCustomer.defaultOption.zero.substring(mgoodsType.length) + mgoodsType;
            var tmp = "";
            if (mgoodsType.charAt(8) == "1")
            {
                tmp += "孰料，";
            }

            if (mgoodsType.charAt(7) == "1")
            {
                tmp += "电煤，";
            }

            if (mgoodsType.charAt(6) == "1")
            {
                tmp += "集装箱，";
            }

            if (mgoodsType.charAt(0) == "1")
            {
                tmp += "其他，";
            }

            return tmp.substring(0,tmp.length-1);
        },
        funOperRenderer : function(e)
        {
            return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="详情查看" href="javascript:PageCustomer.funDetail()"></a>';
        },
        funDetail : function()
        {
            var row = this.customerGrid.getSelected();
            var paramData = {action: "oper", row:row, title:"查看详细"};
            this.funOpenInfo(paramData);
        },
        funOpenInfo : function(paramData)
        {
        	var me = this;
        	mini.open({
                url: PageMain.funGetRootPath() + "/pages/baseinfo/customer_add.html",
                title: paramData.title,
                width: 850,
                height: 30 *  11 + 65,
                onload:function(){
                    var iframe=this.getIFrameEl();
                    iframe.contentWindow.PageCustomerAdd.funSetData(paramData);
                },
                ondestroy:function(action){
                	me.customerGrid.reload();
                }
            })
        },
        funDelete : function()
        {
            var row = this.customerGrid.getSelected();
            var me = this;
            if(row)
            {
                mini.confirm("确定要删除这条记录?", "提醒", function (action) {
                    if (action == "ok") 
                    {
                        $.ajax({
                            url : PageMain.defaultOption.httpUrl + "/customer/del",
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
                                        	 me.customerGrid.reload();
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

$(function(){
	PageCustomer.init();
});