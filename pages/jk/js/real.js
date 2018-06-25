/**
 * Created by WCL on 2018/1/20.
 */
var PageMap = function()
{
    return {
        defaultOption:
        {
            basePath : "",
            mapDiv : "",
            mapObj : null,
            btnOperId:null,
            zeroStaus:"00000000",
            btnOperFlag:false,
            GlobalGeocoder : new BMap.Geocoder(),
            GlobalPointIcon:null,
            GlobalStaytimeIcon:null,
            shipStatus : [{id:1, name:"无任务"},{id:2, name:"有任务"}],
            speedFly : [{id:0.5, name:"0.5秒/条"},{id:1, name:"1秒/条"},{id:2, name:"2秒/条"},{id:3, name:"3秒/条"}],
            GlobalLabelOps : {
                offset : new BMap.Size(-40, -20)    //设置文本偏移量
            },
            GlobalLabelOps2:{
                offset : new BMap.Size(20, -20)    //设置文本偏移量
            },
            mInfoWindow : new BMap.InfoWindow(""),
            GlobalLabelStyle:{
                color : "blue",
                fontWeight : "bold",
                borderColor : "grey",
                paddingLeft : "5px",
                paddingRight : "5px",
                fontSize : "12px",
                height : "20px",
                lineHeight : "20px",
                fontFamily:"微软雅黑"
            },
            GlobalLabelStyle2:{
                color : "red",
                fontSize : "12px",
                height : "20px",
                lineHeight : "20px",
                fontFamily:"微软雅黑"
            },
            GlobalShipIcon : null,
            GlobalShipZCIcon : null,
            GlobalShipZCHIcon : null,
            GlobalShipHcon : null,
            GlobalShip0LxIcon : null,
            GlobalShipHLxIcon : null,
            realMarkerFly : [],
            hisInfoWindow:null,
            hisDataFly : [], //轨迹数据
            hisStaytimeFly : [],//轨迹回放时停靠时间
            hisStaytimeMarkerFly : [],//停靠时间的标注
            hisPolyLine : null,//轨迹回放线路
            hisPolyLineFly : [],
            hisMarker:null,//轨迹回放时船
            hisCurrCnt : 0,//轨迹回放的当前记录
            hisSumCnt : 0,//轨迹的总记录数
            hisTimeOut:null,
            hisTime : 1000,
            hisPlayFlag:false,
            hisPlayStaue:1,
            baseInfoWindow:null,
            realFlag : false,
            PortFly : [],
            DangerZoneFly : [],
            DangerZoneSpeedFly : [],
            GlobalShipFly : [],
            PortMapFly:[],
            DangerZoneMapFly:[],
            DangerZoneSpeedMapFly : [],
            SailingFly:[],
            DispatchFly:[],
            cklist:null,
            mRealInterval:null,
            statelist : null,
            showSatateList:"",
            showBoundsFlag : true,
            circleDzwlMarker : null,//电子围栏
            circleDzwlOverlay : null,//电子围栏
            circleDzwlLng : 0,//电子围栏
            circleDzwlLat : 0,//电子围栏
            circleDzwlRadius : 0,//电子围栏
            TipFly:[],// 提醒
            cklistData :[{"id": 1, "text": "港口"},{"id": 2, "text": "航道"},{"id": 3, "text": "危险区域"}],
            statelistData :[{"id": 4, "text": "只显报警船"},{"id": 5, "text": "只显重载船"}],
            //是否显示地图
            isShowCity : false
        },
        //初始化地图
        init : function (mapdiv)
        {
            mini.parse();

            var date = new Date();
            mini.get("in14").setValue(date);
            date.setDate(date.getDate() - 3);
            mini.get("in13").setValue(date.Format("yyyy-MM-dd hh:mm:ss"));

            this.defaultOption.cklist = mini.get("cklist");
            this.defaultOption.cklist.setData(this.defaultOption.cklistData);
            this.defaultOption.cklist.setValue("1,2,3");

            this.defaultOption.statelist = mini.get("statelist");
            this.defaultOption.statelist.setData(this.defaultOption.statelistData);

            this.mapObj = new BMap.Map(mapdiv);
            try{
                var toolbar = new ToolBar({container:'toolsDiv'});
                toolbar.bind(this.mapObj);
            }catch(e){alert(e)}
            // 初始化地图,设置中心点坐标和地图级别
            //this.mapObj.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
            this.mapObj.centerAndZoom("南京",13);
            this.mapObj.addControl(new BMap.MapTypeControl({
                mapTypes:[
                    BMAP_NORMAL_MAP,
                    BMAP_HYBRID_MAP
                ]}));
            // 设置地图显示的城市 此项是必须设置的
            this.mapObj.setCurrentCity("南京");
            //开启鼠标滚轮缩放
            this.mapObj.enableScrollWheelZoom(true);
            this.mapObj.enableDragging();

            //是否显示地图
            if(this.defaultOption.isShowCity)
            {
                this.funShowCity();
            }

            this.defaultOption.GlobalShipIcon = new BMap.Icon("themes/images/shipred0.png", new BMap.Size(40, 40));
            this.defaultOption.GlobalShipZCIcon = new BMap.Icon("themes/images/ship0.png", new BMap.Size(40, 40));
            this.defaultOption.GlobalShipZCHIcon = new BMap.Icon("themes/images/shiph.png", new BMap.Size(57, 57));
            this.defaultOption.GlobalShipHIcon = new BMap.Icon("themes/images/shipredh.png", new BMap.Size(57, 57));

            this.defaultOption.GlobalShip0LxIcon = new BMap.Icon("themes/images/ship0_lx.png", new BMap.Size(40, 40));
            this.defaultOption.GlobalShipHLxIcon = new BMap.Icon("themes/images/shiph_lx.png", new BMap.Size(40, 40));
            this.defaultOption.GlobalPointIcon = new BMap.Icon("themes/images/point.png", new BMap.Size(16, 16));
            this.defaultOption.GlobalStaytimeIcon = new BMap.Icon("themes/images/staytime.png", new BMap.Size(32, 32));

            // 添加带有定位的导航控件
            var navigationControl = new BMap.NavigationControl({
                // 靠左上角位置
                anchor: BMAP_ANCHOR_TOP_LEFT,
                // LARGE类型
                type: BMAP_NAVIGATION_CONTROL_LARGE,
                // 启用显示定位
                enableGeolocation: true
            });
            this.mapObj.addControl(navigationControl);

            /* var me = this;
             window.setInterval(function(){
             me.funTestReal();
             }, 10000);*/

            $(".btn").hover(
                function()
                {
                    if(PageMap.defaultOption.btnOperId != $(this).attr("id"))
                    {
                        PageMap.defaultOption.btnOperId = $(this).attr("id");
                        $(".info").hide();
                    }
                    $(this).find(".info").show();

                    PageMap.defaultOption.btnOperFlag = true;
                    if($(this).attr("id") == "spanreal")
                    {
                        mini.layout();
                    }
                },
                function()
                {
                    var me = this;
                    PageMap.defaultOption.btnOperFlag = false;
                    /*window.setTimeout(function ()
                    {
                        console.log(PageMap.defaultOption.btnOperFlag)
                        console.log( $(this).attr("id"))
                        console.log( PageMap.defaultOption.btnOperId)
                        if (PageMap.defaultOption.btnOperFlag == false && $(this).attr("id") != PageMap.defaultOption.btnOperId)
                        {
                            $(".info").hide()
                        }
                    }, 2000);*/
                }
            );
            $(".close-img").hover(function(){
                $(".close-img").attr("src",PageMain.funGetRootPath() + "/pages/jk/js/mapbaidu/img/map-close.png");
            },function(){
                $(".close-img").attr("src",PageMain.funGetRootPath() + "/pages/jk/js/mapbaidu/img/map-close-1.png");
            });
            $(".close-img").click(function(){
                $(this).parent().hide();
            });
            $("#bncs_select").attr("disabled", "disabled");

            //mini.get("in03").setData(PageMap.defaultOption.shipStatus);
           /* mini.get("speed").setData(PageMap.defaultOption.speedFly);
            mini.get("speed").select(1);*/
            this.funLoadBase();
        },
        funClearDzwlInfo : function ()
        {
            this.mapObj.removeOverlay(this.defaultOption.circleDzwlOverlay);
            this.mapObj.removeOverlay(this.defaultOption.circleDzwlMarker);
        },
        funAddDzwlInfo : function ()
        {
            this.funClearDzwlInfo();
            var drawingManager = new BMapLib.DrawingManager(this.mapObj, {
                isOpen: true, //是否开启绘制模式
                enableDrawingTool: false, //是否显示工具栏
                drawingToolOptions: {
                    anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                    offset: new BMap.Size(5, 5), //偏离值
                    scale: 0.8, //工具栏缩放比例
                    drawingModes : [
                        BMAP_DRAWING_CIRCLE
                    ]
                }
            });

            drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE);
            var me = this;
            drawingManager.addEventListener('circlecomplete', function(e, overlay) {
                me.defaultOption.circleDzwlOverlay = overlay;
                me.defaultOption.circleDzwlMarker = me.funAddMarkerInfo(new BMap.Point(e.getCenter().lng, e.getCenter().lat));
                me.defaultOption.circleDzwlLng = e.getCenter().lng;
                me.defaultOption.circleDzwlLat = e.getCenter().lat;
                me.defaultOption.circleDzwlRadius = parseInt(e.getRadius());
                me.funDzwlSearchShipInfo(overlay);
                drawingManager.close();
            });

        },
        funDzwlSearchShipInfo : function (mClicle)
        {
            var shipFly = [];
            this.defaultOption.GlobalShipFly.forEach(function (mObj) {
                if (BMapLib.GeoUtils.isPointInCircle(mObj.lnglat, mClicle))
                {
                    shipFly.push(mObj.realObj);
                    //tmp +="<span style='padding: 0 12px; width: 120px; display:-moz-inline-box;display:inline-block; '>设备号："+ mObj.devId +"</span><span style='padding: 0 12px; width: 120px; display:-moz-inline-box;display:inline-block; '>船号：" + mObj.shipNo + "</span>"+ (mObj.alarmType == 1?"<span style='padding: 0 12px; width: 120px; display:-moz-inline-box;display:inline-block; '>报警</span>":"")  + (mObj.sailState == 1?"<span style='padding: 0 12px; width: 120px; display:-moz-inline-box;display:inline-block; '>有任务</span>":"") + " <br/>"
                }
            });
            PageMap.funOpenShipInfo(shipFly);
        },
        funOpenShipInfo : function (shipFly)
        {
            var me = this;
            mini.open({
                url: PageMain.funGetRootPath() + "/pages/jk/query_ship.html",
                title: "电子围栏检索",
                width: 800,
                height: 320,
                onload:function(){
                    var iframe=this.getIFrameEl();
                    iframe.contentWindow.PageQueryShip.funSetData(shipFly);
                },
                ondestroy:function(action){
                    me.funClearDzwlInfo();
                }
            })
        },

        funCkListchangedInfo : function ()
        {
           var ckFlys = this.defaultOption.cklist.getValue().split(",");
            this.defaultOption.PortMapFly.forEach(function (obj) {
                obj.circle.hide();
                obj.label.hide();
                obj.circlePoint.hide();
            });

            this.defaultOption.DangerZoneMapFly.forEach(function (obj) {
                obj.circle.hide();
                obj.label.hide();
                obj.circlePoint.hide();
            });

            this.defaultOption.DangerZoneSpeedMapFly.forEach(function (obj) {
                obj.hide();
            });

            ckFlys.forEach(function (ck) {
                if(ck == "1")
                {
                    PageMap.defaultOption.PortMapFly.forEach(function (obj) {
                        obj.circle.show();
                        obj.label.show();
                        obj.circlePoint.show();
                    });
                }
                else if(ck == "3")
                {
                    PageMap.defaultOption.DangerZoneMapFly.forEach(function (obj) {
                        obj.circle.show();
                        obj.label.show();
                        obj.circlePoint.show();
                    });
                }
                else if(ck == "2")
                {
                    PageMap.defaultOption.DangerZoneSpeedMapFly.forEach(function (obj) {
                        obj.show();
                    });
                }
            });
        },
        //设置可见区域
        funSetBoundsInfo : function (data)
        {
            if(PageMap.defaultOption.showBoundsFlag && data.length > 0)
            {
                var maxLng =0, maxLat = 0, minLng = 10000000000, minLat = 10000000000;
                data.forEach(function (mObj)
                {
                    var pfly = PageConvert.funWGS84ToBaidu(mObj.longitude/1000000, mObj.latitude/1000000);

                    if(pfly[0] > maxLng)
                    {
                        maxLng = pfly[0];
                    }
                    if(pfly[1] > maxLat)
                    {
                        maxLat = pfly[1];
                    }
                    if(pfly[0] < minLng)
                    {
                        minLng = pfly[0];
                    }
                    if(pfly[1] < minLat)
                    {
                        minLat = pfly[1];
                    }
                });

                //
                if (maxLng > 0 )
                {
                    var mBounds = new BMap.Bounds(new BMap.Point(maxLng, maxLat),new BMap.Point(minLng, minLat));
                    try {
                        BMapLib.AreaRestriction.setBounds(PageMap.mapObj, mBounds);
                        var mLngLat = this.mapObj.getCenter();
                        this.mapObj.setCenter(new BMap.Point(parseFloat(mLngLat.lng) + 0.11, mLngLat.lat));
                    } catch (e) {
                    }
                    window.setTimeout(function () {
                        var mLngLat = PageMap.mapObj.getCenter();
                        var zoom = PageMap.mapObj.getZoom()
                        if (zoom > 11)
                        {
                            zoom = 11;
                        }
                        PageMap.mapObj.centerAndZoom(new BMap.Point(parseFloat(mLngLat.lng) + 0.11, mLngLat.lat), zoom);
                        BMapLib.AreaRestriction.clearBounds();
                    }, 1000);
                    PageMap.defaultOption.showBoundsFlag = false;
                }
            }
        },
        funStateListchangedInfo : function ()
        {
            if (this.defaultOption.statelist.getValue() == "")
            {
                this.defaultOption.GlobalShipFly.forEach(function (mObj) {
                    mObj.marker.show();
                });
            }
            else
            {
                var tmp = this.defaultOption.statelist.getValue().replace(/,/g,"");
                if(tmp == 4)
                {
                    this.defaultOption.GlobalShipFly.forEach(function (mObj) {
                        if (mObj.alarmType == 1)
                        {
                            mObj.marker.show();
                        }
                        else
                        {
                            mObj.marker.hide();
                        }
                    });
                }
                else if (tmp == 5)
                {
                    this.defaultOption.GlobalShipFly.forEach(function (mObj) {
                        if (mObj.sailState == 1)
                        {
                            mObj.marker.show();
                        }
                        else
                        {
                            mObj.marker.hide();
                        }
                    });
                }
                else if(tmp ==45)
                {
                    this.defaultOption.GlobalShipFly.forEach(function (mObj) {
                        if (mObj.sailState == 1 && mObj.alarmType == 1)
                        {
                            mObj.marker.show();
                        }
                        else
                        {
                            mObj.marker.hide();
                        }
                    });
                }
            }
        },
        funLoadBase:function()
        {
            //加载港口
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/gps/loadPortAll",{bb:"32", cs:"sds"}, function (data) {
                if(data != null && data.length > 0)
                {
                    PageMap.defaultOption.PortFly = data;
                    for(var nItem = 0; nItem < data.length; nItem++)
                    {
                        PageMap.funAddPort(data[nItem], {bgColor:"#ffff00", pgColor:"#ffffff", lineColor:"#6e57fb", type:1});
                    }
                }
            });

            //加载危险区域
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/gps/loadDangerZoneAll",{}, function (data) {
                if(data != null && data.length > 0)
                {
                    PageMap.defaultOption.DangerZoneFly = data;
                    for(var nItem = 0; nItem < data.length; nItem++)
                    {
                        PageMap.funAddPort(data[nItem], {bgColor:"#ff6600", pgColor:"#ffffff", lineColor:"red", type:3});
                    }
                }
            });

            //加载航道
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/gps/loadDangerZoneSpeedAll",{}, function (data) {
                if(data != null && data.length > 0)
                {
                    PageMap.defaultOption.DangerZoneSpeedFly = data;
                    for(var nItem = 0; nItem < data.length; nItem++)
                    {
                        PageMap.funAddDangerZoneSpeed(data[nItem]);
                    }
                }
            });

            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/gps/loadShip",{}, function (data) {
                mini.get("in01").setData(data);
                mini.get("in02").setData(data);
                mini.get("in11").setData(data);
                mini.get("in12").setData(data);
            });

            PageMap.funLoadSailingInfo();
            PageMap.funLoadRealInfo();
            //加载航道
            PageMap.funRealInterval();
            window.setInterval(PageMap.funLoadSailingInfo, 12000)

        },
        funRealInterval : function () {
            PageMap.defaultOption.mRealInterval = window.setInterval(PageMap.funLoadRealInfo, 15000);
        },
        funRealRowClick : function (e) {
            //e.row.devId
            PageMap.defaultOption.GlobalShipFly.forEach(function(mObj) {
                if (mObj.devId == e.row.devId)
                {
                    mObj.marker.openInfoWindow(mObj.infoWindow);
                    PageMap.mapObj.centerAndZoom(mObj.marker.getPosition(), PageMap.mapObj.getZoom());
                    return;
                }
            })
        },
        funLoadRealInfo : function ()
        {
            var devId = ""
            if(mini.get("in01").getValue() != "undefined")
            {
                devId = mini.get("in01").getValue();
            }
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/gps/loadGpsReal",{shipNo:mini.get("in02").getText(), devId:devId}, function (data) {
                $("#shipcnt").html(data.length);
                mini.get("flowGrid").setData(data);
                PageMap.defaultOption.realFlag = false;
                PageMap.funShowRealInfo(data);
            });
        },
        funLoadSailingInfo : function ()
        {
            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/gps/loadSailing",{}, function (data) {
                PageMap.defaultOption.SailingFly = data;
            });

            PageMain.callAjax(PageMain.defaultOption.httpUrl + "/gps/loadDispatch",{}, function (data) {
                PageMap.defaultOption.DispatchFly = data;
            });
        },
        funSearchRealInfo : function ()
        {
            PageMap.defaultOption.realFlag = true;
            //清空所有船
            PageMap.defaultOption.GlobalShipFly.forEach(function(mObj) {
                mObj.marker.hide();
            });
            PageMap.funLoadRealInfo();
        },
        funAddDangerZoneSpeed : function (mObj)
        {
            var pointFlys = mObj.coordinate.split(";");
            var eleCircleFly = [];
            for (var nItem=0; nItem<pointFlys.length; nItem++)
            {
                var tmp = pointFlys[nItem].split(",");
                eleCircleFly.push({lng: tmp[0] / 1000000, lat: tmp[1] / 1000000})
            }

            var mPolyLine = this.funAddElecircle(eleCircleFly);
            var me = this;
            mPolyLine.addEventListener("click", function(e){
                PageMap.funPortShipPolyLineInfo(mPolyLine, e.point);
            });
            mPolyLine.addEventListener("mouseover", function(e){
                try{
                    me.defaultOption.mInfoWindow.setContent("航道名称：" + mObj.name + " <br/>最低速度：" + mObj.minSpeed + " <br/>最高速度：" + mObj.maxSpeed + " <br/>描述信息：" + mObj.description);
                    me.mapObj.openInfoWindow(me.defaultOption.mInfoWindow, e.point);
                }catch(e){alert(e)}
                mPolyLine.setStrokeWeight(6)
                mPolyLine.setFillColor("#ffff00");
            });
            mPolyLine.addEventListener("mouseout", function(e){
                mPolyLine.setStrokeWeight(4);
                mPolyLine.setFillColor("#ffffff");
                me.mapObj.closeInfoWindow()
            });
            this.defaultOption.DangerZoneSpeedMapFly.push(mPolyLine);
        },
        funPortShipPolyLineInfo : function (mPolyLine, point)
        {
            var tmp = "";
            this.defaultOption.GlobalShipFly.forEach(function (mObj) {
                console.log(BMapLib.GeoUtils.isPointInPolygon(mObj.lnglat, mPolyLine))
                if (BMapLib.GeoUtils.isPointInPolygon(mObj.lnglat, mPolyLine))
                {
                    tmp +="<span style='padding: 0 12px; width: 120px; display:-moz-inline-box;display:inline-block; '>设备号："+ mObj.devId +"</span><span style='padding: 0 12px; width: 120px; display:-moz-inline-box;display:inline-block; '>船号：" + mObj.shipNo + "</span>"+ (mObj.alarmType == 1?"<span style='padding: 0 12px; width: 120px; display:-moz-inline-box;display:inline-block; '>报警</span>":"")  + (mObj.sailState == 1?"<span style='padding: 0 12px; width: 120px; display:-moz-inline-box;display:inline-block; '>有任务</span>":"") + " <br/>"
                }
            });
            if (this.defaultOption.baseInfoWindow == null)
            {
                this.defaultOption.baseInfoWindow =  new BMap.InfoWindow("");
            }
            if (tmp == "")
            {
                tmp = "航道内无船舶";
            }
            this.defaultOption.baseInfoWindow.setContent(tmp);
            this.mapObj.openInfoWindow(this.defaultOption.baseInfoWindow, point);
        },
        funPortShipCircleInfo : function (mClicle, type)
        {
            var tmp = "";
            this.defaultOption.GlobalShipFly.forEach(function (mObj) {
                if (BMapLib.GeoUtils.isPointInCircle(mObj.lnglat, mClicle))
                {
                    tmp +="<span style='padding: 0 12px; width: 120px; display:-moz-inline-box;display:inline-block; '>设备号："+ mObj.devId +"</span><span style='padding: 0 12px; width: 120px; display:-moz-inline-box;display:inline-block; '>船号：" + mObj.shipNo + "</span>"+ (mObj.alarmType == 1?"<span style='padding: 0 12px; width: 120px; display:-moz-inline-box;display:inline-block; '>报警</span>":"")  + (mObj.sailState == 1?"<span style='padding: 0 12px; width: 120px; display:-moz-inline-box;display:inline-block; '>有任务</span>":"") + " <br/>"
                }
            });
            if (this.defaultOption.baseInfoWindow == null)
            {
                this.defaultOption.baseInfoWindow =  new BMap.InfoWindow("");
            }
            if (type == 1 && tmp == "")
            {
                //this.defaultOption.baseInfoWindow.setTitle('<div style="height: 30px; border-bottom: 1px solid #ff0000;">港口</div>');
                tmp = "港口内无船舶";
            }
            else if (type == 3 && tmp == "")
            {
                //this.defaultOption.baseInfoWindow.setTitle('<div style="height: 30px; border-bottom: 1px solid #ff0000;">危险区域</div>');
                tmp = "危险区域内无船舶";
            }
            this.defaultOption.baseInfoWindow.setContent(tmp);
            this.mapObj.openInfoWindow(this.defaultOption.baseInfoWindow, mClicle.getCenter());
        },
        funAddPort : function(mObj, colorFly)
        {
            var PortObj = {circle:null, circlePoint:null, label:null};
            var lngLatFly = PageConvert.funWGS84ToBaidu(mObj.longitude/1000000, mObj.latitude/1000000);
            var mLngLat = this.funPoint(lngLatFly[0], lngLatFly[1]);
            var mCircle2 = this.funAddCircle(mLngLat, mObj.radius);
            mCircle2.addEventListener("mouseover", function(e){
                mCircle2.setStrokeWeight(6)
                mCircle2.setFillColor(colorFly.bgColor);
            });
            mCircle2.addEventListener("click", function(e){
               PageMap.funPortShipCircleInfo(mCircle2, colorFly.type);
            });
            mCircle2.setStrokeColor(colorFly.lineColor)
            PortObj.label = this.funAddLabelSet(mObj.name, mLngLat,{
                position : mLngLat,    // 指定文本标注所在的地理位置
                offset   : new BMap.Size(-16 * parseInt(mObj.name.length / 2), -35)    //设置文本偏移量
            });

            mCircle2.addEventListener("mouseout", function(e){
                mCircle2.setStrokeWeight(4);
                mCircle2.setFillColor(colorFly.pgColor);
            });
            PortObj.circlePoint = this.funAddMarkerInfo(mLngLat, this.defaultOption.GlobalPointIcon);
            PortObj.circle = mCircle2;
            if(colorFly.type == 1)
            {
                this.defaultOption.PortMapFly.push(PortObj);
            }
            else
            {
                this.defaultOption.DangerZoneMapFly.push(PortObj);
            }
        },
        funDealState : function (mObj)
        {
            var  tmp  = parseInt(mObj.state).toString(2);
            tmp = PageMap.defaultOption.zeroStaus.substring(0, 8 - tmp.length) + tmp;
            var html = "";
            if(tmp.charAt(7-0) == "")
            {
                html += "营运状态：未营运<br/>";
            }
            else
            {
                html += "营运状态：营运<br/>";
            }
            if(tmp.charAt(7-2) == "1")
            {
                PageMap.defaultOption.DangerZoneFly.forEach(function (mDangerZoneFly) {
                    if (mDangerZoneFly.id == mObj.areaCode)
                    {
                        html += "区域报警：<a herf='javascript:void()' onclick='PageMap.funShowAlarmInfo("+mObj.areaCode+")'>"+mDangerZoneFly.name+"</a><br/>";
                        return;
                    }
                });
            }
            if(tmp.charAt(7-3) == "1")
            {
                PageMap.defaultOption.DangerZoneSpeedFly.forEach(function (mDangerZoneSpeed) {
                    if (mDangerZoneSpeed.id == mObj.areaCode)
                    {
                        html += "低速报警<：<a herf='javascript:void()' onclick='PageMap.funShowAlarmInfo("+mObj.areaCode+")'>"+mDangerZoneSpeed.name+" 【最低限速："+mDangerZoneSpeed.minSpeed+"】</a><br/>";
                        return;
                    }
                });
                //html += "航道报警：低速报警<br/>";
            }
            if(tmp.charAt(7-6) == "1")
            {
                PageMap.defaultOption.DangerZoneSpeedFly.forEach(function (mDangerZoneSpeed) {
                    if (mDangerZoneSpeed.id == mObj.areaCode)
                    {
                        html += "超速报警<：<a herf='javascript:void()' onclick='PageMap.funShowAlarmInfo("+mObj.areaCode+")'>"+mDangerZoneSpeed.name+" 【最高限速："+mDangerZoneSpeed.maxSpeed+"】</a><br/>";
                        return;
                    }
                });
                //html += "航道报警：超速报警<br/>";
            }
            if(tmp.charAt(7-7) == "0")
            {
                html += "在港状态：未在港<br/>";
            }
            else
            {
                html += "在港状态：在港<br/>";
            }
            $("#devstate").html(html);
        },
        funResetSearch : function()
        {
            mini.get("in01").setValue("");
            mini.get("in02").setValue("");
        },
        funShowCity : function ()
        {
            this.mapObj.addControl(new BMap.CityListControl({
                anchor: BMAP_ANCHOR_TOP_RIGHT,
                offset: new BMap.Size(100, 10)
            }));
        },
        funDevChanged : function (type)
        {
            if (type == 0)
            {
                mini.get("in02").setValue( mini.get("in01").getValue());
            }
            else
            {
                mini.get("in12").setValue( mini.get("in11").getValue());
            }
        },
        funShipChanged : function (type)
        {
            if (type == 0)
            {
                mini.get("in01").setValue( mini.get("in02").getValue());
            }
            else
            {
                mini.get("in11").setValue( mini.get("in12").getValue());
            }

        },
        funHisReal : function ()
        {
            PageMap.funHisClear();
            PageMap.defaultOption.GlobalShipFly.forEach(function (mObj) {
                mObj.marker.show();
            })
            PageMap.funRealInterval();
        },
        funSearchHis : function ()
        {
            PageMap.funStop();
            PageMap.funHisClear();
            PageMap.funClearHisLineFly();
            if (PageMap.defaultOption.hisMarker != null)
            {
                PageMap.defaultOption.hisMarker.hide();
            }
            PageMap.defaultOption.hisPolyLineFly = [];


            if (PageMain.IsNull("in12", "船号")
                || PageMain.IsNull("in13", "开始时间")
                || PageMain.IsNull("in14", "结束时间"))
            {
                return ;
            }
            if((mini.parseDate(mini.get("in14").getValue()) - mini.parseDate(mini.get("in13").getValue()))/86400000 > 8)
            {
                PageMain.funShowMessageBox("查询时间不能大于八天");
                return ;
            }
            PageMain.funShowLoading();
            PageMain.callAjax("http://112.11.223.225:16332/location/getHistoryLocations",	"{\"compcode\":\"2\",\"devicecode\":\""+ mini.get("in12").getValue()+"\",\"starttime\":\""+ mini.get("in13").getValue()+"\",\"endtime\":\""+ mini.get("in14").getValue()+"\",\"apikey\":\"174f9540-0d1e-4509-a96b-e692c64dae8d\"}", function (data) {
                PageMain.funCloseLoading();
                if (data.success && data.data.length > 0)
                {
                    PageMap.funHis2RealInfo();
                    PageMap.funDealHis(data.data);
                }
                else
                {
                    PageMain.funShowMessageBox("暂无轨迹数据");
                }
            },"application/json;charset=utf-8");
        },
        funHis2RealInfo : function ()
        {
            if (PageMap.defaultOption.mRealInterval != null)
            {
                try{
                    window.clearInterval(PageMap.defaultOption.mRealInterval);
                    PageMap.defaultOption.mRealInterval = null;
                }catch(e){

                }
            }
            PageMap.defaultOption.GlobalShipFly.forEach(function (mObj) {
                mObj.marker.hide();
            })
        },
        funDealHis : function (data)
        {
            this.defaultOption.hisDataFly = data;
            this.funHis();
            PageMap.mapObj.centerAndZoom(this.funPointTwo(PageConvert.funWGS84ToBaidu(this.defaultOption.hisDataFly[0].lng, this.defaultOption.hisDataFly[0].lat)), PageMap.mapObj.getZoom());
            var tmpFly = [];
            PageMap.defaultOption.hisStaytimeFly = [];
            for(var nItem = 0; nItem < this.defaultOption.hisDataFly.length; nItem++)
            {
                tmpFly.push(this.funPointTwo(PageConvert.funWGS84ToBaidu(this.defaultOption.hisDataFly[nItem].lng, this.defaultOption.hisDataFly[nItem].lat)));
                //tmpFly.push(this.funPointTwo(PageConvert.funWGS84ToBaidu(this.defaultOption.hisDataFly[nItem + 1].lng, this.defaultOption.hisDataFly[nItem + 1].lat)));
                if (this.defaultOption.hisDataFly[nItem].staytime > 0)
                {
                    PageMap.defaultOption.hisStaytimeFly.push({dataPoint:PageMap.defaultOption.hisDataFly[nItem], lnglat:tmpFly[nItem]});
                }
                PageMap.defaultOption.hisPolyLineFly = [];//.push(null);
            }
            this.defaultOption.hisPolyLine = this.funAddPolyLineInfo(tmpFly, "#FF182A");
            //this.defaultOption.hisPolyLineFly.push(polyline);
            //this.funHisMouseInfo(polyline, nItem);
            PageMap.funDealStaytimeInfo();
        },
        funDealStaytimeInfo : function ()
        {
            PageMap.defaultOption.hisStaytimeFly.forEach(function (obj) {
                PageMap.funDealStaytimeGlobalGeocoder(obj);
            });
        },
        funDealStaytimeGlobalGeocoder : function(data)
        {
            var me = this;
            this.defaultOption.GlobalGeocoder.getLocation(data.lnglat, function(rs)
            {
                var mObj = data.dataPoint;
                var staytimeObj = {marker:null, infoWindow:null};
                var tmpContent = "设<span style='padding: 0 4px;'></span>备<span style='padding: 0 3px;'></span>号：" + mObj.deviceCode + " <br/>" +
                    "时<span style='padding: 0 12px;'></span>间：" + mObj.occurTime + " <br/>" +
                    "速<span style='padding: 0 12px;'></span>度：" + mObj.speed + " <br/>" +
                    "停靠时间：" + mObj.staytime+ " <br/>";
                tmpContent += "位<span style='padding: 0 12px;'></span>置：" + me.funGeocoderAddressInfo(rs);
                staytimeObj.marker = PageMap.funAddMarkerInfo(data.lnglat, PageMap.defaultOption.GlobalStaytimeIcon);
                staytimeObj.infoWindow = new BMap.InfoWindow(tmpContent)
                PageMap.defaultOption.hisStaytimeMarkerFly.push(staytimeObj);
                staytimeObj.marker.addEventListener("click", function(e){
                    staytimeObj.marker.openInfoWindow(staytimeObj.infoWindow);
                });
            });
        },

        funHisMouseInfo : function (polyline, item)
        {
            var me = this;
            polyline.addEventListener("mouseover", function(e){
                polyline.setStrokeWeight(8);
                var mObj = me.defaultOption.hisDataFly[item + 1];
                var paramPoint = me.funPointTwo(PageConvert.funWGS84ToBaidu(mObj.lng, mObj.lat));
                try{

                    me.defaultOption.mInfoWindow.setContent(me.funHisInfoWindowInfo(mObj));
                    me.funDealState(mObj);
                    me.mapObj.openInfoWindow(me.defaultOption.mInfoWindow, e.point);
                    me.defaultOption.GlobalGeocoder.getLocation(paramPoint, function(rs)
                    {
                        $("#hisplace").html(me.funGeocoderAddressInfo(rs));
                    });
                }catch(e){alert(e)}
            });
            polyline.addEventListener("mouseout", function(e){
                polyline.setStrokeWeight(4);
                me.mapObj.closeInfoWindow()
            });
        },

        funHisInfoWindowInfo : function (mObj)
        {
            var tmpContent = "船<span style='padding: 0 14px;'></span>号：" + mini.get("in12").getText() + " <br/>" +
                "设<span style='padding: 0 4px;'></span>备<span style='padding: 0 4px;'></span>号：" + mObj.deviceCode + " <br/>" +
                "时<span style='padding: 0 14px;'></span>间：" + mObj.occurTime + " <br/>" +
                "速<span style='padding: 0 14px;'></span>度：" + mObj.speed + " <br/>";
            /*if(mObj.areaCode != null && mObj.areaCode != "null")
            {
                tmpContent += "区<span style='padding: 0 14px;'></span>域：区域在这里<br/>";
            }*/
            tmpContent += "<div id='devstate'></div>";
            tmpContent += "位<span style='padding: 0 14px;'></span>置：<span id='hisplace'></span>";
            return tmpContent;
        },
        funHisClear : function ()
        {
            PageMap.defaultOption.hisPlayFlag = false;
            if (PageMap.defaultOption.hisPolyLine != null)
            {
                PageMap.mapObj.removeOverlay(PageMap.defaultOption.hisPolyLine);
            }
            PageMap.funClearHisLineFly();
            if (PageMap.defaultOption.hisMarker != null)
            {
                PageMap.defaultOption.hisMarker.hide();
            }
            $("#bncs_select").val(0);
            $("#bncs_select").attr("max" , PageMap.defaultOption.hisSumCnt)
            PageMap.defaultOption.hisDataFly = [];
            PageMap.defaultOption.hisCurrCnt = 0;
            PageMap.defaultOption.hisSumCnt = PageMap.defaultOption.hisDataFly.length;
            PageMap.defaultOption.hisStaytimeMarkerFly.forEach(function (data) {
                PageMap.mapObj.removeOverlay(data.marker);
            });
            PageMap.defaultOption.hisStaytimeMarkerFly = [];
        },
        funClearHisLineFly : function ()
        {
            PageMap.defaultOption.hisPolyLineFly.forEach(function (polyline) {
                if (polyline != null)
                {
                    PageMap.mapObj.removeOverlay(polyline);
                }
            });
        },
        //轨迹回放
        funHis:function ()
        {

            PageMap.defaultOption.hisCurrCnt = 0;
            PageMap.defaultOption.hisSumCnt = PageMap.defaultOption.hisDataFly.length;
            if(PageMap.defaultOption.hisMarker != null)
            {
                PageMap.defaultOption.hisMarker.show();
            }

            $("#bncs_select").val(0);
            $("#bncs_select").attr("max" , PageMap.defaultOption.hisSumCnt);
            PageMap.defaultOption.hisPlayFlag = false;
            $("#bncs_select").attr("disabled", false);
            PageMap.defaultOption.hisInfoWindow = new BMap.InfoWindow("");
            PageMap.funHisMarker(1);
        },
        //滚动条变化
        funSliderChange : function ()
        {
            //console.log("--------------" + $("#bncs_select").val())
            PageMap.defaultOption.hisCurrCnt = parseInt($("#bncs_select").val() - 1);
            console.log("--------------"+PageMap.defaultOption.hisPlayStaue)


            PageMap.funDealSliderChange();

            if (PageMap.defaultOption.hisPlayStaue == 2)
            {

                PageMap.defaultOption.hisPlayStaue = 1;
                PageMap.funPlay();
            }
            else
            {
                PageMap.funHisMarker(PageMap.defaultOption.hisCurrCnt);
            }
        },
        funDealSliderChange : function()
        {
            PageMap.funClearHisLineFly();
            var tmpFly = [];
            for(var nItem = 0; nItem < PageMap.defaultOption.hisCurrCnt; nItem++)
            {
                tmpFly.push(this.funPointTwo(PageConvert.funWGS84ToBaidu(this.defaultOption.hisDataFly[nItem].lng, this.defaultOption.hisDataFly[nItem].lat)));
                tmpFly.push(this.funPointTwo(PageConvert.funWGS84ToBaidu(this.defaultOption.hisDataFly[nItem + 1].lng, this.defaultOption.hisDataFly[nItem + 1].lat)));
            }
            PageMap.defaultOption.hisPolyLineFly = [];
            PageMap.defaultOption.hisPolyLineFly.push(PageMap.funAddPolyLineInfo(tmpFly));
        },
        funHisMarker: function (paramItem)
        {
            var speed = mini.get("speed").getValue();
            if(speed == "")
            {
                speed = 1;
            }
            speed = parseInt(speed);
            var endItem = paramItem + speed;
            if (endItem >= PageMap.defaultOption.hisSumCnt)
            {
                endItem = PageMap.defaultOption.hisSumCnt;
            }

            var tmpFly = [];
            tmpFly.push(PageMap.funPointTwo(PageConvert.funWGS84ToBaidu(PageMap.defaultOption.hisDataFly[paramItem-1].lng, PageMap.defaultOption.hisDataFly[paramItem - 1].lat)));
            for (var nItem = paramItem; nItem < endItem; nItem ++)
            {
                tmpFly.push(PageMap.funPointTwo(PageConvert.funWGS84ToBaidu(PageMap.defaultOption.hisDataFly[nItem].lng, PageMap.defaultOption.hisDataFly[nItem].lat)));
            }
            PageMap.defaultOption.hisPolyLineFly.push(PageMap.funAddPolyLineInfo(tmpFly));
            var mObj = PageMap.defaultOption.hisDataFly[endItem - 1];
            var paramPoint = tmpFly[tmpFly.length - 1];//PageMap.funPointTwo(PageConvert.funWGS84ToBaidu(mObj.lng, mObj.lat));
            var tmpLng = PageMap.mapObj.getBounds();
            if(tmpLng.Ke < paramPoint.lat && tmpLng.Le < paramPoint.lng && tmpLng.Fe > paramPoint.lat && tmpLng.Ge > paramPoint.lng.toFixed(6))
            {

            }
            else
            {
                PageMap.mapObj.centerAndZoom(paramPoint, PageMap.mapObj.getZoom());
            }

            if(PageMap.defaultOption.hisMarker == null)
            {

                PageMap.defaultOption.hisMarker = this.funAddMarkerInfo(paramPoint,PageMap.funShowShipIconInfo(1));
            }
            else
            {
                PageMap.defaultOption.hisMarker.setPosition(paramPoint);
            }
            //PageMap.defaultOption.hisInfoWindow.setContent(PageMap.funHisInfoWindowInfo(mObj));

            if(PageMap.defaultOption.hisInfoWindow.isOpen() == false)
            {
                PageMap.defaultOption.hisInfoWindow.setWidth(320);
                PageMap.defaultOption.hisInfoWindow.setHeight(150);
                PageMap.defaultOption.hisInfoWindow.setContent("<div id='hisCon'>"+PageMap.funHisInfoWindowInfo(mObj)+"</div>");
                PageMap.defaultOption.hisMarker.openInfoWindow( PageMap.defaultOption.hisInfoWindow, paramPoint);
            }
            else {
                $("#hisCon").html(PageMap.funHisInfoWindowInfo(mObj));
            }

            PageMap.funDealState(mObj);
            var me = this;
            PageMap.defaultOption.GlobalGeocoder.getLocation(paramPoint, function(rs)
            {
                $("#hisplace").html(me.funGeocoderAddressInfo(rs));
            });
            PageMap.defaultOption.hisMarker.setRotation(mObj.angle);

            PageMap.defaultOption.hisCurrCnt += speed;
        },
        //画船的位置[暂时不用]
        funHisMarker_bak : function (paramItem)
        {
            if (paramItem >= 1)
            {
                var tmpFly = [];
                tmpFly.push(PageMap.funPointTwo(PageConvert.funWGS84ToBaidu(PageMap.defaultOption.hisDataFly[paramItem-1].lng, PageMap.defaultOption.hisDataFly[paramItem - 1].lat)));
                tmpFly.push(PageMap.funPointTwo(PageConvert.funWGS84ToBaidu(PageMap.defaultOption.hisDataFly[paramItem].lng, PageMap.defaultOption.hisDataFly[paramItem].lat)));
                PageMap.defaultOption.hisPolyLineFly[paramItem-1] = PageMap.funAddPolyLineInfo(tmpFly);
                PageMap.funHisMouseInfo(PageMap.defaultOption.hisPolyLineFly[paramItem-1], paramItem);
            }
            var mObj = PageMap.defaultOption.hisDataFly[paramItem];
            var paramPoint = PageMap.funPointTwo(PageConvert.funWGS84ToBaidu(mObj.lng, mObj.lat));
            var tmpLng = PageMap.mapObj.getBounds();
            if(tmpLng.Ke < paramPoint.lat && tmpLng.Le < paramPoint.lng && tmpLng.Fe > paramPoint.lat && tmpLng.Ge > paramPoint.lng.toFixed(6))
            {

            }
            else
            {
                PageMap.mapObj.centerAndZoom(paramPoint, PageMap.mapObj.getZoom());
            }

            if(PageMap.defaultOption.hisMarker == null)
            {

                PageMap.defaultOption.hisMarker = this.funAddMarkerInfo(paramPoint,PageMap.funShowShipIconInfo(1));
            }
            else
            {
                PageMap.defaultOption.hisMarker.setPosition(paramPoint);
            }
            //PageMap.defaultOption.hisInfoWindow.setContent(PageMap.funHisInfoWindowInfo(mObj));

            if(PageMap.defaultOption.hisInfoWindow.isOpen() == false)
            {
                PageMap.defaultOption.hisInfoWindow.setWidth(320);
                PageMap.defaultOption.hisInfoWindow.setHeight(150);
                PageMap.defaultOption.hisInfoWindow.setContent("<div id='hisCon'>"+PageMap.funHisInfoWindowInfo(mObj)+"</div>");
                PageMap.defaultOption.hisMarker.openInfoWindow( PageMap.defaultOption.hisInfoWindow, paramPoint);
            }
            else {
                $("#hisCon").html(PageMap.funHisInfoWindowInfo(mObj));
            }

            PageMap.funDealState(mObj);
            var me = this;
            PageMap.defaultOption.GlobalGeocoder.getLocation(paramPoint, function(rs)
            {
                $("#hisplace").html(me.funGeocoderAddressInfo(rs));
            });
            PageMap.defaultOption.hisMarker.setRotation(mObj.angle);

        },
        //自动回放
        funAutoPlay : function ()
        {
            //console.log(PageMap.defaultOption.hisCurrCnt);
            PageMap.funHisMarker(PageMap.defaultOption.hisCurrCnt);
            $("#bncs_select").val(PageMap.defaultOption.hisCurrCnt + 1);
            //设置进度条
            //PageMap.defaultOption.hisCurrCnt += 1;
            PageMap.funBlack();
        },
        //回放停止
        funStop : function ()
        {
            PageMap.funClearHisLineFly();
            PageMap.defaultOption.hisCurrCnt = 0;
            PageMap.defaultOption.hisPlayFlag = false;
            if (PageMap.defaultOption.hisTimeOut != null)
            {
                window.clearTimeout(PageMap.defaultOption.hisTimeOut);
                PageMap.defaultOption.hisTimeOut = null;
            }
        },
        //暂停
        funParse : function()
        {
            PageMap.defaultOption.hisPlayFlag = false;
        },
        funBlack : function ()
        {
            if(PageMap.defaultOption.hisCurrCnt < PageMap.defaultOption.hisSumCnt && PageMap.defaultOption.hisPlayFlag)
            {
                /*var speed = mini.get("speed").getValue();
                if(speed == "")
                {
                    speed = 1;
                }
                PageMap.defaultOption.hisTimeOut = window.setTimeout(PageMap.funAutoPlay, PageMap.defaultOption.hisTime / parseFloat(speed));
                */
                PageMap.defaultOption.hisTimeOut = window.setTimeout(PageMap.funAutoPlay, PageMap.defaultOption.hisTime);
            }
            else
            {
                return false;
            }
        },
        //播放
        funPlay : function ()
        {
            if (PageMap.defaultOption.hisPlayFlag == false)
            {
                PageMap.defaultOption.hisPlayFlag = true;
                PageMap.funAutoPlay();
            }
        },
        //重播
        funRePlay : function()
        {
            PageMap.funClearHisLineFly();
            PageMap.defaultOption.hisCurrCnt = 0;
            if (PageMap.defaultOption.hisPlayFlag == false)
            {
                PageMap.defaultOption.hisPlayFlag = true;
                PageMap.funAutoPlay();
            }
        },
        funSliderKeyDown : function ()
        {
            if (PageMap.defaultOption.hisPlayFlag)
            {
                PageMap.funParse();
                PageMap.defaultOption.hisPlayStaue = 2;
            }
            else
            {
                PageMap.defaultOption.hisPlayStaue = 0;
            }
        },
        //删除图层
        funRemoveOverlayByObj : function(mObj)
        {
            this.mapObj.removeOverlay(mObj);
        },
        //画线路
        funAddPolyLineInfo : function()
        {
            var pointFly = arguments[0];
            var lineColor = "blue";
            if (arguments.length > 1)
            {
                lineColor = arguments[1];
            }
            var polyLine = new BMap.Polyline(pointFly, {strokeColor:lineColor, strokeWeight:6, strokeOpacity:0.4});
            this.mapObj.addOverlay(polyLine);
            return polyLine;
        },
        //创建图标
        funAddMarkerInfo : function(paramPoint, paramIcon)
        {
            var marker = new BMap.Marker(paramPoint,{icon:paramIcon});
            this.mapObj.addOverlay(marker);
            return marker;
        },
        // 画圆
        funAddCircle : function (paramPoint, paramRadius)
        {
            var circle = new BMap.Circle(paramPoint, paramRadius);
            this.mapObj.addOverlay(circle);
            return circle;
        },
        funShowRealInfo : function(data)
        {

            //this.defaultOption.statelist.showSatateList = this.defaultOption.statelist.getValue().replace(/,/g,"");
            for(var nItem=0; nItem < data.length; nItem++)
            {
                var pfly = PageConvert.funWGS84ToBaidu(data[nItem].longitude/1000000, data[nItem].latitude/1000000)
                var mPoint = this.funPoint(pfly[0], pfly[1]);
                this.funGlobalGeocoder(data[nItem], mPoint);
            }
            this.funSetBoundsInfo(data);
            this.funStateListchangedInfo();
            //window.setTimeout(this.funStateListchangedInfo, 6000);
        },
        funGlobalGeocoder : function (paramRow, paramPoint)
        {
            var me = this;
            this.defaultOption.GlobalGeocoder.getLocation(paramPoint, function(rs)
            {
                me.funDrawCarCallBackInfo(paramRow, paramPoint, me.funGeocoderAddressInfo(rs));
            });
        },
        funGetPortInfo : function (id)
        {
            var retObj = null;
            PageMap.defaultOption.PortFly.forEach(function (obj) {
                if(obj.id == id)
                {
                    retObj = obj;
                   return obj;
                }
            });
            return retObj;
        },
        funGetPortNameInfo : function (id)
        {
            var tmp  = this.funGetPortInfo(id);
            if (tmp != null)
            {
                return tmp.name;
            }
            return "";
        },
        funGetDangerZoneSpeedInfo : function (id)
        {
            var retObj = null;
            PageMap.defaultOption.DangerZoneSpeedFly.forEach(function (obj) {
                if(obj.id == id)
                {
                    retObj = obj;
                    return obj;
                }
            });
            return retObj;
        },
        funGetSailingInfo : function (shipId)
        {
            var retObj = null;
            PageMap.defaultOption.SailingFly.forEach(function (obj) {
               if (obj.shipId == shipId)
               {
                   retObj = obj;
                   return retObj;
               }
            });
            return retObj;
        },
        funGetDispatchInfo : function (shipId)
        {
            var retObj = null;
            PageMap.defaultOption.DispatchFly.forEach(function (obj) {
                if (obj.shipId == shipId)
                {
                    retObj = obj;
                    return retObj;
                }
            });
            return retObj;
        },
        funGetDangerZoneInfo : function (id)
        {
            var retObj = null;
            PageMap.defaultOption.DangerZoneFly.forEach(function (obj) {
                if(obj.id == id)
                {
                    retObj = obj;
                    return obj;
                }
            });
            return retObj;
        },
        funSettleTypeInfo : function (state)
        {
            if (state == 1)
            {
                return "按实发吨位";
            }
            else if(state == 2)
            {
                return "按实收吨位";
            }
            else if(state == 11)
            {
                return "现金结算";
            }
            else if(state == 12)
            {
                return "定期结算";
            }
            return state;
        },
        funSailState : function (state)
        {
            if (state == 1)
            {
                return "空船到港";
            }
            else if (state == 2)
            {
                return "空船装后"
            }
            else if (state == 3)
            {
                return "重船离港"
            }
            else if (state == 4)
            {
                return "重船到港"
            }
            else if (state == 5)
            {
                return "重船卸后"
            }
            return state;
        },
        funDrawCarCallBackInfo : function (paramRow, paramPoint, paramPlace)
        {
            var alarmType = 0;
            var alarmTypeVal = "-";
            var sailState = 0;
            /*PageMain.funTipInfo(paramRow.shipNo)*/
            var flag = true;
            var tmpContent = '<table style="font-size:12px; width: 600px;"><tr><td colspan="2" style="border: 0px solid #CCCCCC;">'+
                '<div style="width: 272px; float: left; height: 25px;">设<span style="padding:0 4px;"></span>备<span style="padding:0 4px;"></span>码：'+paramRow.devId+'</div>' +
                '<div style="width: 272px; float: left; height: 25px;">船<span style="padding:0 14px;"></span>号：'+paramRow.shipNo+'</div>' +
                '<div style="width: 272px; float: left; height: 25px;">时<span style="padding:0 14px;"></span>间：'+paramRow.gpsTime+'</div>' +
                '<div style="width: 272px; float: left; height: 25px;">速<span style="padding:0 14px;"></span>度：'+paramRow.speed+'</div>';
            // 状态
            var  tmpStatue  = parseInt(paramRow.alarmType).toString(2);
            tmpStatue = PageMap.defaultOption.zeroStaus.substring(0, 8 - tmpStatue.length) + tmpStatue;
           /* tmpContent += '<tr><td colspan="2">';*/
            if(tmpStatue.charAt(1) == "1")
            {
                alarmType = 1;
                var tmpObj = PageMap.funGetDangerZoneSpeedInfo(paramRow.areaId);
                if (tmpObj != null)
                {
                    alarmTypeVal += "超速报警"+tmpObj.name+"【最高速度"+tmpObj.maxSpeed+"】";
                    tmpContent += '<div style="width: 272px; float: left; height: 25px; color: red;">超速报警：'+tmpObj.name+'【最高速度'+tmpObj.maxSpeed+'】</div>';
                }
            }
            if(tmpStatue.charAt(4) == "1")
            {
                alarmType = 1;
                var tmpObj = PageMap.funGetDangerZoneSpeedInfo(paramRow.areaId);
                if (tmpObj != null)
                {
                    alarmTypeVal += "低速报警"+tmpObj.name+"【最低速度"+tmpObj.minSpeed+"】";
                    tmpContent += '<div style="width: 272px; float: left; height: 25px; color: red;">低速报警：' + tmpObj.name + '【最低速度' + tmpObj.minSpeed + '】</div>';
                }
            }
            if(tmpStatue.charAt(5) == "1")
            {
                alarmType = 1;
                var tmpObj = PageMap.funGetDangerZoneInfo(paramRow.areaId);
                if (tmpObj != null)
                {
                    alarmTypeVal += "区载报警"+tmpObj.name;
                    tmpContent += '<div style="width: 272px; float: left; height: 25px; color: red;">区载报警：' + tmpObj.name + '</div>';
                }
            }

            paramRow.alarmType = alarmType;
            paramRow.alarmTypeVal = alarmTypeVal;

            //进港
            if(paramRow.inOrOut == 1)
            {
                tmpContent += '<div style="width: 272px; float: left; height: 25px;">进<span style="padding:0 4px;"></span>出<span style="padding:0 4px;"></span>港：<span style="color:red; font-weight: bold;">进港</span></div>' +
                    '<div style="width: 272px; float: left; height: 25px;">港口名称：'+PageMap.funGetPortNameInfo(paramRow.fieldcode)+'</div>'+
                    '<div style="width: 272px; float: left; height: 25px;">进港时间：'+paramRow.entertime+'</div>';
            }
            else if(paramRow.inOrOut == 0)
            {
                tmpContent += '<div style="width: 272px; float: left; height: 25px;">进<span style="padding:0 4px;"></span>出<span style="padding:0 4px;"></span>港：<span style="color:red; font-weight: bold;">出港</span></div>' +
                    '<div style="width: 272px; float: left; height: 25px;">港口名称：'+PageMap.funGetPortNameInfo(paramRow.fieldcode)+'</div>'+
                    '<div style="width: 272px; float: left; height: 25px;">进港时间：'+paramRow.entertime+'</div>'+
                    '<div style="width: 272px; float: left; height: 25px;">离港时间：'+paramRow.leavetime+'</div>';
            }

            //处理任务
            var mSail = PageMap.funGetSailingInfo(paramRow.shipId);
            if (mSail != null)
            {
                sailState = 1;
                tmpContent +=
                    /*'<table style="font-size:12px; width: 650px;"><tr><td colspan="2"><div style="width: 100%; height: 1px; background: #cce1fc; "> </div></td></tr><tr><td colspan="2">'+*/
                    '<div style="width: 272px; float: left; height: 25px;">货物名称：'+PageMain.funStrinfo(mSail.goodsName)+'</div>' +
                    '<div style="width: 272px; float: left; height: 25px;">起始港口：'+PageMap.funGetPortNameInfo(mSail.startPortId)+'</div>' +
                    '<div style="width: 272px; float: left; height: 25px;">终止港口：'+PageMap.funGetPortNameInfo(mSail.endPortId)+'</div>' +
                    '<div style="width: 272px; float: left; height: 25px;">订单状态：'+PageMap.funSailState(mSail.status)+'</div>' +
                    '<div style="width: 272px; float: left; height: 25px;">装货吨位：'+mSail.loadWeight+'</div>' +
                    '<div style="width: 272px; float: left; height: 25px;">实际到港时间：'+PageMain.funStrToDate(mSail.arriveSPortTime)+'</div>' +
                    '<div style="width: 272px; float: left; height: 25px;">实际装货时间：'+PageMain.funStrToDate(mSail.loadTime)+'</div>' +
                    '<div style="width: 272px; float: left; height: 25px;">重船离港时间：'+PageMain.funStrToDate(mSail.departPortTime)+'</div>' +
                    '<div style="width: 272px; float: left; height: 25px;">实际卸货时间：'+PageMain.funStrToDate(mSail.dischargeTime)+'</div>' +
                    '<div style="width: 272px; float: left; height: 25px;">实际卸货重量：'+mSail.dischargeWeight+'</div>' +
                    '<div style="width: 272px; float: left; height: 25px;">卸货延迟费用：'+mSail.dischargeDelayFee+'</div>';
            }
            else
            {
                var mDispatch = PageMap.funGetDispatchInfo(paramRow.shipId);
                if (mDispatch != null)
                {
                    sailState = 1;
                    tmpContent +=
                       /* '<table style="font-size:12px; width: 650px;"><tr><td colspan="2"><div style="width: 100%; height: 1px; background: #cce1fc;"> </div></td></tr><tr><td colspan="2">'+*/
                        '<div style="width: 272px; float: left; height: 25px;">货物名称：'+PageMain.funStrinfo(mDispatch.goodsName)+'</div>' +
                        '<div style="width: 272px; float: left; height: 25px;">起始港口：'+PageMap.funGetPortNameInfo(mDispatch.startPortId)+'</div>' +
                        '<div style="width: 272px; float: left; height: 25px;">终止港口：'+PageMap.funGetPortNameInfo(mDispatch.endPortId)+'</div>' +
                        '<div style="width: 272px; float: left; height: 25px;">预报吨位：'+mDispatch.preWeight+'</div>'+
                        '<div style="width: 272px; float: left; height: 25px;">预发吨位：'+mDispatch.preLoad+'</div>'+
                        '<div style="width: 272px; float: left; height: 25px;">预计到港时间：'+PageMain.funStrToDate(mDispatch.preArriveTime)+'</div>'+
                        '<div style="width: 272px; float: left; height: 25px;">预结算金额：'+mDispatch.preSettleAmount+'</div>'+
                        '<div style="width: 272px; float: left; height: 25px;">结算方式：'+PageMap.funSettleTypeInfo(mDispatch.settleType)+'</div>';
                }
            }

            tmpContent += '<div style="float: left; height: 25px;">详细位置：'+paramPlace+'</div></td></tr></table>';
            for(var nItem=0; nItem<this.defaultOption.GlobalShipFly.length; nItem++)
            {
                if(this.defaultOption.GlobalShipFly[nItem].devId == paramRow.devId)
                {
                    this.defaultOption.GlobalShipFly[nItem].lnglat = paramPoint;
                    this.defaultOption.GlobalShipFly[nItem].alarmType = alarmType;
                    this.defaultOption.GlobalShipFly[nItem].sailState = sailState;
                    this.defaultOption.GlobalShipFly[nItem].marker.setPosition(paramPoint);
                    //this.defaultOption.GlobalShipFly[nItem].marker.setIcon(this.funShipIconInfo(paramRow.angle));
                    this.defaultOption.GlobalShipFly[nItem].marker.setRotation(paramRow.angle);
                    this.defaultOption.GlobalShipFly[nItem].infoWindow.setContent(tmpContent);
                    flag = false;
                    break;
                }
            }

            if (flag)
            {
                var mMarkerObj = {devId: null, lnglat:null, alarmType:null, sailState:null, shipNo:null, marker: null, label: null, infoWindow: null, realObj : null};
                mMarkerObj.devId = paramRow.devId;
                mMarkerObj.lnglat = paramPoint;
                mMarkerObj.alarmType = alarmType;
                mMarkerObj.sailState = sailState;
                mMarkerObj.shipNo = paramRow.shipNo;
                mMarkerObj.infoWindow = new BMap.InfoWindow(tmpContent);
                mMarkerObj.realObj = paramRow;

                mMarkerObj.label = new BMap.Label(paramRow.shipNo, {
                    offset : new BMap.Size(-5 * parseInt(paramRow.shipNo.replace(/[^\x00-\xff]/g,"aa").length / 2), -20)    //设置文本偏移量
                });
                mMarkerObj.label.setStyle(this.defaultOption.GlobalLabelStyle);

                mMarkerObj.marker = this.funAddMarkerInfo(paramPoint, this.funShowRealIconInfo(alarmType, sailState, paramRow.online));
                mMarkerObj.marker.setRotation(paramRow.angle);

                //mMarkerObj.label.setRotation(paramRow.angle);
                mMarkerObj.marker.setLabel(mMarkerObj.label);
                this.defaultOption.GlobalShipFly.push(mMarkerObj);
                mMarkerObj.marker.addEventListener("click", function(e){
                    mMarkerObj.marker.openInfoWindow(mMarkerObj.infoWindow);
                });
            }
        },
        //地理位置解析公共部分
        funGeocoderAddressInfo : function(rs)
        {
            try { return rs.address; }catch (e){}
            return "";
        },
        funShowRealIconInfo : function (alarmType, shipState, online)
        {
            if(online == 0)
            {
                if(shipState  == 1)
                {
                    return this.defaultOption.GlobalShipHLxIcon;
                }
                return this.defaultOption.GlobalShip0LxIcon;
            }
            else if (alarmType == 1)
            {
                if(shipState  == 1)
                {
                    return this.defaultOption.GlobalShipHIcon;
                }
                return this.defaultOption.GlobalShipIcon;
            }
            else
            {
                if(shipState  == 1)
                {
                    return this.defaultOption.GlobalShipZCHIcon;
                }
            }
            return this.defaultOption.GlobalShipZCIcon;
        },
        funShowShipIconInfo : function(type)
        {
            return this.defaultOption.GlobalShipIcon;
        },
        //设置图标方向
        funShipIconInfo : function(paramVal)
        {
            var _mIndex = parseInt((eval(paramVal) + 22.5)/45);
            if(eval(paramVal) < 0)
            {
                _mIndex = parseInt((eval(paramVal) + 22.5 + 360)/45);
            }
            var tmp =  _mIndex % 8;
            this.defaultOption.GlobalShipIcon.setImageUrl(this.defaultOption.basePath + "themes/images/shipRed"+tmp+".png");
            return this.defaultOption.GlobalShipIcon;
        },
        //画电子圈栏
        funAddElecircle : function (data)
        {
            var polygon = new BMap.Polygon(data, {strokeColor:"#3a6bdb",fillColor:"#fff", strokeWeight:4, strokeOpacity:0,fillOpacity:0,});
            this.mapObj.addOverlay(polygon);
            return polygon;
        },
        funAddLabel : function (paramTitle, paramPoint)
        {
            var opts = {
                position : paramPoint,    // 指定文本标注所在的地理位置
                offset   : new BMap.Size(-20, -15)    //设置文本偏移量
            }
            return this.funAddLabelSet(paramTitle, paramPoint, opts);
        },
        funAddLabelSet : function (paramTitle, paramPoint, paramSize)
        {
            var label = new BMap.Label(paramTitle, paramSize);  // 创建文本标注对象
            label.setStyle(this.defaultOption.GlobalLabelStyle2);
            this.mapObj.addOverlay(label);
            return label;
        },
        funPointFly : function (data)
        {
            var pointFly = [];
            for(var nItem=0; nItem < data.length; nItem++)
            {
                pointFly.push(this.funPoint(data[nItem].lng, data[nItem].lat));
            }
            return pointFly;
        },
        funPoint : function(lng, lat)
        {
            return new BMap.Point(lng, lat);
        },
        funPointTwo : function(paramFly)
        {
            return this.funPoint(paramFly[0], paramFly[1]);
        },

        //清除轨迹信息
        funClearHisInfo : function ()
        {
            if (this.defaultOption.hisPolyLine != null)
            {
                this.mapObj.removeOverlay(this.defaultOption.hisPolyLine);
                this.defaultOption.hisPolyLine = null;
            }

            if (this.defaultOption.hisMarker != null)
            {
                this.mapObj.removeOverlay(this.defaultOption.hisMarker);
                this.defaultOption.hisMarker = null;
            }
            this.defaultOption.hisDataFly = [];
        }
    }
}();


$(function () {
    PageMap.init("allmap");
})