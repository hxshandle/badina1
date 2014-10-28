// JavaScript Document
function cs_VScroll(sec){
	var t = sec;
	var sp = t.find(".VScrollWrap");
	var spdiv = t.find(".VScrollCon");
	var spbar = t.find(".VScrollBar");
	var spthumb = t.find(".VScrollThumb");
	if(t.hasClass("iniOver")){
		spthumb.css("top","0px");
		spdiv.css("top","0px");
		return true;
	}
	spthumb.css("height",sp.height()/spdiv.height()*spbar.height()+"px");
	var scrollmount = (spdiv.height()-spbar.height()+10)/(spbar.height()-spthumb.height());
	var sd = 5;
	var dire = "down";
	if(spthumb.height()>spbar.height()){
		spbar.hide();
	}else{
		sp.mousewheel(function(e){
			e.preventDefault();
			e.stopPropagation();
			if(e.deltaY>0&&spthumb.position().top>spbar.height()%sd){
				spthumb.css("top",spthumb.position().top-sd+"px");
				spdiv.css("top",spdiv.position().top+sd*scrollmount);
			}else if(e.deltaY<0&&spthumb.position().top<spbar.height()-spthumb.height()){
				spthumb.css("top",spthumb.position().top+sd+"px");
				spdiv.css("top",spdiv.position().top-sd*scrollmount);
			}
		});
	}
	spthumb.mousedown(function(){
		$("body").mousemove(function(e){
			var y = spthumb.offset().top;
			var m_sd = y - e.pageY;
			if(spthumb.position().top>=0&&spthumb.position().top<=spbar.height()-spthumb.height()+2){
				if(e.pageY > y){
					if(spthumb.position().top-m_sd <= spbar.height()-spthumb.height()){
						spthumb.css("top",spthumb.position().top-m_sd+"px");
						spdiv.css("top",spdiv.position().top+m_sd*scrollmount);
					}else{
						spthumb.css("top",spbar.height()-spthumb.height()+"px");
						if(dire == "down"){
							spdiv.css("top",spdiv.position().top+m_sd*scrollmount);
							dire = "up";
						}
					}
				}else if(e.pageY < y){
					if(spthumb.position().top-m_sd >= 0){
						spthumb.css("top",spthumb.position().top-m_sd+"px");
						spdiv.css("top",spdiv.position().top+m_sd*scrollmount);
					}else{
						spthumb.css("top",0+"px");
						if(dire == "up"){
							spdiv.css("top",spdiv.position().top+m_sd*scrollmount);
							dire = "down";
						}
					}
				}
			}else{
				console.log(spthumb.position().top+","+spbar.height()+","+spthumb.height());
			}
		});
	});
	$("body").mouseup(function(){
		$("body").unbind("mousemove");
	});
	sp.mouseleave(function(){
		$("body").unbind("mousemove");
	});
	t.addClass("iniOver");
}