
var pubHTML = {};
var board = null;
var nextoffset=0;
var  _offset = 0;
var  _limit = 0;
var  _album = 0;
var arrimg=[];
var imgarr=[];
function getMinCol(){
	var min = Math.min.apply(null,arrimg);
	for(var i=0;i<arrimg.length;i++){
		if(min == arrimg[i]){
			return {
				col:i,
				top:arrimg[i]
			};
		}
	}

}



function httpSuccess(opid, result, data){
	//return;
	var b2 = new Date();
	//localStorage.setItem('lastdata', data);
	data = eval('(' + data + ')');
	//alert(data);
	for (var i = 0; i < data.length; i++) {
		addImg(data[i], i);
	}
	var _height = Math.max.apply(null, [$(window).height(), Math.max.apply(null, arrimg)]);
	$("#thelist>li").css("height", _height + 100 + 'px');
	nextoffset = (_offset == 0 ? _limit : _limit + _offset);
	if (opid) {
		//uexXmlHttpMgr.close(opid);
	}
}

function fixA(str){
	str=str.replace(/<a/g,'<span').replace(/<\/a>/g,"</span>")
	return str;
}
function view(obj){
	setTimeout(function(){
		if (abc) {
			$('#thelist>li').eq(1).html("<img src='" + obj.src.replace('!192', '') + "'>");
			document.getElementById("thelist").style.webkitTransition = "all 0.5s ease-in-out";
			$('#thelist')[0].style.marginLeft = -$(window).width() + 'px';
		}
	},300);
	
}
function addImg(data,index){
	var rote = (data.w/228);
	var h = data.h*1?(parseInt(data.h/rote)):"auto";
	var playurl="";
	var vv="";
	var rel="";
	var wh="";
	playurl ="/play/"+data.id;
	if(data['type']==4){
		wh = ",,width=810,,height=610";
		str = "<div class='pic_item ui-state-default' style='left:{$left}px;top:{$top}px;width:{$w}px;'><a href='###'  ><div style='padding: 0 5px;'>{$desc}</div></a><a target='_blank' href='{$userurl}'><img src='{$userpic}'  width='30' height='30' /><span>{$username}</span></a></div>".replaceWith({
			id:data.id	
		})
	}else{
		if(data['type']==2){ 
			vv = "<img  src='http://huaworld.sinaapp.com/images/VideoIndicator.png' style='width: 50px;height: 50px;position: absolute;left: 78px;top: 54px;border: 0;' />";
			
			wh = ",,width=810,,height=610";
			
		}
		str =   "<div class='pic_item ui-state-default' style='left:{$left}px;top:{$top}px;'><a  {$rel} href='###'><img onclick='view(this)' width='228' height='{$h}' id='img_{$id}' class='scrollLoading' src='{$url}'  />{$vv}<div style='padding: 0 5px;'>{$desc}</div></a></div>";
	}
	var minCol = getMinCol();
	
	var _left = _offset?(minCol.col)*237:(index)%arrimg.length*237;
	
	var _top = _offset?minCol.top:(arrimg[(index)%arrimg.length]?(arrimg[(index)%arrimg.length]):0);
	var str = str.replaceWith({
		id:data.id,
		left:_left,
		top:_top,
		userpic:data.photo,
		username:data.name,
		userurl:"http://weibo.com/"+data.uid,
		height:h,
		h:h,
		w:220,
		playurl:playurl,
		vv:vv,
		desc:fixA(data.desc),
		url:(data.domain?data.domain:"http://huaworld.b0.upaiyun.com/")+data.filename+'!192',
		url2:(data.domain?data.domain:"http://huaworld.b0.upaiyun.com/")+data.filename,
		wh:wh,
		rel:rel
	});	
	var aa = $(str).appendTo($("#content1"));
	if(_offset){
		arrimg[minCol.col] += aa.height()+21;
	}else{
		arrimg[(index)%arrimg.length] += aa.height()+21;
	}
	
}
function getData(offset,limit,album){
	//alert('getData');
	_offset = offset*1;
	_limit = limit*1;
	_album = album;
	var b1= new Date();
	$.ajax({
		url:"http://huaworld.sinaapp.com/getpub.php?offset="+offset+"&limit="+limit+"&_nd="+(+new Date),
		dataType:'json',
		success:function(data){
			for(var i=0;i<data.length;i++){
				addImg(data[i],i);
			}
			var _height = Math.max.apply(null, [$(window).height(), Math.max.apply(null, arrimg)]);
			$("#thelist>li").css("height", _height + 100 + 'px');
			nextoffset = (_offset == 0 ? _limit : _limit + _offset);
		}
	});
	//uexXmlHttpMgr.open("1", "GET", );
	//uexXmlHttpMgr.send("1");
}


