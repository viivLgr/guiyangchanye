var head = function() {};
$(function(){
	
	
    
    //select handle
    $(".J_options p").click(function(){
		var ul = $(".J_options ul");
		if(ul.css("display")=="none"){
			ul.slideDown("fast");
		}else{
			ul.slideUp("fast");
		}
	});
	$(".J_options ul li a").click(function(){
		var txt = $(this).text();
		$(".J_options p").html(txt);
		$(".J_options p").css("font-size",'14px');
		$(".J_options p").css("color",'#4d4d4d');
		var value = $(this).attr("rel");
		$(".J_options ul").hide();
		$("#J_opt").attr('rel', value);
		
		/*add by lcc 11.9 start*/
		var parentOptions = $(this).parents(".J_options").eq(0);
		parentOptions.find(".on").eq(0).removeClass("on");
		$(this).addClass("on");
		/*add by lcc 11.9 end*/
		
	});
	
	//点击其它区域收起下来框
	$(document).bind("click",function(e){
		var ul = $(".J_options ul");
		if(e.target.id != "J_opt"){
			if (ul.css("display") != "none") {
				ul.slideUp("fast");
			} 
		}
	});
	
	});

