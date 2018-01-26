/**
 * Created by WCL on 2018/1/25.
 */
(function ($) {
    var _ajax = $.ajax;
    $.ajax = function (options) {
        var _options = $.extend(options, {
            headers:{"token":$.cookie('token')}
        });
        _ajax(_options);
    };
})(jQuery);