function openimage(obj){
	var array=new Array();
	array[0]=obj.getElementsByTagName('img')[0].src.replace(/!192/,"");
	uexImageBrowser.open(array);	
}
var pubY = 0;
var cachedItems = [];
var timer = null;
     
var myScroll,
	pullDownEl, pullDownOffset,
	pullUpEl, pullUpOffset,
	generatedCount = 0;

function pullDownAction () {
		setTimeout(function () {
			myScroll.refresh();
		}, 1000);
}

function pullUpAction () {
	setTimeout(function () {	
		getData(nextoffset,_limit, _album);
	}, 1000);
}
var beginX=0;
var beginY=0;
var endX=0;
var endY=0;
var beginEl = null;
var fixXY=0;
var beginM=0;
var isDrag = false;
var abc=true;
var isDown = false;
var getScrollTop = function(node) {
	var doc = node ? node.ownerDocument : document;
	return doc.documentElement.scrollTop || doc.body.scrollTop;
};
var getScrollLeft = function(node) {
	var doc = node ? node.ownerDocument : document;
	return doc.documentElement.scrollLeft || doc.body.scrollLeft;
};
function loaded() {
	var icount = parseInt($(window).width()/237);
	(function(){
		for(var i = 0 ;i<icount;i++){
			arrimg.push(0);
		}
	})();
	getData(0,10,0);
	
	/* $(window).scroll(function () {
		
		window["_scroll"] = setTimeout(function(){
			
			clearTimeout(window["_scroll"]);
			var _top = getScrollTop();
			var min = Math.min.apply(null,arrimg);
			if(_top>(min-$(window).height()*2) ){
				t_offset = (_offset==0?_limit:_limit+_offset);
				if(nextoffset == t_offset){
					_offset = _offset==0?_limit:_limit+_offset;
					
					getData(_offset,_limit, _album);
				}
			}
		},500);
   });*/
	pullDownEl = document.getElementById('pullDown');

	pullDownOffset = pullDownEl.offsetHeight;
	pullUpEl = document.getElementById('pullUp');	
	pullUpOffset = pullUpEl.offsetHeight;
	
	$('#thelist').css("width",$(window).width()*2+40+'px');
	
	$('#thelist>li').each(function(i,item){
		item.style.width = $(window).width() + 'px';
		item.style.overflowX = 'hidden';
	});
	$('#content1').css('height',($(window).height()-$('footer').height()-$('header').height()-12)+'px');

	myScroll = new iScroll('wrapper', {
	
		checkDOMChanges: true,
		topOffset: pullDownOffset,
		onRefresh: function () {
			if (pullDownEl.className.match('loading')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
			} else if (pullUpEl.className.match('loading')) {
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
			}
		},
		onScrollStart:function(){
			$('#thelist').each(function(i,item){
				item.style.overflowY = 'hidden';
			});
		},
		onScrollMove: function () {
			
			if (this.y > 5 && !pullDownEl.className.match('flip')) {
				pullDownEl.className = 'flip';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Release to refresh...';
				this.minScrollY = 0;
			} else if (this.y < 5 && pullDownEl.className.match('flip')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
				this.minScrollY = -pullDownOffset;
			} else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
				pullUpEl.className = 'flip';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Release to refresh...';
				this.maxScrollY = this.maxScrollY;
			} else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
				this.maxScrollY = pullUpOffset;
			}
		},
		onScrollEnd: function () {
			if (pullDownEl.className.match('flip')) {
				pullDownEl.className = 'loading';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';				
				pullDownAction();	// Execute custom function (ajax call?)
			} else if (pullUpEl.className.match('flip')) {
				pullUpEl.className = 'loading';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Loading...';				
				pullUpAction();	// Execute custom function (ajax call?)
			}
		}
	});
	
	setTimeout(function () { document.getElementById('wrapper').style.left = '0';}, 800);
	
	

	
	

	//var socket = io.connect('http://192.168.1.100:8082');
	//socket.emit('sendchat', "ok");
	

				
	var isAndroid = (/android/gi).test(navigator.appVersion),
		isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
		isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
	    hasTouch = 'ontouchstart' in window && !isTouchPad,
		START_EV = hasTouch ? 'touchstart' : 'mousedown',
		MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
		END_EV = hasTouch ? 'touchend' : 'mouseup',
		CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup'
		
	document.getElementById("thelist").addEventListener(START_EV, function(e){
		
			//e.preventDefault();
       		//e.stopPropagation();
			//uexLog.sendLog('mousedown');
			var pageX = (e.touches && e.touches[0])?e.touches[0].pageX:e.pageX;
			var pageY = (e.touches && e.touches[0])?e.touches[0].pageY:e.pageY;
			isDown = true;
			beginX = pageX;
			beginY = pageY;
			beginEl =e.target.tagName=='LI'?e.target:$(e.target).parents('li')[0];
			beginM = (parseInt(document.getElementById("thelist").style.marginLeft)||0);
			
			document.getElementById("thelist").style.webkitTransition="";
	}, false);
	
	
	document.getElementById("thelist").addEventListener(MOVE_EV, function(e){
//			var v = [isDown,beginX,(Math.abs(e.pageX - beginX)>Math.abs(e.pageY - beginY))].join(':');
//	
//			socket.emit('sendchat', v);
			var pageX = (e.touches && e.touches[0])?e.touches[0].pageX:e.pageX;
			var pageY = (e.touches && e.touches[0])?e.touches[0].pageY:e.pageY;
			if (isDown && beginX && (Math.abs(pageX - beginX)>Math.abs(pageY - beginY))) {
				
				isDrag = true;
				fixXY=(pageX - beginX)>0?1:-1;
				document.getElementById("thelist").style.marginLeft =beginM+ pageX - beginX + 'px' ;
				return ;
			}
			
//			if (isDown && beginY) {
//					
//					pullDownEl.style.height =(e.pageY-beginY) +"px";
//				
//					if(!$('.pullDownLabel',pullDownEl).attr('data-value')){
//						$('.pullDownLabel',pullDownEl).attr('data-value',$('.pullDownLabel',pullDownEl).html());
//					}
//					$('.pullDownLabel',pullDownEl).html('rrrrrrrrrr');
//			}
	}, false);
