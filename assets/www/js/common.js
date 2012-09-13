function getWH(obj){
	
	return {
		w:$(obj).width()>$(window).width()?$(obj).width():$(window).width(),
		h:$(obj).height()>$(window).height()?$(obj).height():$(window).height()
	}
}
var getScrollTop = function(node) {
	var doc = node ? node.ownerDocument : document;
	return doc.documentElement.scrollTop || doc.body.scrollTop;
};
var getScrollLeft = function(node) {
	var doc = node ? node.ownerDocument : document;
	return doc.documentElement.scrollLeft || doc.body.scrollLeft;
};
String.prototype.replaceWith = function (d) { 
	return this.replace(/\{\$(\w+)\}/g, function (a, c) {if (c in d) {return d[c];} else {return a;}}); 
}
function  getScollPostion() {
	var t, l, w, h;
	if (document.documentElement) {
		t = document.documentElement.scrollTop;
		l = document.documentElement.scrollLeft;
		w = document.documentElement.scrollWidth;
		h = document.documentElement.scrollHeight;
	} else if (document.body) {
		t = document.body.scrollTop;
		l = document.body.scrollLeft;
		w = document.body.scrollWidth;
		h = document.body.scrollHeight;
	}
	return { top: t, left: l, width: w, height: h };
}

;(function($) {
	$.mask = function(t){
		if(!t){
			$("#_mask_").remove();
		}
	};
	$.fn.mask = function(options) {
		var defaults = {
			width:"auto",
			height:"auto",
			bg:true
		};
		$.extend(defaults,options||{});
		 
		var pos = getScollPostion();
		if(defaults.bg){
		
			var maskDiv = document.createElement("div");
			maskDiv.id="_mask_";
		
			maskDiv.style.cssText="position:absolute;left:0;top:0;opacity:0.7;filter: alpha(opacity=70); z-index: 15;background-color:#000;width: "+getWH(document.documentElement).w+"px; height:"+getWH(document.documentElement).h+"px; "
			document.body.appendChild(maskDiv);
		}
		this.show().css({
			"top":$(window).height()/2-$(this).height()/2+pos.top+'px',
			"left":$(window).width()/2-$(this).width()/2+'px',
			"z-index":"999"
		});
		var self = this;
		$(window).resize(function(){
				var pos = getScollPostion();
				var wh = getWH(document.documentElement);
				$("#_mask_").css({
					width:wh.w+'px',
					height:wh.h+'px'
				});
				$(self).css({
					"top":$(window).height()/2-$(self).height()/2+pos.top+'px',
					"left":$(window).width()/2-$(self).width()/2+pos.left+'px'
				});
		
		});
		// $(window).scroll(function(){
			// var pos= getScollPostion();
			// $(self).css({
				// "top":$(window).height()/2-$(self).height()/2+pos.top+'px'
			// })
		// })
	
		
	
	}
})(jQuery);

