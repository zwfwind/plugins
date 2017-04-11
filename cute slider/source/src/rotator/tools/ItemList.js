Cute.ItemList = function(element){
	
	this.frame   = document.createElement('div');
	this.frame.className = 'il-frame';
	
	this.content = document.createElement('div');
	this.content.className = 'il-content';
	
	this.type = 'vertical';
	this.items = [];
	
	this.sc = new Averta.ScrollContainer(this.frame , this.content);
	
	var il = this;
	var dir = 0;
	var down = false;
	
	var it = this.sc.isTouch()
	
	this.__scrollnext = function(e){
		down = true;
		dir = 2;
		Cute.Ticker.add(il.__scrolling , il);
		if(it) e.preventDefault();
	};
	
	this.__scrollprev = function(e){
		down = true;
		dir = -2;
		Cute.Ticker.add(il.__scrolling , il);
		if(it) e.preventDefault();
	};
	
	this.__stopscroll = function(e){ 
		if(!down)return;
		down = false;
		Cute.Ticker.remove(il.__scrolling , il);
		il.sc.moved = false;
		if(it) e.preventDefault();
	};
	
	this.__scrolling = function(){
		if(il.type == 'vertical')
			il.sc.translate(0 , dir);
		else
			il.sc.translate(-dir , 0);
	};
	
	this.upleft = document.createElement('div');
	this.upleft.onmousedown = this.__scrollprev;
	
	this.downright = document.createElement('div');
	this.downright.onmousedown = this.__scrollnext;
	
	document.onmouseup = this.__stopscroll;
	
	
	if(it){
		this.upleft.addEventListener   ('touchstart' , this.__scrollprev , false);
		this.downright.addEventListener('touchstart' , this.__scrollnext , false);
		document.addEventListener('touchend' , this.__stopscroll , false);
	}
	
	
	element.appendChild(this.frame);
	element.appendChild(this.downright);
	element.appendChild(this.upleft);
	this.frame.appendChild(this.content);
	
	this.addItem = function(itemEle){
		this.content.appendChild(itemEle);
		this.items.push(itemEle);
	};
};

