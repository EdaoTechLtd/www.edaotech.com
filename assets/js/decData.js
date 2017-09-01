doAuthUrl = "doDecDataRequest.php";
authResultUrl = "authResult.php";

// 授权登录
authBtn = "#dec";

var authStateUrl = "authState.php";
var authSuccWithDataUrl = "authSuccWithData.php";
var decDataUrl = "decData.php";
var doDecDataUrl = "doDecData.php";

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

    var encData = $("#enc-data").val();
    if(encData == undefined || encData.length == 0){
        alert("解密内容不能为空");
        $("#plain-data").focus();
        return false;
    }

    return true;
};

var doAuthPackDataFunc = function (userId, browser) {
    var encData = $("#enc-data").val();
    return {userId:userId,clientName:browser, encData:encData};
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
        title: '解密推送',
        next_url: decDataUrl
    };
}

function decData(result){
    var encData = $("#enc-data").val();
    var postData = {
        encKeyCode: result.encKeyCode,
        encKey: result.encKey,
        encAlgo: result.encAlgo,
        fileDataHash: result.fileDataHash,
        encData: encData
    };

    var autoStatdata =makeAutoStatdata();

    $.ajax({
        type: "POST",
        url: doDecDataUrl,
        data: postData,
        success: function (data) {
            if(data.errorCode == 0){
                autoStatdata.buttonText = '复制解密结果';
                autoStatdata.succ = 1;
                autoStatdata.msg =  '解密成功，结果如下';
                autoStatdata.data =  data.decryptData;
                authAutoPostData(authSuccWithDataUrl, autoStatdata);
            }else{
                autoStatdata.succ = 1;
                if(data.errorCode == -1){
                    autoStatdata.msg = '解密数据失败(未知错误)，要不要再试一下';
                }else{
                    autoStatdata.msg = '解密数据失败(错误码: ' + data.errorCode + ')，要不要再试一下';
                }
                authAutoPostData(authStateUrl, autoStatdata);
            }
        },
        error: function () {
            autoStatdata.succ = 0;
            autoStatdata.msg = '解密数据失败(未知错误)，要不要再试一下';
            authAutoPostData(authStateUrl, autoStatdata);
        }
    });
};

// APP 授权解密
var authSuccFunc = function(action, result){

    if(action == 'OK'){
        // 解密文件
        decData(result);
    }else  if (action == 'Cancel'){
        var autoStatdata =makeAutoStatdata();
        autoStatdata.succ = 0;
        autoStatdata.msg = '被拒绝解密了，要不要再试一下';
        authAutoPostData(authStateUrl, autoStatdata);
    }
};

// 授权失败的操作, errorCode 为服务端的错误码
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

    var autoStatdata =makeAutoStatdata();
    autoStatdata.succ = 0;
    autoStatdata.msg = msg;
    authAutoPostData(authStateUrl, autoStatdata);
};