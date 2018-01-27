var PageLogin = function(){
    return {
        defaultOption: {
            basePath:"",
            bigShipStateGrid : null,
            customerLogin: false
        },
        init :function ()
        {
            mini.parse();
            var obj = $.cookie("obj");
            if (obj && obj != "null") {
                $("#rememberKey").attr("checked", true);
                var userData = JSON.parse(obj);
                var $user = userData.user;
                var $key = atob(userData.key);
                $("#signName").val($user);
                $("#password").val($key);
            }
            else {
                $("#rememberKey").attr("checked", false);
                $("#signName").val();
                $("#password").val();
            }
        },
        funLogin: function()
        {
            var signName = $("#signName").val();
            var password = $("#password").val();
            if (signName == "") {
                $("#signName").focus();
                //mini.alert("请输入用户名!");
                return;
            } else if (signName && password) {
                //$('#password').val($.md5(password));
            }
            if (password == "") {
                $("#password").focus();
                //mini.alert("请输入密码!");
                return;
            }
            $.ajax({
                type: "POST",
                dataType: "JSON",
                data: {signName:signName,passwd:$('#password').val()},
                url: PageMain.defaultOption.httpUrl + "/signin/local",
                success: function(result) {
                    if (result.success == true) {
                        if ($("#rememberKey").is(':checked') && signName && password) {
                            var key = btoa(password);
                            var obj = {user: signName,key: key};
                            $.cookie('obj', JSON.stringify(obj), { path: '/', expires: 7 });
                        }
                        else {
                            $.cookie('obj', null, { path: '/'});
                        }
                        var token = result.data.token;
                        $.cookie('token', token, { path: '/' });
                        window.location.href = PageMain.funGetRootPath() + "/pages/home/main.html";
                    }
                    else {
                        mini.alert(result.msg);
                    }
                },
                error: function() {
                    mini.alert("网络异常");
                },
            });
        },
        funJudgeLogin: function() {
            var token = $.cookie("token");
            var isLogin = function() {
                PageMain.callAjax(PageMain.defaultOption.httpUrl + "/user/info", {"token": token}, function (data) {
                    if (data.success)
                    {
                        customerLogin = true;
                        window.location.href = PageMain.funGetRootPath() + "/pages/home/main.html";
                    }
                    else
                    {
                        $.cookie('token', null, { expires: -1, path: '/' });
                    }
                });
            }
            if (token != undefined && token != null) {
                isLogin();
            } else {
                customerLogin = false;
            }
        },
        funRemenberKey: function(e)
        {
            var signName = $("#signName").val();
            var password = $("#password").val();
            if ($(e).is(':checked') && signName && password) {
                var key = btoa(password);
                var obj = {user: signName,key: key};
                $.cookie('obj', JSON.stringify(obj), { path: '/', expires: 7 });
            }
            else {
                $.cookie('obj', null, { path: '/'});
            }
        }
    }
}();

$(function(){
    PageLogin.init();
    PageLogin.funJudgeLogin();
});