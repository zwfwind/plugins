Cute.SlideControl = function(slider) {
	Cute.AbstractControl.call(this,slider);
	
	this.config = {
		css_class : 'br-slidecontrol',
		thumb	  : true,
		thumb_align : 'bottom'
	};
	
	this.domElement = document.createElement('div');
	this.points_ul	= document.createElement('ul');
			
	this.points     = [];

};

Cute.rotatorControls.slidecontrol = Cute.SlideControl;
Cute.SlideControl.prototype = new Cute.AbstractControl();
Cute.SlideControl.prototype.constructor = Cute.SlideControl;

Cute.SlideControl.prototype.setup = function(config_ele) {
	Cute.AbstractControl.prototype.setup.call(this , config_ele);
	
	this.domElement.appendChild(this.points_ul);
	this.slider.addEventListener(Cute.SliderEvent.CHANGE_NEXT_SLIDE , this.update , this);
	
	this.config.thumb       = config_ele.getAttribute('data-thumb') != 'false';
	this.config.thumb_align = config_ele.getAttribute('data-thumbalign') || 'bottom';
	
	var point;
	 
	for(var i=0 , l = this.slider.getSlideList().length; i<l ; ++i){
		point = new Cute.SlideControl.Point(this.slider , this.slider.getSlideList()[i] , this);
		if(i == this.slider.getCurrentSlideIndex()){
			this.selectedPoint = point;
		 	point.select();
		}
		 
		 point.index = i;
		 
		 this.points_ul.appendChild(point.domElement);	
		 this.points.push(point);
	}
	
	
};

Cute.SlideControl.prototype.update = function(){
	if(this.selectedPoint && this.slider.getCurrentSlideIndex() == this.selectedPoint.index) return;
	
	if(this.selectedPoint)
		this.selectedPoint.unselect();
		
	this.selectedPoint = this.points[this.slider.getCurrentSlideIndex()];
	this.selectedPoint.select();
	
};

Cute.SlideControl.prototype.show = function(){
	Cute.AbstractControl.prototype.show.call(this);
	this.disable = false;
	this.domElement.style.cursor = 'pointer';
};

Cute.SlideControl.prototype.hide = function(){
	Cute.AbstractControl.prototype.hide.call(this);
	this.disable = true;
	this.domElement.style.cursor = 'default';
};


Cute.SlideControl.Point = function(slider ,slide , slideControl){
	this.domElement = document.createElement('li');
	this.slider = slider;	
	this.index = 0;
	this.domElement.point = this;
	this.sc= slideControl;
	
	this.domElement.onclick = function () {
		if(this.point.sc.disable) return;
		this.point.changeSlide();
	};
	
	if(Cute.FallBack.ua.browser.name == 'IE')
		this.domElement.style.filter = 'inherit';
	

	this.selectedElement = document.createElement('span');
	this.selectedElement.className = 'br-control-selected';
	this.selectOpacity = 0;
	this.uo();
	
	
	if(slideControl.config.thumb){
		this.thumb = new Cute.Thumb(slide.thumb , slideControl.config.thumb_align );
		this.domElement.onmouseover = function(){this.point.showThumb();};
		this.domElement.onmouseout  = function(){this.point.hideThumb();};
		this.thumb_pos 		= 0;
		this.drawThumb ();
		this.thumb.domElement.style.display = 'none';	
		this.domElement.appendChild(this.thumb.domElement);
		this.thumb.align = slideControl.config.thumb_align;
	}
			
	this.domElement.appendChild(this.selectedElement);
	
	this.selectTween = null;
	
};



Cute.SlideControl.Point.prototype = {
	constructor : Cute.SlideControl.Point,
	
	align:'bottom',
	
	changeSlide : function(){
		this.slider.gotoSlide(this.index ,true);
	},
	
	uo : function(){
		setOpacity(this.selectedElement , this.selectOpacity);
	},
	
	select : function(){
		if(this.selectTween)
			this.selectTween.stop();
	
		this.selectTween = new TWEEN.Tween(this).to( {selectOpacity:100} , 450).onUpdate(this.uo).start();
		TWEEN.add(this.selectTween);
	},
	
	unselect : function(){
		if(this.selectTween)
			this.selectTween.stop();
	
		this.selectTween = new TWEEN.Tween(this).to( {selectOpacity:0} , 450).onUpdate(this.uo).start();
		TWEEN.add(this.selectTween);
	},
	
	drawThumb : function(){
		setOpacity(this.thumb.domElement , this.thumb_pos);

		if(this.sc.config.thumb_align == 'up')
			this.thumb.domElement.style.top = 10 -this.thumb.frame.offsetHeight + - this.thumb_pos * 0.1 + 'px';
		else
			this.thumb.domElement.style.top = 24 + - this.thumb_pos * 0.1 + 'px';
	},
	
	showThumb :function (){
		this.domElement.style.zIndex = this.slider.getSlideList().length;
		if(this.thumbTween)
			this.thumbTween.stop();
		
		this.thumb.show();
		this.thumb.domElement.style.display = '';
		
		this.thumbTween = new TWEEN.Tween(this).to( {thumb_pos:100} , 700).onUpdate(this.drawThumb).easing(TWEEN.Easing.Quartic.EaseOut).start();
	},
	
	hideThumb : function () {
		this.domElement.style.zIndex = 0;
		if(this.thumbTween)
			this.thumbTween.stop();
			
		this.thumb.reset();
		this.thumbTween = new TWEEN.Tween(this).to( {thumb_pos:0} , 250).onUpdate(this.drawThumb).start().onComplete(function(){
			this.thumb.domElement.style.display = 'none';
		});
	}
};

