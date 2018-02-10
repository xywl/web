/**
 * Created by WCL on 2018/1/25.
 */
(function ($) {
    var _ajax = $.ajax;

    $.ajax = function (options) {
        var _options = $.extend(options, {
            error:function(XMLHttpRequest, textStatus, errorThrown){
                if (XMLHttpRequest.readyState == 0)
                {
                    try{
                        PageMain.funShowMessageBox("网络出现异常！")
                    }
                    catch (e)
                    {
                        
                    }
                }
            },
            headers:{"token":$.cookie('token')
            }
        });
        _ajax(_options);
    };
})(jQuery);