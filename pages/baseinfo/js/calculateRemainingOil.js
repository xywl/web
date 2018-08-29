
var PageShipOil = function(){
    return {
        defaultOption: {
            basePath:"",
            shipOilGrid : null,
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.shipOilGrid = mini.get("shipOilGrid");
            this.shipOilGrid.setUrl(PageMain.defaultOption.httpUrl + "/shipOil/calculateRemainingOil");
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/shipOil/calculateRemainingOil",{pageSize:100000}, function (data) {
                PageShipOil.defaultOption.shipNoData = data.data.list;
                PageShipOil.funSearch();
            });

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