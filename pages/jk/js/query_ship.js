
var PageQueryShip = function(){
    return {
        defaultOption: {
            basePath:"",
            action : "",
            shipGrid: null,
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.defaultOption.shipGrid = mini.get("shipGrid");
        },
        funSetData : function(data)
        {
            this.defaultOption.shipGrid.setData(data);
        },
        funRenderer : function (e)
        {
            if("online" == e.field)
            {
                return PageQueryShip.funOnlineInfo(e.value);
            }
            else if ("inOrOut" == e.field)
            {
                return PageQueryShip.funInOrOutInfo(e.value);
            }
            else if ("alarmType" == e.field)
            {
                return PageQueryShip.funAlarmTypeInfo(e.value);
            }
            return "";
        },

        funOnlineInfo : function (val)
        {
            if (val == 0)
            {
                return "离线";
            }
            return "在线";
        },
        funInOrOutInfo : function (val)
        {
            if (val == 0)
            {
                return "出港";
            }
            return "进港";
        },
        funAlarmTypeInfo : function (val)
        {
            if (val == 0)
            {
                return "-";
            }
            return "已报警";
        },
        funCancel : function()
        {
            PageMain.funCloseWindow("cancel");
        }
    }
}();

$(function(){
    PageQueryShip.init();
});