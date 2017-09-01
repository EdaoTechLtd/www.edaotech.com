/* 版本信息
 version = 1.1

*/

var maxAuthWaitCount = 60;
var _authId = undefined;
var _timerAuthResult = undefined;

//// 下面可以根据每个授权页面不同做调整

var doAuthUrl = "";
var doQrAuthUrl = "";
var authResultUrl = "";
var authCancelUrl = "";

// 授权
var authBtn = "";
// 取消授权
var cancelAuthBtn = "";

// 切换 二维码授权
var switchQrAuthBtn = "";
// 切换一键授权
var switchAuthBtn = "";
// 二维码刷新
var qrAuthRefreshBtn = "";

// 获取帐号
var getAccountFunc = function(){
    return null;
};

// 一键授权时可能需要保存帐号, 主要是为了在cookie里记住帐号
// 下次就不用重新输入帐号了
var saveAuthAccountFunc = function(account) {
};

// 显示一键授权页面
var showAuthPageFunc = function(show){

};

// 显示 等待 APP 授权的窗口
var showAuthWaitingPageFunc = function(show){
};

// 显示二维码授权页面
var showQrAuthPageFunc = function(show){
};

// 显示一键授权的倒计时信息
var showAuthCountMsgFunc = function(count){
    if(count > 0){
    }else{
    }
};

// 可以在这里做一些检查
// 是否允许继续一键授权
var prepareDoAuthFunc = function(account){
    if (account == undefined || account.length == 0) {
        alert("帐号不能为空");
        return false;
    }

    return true;
};

// 准备开始一键授权
var startDoAuthFunc = function(){
};

var doAuthPackDataFunc = function (userId, browser) {
    return {userId:userId,clientName:browser};
};

// APP 成功授权,
// action 值为 OK 时， APP授权
// action 值为 Cancel 时， APP拒绝授权
var authSuccFunc = function(action, result){
    if(action == 'OK'){
    }else  if (action == 'Cancel'){
    }
};

// 授权失败的操作, errorCode 为服务端的错误码
// errorCode 为 -1， 表示未知错误
var authFailFunc = function(errorCode){
    if(errorCode == 1014) {
        //没有该帐号
    }
    else {
    }
};

// 真正处理一键授权逻辑代码的函数
var doAuthFunc = function(userId){
    startDoAuthFunc();

    var postData = doAuthPackDataFunc(userId, navigator.sayswho);

    $.ajax({
        type: "POST",
        url: doAuthUrl,
        data: postData,
        success: doAuthSuccess,
        error: doAuthError
    });
};

var repeatCheckAuthResultFunc = function(authId, callbackFun){
    var urlData = { authId : authId, t : new Date().getTime()};
    $.ajax({
        type: "get",
        url: authResultUrl,
        data: urlData,
        success: function (data) {
            callbackFun(data);
        },
        error: function () {
            console.error("get error from " + authResultUrl + "");
            callbackFun(undefined);
        },
        complete: function () {
            if(_authId != undefined){
                _timerAuthResult = setTimeout(function (){
                        repeatCheckAuthResultFunc(authId, callbackFun)
                    },
                    1000);
            }
        }
    });
};

// 二维码授权相关配置

// 显示 二维码
var showQrAuthCodeFunc = function(authCode){
};

// 显示 二维码授权倒计时
var showQrAuthCountMsgFunc = function(count) {
    if(count > 0){
    }else{
    }
};

// 可以在这里做一些检查
// 是否允许继续二维码授权
var prepareQrAuthFunc = function(account){
    return true;
};

// 准备开始 二维码授权
var startDoQrAuthFunc = function(){
};

var doQrAuthPackDataFunc = function (userId, browser) {
    return {userId:userId,clientName:browser};
};

// APP 成功授权,
// action 值为 OK 时， APP授权
// action 值为 Cancel 时， APP拒绝授权
var qrAuthSuccFunc = function(action, result){
    if(action == 'OK'){
    }else  if (action == 'Cancel'){
    }
};

