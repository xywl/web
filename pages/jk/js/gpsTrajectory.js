/**
 * Created by WCL on 2018/1/20.
 */
var PageMap = function()
{
    return {
        defaultOption:
            {
                basePath: "",
                mapDiv: "",
                mapObj: null,
                btnOperId: null,
                zeroStaus: "00000000",
                btnOperFlag: false,
                GlobalPointIcon: null,
                GlobalStaytimeIcon: null,
                shipStatus: [{id: 1, name: "在线"}, {id: 2, name: "离线"}],
                GlobalShipIcon: null,
                GlobalShipZCIcon: null,
                GlobalShipZCHIcon: null,
                GlobalShipHcon: null,
                GlobalShip0LxIcon: null,
                GlobalShipHLxIcon: null,
                realMarkerFly: [],
                hisInfoWindow: null,
                hisTimeOut: null,
                hisTime: 1000,
                hisPlayFlag: false,
                hisPlayStaue: 1,
                baseInfoWindow: null,
                realFlag: false,
                PortFly: [],
                DangerZoneFly: [],
                DangerZoneSpeedFly: [],
                GlobalShipFly: [],
                PortMapFly: [],
            },

        init: function () {
            var devId = ""
            if (mini.get("in01").getValue() != "undefined") {
                devId = mini.get("in01").getValue();
            }
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/gps/loadGpsReal",{shipNo:mini.get("in02").getText(), online:mini.get("in03").getValue(),taskNo:mini.get("in04").getValue(), devId:devId}, function (data) {
                $("#shipcnt").html(data.length);
                mini.get("flowGrid").setData(data);
                PageMap.defaultOption.realFlag = false;
            });
        },
        // 处理在线状态
        funDealOnlineInfo: function (e) {
            console.log(e.value)
            if (e.value == 1) {
                return "在线";
            }
            return "离线";
        },
        funSearchRealInfo: function () {
            PageMap.defaultOption.realFlag = true;
            console.log(PageMap.defaultOption.GlobalShipFly.length)
            //清空所有船
            PageMap.defaultOption.GlobalShipFly.forEach(function (mObj) {
                mObj.marker.hide();
                mObj.delFlag = true;
            });
            PageMap.funLoadRealInfo();
        },
        funResetSearch: function () {
            mini.get("in01").setValue("");
            mini.get("in02").setValue("");
            mini.get("in03").setValue("");
            mini.get("in04").setValue("");
        },
        funDevChanged: function () {
            mini.get("in02").setValue(mini.get("in01").getValue());
        },
        funShipChanged: function () {
            mini.get("in01").setValue(mini.get("in02").getValue());
        }
    }
}();


$(function(){
    PageMap.init();
});