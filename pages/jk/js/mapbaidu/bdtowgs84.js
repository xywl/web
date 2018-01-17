/**
 * Created by WCL on 2018/1/17.
 */
var PageConvert = function () {
    return{
        defaultOption:{
            x_PI : 3.14159265358979324 * 3000.0 / 180.0,
            PI : 3.1415926535897932384626,
            a : 6378245.0,
            ee : 0.00669342162296594323
        },
        bd09togcj02 : function (bd_lon, bd_lat)
        {
            var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
            var x = bd_lon - 0.0065;
            var y = bd_lat - 0.006;
            var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
            var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
            var gg_lng = z * Math.cos(theta);
            var gg_lat = z * Math.sin(theta);
            return [gg_lng, gg_lat]
        },
        gcj02tobd09 : function (lng, lat) {
            var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * PageConvert.defaultOption.x_PI);
            var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * PageConvert.defaultOption.x_PI);
            var bd_lng = z * Math.cos(theta) + 0.0065;
            var bd_lat = z * Math.sin(theta) + 0.006;
            return [bd_lng, bd_lat]
        },
        wgs84togcj02 : function (lng, lat) {
            if (PageConvert.out_of_china(lng, lat)) {
                return [lng, lat]
            }
            else {
                var dlat = PageConvert.transformlat(lng - 105.0, lat - 35.0);
                var dlng = PageConvert.transformlng(lng - 105.0, lat - 35.0);
                var radlat = lat / 180.0 * PageConvert.defaultOption.PI;
                var magic = Math.sin(radlat);
                magic = 1 - PageConvert.defaultOption.ee * magic * magic;
                var sqrtmagic = Math.sqrt(magic);
                dlat = (dlat * 180.0) / ((PageConvert.defaultOption.a * (1 - PageConvert.defaultOption.ee)) / (magic * sqrtmagic) * PageConvert.defaultOption.PI);
                dlng = (dlng * 180.0) / (PageConvert.defaultOption.a / sqrtmagic * Math.cos(radlat) * PageConvert.defaultOption.PI);
                var mglat = lat + dlat;
                var mglng = lng + dlng;
                return [mglng, mglat]
            }
        },
        gcj02towgs84 : function (lng, lat) {
            if (PageConvert.out_of_china(lng, lat)) {
                return [lng, lat]
            }
            else {
                var dlat = PageConvert.transformlat(lng - 105.0, lat - 35.0);
                var dlng = PageConvert.transformlng(lng - 105.0, lat - 35.0);
                var radlat = lat / 180.0 * PageConvert.defaultOption.PI;
                var magic = Math.sin(radlat);
                magic = 1 - PageConvert.defaultOption.ee * magic * magic;
                var sqrtmagic = Math.sqrt(magic);
                dlat = (dlat * 180.0) / ((PageConvert.defaultOption.a * (1 - PageConvert.defaultOption.ee)) / (magic * sqrtmagic) * PageConvert.defaultOption.PI);
                dlng = (dlng * 180.0) / (PageConvert.defaultOption.a / sqrtmagic * Math.cos(radlat) * PageConvert.defaultOption.PI);
                mglat = lat + dlat;
                mglng = lng + dlng;
                return [lng * 2 - mglng, lat * 2 - mglat]
            }
        },
        funBaiduToWGS84 : function (blng, blat)
        {
            var pfly = PageConvert.bd09togcj02(blng, blat);
            return PageConvert.gcj02towgs84(pfly[0], pfly[1]);
        },
        funWGS84ToBaidu : function (lng, lat)
        {
            var pfly = PageConvert.wgs84togcj02(lng, lat);
            return PageConvert.gcj02tobd09(pfly[0], pfly[1]);
        },
        transformlat : function (lng, lat) {
            var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
            ret += (20.0 * Math.sin(6.0 * lng * PageConvert.defaultOption.PI) + 20.0 * Math.sin(2.0 * lng * PageConvert.defaultOption.PI)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(lat * PageConvert.defaultOption.PI) + 40.0 * Math.sin(lat / 3.0 * PageConvert.defaultOption.PI)) * 2.0 / 3.0;
            ret += (160.0 * Math.sin(lat / 12.0 * PageConvert.defaultOption.PI) + 320 * Math.sin(lat * PageConvert.defaultOption.PI / 30.0)) * 2.0 / 3.0;
            return ret
        },
        transformlng:function (lng, lat) {
            var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
            ret += (20.0 * Math.sin(6.0 * lng * PageConvert.defaultOption.PI) + 20.0 * Math.sin(2.0 * lng * PageConvert.defaultOption.PI)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(lng * PageConvert.defaultOption.PI) + 40.0 * Math.sin(lng / 3.0 * PageConvert.defaultOption.PI)) * 2.0 / 3.0;
            ret += (150.0 * Math.sin(lng / 12.0 * PageConvert.defaultOption.PI) + 300.0 * Math.sin(lng / 30.0 * PageConvert.defaultOption.PI)) * 2.0 / 3.0;
            return ret
        },
        out_of_china : function (lng, lat) {
            return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
        }

    }
}();