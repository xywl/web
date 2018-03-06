/*自定义vtype*/

/*英文*/
mini.VTypes["englishErrorText"] = "请输入英文";
mini.VTypes["english"] = function (v) {
    var re = new RegExp("^[a-zA-Z\_]+$");
    if (re.test(v)) return true;
    return false;
}
/*中文*/
mini.VTypes["chineseErrorText"] = "请输入中文";
mini.VTypes["chinese"] = function (v) {
	var re = new RegExp("^[\u4e00-\u9fa5]+$");
    if (re.test(v)) return true;
    return false;
}
/*ip*/
mini.VTypes["ipErrorText"] = "请输入正确的IP地址";
mini.VTypes["ip"] = function (v) {
	var re = new RegExp("((?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d))");
    if (re.test(v)) return true;
    return false;
}
/*手机*/
/*国内 13、15、18开头*/
mini.VTypes["cellPhoneErrorText"] = "请输入正确的手机号码";
mini.VTypes["cellPhone"] = function (v) {
	var re = new RegExp("^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\\d{8}$");
    if (re.test(v)) return true;
    return false;
}
/*固定电话*/
mini.VTypes["telePhoneErrorText"] = "请输入正确的固定电话";
mini.VTypes["telePhone"] = function (v) {
	var re = new RegExp(/^\d{3}-\d{7,8}|\d{4}-\d{7,8}$/);
    if (re.test(v)) return true;
    return false;
}
/*邮箱*/
mini.VTypes["emailErrorText"] = "请输入正确的Email地址";
mini.VTypes["email"] = function (v) {
	//var re = new RegExp("^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$");
	var re = new RegExp("^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$");
    if (re.test(v)) return true;
    return false;
}
/*15位身份证*/
mini.VTypes["15IDCardErrorText"] = "请输入正确的身份证号码";
mini.VTypes["15IDCard"] = function (v) {
	var re = new RegExp("^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$");
    if (re.test(v)) return true;
    return false;
}
/*18位身份证*/
mini.VTypes["IDCardErrorText"] = "请输入正确的身份证号码";
mini.VTypes["IDCard"] = function (v) {
	var reg = new RegExp("^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$");
	var regE = new RegExp("^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}([0-9]|X)$");
    if (reg.test(v) || regE.test(v)) return true;
    return false;
}
/*中文、英文长度*/
mini.VTypes["maxLengthErrorText"] = "长度不能超过{0}";
mini.VTypes["maxLength"] = function (v, args) {
	var strReg=/[^\x00-\xff]/g;  
    var v=v.replace(strReg,"**");
	if (mini.isNull(v) || v === "") return true;
    var n = parseInt(args);
    if (!v || isNaN(n)) return true;
    if (v.length <= n) return true;
    else return false;
}
/*经纬度*/
/*经度*/
mini.VTypes["lngTypeErrorText"] = " 经度-180 ~ 180 ";
mini.VTypes["lngType"] = function (v) {
    var lngRe=/^[-]?(\d|([1-9]\d)|(1[0-7]\d)|(180))(\.\d*)?$/g;
    var re = /^[-]?\d{1,4}(\.\d{1,6})?$/;
    if (mini.isNull(v) || v === "") return true;
    if (lngRe.test(v)&&re.test(v)) return true;
    return false;
}
/*纬度*/
mini.VTypes["latTypeErrorText"] = "纬度-90 ~ 90";
mini.VTypes["latType"] = function (v) {
    var latRe=/^[-]?(\d|([1-8]\d)|(90))(\.\d*)?$/g;
    var re = /^[-]?\d{1,4}(\.\d{1,6})?$/;
    if (mini.isNull(v) || v === "") return true;
    if (latRe.test(v)&&re.test(v)) return true;
    return false;
}
/*密码*/
mini.VTypes["pwdErrorText"]="密码只能由6-12位英文，数字，下划线组成";
mini.VTypes["pwd"]=function(v){
    var pwdReg= new RegExp("^[0-9a-zA-Z_]{6,12}$");
    if(pwdReg.test(v))return true;
    return false;
}