;(function (Namespace) {
	LazyLoad.each = function ( object, callback ) {
		if ( undefined === object.length ){
			for ( var name in object ) {
				if (false === callback( object[name], name, object )) break;
			}
		} else {
			for ( var i = 0, len = object.length; i < len; i++ ) {
				if (i in object) { if (false === callback( object[i], i, object )) break; }
			}
		}
	};
	LazyLoad.extend = function (destination, source, override) {
		if (override === undefined) override = true;
		for (var property in source) {
			if (override || !(property in destination)) {
				destination[property] = source[property];
			}
		}
		return destination;
	}
	LazyLoad.CE = (function(){
		var guid = 1;
		return {
			addEvent: function( object, type, handler ){
				if (!handler.$$$guid) handler.$$$guid = guid++;
				if (!object.cusevents) object.cusevents = {};
				if (!object.cusevents[type]) object.cusevents[type] = {};
				object.cusevents[type][handler.$$$guid] = handler;
			},
			removeEvent: function( object, type, handler ){
				if (object.cusevents && object.cusevents[type]) {
					delete object.cusevents[type][handler.$$$guid];
				}
			},
			fireEvent: function( object, type ){
				if (!object.cusevents) return;
				var args = Array.prototype.slice.call(arguments, 2),
					handlers = object.cusevents[type];
				for (var i in handlers) {
					handlers[i].apply(object, args);
				}
			},
			clearEvent: function( object ){
				if (!object.cusevents) return;
				for (var type in object.cusevents) {
					var handlers = object.cusevents[type];
					for (var i in handlers) {
						handlers[i] = null;
					}
					object.cusevents[type] = null;
				}
				object.cusevents = null;
			}
		};
	})();
	LazyLoad.F= (function(){
		var slice = Array.prototype.slice;
		return {
			bind: function( fun, thisp ) {
				var args = slice.call(arguments, 2);
				return function() {
					return fun.apply(thisp, args.concat(slice.call(arguments)));
				}
			},
			bindAsEventListener: function( fun, thisp ) {
				var args = slice.call(arguments, 2);
				return function(event) {
					return fun.apply(thisp, [E.fixEvent(event)].concat(args));
				}
			}
		};
	})();
	LazyLoad.E = (function(){
		/*from dean edwards*/
		var addEvent, removeEvent, guid = 1,
			storage = function( element, type, handler ){
				if (!handler.$$guid) handler.$$guid = guid++;
				if (!element.events) element.events = {};
				var handlers = element.events[type];
				if (!handlers) {
					handlers = element.events[type] = {};
					if (element["on" + type]) {
						handlers[0] = element["on" + type];
					}
				}
			};
		if ( window.addEventListener ) {
			var fix = { "mouseenter": "mouseover", "mouseleave": "mouseout" };
			addEvent = function( element, type, handler ){
				if ( type in fix ) {
					storage( element, type, handler );
					var fixhandler = element.events[type][handler.$$guid] = function(event){
						var related = event.relatedTarget;
						if ( !related || (element != related && !(element.compareDocumentPosition(related) & 16)) ){
							handler.call(this, event);
						}
					};
					element.addEventListener(fix[type], fixhandler, false);
				} else {
					element.addEventListener(type, handler, false);
				};
			};
			removeEvent = function( element, type, handler ){
				if ( type in fix ) {
					if (element.events && element.events[type]) {
						element.removeEventListener(fix[type], element.events[type][handler.$$guid], false);
						delete element.events[type][handler.$$guid];
					}
				} else {
					element.removeEventListener(type, handler, false);
				};
			};
		} else {
			addEvent = function( element, type, handler ){
				storage( element, type, handler );
				element.events[type][handler.$$guid] = handler;
				element["on" + type] = handleEvent;
			};
			removeEvent = function( element, type, handler ){
				if (element.events && element.events[type]) {
					delete element.events[type][handler.$$guid];
				}
			};
			function handleEvent() {
				var returnValue = true, event = fixEvent();
				var handlers = this.events[event.type];
				for (var i in handlers) {
					this.$$handleEvent = handlers[i];
					if (this.$$handleEvent(event) === false) {
						returnValue = false;
					}
				}
				return returnValue;
			};
		}
		var getScrollTop = function(node) {
			var doc = node ? node.ownerDocument : document;
			return doc.documentElement.scrollTop || doc.body.scrollTop;
		};
		var getScrollLeft = function(node) {
			var doc = node ? node.ownerDocument : document;
			return doc.documentElement.scrollLeft || doc.body.scrollLeft;
		};
		
		function fixEvent(event) {
			if (event) return event;
			event = window.event;
			event.pageX = event.clientX + getScrollLeft(event.srcElement);
			event.pageY = event.clientY + getScrollTop(event.srcElement);
			event.target = event.srcElement;
			event.stopPropagation = stopPropagation;
			event.preventDefault = preventDefault;
			var relatedTarget = {
					"mouseout": event.toElement, "mouseover": event.fromElement
				}[ event.type ];
			if ( relatedTarget ){ event.relatedTarget = relatedTarget;}
			
			return event;
		};
		function stopPropagation() { this.cancelBubble = true; };
		function preventDefault() { this.returnValue = false; };
		var fireEvent = function(el,type){
			if(document.createEventObject){
				return el.fireEvent('on'+type);
			}else{
				var e = document.createEvent('HTMLEvents');
				e.initEvent(type,true,true);
				return !el.dispatchEvent(e);
			}
		}
		return {
			"addEvent": addEvent,
			"removeEvent": removeEvent,
			"fixEvent": fixEvent,
			"fireEvent":fireEvent
		};
	})();
	LazyLoad.ie = !-[1,];
	LazyLoad.fx = function(f, t, fn, callback) {
		var D = Date,
		d = new D,
		e, T = 680,
		F = function(x) {
			return (x /= 0.5) < 1 ? (0.5 * Math.pow(x, 2)) : ( - 0.5 * ((x -= 2) * x - 2))
		};
		return e = setInterval(function() {
			var z = Math.min(1, (new D - d) / T);
			if (false === fn( + f + (t - f) * F(z)) || z == 1) {
				if (callback && typeof callback == 'function') callback();
				clearInterval(e);
			}
		},
		100);
	}
	LazyLoad.fadeOut = function(el, val) {
		el.style.filter = "alpha(opacity=" + parseInt(val * 100) + ")";
		el.style.opacity = val;
	}
	function LazyLoad (opt) { 
		
		this._initialize(opt);
	}
	LazyLoad.prototype = {
		_initialize:function (opt) {
			this._opt = opt;
			this._setOptions();
			this._bindEvent();
			this._trigger();
			return this;
		},
		_setOptions: function() {
			var defaults = {
				/**
				*@cfg {String} placeholder 
				*/
				"placeholder" :"o_loading.gif",
				/**
				*@cfg {Number}  threshold 加载范围阈值
				*@default 0 
				*/
				"threshold"    : 0,
				/**
				*@cfg {String}  event 触发事件类型
				*@default scroll
				*/
				"event"        : "scroll",
				/**
				*@cfg {String}  attribute 记录图片地址的属性
				*@default _src
				*/
				"attribute"	 : "data-url",
				/**
				*@cfg {Array}  elems 要延时加载的图片
				*@default null
				*/
				"elems"		 : null,//要显示的图片
				/**
				*@cfg {String}  class  过滤图片的类
				*@default ""
				*/
				"class"		 : "",
				/**
				*@cfg {HtmlElement}  container 图片的容器
				*@default window
				*/
				"container"	 : window,
				/**
				*@cfg {Function}  onDataLoad  图片加载完后出发的函数
				*@default function () {}
				*/
				"onDataLoad"  : function () {}
			};
			this._opts = LazyLoad.extend(defaults,this._opt || {});
			this._isWindow = false;
			this._elems = [];
			this._initContainer();
			this._initElems();
		},
		_initContainer: function() {
			var self = this
			,doc = document
			,db = doc.body
			,dd = doc.documentElement
			,container = this._opts.container;
			this._isWindow = (
				container == window 
				|| container == doc
				|| !container.tagName 
				|| (/^(?:body|html)$/i).test(container.tagName)
			);
			if (this._isWindow) {
				this._container = doc.compatMode == 'CSS1Compat' ?dd:db;
			} 
			else {
				this._container = container;
			} 
			this._binder = this._isWindow?window:this._container;
		},
		_initElems :function () {
			var self = this 
			,hasClass
			,opts = this._opts
			,elems = opts.elems || this._container.getElementsByTagName('img') || []
			,attribute = opts.attribute
			,holder = opts.holder
			,className = opts.className,
			placeholder = opts.placeholder;
			
			LazyLoad.each(elems,function(img){ 
				var _src = img.getAttribute(attribute);
				hasClass = className?(" " + img.className + " ").indexOf(" " + className + " ")+1:1;
				if(hasClass && _src) {
					img.style.cssText +='background: url("'+placeholder+'")  no-repeat scroll center center transparent;';
					self._elems.push(img);
				}
			})
		},
		_bindEvent:function () {
			var self = this
			,_opts = this._opts
			,attribute = _opts.attribute;
			this._bindImg();
			this._delayLoad = function () {
				self._doLoad();
			}
			this._delayResize = function () {
				self._doLoad();
			}
			LazyLoad.E.addEvent(this._binder,_opts.event,self._delayLoad)
			if(this._isWindow) {
				LazyLoad.E.addEvent(this._binder,"resize", LazyLoad.F.bind(self._delayResize,self))
			}
		},
		_bindImg:function () {
			var self = this
			,_opts = this._opts
			,attribute = _opts.attribute;
			LazyLoad.each(this._elems,function(elem){ 
				var _src = elem.getAttribute(attribute);
				elem._LazyLoad = self;
				
				LazyLoad.CE.addEvent(elem,"appear", LazyLoad.F.bind(function() {
					
					var _this = this;
					function onComplete() {
						this.loaded = true;
						this.removeAttribute(this._LazyLoad._opts.attribute);
						LazyLoad.fx (0,1,function (x) {
							LazyLoad.fadeOut(_this,x)
						},function () {})
					}
					if(LazyLoad.ie){
						this.onreadystatechange = function(){
							if(this.readyState == 'complete') {
								onComplete.call(this)
							};
						}
					}else{
						this.onload = function(){
							if(this.complete == true) {
								onComplete.call(this)
							};
						}
					}
					
					LazyLoad.fadeOut(this,0);
					this.setAttribute("src", _src);	
				},elem))
			});
			self._loadRun();
		},
		_doLoad:function () {
			var self = this;
			if(!this._lock){
				this._lock=true;
				setTimeout(function(){self._loadRun()},100);
			}else{
				clearTimeout(this._timer);
				var _=arguments.callee;
				this._timer=setTimeout(function(){_.call(self)},100);
			}
		},
		_loadRun:function(){
			if(this._isFinish()) return;
			var self = this
			,rect = this._getContainerRect()
			,scroll = this._getScroll()
			,left = scroll.left
			,top = scroll.top
			,elems = this._elems
			,threshold = Math.max( 0, this.threshold || 0 );
			this._range = {
				top:	rect.top + top - threshold,
				bottom:	rect.bottom + top + threshold,
				left:	rect.left + left - threshold,
				right:	rect.right + left + threshold
			}
			if(elems.length){
				var newElems = [];
				LazyLoad.each(elems,function(elem,i){ 
					var ret = self._insideRange(elem);
					if(ret&&!elem._loaded) { 
						this._lock=true;
						
						LazyLoad.CE.fireEvent(elem,"appear",{});
						elem._loaded = true;
						self._opts.onDataLoad();
					} else {
						newElems.push(elem);
					}
				})
				this._elems = newElems;
				if(!this._elems.length){
					this.release();
				}
			} 
			this._lock=false;
		},
		_isFinish: function() {
			if ( !this._elems || !this._elems.length ) {
				this.release(); return true;
			}
			else {
				return false;
			}
		},
		_getContainerRect:function () {
			if(this._isWindow && ( "innerHeight" in window )) {
				 return {
					"left":	0, "right":	window.innerWidth,
					"top":	0, "bottom":window.innerHeight
				}
			} else {
				 return this._getRect(this._container);
			}
		},
		_getRect: function(node) {
			var n = node, left = 0, top = 0;
			while (n) { left += n.offsetLeft; top += n.offsetTop; n = n.offsetParent; };
			return {
				"left": left, "right": left + node.offsetWidth,
				"top": top, "bottom": top + node.offsetHeight
			};
		},
		_getScroll:function () {
			if(this._isWindow) {
				var doc = document;
				 return {
					"left": doc.documentElement.scrollLeft || doc.body.scrollLeft,
					"top": doc.documentElement.scrollTop || doc.body.scrollTop
				}
			} else {
				return {
					"left": this._container.scrollLeft, "top": this._container.scrollTop
				}
			}
		},
		_insideRange: function(elem, mode) {
			var range = this._range
			,rect = elem._rect || this._getRect(elem)
			,insideH = rect.right >= range.left && rect.left <= range.right
			,insideV = rect.bottom >= range.top && rect.top-800 <= range.bottom
			,inside = {
				"horizontal":	insideH,
				"vertical":		insideV,
				"cross":		insideH && insideV
			}[ mode || "cross" ];
			return inside;
		  },
		_trigger:function () {
			this._delayLoad();

		},
		release:function(){
			clearTimeout(this._timer);
			if ( this._elems || this._binder ) {
				LazyLoad.E.removeEvent(this._binder,this._opts.event,this._delayLoad);
				if(this._isWindow) {
					LazyLoad.E.removeEvent(this._binder,"resize",this._delayResize );
				}
				this._elems = null;// = this._binder
			}
		},
		setSource:function (imgs) {
			var self = this 
			,hasClass
			,opts = this._opts
			,elems = imgs||[]
			,attribute = opts.attribute
			,holder = opts.holder
			,className = opts.className,
			placeholder = opts.placeholder;
			
			if(!self._elems){
				LazyLoad.E.addEvent(this._binder,opts.event,self._delayLoad)
				if(this._isWindow) {
					LazyLoad.E.addEvent(this._binder,"resize", LazyLoad.F.bind(self._delayResize,self))
				}
			}
				
			self._elems=self._elems||[];
			
			LazyLoad.each(elems,function(img){ 
				var _src = img&&img.getAttribute(attribute);
				if(_src){
					hasClass = className?(" " + img.className + " ").indexOf(" " + className + " ")+1:1;
					if(hasClass && _src) {
						img.style.cssText +='background: url("'+placeholder+'")  no-repeat scroll center center transparent;';
						self._elems.push(img);
					}
				}
			})
			this._bindImg();
		}
	}
	Namespace["LazyLoad"] = LazyLoad;
})(window,undefined);

