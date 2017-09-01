doAuthUrl = "doSign.php";
authResultUrl = "authResult.php";

// 授权登录
authBtn = "#sign";

var authStateUrl = "authState.php";
var signUrl = "sign.php";
var authSuccWithDataUrl = "authSuccWithData.php";

getAccountFunc = function(){
    var userId=$('input[name=account]').val();
    return userId;
};

showAuthWaitingPageFunc = function(show){
    if(show){
        $(".loading").show();
        //$(".box").hide();
    }else{
        $(".loading").hide();
        //$(".box").show();
    }
};

function makeAutoStatdata() {
    return {
        title: '推送授权',
        next_url: signUrl
    };
}

showAuthCountMsgFunc = function(count){
    if(count < 1){
        var  autoStatData = makeAutoStatdata();
        autoStatData.succ = 0;
        autoStatData.msg = '授权超时,要不要再试一下';
        authAutoPostData(authStateUrl, autoStatData);
    }
};

// APP 授权登录
authSuccFunc = function(action, result){
    var  autoStatData = makeAutoStatdata();
    if(action == 'OK'){
        //autoStatData.succ = 1;
        //autoStatData.msg = '恭喜您！推送授权成功';
        autoStatData.buttonText = '复制签名结果';
        autoStatData.succ = 1;
        autoStatData.msg =  '恭喜您！推送授权成功';
        autoStatData.showDataButtonText = '签名数据';
        autoStatData.data =  result.signedData;
        console.log("data xxx " + result.signedData);
    }else  if (action == 'Cancel'){
        autoStatData.succ = 0;
        autoStatData.msg = '推送授权拒绝，要不要再试一下';
    }
    authAutoPostData(authStateUrl, autoStatData);
};

// 登录失败的操作, errorCode 为服务端的错误码
// errorCode 为 -1， 表示未知错误
authFailFunc = function(errorCode){
    var msg = "";
    if(errorCode == 1014) {
        //没有该帐号
        msg = "帐号错误,请重新输入";
    }
    else {
        msg = "未知错误,请再试一次";
    }

    var  autoStatData = makeAutoStatdata();
    autoStatData.succ = 0;
    autoStatData.msg = msg;
    authAutoPostData(authStateUrl, autoStatData);
};