//	document.getElementById("thelist").addEventListener("touchmove", function(e){
//			alert(1);
//	}, false);
	document.getElementById('thelist').addEventListener(END_EV, function(e){
			var pageX = (e.touches && e.touches[0])?e.touches[0].pageX:e.pageX;
			var pageY = (e.touches && e.touches[0])?e.touches[0].pageY:e.pageY;
			if (isDrag) {
				beginX = 0;
				var index = $('#thelist>li').index(beginEl) - fixXY;
				if(index<0){
					index = 0
				}
				if(index==$('#thelist>li').length){
					
					index = $('#thelist>li').length-1;
				}
				var w = index * $(window).width();
				//socket.emit('sendchat',w);
				document.getElementById("thelist").style.marginLeft = w * fixXY + 'px';
				document.getElementById("thelist").style.webkitTransition = "all 0.5s ease-in-out";
				setTimeout(function(){
					abc=false;
				},30);
				
			}else{
				setTimeout(function(){
					abc=false;
				},20);			
			}
			if(!(pageY-beginY)){
				setTimeout(function(){
					abc=true;
				},40);	
			}
			beginEl = null;
			isDrag = false;
			isDown = false;	
//			if ( beginY) {
//				pullDownEl.style.webkitTransition = "all 0.2s ease-in-out";
//				pullDownEl.style.height =(0) +"px";
//				setTimeout(function(){
//					pullDownEl.style.webkitTransition = "";
//					$('.pullDownLabel',pullDownEl).html($('.pullDownLabel',pullDownEl).attr('data-value'));
//				},300);
//				
//			}	
	}, false);
//	document.getElementById("thelist").addEventListener("touchend", function(e){
//			alert(1);
//	}, false);
}

//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);
