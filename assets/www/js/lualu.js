
var pubHTML = {};
var board = null;
var nextoffset=0;
var  _offset = 0;
var  _limit = 0;
var  _album = 0;
var arrimg=[];
var imgarr=[];
var scrollTop=0;
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


function down(){
	//var ft = new FileTransfer();
	//ft.upload(fileURI, $('.detail_pic img').attr('src'));
	
	
	
	// var aaa= $('.detail_pic img').attr('src').split('/');
	
	// var fileTransfer = new FileTransfer();
	// for(var b in fileTransfer){
		// alert(b);
	// }
	// var uri = encodeURI( $('.detail_pic img').attr('src'));

	// fileTransfer.download(
		// uri,
		// aaa[aaa.length-1],
		// function(entry) {
			// console.log("download complete: " + entry.fullPath);
		// },
		// function(error) {
			// console.log("download error source " + error.source);
			// console.log("download error target " + error.target);
			// console.log("upload error code" + error.code);
		// }
	// );
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
			
			$('#thelist>li').eq(1).html("<div class='detail_pic'><img width="+_max+" src='" + obj.src + "'></div>");
			document.getElementById("thelist").style.webkitTransition = "all 0.2s ease";
			$('#thelist')[0].style.marginLeft = -$(window).width() + 'px';
			
			setTimeout(function(){
				$('#thelist>li').eq(1).find('img').attr('src',obj.src.replace('!192', '').replace('!60', ''));
				myScroll.scrollTo(0,0);
			},500);
		}
	},300);
	
}
var getBoardItem = function(data,boardid){
	
	var strlist = '<img src="{$src}"/>';
	var arr=[];
	for(var i = 0;i<data.length;i++){
		arr.push(strlist.replaceWith({
			src:(data[i].domain?data[i].domain:"http://huaworld.b0.upaiyun.com/")+data[i].filename+'!60',
			boardid:boardid
		}))
	}
	return '<a href="###">'+arr.join('')+'</a>';
};
var addBoard = function (data,index){
	
	col = arrimg;
	var _imgwidth = _max>350?224:145;
	var _leftwidth = _max>350?237:150;
	var _width =  _max>350?224:145;
	var str = '<div class="pic_item" style="left:{$left}px;top:{$top}px;width:{$_width}px;height:191px">'+
		'<div class="board_list" onclick="goboard({$board_id})">{$list}</div>'+
		'<div class="name">{$board_name}</div>'+
	'</div>';
	var rote = 1;
	var h = 275;
	

	var minCol = getMinCol(col);
	
	
	var _left = _offset?(minCol.col)*_leftwidth:(index)%arrimg.length*_leftwidth;
	_left= _left+10;
	var _top = _offset?minCol.top:(arrimg[(index)%arrimg.length]?(arrimg[(index)%arrimg.length]):0);

	str = str.replaceWith({
		left:_left,
		top:_top,
		_width:_width,
		repin:data.like_times,
		board_id:data.id,
		board_name:"<span style='display:none;'>("+data.pin_count+")</span>" + data.name ,
		list:getBoardItem(data.data,data.id)
		
	});

	
	
	var aa = $(str).appendTo($("#content1"));
	if(_offset){
		arrimg[minCol.col] += aa.height()+21;
	}else{
		arrimg[(index)%arrimg.length] += aa.height()+21;
	}
};