// 授权失败的操作, errorCode 为服务端的错误码
// errorCode 为 -1， 表示未知错误
var qrAuthFailFunc = function(errorCode){
};

// 处理二维码授权的逻辑代码
var doQrAuthFunc = function(userId){
    //显示二维码生成中
    startDoQrAuthFunc();

    var postData = doQrAuthPackDataFunc(userId, navigator.sayswho);

    $.ajax({
        type: "POST",
        url: doQrAuthUrl,
        data: postData,
        success: doQrAuthSuccess,
        error: doQrAuthError
    });
};


////================================
// 一键授权操作
function authAction(){
    console.log("auth action");
    var userId = getAccountFunc();
    if(userId != undefined && userId.length > 0){
        saveAuthAccountFunc(userId);
    }

    var result = prepareDoAuthFunc(userId);
    if(!result) return ;

    showAuthWaitingPageFunc(true);

    doAuthFunc(userId);

    return ;
};

// 二维码授权操作
function qrAuthAction(){
    var userId = getAccountFunc();
    if(userId != undefined && userId.length > 0){
        saveAuthAccountFunc(userId);
    }

    var result = prepareQrAuthFunc(userId);
    if(!result) return ;

    doQrAuthFunc(userId);

    showAuthPageFunc(false);
    showQrAuthPageFunc(true);

    return;
};

// 绑定 HTML 的 DOM 节点
function authBindDom(){
    //一键登录按钮点击事件
    if(authBtn && authBtn.length>0)
    {
        $(authBtn).bind("click",function(){
            authAction();
        });
    }

    //一键登录关闭授权等待按钮事件
    if(cancelAuthBtn && cancelAuthBtn.length)
    {
        $(cancelAuthBtn).bind("click",function(){

            doCancleAuth();

            stopGetAuthResult();
            stopAuthCountBackwards();

            showAuthWaitingPageFunc(false);
        });
    }

    //一键登录切换到二维码登录按钮事件
    if(switchQrAuthBtn && switchQrAuthBtn.length > 0)
    {
        $(switchQrAuthBtn).bind("click",function(){

            stopGetAuthResult();
            stopAuthCountBackwards();

            qrAuthAction();
        });
    }

    //二维码登录切换到一键登录按钮事件
    if(switchAuthBtn && switchAuthBtn.length > 0)
    {
        $(switchAuthBtn).bind("click",function(){

            stopGetAuthResult();
            stopQrAuthCountBackwards();

            showQrAuthPageFunc(false);
            showAuthPageFunc(true);
        });
    }

    //二维码刷新按钮
    if(qrAuthRefreshBtn && qrAuthRefreshBtn.length>0)
    {
        $(qrAuthRefreshBtn).bind("click",function(){
            qrAuthAction();
        });
    }
};

function checkAuthResultCallBack(result){
    if(result == undefined)
        return;

    if(result.succ != 1){
        if(result.errorCode == 4001 || result.errorCode == 4003){
            // 4001 为 正在等待APP授权
            // 4003 为 授权超时
        }else{
            stopGetAuthResult();
            stopAuthCountBackwards();

            authFailFunc(result.errorCode);
        }
    }else{
        if(result.action == 'OK') {
            stopGetAuthResult();
            stopAuthCountBackwards();

            authSuccFunc(result.action, result);
        }else if(result.action == 'Cancel'){
            stopGetAuthResult();
            stopAuthCountBackwards();

            authSuccFunc(result.action, result);
        }
    }
}

function doAuthSuccess(data){
    if(data.errorCode != 0){
        authFailFunc(data.errorCode);
        return;
    }

    startGetAuthResult(data.authId, checkAuthResultCallBack);
    authCountBackwards(maxAuthWaitCount);//开始倒数60秒
};
function doAuthError(){
    authFailFunc(-1);
};


