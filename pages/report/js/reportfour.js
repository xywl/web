var PageReportfour = function(){
    return {
        defaultOption: {
            basePath:"",
            reportSevenGrid1 : null,
            reportSevenGrid2 : null,
            reportSevenGrid3 : null,
            reportSevenGrid4 : null,
            reportSevenGrid5 : null
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.reportSevenGrid1 = mini.get("reportSevenGrid1");
            this.reportSevenGrid1.setUrl(PageMain.defaultOption.httpUrl + "/dispatch/getReportFour2OneList");
            this.reportSevenGrid2 = mini.get("reportSevenGrid2");
            this.reportSevenGrid2.setUrl(PageMain.defaultOption.httpUrl + "/dispatch/getReportFour2TwoList");
            this.reportSevenGrid3 = mini.get("reportSevenGrid3");
            this.reportSevenGrid3.setUrl(PageMain.defaultOption.httpUrl + "/dispatch/getReportFour2ThreeList");
            this.reportSevenGrid4 = mini.get("reportSevenGrid4");
            this.reportSevenGrid4.setUrl(PageMain.defaultOption.httpUrl + "/dispatch/getReportFour2FourList");
            /*PageMain.callAjax(PageMain.defaultOption.httpUrl + "/dispatch/getReportFour2OneList", {queryParamFlag:1, key: '2018-05'}, function (data) {
                console.log(data);
            });
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/dispatch/getReportFour2TwoList", {queryParamFlag:1, key: '2018-05'}, function (data) {
                console.log(data);
            });
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/dispatch/getReportFour2ThreeList", {queryParamFlag:1, key: '2018-05'}, function (data) {
                console.log(data);
            });
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/dispatch/getReportFour2FourList", {queryParamFlag:1, key: '2018-05'}, function (data) {
                console.log(data);
            });*/
            var now   = new Date();
            var month = now.getMonth();
            mini.get("key").setValue(now.getFullYear()+"-"+((month+1).length=1?("0"+(month+1)):(month+1)));
           this.funSearch();
        },
        funSearch : function()
        {
            if(mini.get("key").getFormValue() == null || mini.get("key").getFormValue() == ""){
                PageMain.funShowMessageBox("请填写统计年月");
                return;
            }
        	var reportfourForm = new mini.Form("reportfourForm");
            var postData = reportfourForm.getData();
            postData.key =mini.get("key").getFormValue();

            this.reportSevenGrid1.load(postData);
            this.reportSevenGrid2.load(postData);
            this.reportSevenGrid3.load(postData);
            this.reportSevenGrid4.load(postData);
        },
        funReset : function()
        {

        	var reportfourForm = new mini.Form("reportfourForm");
        	reportfourForm.setData();
        	mini.get("queryParamFlag").setValue("1");

            var postData = reportfourForm.getData();
            var now   = new Date();
            var month = now.getMonth();
            mini.get("key").setValue(now.getFullYear()+"-"+((month+1).length=1?("0"+(month+1)):(month+1)));
            postData.key =mini.get("key").getFormValue();

            this.reportSevenGrid1.load(postData);
            this.reportSevenGrid2.load(postData);
            this.reportSevenGrid3.load(postData);
            this.reportSevenGrid4.load(postData);
        }

    }
}();

$(function(){
    PageReportfour.init();
});