function addImg(data,index){
	if(data['data']){
		addBoard(data,index);
		return;
	}
	var _imgwidth = _max>350?224:145;
	var _leftwidth = _max>350?237:150;
	var _width =  _max>350?224:145;
	var rote = (data.w/_imgwidth);
	var h = data.h*1?(parseInt(data.h/rote)):"auto";
	var playurl="";
	var vv="";
	var rel="";
	var wh="";
	playurl ="/play/"+data.id;


		str = "<div class='pic_item' style='left:{$left}px;top:{$top}px;width:{$_width}px'><a  {$rel} href='###' ><img width='{$_imgwidth}' height='{$h}' id='img_{$id}' class='scrollLoading' src='{$url}'  />{$vv}<div class='name'>{$desc}</div></a></div>";

	var minCol = getMinCol();
	
	var _left = _offset?(minCol.col)*_leftwidth:(index)%arrimg.length*_leftwidth;
	_left= _left+10;
	var _top = _offset?minCol.top:(arrimg[(index)%arrimg.length]?(arrimg[(index)%arrimg.length]):0);
	var str = str.replaceWith({
		id:data.id,
		_width:_width,
		left:_left,
		_imgwidth:_imgwidth,
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
		url:"http://huaworld.sinaapp.com/getlualu.php?offset="+offset+"&limit="+limit+"&_nd="+(+new Date),
		dataType:'json',
		success:function(data){
	
			if(data.length && !_offset){
				localStorage.setItem('lastdata',JSON.stringify(data));
			}
			
			for(var i=0;i<data.length;i++){
			
				addImg(data[i],i);
			}
			var _height = Math.max.apply(null, [$(window).height(), Math.max.apply(null, arrimg)]);
			$("#thelist>li").css("height", _height + 50+ 'px');
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
var _max = 0;
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
var fileSystem = null;
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
			arrimg.push(10);
		}
	})();
	
	_max = $(window).width();
	var ldata = localStorage.getItem('lastdata');
	if(ldata){
		ldata = JSON.parse(ldata);
		for(var i=0;i<ldata.length;i++){
			addImg(ldata[i],i);
		}
		var _height = Math.max.apply(null, [$(window).height(), Math.max.apply(null, arrimg)]);
		$("#thelist>li").css("height", _height + 100 + 'px');
		nextoffset = (_offset == 0 ? _limit : _limit + _offset);
		getData(10,10,0);
	}else{
		getData(0,10,0);
	}
	
	
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
		useTransition:true,
		checkDOMChanges: true,
		topOffset: pullDownOffset,
		onRefresh: function () {
			if (pullDownEl.className.match('loading')) {
				pullDownEl.className = '';
				//pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
			} else if (pullUpEl.className.match('loading')) {
				pullUpEl.className = '';
				//pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
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
				//pullDownEl.querySelector('.pullDownLabel').innerHTML = '往下继续查看...';
				this.minScrollY = 0;
			} else if (this.y < 5 && pullDownEl.className.match('flip')) {
				pullDownEl.className = '';
				//pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
				this.minScrollY = -pullDownOffset;
			} else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
				pullUpEl.className = 'flip';
				//pullUpEl.querySelector('.pullUpLabel').innerHTML = '往下继续查看...';
				this.maxScrollY = this.maxScrollY;
			} else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
				pullUpEl.className = '';
				//pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
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
				//pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Loading...';				
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
			abcY  = myScroll.y;
			beginEl =e.target.tagName=='LI'?e.target:$(e.target).parents('li')[0];
			beginM = (parseInt(document.getElementById("thelist").style.marginLeft)||0);
			if(e.target.tagName=="IMG" && e.target.parentNode.className!="detail_pic"){
				//view(e.target);
				scrollTop = myScroll.y;
			}
			document.getElementById("thelist").style.webkitTransition="";
	}, false);
	
	
	document.getElementById("thelist").addEventListener(MOVE_EV, function(e){
//			var v = [isDown,beginX,(Math.abs(e.pageX - beginX)>Math.abs(e.pageY - beginY))].join(':');
//	
//			socket.emit('sendchat', v);
			var pageX = (e.touches && e.touches[0])?e.touches[0].pageX:e.pageX;
			var pageY = (e.touches && e.touches[0])?e.touches[0].pageY:e.pageY;
			if (!isDrag && isDown && beginX && (Math.abs(pageX - beginX)>Math.abs(pageY - beginY))) {
				
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

				document.getElementById("thelist").style.marginLeft = w * fixXY + 'px';
				document.getElementById("thelist").style.webkitTransition = "all 0.2s ease-in-out";
				setTimeout(function(){
					myScroll.scrollTo(0,scrollTop);
				},400);
				setTimeout(function(){
					abc=false;
				},30);
				
			}else{
				setTimeout(function(){
					abc=false;
					
				},20);			
			}
			
			if(!(myScroll.y-abcY)){
				setTimeout(function(){
					abc=true;
					if(e.target.tagName=="IMG" && e.target.parentNode.className!="detail_pic"){
						view(e.target);
						scrollTop = myScroll.y;
					}
				},40);	
			}
			
			beginEl = null;
			isDrag = false;
			isDown = false;	
	}, false);
}

//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
//document.addEventListener("DOMContentLoaded", loaded, false);
document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);
