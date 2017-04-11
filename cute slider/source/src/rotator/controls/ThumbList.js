Cute.ThumbList = function(slider , type) {
	Cute.AbstractControl.call(this,slider);
		
	this.config = {
		css_class : 'br-thumblist',
		type	  : 'vertical'
	};
	
	this.domElement = document.createElement('div');		
	this.thumbs  = [];
};

Cute.rotatorControls.thumblist = Cute.ThumbList;
Cute.ThumbList.prototype = new Cute.AbstractControl();
Cute.ThumbList.prototype.constructor = Cute.ThumbList;

Cute.ThumbList.prototype.setup = function(config_ele) {
	Cute.AbstractControl.prototype.setup.call(this , config_ele);
	
	this.config.type    = config_ele.getAttribute('data-dir')  || 'vertical';
	this.config.autohide    = config_ele.getAttribute('data-autohide')  == 'true';
	
	this.domElement.className += ' ' + this.config.type;
	
	this.list = new Cute.ItemList(this.domElement);
	this.list.type = this.config.type;	

	this.list.frame.className = 'br-thumblist-frame';
	this.list.content.className = 'br-thumblist-content';
	this.list.downright.className = 'br-thumblist-next';
	this.list.upleft.className = 'br-thumblist-previous';
	
	this.slider.addEventListener(Cute.SliderEvent.CHANGE_NEXT_SLIDE , this.update , this);

	var thumb;
	 
	for(var i=0 , l = this.slider.getSlideList().length; i<l ; ++i){
		thumb = new Cute.ListThumb(this.slider.getSlideList()[i].thumb , this.slider , this);
		
		thumb.index = i;
		this.thumbs.push(thumb);
		
		this.list.addItem(thumb.element);
	}	
	
	this.list.sc.setup();
};

Cute.ThumbList.prototype.update = function(){
	if(this.selectedThumb && this.slider.getCurrentSlideIndex() == this.selectedThumb.index) return;
	
	if(this.selectedThumb)
		this.selectedThumb.unselect();
		
	this.selectedThumb = this.thumbs[this.slider.getCurrentSlideIndex()];
	this.selectedThumb.select();
};

Cute.ThumbList.prototype.show = function(){
	if(this.config.autohide)
		Cute.AbstractControl.prototype.show.call(this);
		
	this.disable = false;
};

Cute.ThumbList.prototype.hide = function(){
	if(this.config.autohide)
		Cute.AbstractControl.prototype.hide.call(this);
	this.disable = true;
};


/*--------------------- Thumb -------------------- */

Cute.ListThumb = function(src , slider , thumblist){
 	this.img = new Image();
	this.img.src = src;
	
	this.element = document.createElement('div');
	this.element.className = 'br-list-thumb';
	
	this.select_ele = document.createElement('div');
	this.select_ele.className = 'br-list-thumb-select';
	
	this.element.appendChild(this.img);
	this.element.appendChild(this.select_ele);
	
	setOpacity(this.select_ele , 0);
	this.opacity = 0;

	var thumb = this;
	
	if(thumblist.list.sc.isTouch()){
		this.element.addEventListener('touchend' , function(event){
			if(thumb.selected || thumblist.disable || thumblist.list.sc.moved) return;
			slider.gotoSlide(thumb.index , true);
			event.preventDefault();
			event.stopPropagation();
		} , false);
	}else{
		this.element.onclick = function(){
			if(thumb.selected || thumblist.disable || thumblist.list.sc.moved) return;
			slider.gotoSlide(thumb.index , true);
		};
	}
}

Cute.ListThumb.prototype = {
	constructor : Cute.ListThumb,
	
	opacityUpdate : function(){
		setOpacity(this.select_ele , this.opacity);
	},
	
	select : function(){
		if(this.selected) return;
		this.selected = true;
		if(this.showTween) this.showTween = null;
		this.showTween = new TWEEN.Tween(this).to( {opacity:100} , 450).onUpdate(this.opacityUpdate).start();
	},
	
	unselect : function(){
		if(!this.selected) return;
		this.selected = false;
		if(this.showTween) this.showTween = null;
		this.showTween = new TWEEN.Tween(this).to( {opacity:0} , 450).onUpdate(this.opacityUpdate).start();
	}
}

