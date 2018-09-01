
var PageShipOil = function(){
    return {
        defaultOption: {
            basePath:"",
            shipOilGrid : null,
            shipNoData:[],
            disIdData:[]
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.shipOilGrid = mini.get("shipOilGrid");
            this.shipOilGrid.setUrl(PageMain.defaultOption.httpUrl + "/shipOil/calculateRemainingOil");
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/ship/getList",{pageSize:100000}, function (data) {
                PageShipOil.defaultOption.shipNoData = data.data.list;
                PageShipOil.funSearch();
            });
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/dispatch/loadDispatchInfo",{key:null}, function (data) {
                PageShipOil.defaultOption.disIdData = data;
                //mini.get("key").setData(data);
            });

        },
        funShipIdRenderer : function (e)//船号转码
        {
            for(var nItem = 0; nItem < PageShipOil.defaultOption.shipNoData.length; nItem++)
            {

                if(e.value == PageShipOil.defaultOption.shipNoData[nItem].id)
                {
                    return PageShipOil.defaultOption.shipNoData[nItem].shipNo;
                }
            }
            return e.value;
        },
        funSearch : function()
        {
            var shipOilForm = new mini.Form("shipOilForm");
            this.shipOilGrid.load(shipOilForm.getData().shipId);
        },
        funReset : function()
        {
            var shipOilForm = new mini.Form("shipOilForm");
            shipOilForm.setData();
            mini.get("queryParamFlag").setValue("1");
            this.shipOilGrid.load(shipOilForm.getData());
        }
    }
}();

$(function(){
	PageShipOil.init();
});