function startGetAuthResult(authId, callbackFun) {

    if(_timerAuthResult != undefined)
        clearTimeout(_timerAuthResult);

    _authId = authId;

    repeatCheckAuthResultFunc(authId, callbackFun);
}

// 取消授权
function doCancleAuth(authId){
    if(authId != undefined)
        $.getJSON(authCancelUrl, { authId : authId });
}

function stopGetAuthResult() {

    if(_timerAuthResult != undefined)
        clearTimeout(_timerAuthResult);
    _timerAuthResult = undefined;

    _authId = undefined;
}

var _timerAuthCountBackwards = undefined;
function authCountBackwards(count) {

    showAuthCountMsgFunc(count);

    if (count > 0) {
        _timerAuthCountBackwards = setTimeout(function (){ authCountBackwards(count - 1) }, 1000);
    } else {
        stopGetAuthResult();
        stopAuthCountBackwards();
    }
}

function stopAuthCountBackwards() {
    clearTimeout(_timerAuthCountBackwards);
    _timerAuthCountBackwards = undefined;
}

// =============== 二维码授权相关代码
function checkQrAuthResultCallback(result){
    if(result == undefined)
        return;

    if(result.succ != 1){
        if(result.errorCode == 4001 || result.errorCode == 4003){
            // 4001 为 正在等待APP授权
            // 4003 为 授权超时
        }else{
            stopGetAuthResult();
            stopQrAuthCountBackwards();

            qrAuthFailFunc(result.errorCode);
        }
    }else{
        if(result.action == 'OK'){
            stopGetAuthResult();
            stopQrAuthCountBackwards();

            qrAuthSuccFunc(result.action, result);
        }else if(result.action == 'Cancel'){
            stopGetAuthResult();
            stopQrAuthCountBackwards();

            qrAuthSuccFunc(result.action, result);
        }
    }
}

function doQrAuthSuccess(data){
    if(data.errorCode != 0){
        qrAuthFailFunc(data.errorCode);
        return;
    }
    //通过AuthId显示二维码
    showQrAuthCodeFunc(data.authId);

    showQrAuthRefreshBtn(false);

    //开始倒数
    startGetAuthResult(data.authId, checkQrAuthResultCallback);
    qrAuthCountBackwards(maxAuthWaitCount);
};
function doQrAuthError(){
    qrAuthFailFunc(-1);
};


var _timerQrAuthCountBackwards = undefined;
function qrAuthCountBackwards(count) {

    showQrAuthCountMsgFunc(count);

    if (count > 0) {
        _timerQrAuthCountBackwards = setTimeout(function (){ qrAuthCountBackwards(count - 1) }, 1000);
    } else {
        stopGetAuthResult();
        stopQrAuthCountBackwards();

        showQrAuthRefreshBtn(true);
    }
}

function stopQrAuthCountBackwards() {
    if(_timerQrAuthCountBackwards != undefined){
        clearTimeout(_timerQrAuthCountBackwards);
    }
    _timerQrAuthCountBackwards = undefined;
}

function showQrAuthRefreshBtn(show){
    if(!qrAuthRefreshBtn || qrAuthRefreshBtn.length<0) return;

    if(show) {
        //显示二维码刷新按钮
        $(qrAuthRefreshBtn).show();
    }else{
        //隐藏二维码刷新按钮
        $(qrAuthRefreshBtn).hide();
    }
}

navigator.sayswho= (function(){
    var ua= navigator.userAgent, tem,
        M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\bOPR\/(\d+)/)
        if(tem!= null) return 'Opera '+tem[1];
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();

function authAutoPostData(url, dataObject){
    var formContent = '<form action="' + url + '" ' + ' method="post" style="display:none">';
    for(var property in dataObject){
        if(dataObject.hasOwnProperty(property)) {
            formContent += '<input type="text" name="'+property+'"'+' value="' + dataObject[property] +'" />';
        }
    }
    formContent += '</form>';
    console.log(formContent);
    var form = $(formContent);
    $('body').append(form);
    $(form).submit();
}