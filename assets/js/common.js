/*tab切换*/
function TabSwitch(theClass){
    $(".switch_view").toggleClass("current_view")
    $(".switchBtn").toggleClass("btn_account_bg")
}

/*job*/
$(function(){
    jQuery.noConflict();
    $('.careers-title').toggle(
        function(){
            $(this).addClass('active');
            $(this).parent().find('.careers-content').slideToggle();
        },
        function(){
            $(this).removeClass('active');
            $(this).parent().find('.careers-content').slideToggle();
        }
    );
    $('.careers-title').eq(0).click();
});
