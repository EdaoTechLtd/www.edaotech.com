doAuthUrl = "doEncDataRequest.php";
authResultUrl = "authResult.php";

// 授权登录
authBtn = "#enc";

var authStateUrl = "authState.php";
var authSuccWithDataUrl = "authSuccWithData.php";
var encDataUrl = "encData.php";
var doEncDataUrl = "doEncData.php";

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

prepareDoAuthFunc = function(account){
    if (account == undefined || account.length == 0) {
        alert("帐号不能为空");
        return false;
    }

    var plainData = $("#plain-data").val();
    if(plainData == undefined || plainData.length == 0){
        alert("加密内容不能为空");
        $("#plain-data").focus();
        return false;
    }

    return true;
};

var doAuthPackDataFunc = function (userId, browser) {
    var plainData = $("#plain-data").val();
    return {userId:userId,clientName:browser, plainData:plainData};
};

showAuthCountMsgFunc = function(count){
    if(count < 1){
        var autoStatdata = makeAutoStatdata();
        autoStatdata.succ = 0;
        autoStatdata.msg = '授权超时,要不要再试一下';
        authAutoPostData(authStateUrl, autoStatdata);
    }
};

function makeAutoStatdata(){
    return {
        title: '加密推送',
        next_url: encDataUrl
    };
}

function encData(result){
    var plainData = $("#plain-data").val();
    var postData = {
        encKeyCode: result.encKeyCode,
        encKey: result.encKey,
        encAlgo: result.encAlgo,
        fileDataHash: result.fileDataHash,
        plainData: plainData
    };

    var autoStatdata = makeAutoStatdata();
    $.ajax({
        type: "POST",
        url: doEncDataUrl,
        data: postData,
        success: function (data) {
            if(data.errorCode == 0){
                autoStatdata.buttonText = '复制加密结果';
                autoStatdata.succ = 1;
                autoStatdata.msg =  '加密成功，结果如下';
                autoStatdata.data =  data.encData;
                authAutoPostData(authSuccWithDataUrl, autoStatdata);
            }else{
                autoStatdata.succ = 1;
                autoStatdata.msg = '加密数据失败(错误码: ' + data.errorCode + ')，要不要再试一下';
                authAutoPostData(authStateUrl, autoStatdata);
            }
        },
        error: function () {
            autoStatdata.succ = 0;
            autoStatdata.msg = '加密数据失败(未知错误)，要不要再试一下';
            authAutoPostData(authStateUrl, autoStatdata);
        }
    });
};

// APP 授权登录
var authSuccFunc = function(action, result){

    if(action == 'OK'){
        // 加密文件
        encData(result);
    }else  if (action == 'Cancel'){
        var autoStatdata = makeAutoStatdata();
        autoStatdata.succ = 0;
        autoStatdata.msg = '被拒绝加密了，要不要再试一下';
        authAutoPostData(authStateUrl, autoStatdata);
    }
};

// 登录失败的操作, errorCode 为服务端的错误码
// errorCode 为 -1， 表示未知错误
var authFailFunc = function(errorCode){
    var msg = "";
    if(errorCode == 1014) {
        //没有该帐号
        msg = "帐号错误,请重新输入";
    }
    else {
        msg = "未知错误,请再试一次";
    }

    var autoStatdata = makeAutoStatdata();
    autoStatdata.succ = 0;
    autoStatdata.msg = msg;
    authAutoPostData(authStateUrl, autoStatdata);
};