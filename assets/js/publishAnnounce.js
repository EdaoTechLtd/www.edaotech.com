var publishAnnounceUrl = "publishAnnounce.php";
var authStateUrl = "authState.php";
var publishAnnounceSuccUrl = "publishAnnounceSucc.php";
var doPublishAnnounceUrl = "doPublishAnnounce.php";

function makeAutoStatdata() {
    return {
        title: '推送公告',
        next_url: publishAnnounceUrl
    };
}

function doPublishAnnounce()
{
    var content = $("#announce").val();
    if(content==undefined || content.length==0){
        alert("公告内容不能为空");
        return;
    }
    var  autoStatData = makeAutoStatdata();
    var postData = {
        announce: content
    };
    $.ajax({
        type: "POST",
        url: doPublishAnnounceUrl,
        data: postData,
        success: function (data) {
            if(data.errorCode!=0){
                autoStatData.succ = 0;
                autoStatData.msg = '推送公告失败(错误码: ' + data.errorCode+')，要不要再试一下';
                authAutoPostData(authStateUrl, autoStatData);
            }else {
                location.href = publishAnnounceSuccUrl;
            }
        },
        error: function () {
            autoStatData.succ = 0;
            autoStatData.msg = '推送公告失败(未知错误)，要不要再试一下';
            authAutoPostData(authStateUrl, autoStatData);
        }
    });
};
