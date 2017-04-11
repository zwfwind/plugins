Cute.InfoList = function(slider , type) {
	Cute.AbstractControl.call(this,slider);
		
	this.config = {
		css_class : 'br-infolist',
		type	  : 'vertical'
	};
	
	this.domElement = document.createElement('div');		
	this.items  = [];
};

Cute.rotatorControls.infolist = Cute.InfoList;
Cute.InfoList.prototype = new Cute.AbstractControl();
Cute.InfoList.prototype.constructor = Cute.InfoList;

Cute.InfoList.prototype.setup = function(config_ele) {
	Cute.AbstractControl.prototype.setup.call(this , config_ele);
	
	this.config.type    = config_ele.getAttribute('data-dir')  || 'vertical';
	this.config.autohide= config_ele.getAttribute('data-autohide')  == 'true';
	
	this.domElement.className += ' ' + this.config.type;
	
	this.list = new Cute.ItemList(this.domElement);
	this.list.type = this.config.type;	

	this.list.frame.className     = 'br-infolist-frame';
	this.list.content.className   = 'br-infolist-content';
	this.list.downright.className = 'br-infolist-next';
	this.list.upleft.className    = 'br-infolist-previous';
	
	this.slider.addEventListener(Cute.SliderEvent.CHANGE_NEXT_SLIDE , this.update , this);

	var item;
	 
	for(var i=0 , l = this.slider.getSlideList().length; i<l ; ++i){
		item = new Cute.ListItem(this.slider.getSlideList()[i].pluginData.info , this.slider , this);
		
		item.index = i;
		this.items.push(item);
		
		this.list.addItem(item.element);
	}	
	
	this.list.sc.setup();
};

Cute.InfoList.prototype.update = function(){
	if(this.selectedThumb && this.slider.getCurrentSlideIndex() == this.selectedThumb.index) return;
	
	if(this.selectedThumb)
		this.selectedThumb.unselect();
		
	this.selectedThumb = this.items[this.slider.getCurrentSlideIndex()];
	this.selectedThumb.select();
};

Cute.InfoList.prototype.show = function(){
	if(this.config.autohide)
		Cute.AbstractControl.prototype.show.call(this);
		
	this.disable = false;
};

Cute.InfoList.prototype.hide = function(){
	if(this.config.autohide)
		Cute.AbstractControl.prototype.hide.call(this);
	this.disable = true;
};


/*--------------------- List Item -------------------- */

Cute.ListItem = function(info , slider , infolist){	
	this.element = document.createElement('div');
	this.element.className = 'br-slist-item';
	
	this.select_ele = document.createElement('div');
	this.select_ele.className = 'br-slist-item-select';
	
	this.content = document.createElement('div');
	this.content.innerHTML = info ? info.text : '';
	this.content.className = 'br-slist-item-content';
	
	this.element.appendChild(this.select_ele);
	this.element.appendChild(this.content);
	
	setOpacity(this.select_ele , 0);
	this.opacity = 0;

	var item = this;
	
	if(infolist.list.sc.isTouch()){
		this.element.addEventListener('touchend' , function(event){
			if(item.selected || infolist.disable || infolist.list.sc.moved) return;
			slider.gotoSlide(item.index , true);
			event.preventDefault();
			event.stopPropagation();
		} , false);
	}else{
		this.element.onclick = function(){
			if(item.selected || infolist.disable || infolist.list.sc.moved) return;
			slider.gotoSlide(item.index , true);
		};
	}
}

Cute.ListItem.prototype = {
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