(function($){
	$.fn.Placeholders = function(options){
		options = options || {};
		var defaults = {
			blurColor: "#999",
			focusColor: "#333",
			auto: true,
			window:window,
			chgClass: "",
			value:"",
			styles:".textarea{border:1px solid #bbb; width:550px; height:80px;}.border{border:1px solid #34538b;}"
		};
		var settings = $.extend(defaults,options);
		(function(){
			
			if ($.browser.isIE) {
				sty = this.window.document.createStyleSheet();
				sty.cssText = defaults.styles
			} else {
				sty = this.window.document.createElement('style');
				sty.type = "text/css";
				sty.textContent = defaults.styles;
				this.window.document.getElementsByTagName('head')[0].appendChild(sty)
			}
		})();
		$(this).each(function(){
			var value=$(this).attr("Placeholders");
			if(defaults.auto){
				$(this).css("color",settings.blurColor);
			}
			var v = $.trim(value);
			if(v){
				$(this).val(v);
				$(this).focus(function(){
					if($.trim($(this).val()) === v){
						$(this).val("");
					}
					$(this).css("color",settings.focusColor);
					if(settings.chgClass){
						$(this).toggleClass(settings.chgClass);
					}
				}).blur(function(){
				
					if($.trim($(this).val()) === ""){
						$(this).val(v);
						$(this).css("color",settings.blurColor);
						if(settings.chgClass){
							$(this).toggleClass(settings.chgClass);
						}
					}
					
				});	
			}
		});
	};
})(jQuery);



