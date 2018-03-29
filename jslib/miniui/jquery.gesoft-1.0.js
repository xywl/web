var PageMain = function(){
    return {
        defaultOption: {
            basePath:"",
            isNenuFlag:false,//是否根据权限显示操作功能; true时不按数据库处理
            userProfileFly:[],
            zero:"0000000000000000000000000000000000",
            httpUrl : window.location.protocol + "//" + window.location.host + "/xyl" //"http://xingyi.nandasoft-its.com:8080/xyl"//"http://xingyi.nandasoft-its.com:8080/xyl"//"http://127.0.0.1:16721/xyl"
        },
        init :function (basePath){
            this.basePath = basePath;
        },
        funShowMessageBox : function(msg)
        {
            mini.showMessageBox({
                showModal: false,
                width: 250,
                title: "提醒",
                iconCls: "mini-messagebox-warning",
                message: msg,
                timeout: 2000
            });
        },
        funTest : function (test) {
          alert(test)
        },
        funShowLoading : function ()
        {
            var tmp = '加载中...';
            if (arguments.length  > 0)
            {
                tmp = arguments[0];
            }
            mini.mask({
                el: document.body,
                cls: 'mini-mask-loading',
                html: tmp
            });
        },
        funOpenDateInfo : function (e)
        {
            var date = e.date;
            var d = new Date();
            if (date.getTime() < d.getTime()) {
                e.allowSelect = false;
            }
        },
        funGetTimeMiniInfo : function (paramId)
        {
            var tmp = mini.get(paramId).getValue();
            if (tmp == "" || tmp == null)
            {
                return 0;
            }
            return tmp.getTime()/1000;
        },
        IsNull:function (paramId, paramTip)
        {
            var tmp = "";
            if (arguments.length == 3)
            {
                tmp = $("#"+paramId).val();
            }
            else
            {
                tmp = mini.get(paramId).getValue();
            }
            if(tmp == null || tmp == "" || $.trim(tmp).length == 0)
            {
                PageMain.funShowMessageBox(paramTip + "内容为空");
                return true;
            }
            return false;
        },
        funFromDateInfo : function (e)
        {
            if (e.value == "0"
                || e.value == 0
                || e.value == null
                || e.value == "null")
            {
                return "";
            }
            return mini.formatDate (new Date(e.value * 1000), "yyyy-MM-dd HH:mm:ss");
        },
        funDateOperInfo:function (e, paramId, paramType)
        {
            var date = PageMain.funDateYMD(e.date);
            var tmpDate = PageMain.funDateYMD(mini.get(paramId).getValue());
            if (tmpDate == null)
            {
                e.allowSelect = true;
                return ;
            }
            if (paramType == "lt")
            {
                if (parseInt(date.getTime()) < parseInt(tmpDate.getTime()))
                {
                    e.allowSelect = false;
                }
            }
            else
            {
                if (parseInt(date.getTime()) > parseInt(tmpDate.getTime()))
                {
                    e.allowSelect = false;
                }
            }
        },
        funDateYMD : function (date)
        {
            var paramFormat = "yyyy-MM-dd 00:00:00";
            if (arguments.length > 1)
            {
                paramFormat = arguments[1];
            }
            return mini.parseDate(mini.formatDate(date, paramFormat));
        },
        funStrToDate :function ()
        {
            if (arguments[0] == "0"
                || arguments[0] == 0
                || arguments[0] == null
                || arguments[0] == "null")
            {
                return "";
            }
            var paramFormat = "yyyy-MM-dd HH:mm:ss";
            if (arguments.length > 1)
            {
                paramFormat = arguments[1];
            }
            var tmp = parseInt(arguments[0]) * 1000;
            if (tmp == 0)
            {
                return "";
            }
            return mini.formatDate(new Date(tmp), paramFormat);
        },

        funStrinfo : function (text)
        {
            if (text == null || text == "null")
            {
                return "";
            }
            return text;
        },
        funCloseLoading : function ()
        {
            mini.unmask(document.body);
        },
        funCloseWindow : function(action)
        {
            if(window.CloseOwnerWindow) return window.CloseOwnerWindow(action);
            else window.close();
        },
        funGetRootPath : function()
        {
            var pathName = window.location.pathname.substring(1);
            var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
            var path = "";
            if (webName == "")
            {
                path = window.location.protocol + '//' + window.location.host;
            }
            else {
                path = window.location.protocol + '//' + window.location.host + '/' + webName;
            }
            return path;
        },
        //处理公共验证部分
        funDealSubmitValidate : function (paramForm)
        {
            paramForm.validate();
            if (!paramForm.isValid())
            {
                var errorTexts = paramForm.getErrorTexts();
                for (var i in errorTexts)
                {
                    mini.alert(errorTexts[i]);
                    return true;
                }
            }
            return false;
        },
        //公共部分不可见
        funDealDetailInfo : function (paramId, paramForm)
        {
            mini.get(paramId).updateRegion("south", { visible: false });//$(".mini-toolbar").hide();
            var fields = paramForm.getFields();
            for (var i = 0, l = fields.length; i < l; i++)
            {
                var c = fields[i];
                if (c.setReadOnly) c.setReadOnly(true);     //只读
                if (c.setIsValid) c.setIsValid(true);      //去除错误提示
            }
        },
        funGetUrlInfo : function ()
        {
            var pathName = window.location.pathname.substring(1);
            var webName = pathName == '' ? '' : pathName.substring(pathName.indexOf('/'));
            return webName;
        },
        funTipInfo : function (txt)
        {
            mini.showMessageBox({
                showModal: false,
                width: 250,
                height:120,
                title: "提示",
                iconCls: "mini-messagebox-warning",
                message: txt,
                x: "right",
                y: "bottom",
                timeout: 10000
            });
        },
        funDealComBitInfo : function (paramVal, paramLen)
        {
            var paramBit = PageMain.funDealBinInfo(paramVal, paramLen);
            var tmp = "";
            for(var nItem=0; nItem <= paramLen; nItem++)
            {
                if(paramBit.charAt(nItem) == 1)
                {
                    if (tmp != "")
                    {
                        tmp += ",";
                    }
                    tmp += Math.pow(2, paramLen - 1 - nItem);
                }
            }
            return tmp;
        },
        funDealBinInfo : function (paramVal, paramLen)
        {
            var paramBit = parseInt(paramVal).toString(2);
            paramBit = PageMain.defaultOption.zero.substring(0, paramLen).substring(paramBit.length) + paramBit;
            console.log(paramBit)
            return paramBit;
        },
        funUserProfileRenderer : function (e)
        {

            for(var nItem = 0; nItem < PageMain.defaultOption.userProfileFly.length; nItem++)
            {
                if(e.value == PageMain.defaultOption.userProfileFly[nItem].id)
                {
                    return PageMain.defaultOption.userProfileFly[nItem].name;
                }
            }
           return "";
        },
        funDealMenuInfo: function (sysMenuFly)
        {
            if (PageMain.defaultOption.isNenuFlag)
            {
                return ;
            }
            var menuFly = $(".mini-toolbar").find("a");
            var menuFlag = true;
            menuFly.each(function (index)
            {
                menuFlag = true;
                sysMenuFly.forEach(function (menuName)
                {
                    if(menuName == $(menuFly[index]).text())
                    {
                        menuFlag = false;
                        $(menuFly[index]).show();
                    }
                });

                if(menuFlag)
                {
                    $(menuFly[index]).hide();
                }
            })
        },
        funUserProfileInfo : function ()
        {
            PageMain.callAjax(PageMain.defaultOption.httpUrl +"/gps/loadUserProfile", {}, function (data) {
                PageMain.defaultOption.userProfileFly = data;
            });
        },
        funDealDate : function ()
        {
            Date.prototype.Format = function (fmt) {
                var o = {
                    "M+": this.getMonth() + 1, //月份
                    "d+": this.getDate(), //日
                    "h+": this.getHours(), //小时
                    "m+": this.getMinutes(), //分
                    "s+": this.getSeconds(), //秒
                    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                    "S": this.getMilliseconds() //毫秒
                };
                if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            }
        },
        //
        callAjax : function (paramUrl, paramData, callback)
        {
            var contentType = "application/x-www-form-urlencoded";
            var asyncFlag = true;
            if (arguments.length == 4)
            {
                contentType =  arguments[3];
            }
            if (arguments.length == 5)
            {
                asyncFlag = arguments[4];
            }
            $.ajax({
                url : paramUrl,
                type: 'POST',
                data: paramData,
                async: true, //同步
                dataType: 'json',
                contentType:contentType,
                success: function (data)
                {
                    callback(data);
                },
                error: function ()
                {
                    PageMain.funShowMessageBox("操作出现异常");
                }
            });
        }
    }
}();

$(function () {
    //console.log(PageMain.funGetRootPath())
    PageMain.funDealMenuInfo(["保存", "取消"]);
    PageMain.funDealDate();
    if( typeof  $.cookie('token') === "undefined" && PageMain.funGetUrlInfo() != "/pages/login/login.html")
    {
       window.location.href = PageMain.funGetRootPath() + "/pages/login/login.html"
    }
})