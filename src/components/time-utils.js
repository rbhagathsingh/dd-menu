
function getSelector(ele, attr) {
	let targetEle = null;
	if(typeof ele === 'string') {
		return ele;
	}
	if(ele instanceof Node){ 
		if(ele.className || attr === 'class') {
			targetEle = '.'+ele.className.replaceAll(' ', '.');
		}
		if(ele.id || attr === 'id') {
			targetEle = '#' + ele.id;
		}
		if((!ele.className && !ele.id) || attr === 'tag'){
			targetEle = ele.nodeName;
		}
	}
	return targetEle; 
}

Node.prototype.getScrollableParent = function () {
    var el = this;

    do {
        let styles = window.getComputedStyle(el);
        let scroll = styles.getPropertyValue('overflow');
        let scrollx = styles.getPropertyValue('overflow-x');
        let scrolly = styles.getPropertyValue('overflow-y');
        
        if(scroll === 'auto' || scrollx === 'auto' || scrolly === 'auto') {
            return el;
        }
            
        el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    
    return null;
};

 Node.prototype.find = function(selector) {
    return this.querySelector(selector);
 };

 Node.prototype.deepPosition = function() {
	let ele = this;
    let left = 0;
	let top = 0;
	let el = ele;
	while( el ){
		
		left += el.offsetLeft || 0;
		top += el.offsetTop || 0;
		el = el.offsetParent;
	}
	return {
		left: left,
		top: top
	}
 };

 Node.prototype.offset = function(isCurrentPosition) {
	 let offsetObj = isCurrentPosition ? {left: this.offsetLeft, top: this.offsetTop} : this.deepPosition();
    return offsetObj;
 };

 Node.prototype.findAll = function(selector) {
    return this.querySelectorAll(selector);
 };
 
 Node.prototype.addClass = function(cls) {
	this.classList.add(cls);
	return this;
 }
 Node.prototype.removeClass = function(cls) {
	this.classList.remove(cls);
	return this;
 }
 Node.prototype.hasClass = function(cls) {
	return this.classList.contains(cls);
 }
 Node.prototype.toggleClass = function(cls, isBool) {
	if(!cls) {
		return this;
	}
	this.classObj = this.classObj || {};
	if(isBool === undefined) {
		this.classObj[cls] = !this.classObj[cls];
	}else {
		this.classObj[cls] = isBool;
	}
	if(this.classObj[cls]) {
		this.classList.add(cls);
	}else {
		this.classList.remove(cls);
	}
	
	return this;
}

 Node.prototype.outerHeight = function(cls) {
    return this.offsetHeight;
 }
 Node.prototype.outerWidth = function(cls) {
    return this.offsetWidth;
 }
 Node.prototype.show = function(cls) {
   // this.removeAttribute('style');
    this.style.display = 'block';
    return this;
 }
 Node.prototype.hide = function(cls) {
    this.style.display = 'none';
    return this;
 }
 Node.prototype.empty = function() {
    this.innerHTML = '';
    return this;
 }
 Node.prototype.html = function( val) {
    this.innerHTML = val;
 }
 Node.prototype.html = function(html) {
    if(html) {
        this.innerHTML = html;
        return this;
    }
    return this.innerHTML;
 }
 Node.prototype.css = function(obj, value) {
     if(typeof obj === 'string' && !value) {
         let val = this.style[obj];
         return val;
     }
	 if(obj && value && (typeof obj === 'string' && typeof value === 'string')) {
		 this.style[obj] = value;
		 return this;
	 }
    for(let i in obj) {
		let val = isNaN(Number(obj[i]));
        this.style[i] = val ?  obj[i] : (obj[i] + 'px');
    }
    return this;
 }
 Node.prototype.on = Window.prototype.on =  function(eventName, callBack, bubbling) {
	let events = eventName.split(' ');
	this.eventObj = this.eventObj || {};
	let _this = this;
	events.forEach(function(eventStr){
		_this.eventObj[eventStr] = callBack.bind(_this);
		let evtName = eventStr.split('.')[0];
		_this.addEventListener(evtName, _this.eventObj[eventStr], bubbling ? bubbling : false);
	});
   return this;
}
Node.prototype.off =  Window.prototype.off = function(eventName, bubbling) {
	let events = eventName.split(' ');
    let _this = this;
	events.forEach(function(eventStr){
        let evtName = eventStr.split('.')[0];
        if(_this.eventObj && _this.eventObj[eventStr]) {
            _this.removeEventListener(evtName, _this.eventObj[eventStr], bubbling ? bubbling : false);
            delete _this.eventObj[eventStr];
        }
	});
   return this;
}

Node.prototype.trigger = function(eventName) {
    var event = new Event(eventName);
    this.dispatchEvent(event);
    return this;
}
Node.prototype.triggerHandler = function(eventName) {
    var event = new Event(eventName);
    this.dispatchEvent(event);
    return this;
}

Node.prototype.prop = function(key, value) {
	let tags = ['INPUT', 'SELECT', 'TEXTAREA'];
	let nodeName = this.nodeName;
	if(tags.indexOf(nodeName) === -1) {
		return this;
	}
	if (key && value) {
		this.setAttribute(key, value);
		return this;
	}else if(key && !value) {
		return this[key];
	}
	return this;
}
 HTMLCollection.prototype.each = NodeList.prototype.each = function(callBack) {
	 let k = 0;
	 while( k < this.length) {
		callBack.call(this, this[k], k, this);
	 }
 }

 Node.prototype.appendTo = function( selector ) {
	let ele = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if(ele) {
        ele.appendChild(this);
    }
	return this; 
 }
 Node.prototype.clone = function(ele) {
	 if(ele) {
		 let eleObj = typeof ele === 'string' ? this.stringToHTML(ele) : document.querySelector(ele);
		 return eleObj.cloneNode( true );
	 }else {
		return this.cloneNode( true );
	 }
	
 }
 Node.prototype.stringToHTML = function(htmlString) {
	let parser = new DOMParser();
	let doc = parser.parseFromString(htmlString, "text/html");
	return doc.body.children[0];
 }

 Date.prototype.getDateObj = function() {
	let hour = this.getHours();
	return {
		hour: hour,
		minute: this.getMinutes(),
		seconds: this.getSeconds(),
		milliseconds: this.getMilliseconds(),
		day: this.getDay(),
		date: this.getDate(),
		month: this.getMonth(),
		year: this.getFullYear(),
		amPm: hour > 11 ? 'PM' : 'AM'
	}
}

module.exports = {
    timeoutObj: {},
    timeout: function(key, callback, time = 0) {
        this.timeoutObj[key] = setTimeout(callback, time);
    },
    clearTimer: function(key) {
        clearTimeout(this.timeoutObj[key]);
        delete this.timeoutObj[key];
    }
}