var contains = document.compareDocumentPosition ?
function(a, b) {
	return !!(a.compareDocumentPosition(b) & 16);
} : function(a, b) {
	return a !== b && (a.contains ? a.contains(b) : true);
};
var lastTip = null;
function sendWeibo(id){
	
	CB_Open('tnhrf=nopreview,,href=/sendwb.php?id='+id+',,height=460,,width=600,,title=转发微博');
};

function hoverButtonClick(){
	var icon_turn = $('.icon_turn');
	var icon_like = $('.icon_like');
	if(icon_turn.length && icon_like.length){
		$(document.body).bind('click',function(e){
			var tag = e.target||e.srcElement;
			if(tag.className=="icon_turn"){
				
			}
			if(tag.className=="icon_like"){
				
			}
		});
	}
};

$(function() {
	var pics = $(document.body);
	var opts = {
		"placeholder": "images/o_loading.gif",
		"threshold": 0,
		"event": "scroll",
		"attribute": "data-url",
		"elems": null,
		"class": "",
		"container": window,
		"onDataLoad": function () {}
	}
	new LazyLoad(opts);
	//$(".scrollLoading").scrollLoading();
	hoverButtonClick();

	
	// if($.browser.msie && ($.browser.version == "6.0") ){

		// pics.bind("mousemove", function(e) {
			// var tag = e.target || e.srcElement;
			// var toElement = e.relatedTarget || e.toElement;
			// if (tag.tagName == "IMG" && lastTip != tag && tag.parentNode.parentNode.className == "pic") {
				// lastTip = tag;
				// $(tag).parent(".pic_item").removeClass('current').addClass('current')
			// }
		// });
		// $('.pic').bind("mouseout", function(e) {
			// var tag = e.target || e.srcElement;
			// var toElement = e.relatedTarget || e.toElement;
			// if (tag.tagName == "IMG" && toElement) {
				// if (toElement.className != "icon_box" ) {
					// lastTip = null;
					// $(tag).parent(".pic_item").removeClass('current').addClass('current')
				// }
			// }
			// if (tag.className == "pic") {
				// lastTip = null;
				// $(tag).parent(".pic_item").removeClass('current').addClass('current')
			// }
		// });
	// }
	
	$("input[placeholders]").Placeholders({});
	
	

	
  
			

})