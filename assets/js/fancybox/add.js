 // JavaScript Document

function setTab03Syn ( i )
{
	selectTab03Syn(i);
}

function selectTab03Syn ( i )
{
	switch(i){
		case 1:
		document.getElementById("TabTab03Con1").style.display="block";
		document.getElementById("TabTab03Con2").style.display="none";
		document.getElementById("TabTab03Con3").style.display="none";
		document.getElementById("TabTab03Con4").style.display="none";
		document.getElementById("font1").style.background="url(../assets/images/edaoikey/tab-hover.png) left top no-repeat";
		document.getElementById("font2").style.background="none";
		document.getElementById("font3").style.background="none";
		document.getElementById("font4").style.background="none";
		break;
		case 2:
		document.getElementById("TabTab03Con1").style.display="none";
		document.getElementById("TabTab03Con2").style.display="block";
		document.getElementById("TabTab03Con3").style.display="none";
		document.getElementById("TabTab03Con4").style.display="none";
		document.getElementById("font1").style.background="none";
		document.getElementById("font2").style.background="url(../assets/images/edaoikey/tab-hover.png) left top no-repeat";
		document.getElementById("font3").style.background="none";
		document.getElementById("font4").style.background="none";
		break;
		case 3:
		document.getElementById("TabTab03Con1").style.display="none";
		document.getElementById("TabTab03Con2").style.display="none";
		document.getElementById("TabTab03Con3").style.display="block";
		document.getElementById("TabTab03Con4").style.display="none";
		document.getElementById("font1").style.background="none";
		document.getElementById("font2").style.background="none";
		document.getElementById("font3").style.background="url(../assets/images/edaoikey/tab-hover.png) left top no-repeat";
		document.getElementById("font4").style.background="none";
		break;
		case 4:
		document.getElementById("TabTab03Con1").style.display="none";
		document.getElementById("TabTab03Con2").style.display="none";
		document.getElementById("TabTab03Con3").style.display="none";
		document.getElementById("TabTab03Con4").style.display="block";
		document.getElementById("font1").style.background="none";
		document.getElementById("font2").style.background="none";
		document.getElementById("font3").style.background="none";
		document.getElementById("font4").style.background="url(../assets/images/edaoikey/tab-hover.png) left top no-repeat";
		break;
	}
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