Cute.Captions = function(slider){
	Cute.AbstractControl.call(this , slider);
	
	this.config = {
		css_class : 'br-captions'
	}
	
	this.domElement = document.createElement('div');
	this.captions = [];
	this.overpause = false;
};


Cute.rotatorControls.captions = Cute.Captions;
Cute.Captions.prototype = new Cute.AbstractControl();
Cute.Captions.prototype.constructor = Cute.Captions;

Cute.Captions.prototype.setup = function(config_ele){
	Cute.AbstractControl.prototype.setup.call(this,config_ele);
	this.domElement.style.width  = '100%';
	this.domElement.style.height = '100%';
	this.domElement.style.position = 'absolute';
};	

Cute.Captions.prototype.show = function(){
	
	this.data = this.slider.getCurrentSlide().pluginData.captions;
	this.slide_index = this.slider.getCurrentSlideIndex();
	
	if(!this.captions[this.slide_index] && this.data){
		
		this.captions[this.slide_index] = [];
		
		var cps_li = this.data.getElementsByTagName('li');
		var caption;
		
		for(var i = 0 , l = cps_li.length; i < l ; ++i){
			caption = new Cute.Caption();
			caption.add(cps_li[i].innerHTML , cps_li[i].className);
			caption.delay = Number(cps_li[i].getAttribute('data-delay')) || 0;
			caption.effect = cps_li[i].getAttribute('data-effect') || 'fade';
			this.captions[this.slide_index].push(caption);
		}
	}

	if(this.data){
		for(var i = 0 , l = this.captions[this.slide_index].length ; i < l ; ++i){
			this.domElement.appendChild(this.captions[this.slide_index][i].domElement);
			this.captions[this.slide_index][i].show();
		}
	}
}

Cute.Captions.prototype.hide = function(){
	if(this.captions[this.slide_index]){
		for(var i = 0 , l = this.captions[this.slide_index].length ; i < l ; ++i){
			this.captions[this.slide_index][i].hide();
		}
	}
}


Cute.Caption = function() {
	this.domElement = document.createElement('div');
	this.content = document.createElement('div');
	
	
	//this.domElement.style.filter = 'inherit';
	//this.content.style.filter  = 'inherit';
	
};

Cute.Caption.prototype = {
	constructro : Cute.Caption,
	
	effect : 'fade',
	
	add : function (cont , css_class){
		this.content.innerHTML = cont;
		
		this.content.className = 'br-caption-content';
		this.content.style.position = 'relative';
		
		this.domElement.className = css_class;
		this.domElement.style.overflow = 'hidden';
		
		this.domElement.appendChild(this.content);
		
	},
	
	fade : function(){
		setOpacity(this.domElement, this.show_pos);
	},
	
	slide : function(){
		this.content.style.left = -this.domElement.offsetWidth * ( 1 - this.show_pos * 0.01 ) + 'px';
	},
		
	show : function(){
		if(this.showTween)
			this.showTween.stop();
		
		this.show_pos = 0;
		this[this.effect]();
		
		this.showTween = new TWEEN.Tween(this).to({show_pos:100} , 1000).delay(this.delay)
											  .easing(TWEEN.Easing.Quartic.EaseInOut)
											  .onUpdate(this[this.effect])
											  .delay(this.delay)
											  .start();
		TWEEN.add(this.showTween);
	},
	
	hide : function() {
		if(this.showTween)
			this.showTween.stop();
		 
		this.showTween = new TWEEN.Tween(this).to({show_pos:0} , 1000)//.delay(this.delay)
											  .easing(TWEEN.Easing.Quartic.EaseInOut)
											  .onUpdate(this[this.effect])
											  .onComplete(this.remove)
											  .start();
	},
	
	remove : function (){
		if(this.domElement.parentElement)
			this.domElement.parentElement.removeChild(this.domElement);
	}
}


