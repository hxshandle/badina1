//常用属性
var win_W = $(window).width();
var win_H = $(window).height();

//横向导航-中英文切换
function hNavWordChange(sec){
	sec.each(function(){
		var t = $(this);
		var lan1 = t.find(".en");
		var lan2 = t.find(".ch");
		if(lan1.width()>lan2.width()){
			t.css("width",lan1.width()+5+"px");
		}else{
			t.css("width",lan2.width()+5+"px");
		}
		if(!t.parent("li").hasClass("on")){
			lan2.hide();
		}else{
			lan1.hide();
		}
		t.mouseenter(function(){
			if(!t.parent("li").hasClass("on")){
				lan2.show();
				lan1.hide();
			}
		})
		t.mouseleave(function(){
			if(!t.parent("li").hasClass("on")){
				lan2.hide();
				lan1.show();
			}
		})
	});
}
//判断客户端是否是手机平台
function ismoblieplatform(){
	var system ={  
        win : false,  
        mac : false,  
        xll : false 
    };  
	var p = navigator.platform;  
	console.log(p);
    system.win = p.indexOf("Win") == 0;  
    system.mac = p.indexOf("Mac") == 0;  
    system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
	if(system.win||system.mac||system.xll){
		return false;
    }else{
		return true;
    } 
}
//高度不变，图片小于屏宽则铺满，反之则隐藏两头
$("[data-role=rpBanner]").each(function(){
	var t = $(this);
	var img = new Image();
	var rw,rh;
	img.src = t.attr("dataimgSrc");
	img.onload = function(){
		rw = img.width;
		rh = img.height;
		t.css("height",rh+"px");
		t.css("position","relative");
		t.css("overflow","hidden");
		var imgNode = $("<img src='"+img.src+"'/>").appendTo(t);
		rpBannerFix(imgNode,rw);
		$(window).resize(function(){
			rpBannerFix(imgNode,rw);
		});
	}
});
function rpBannerFix(imgNode,rw){
	imgNode.removeAttr("style");
	if(rw < $(window).width()){
		imgNode.css("width","100%");
	}else{
		imgNode.css("margin-left",-(rw - $(window).width())/2+"px");
	}
}
//图片跟随鼠标移动的浏览窗口
function csImgView(sec){
	var sec_W = sec.width();
	var sec_H = sec.height();
	var imgNode = sec.find("div");
	var dangC = $("<span></span>").appendTo(sec);
	var iw,ih;
	var img = new Image();
	img.src = imgNode.attr("data-img");
	img.onload = function(){
		iw = img.width;
		ih = img.height;
		imgNode.css({
			width:iw+"px",
			height:ih+"px",
		});
		dangC.css({
			display:"block",
			position: "absolute",
			width: "100%",
			height: "100%",
			zIndex: 200,
			left: 0,
			top: 0
		});
		imgNode.css("background","url('"+img.src+"')");
		imgNode.css("position","relative");
		sec.mousemove(function(e){
			imgNode.css({
				left:-e.offsetX*(iw-sec_W)/sec_W+"px",
				top:-e.offsetY*(ih-sec_H)/sec_H+"px"
			});
		});
	}
}
function FLmove(sec){
	$(document).mousemove(function(e){
		sec.css({
			left:e.clientX,
			top:e.clientY
		});  
	});
}