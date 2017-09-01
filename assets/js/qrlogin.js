
doQrAuthUrl = "doQrLogin.php";
authResultUrl = "authResult.php";

// 二维码刷新
qrAuthRefreshBtn = "#refreshQrBtn";

var qrLoginUrl = "qrLogin.php";
var authStateUrl = "authState.php";

var showQrAuthMsgFunc = function(msg, isHtml){
    $("#msg").text(msg);
};
showQrAuthCountMsgFunc = function (count) {
    if(count<1){
        $("#qrcode table").remove();
        $("#msg").text("授权超时,请重试");
        $("#error-qrcode").show();
    }
};

showQrAuthCodeFunc = function(authCode){
    $("#error-qrcode").hide();

    $('#qrcode').qrcode({
        render: "table",
        text: authCode,
        height: "160",
        width: "160"
    });
    showQrAuthMsgFunc("扫码下方二维码登录账号", true);
};

function makeAutoStatdata() {
    return {
        title: '扫码登录',
        next_url: qrLoginUrl
    };
}

// APP 成功授权,
// action 值为 OK 时， APP授权
// action 值为 Cancel 时， APP拒绝授权
qrAuthSuccFunc = function(action, result){
    var  autoStatData = makeAutoStatdata();
    if(action == 'OK'){
        autoStatData.succ = 1;
        autoStatData.msg = '恭喜您！扫码登录成功';
    }else  if (action == 'Cancel'){
        autoStatData.succ = 0;
        autoStatData.msg = '扫码登录被拒绝了，要不要再试一下';
    }
    authAutoPostData(authStateUrl, autoStatData);
};

// 授权失败的操作, errorCode 为服务端的错误码
// errorCode 为 -1， 表示未知错误
qrAuthFailFunc = function(errorCode){
    showQrAuthMsgFunc("生成二维码失败", false);
    $("#error-qrcode").show();
};
