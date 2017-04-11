Cute.SlideInfo = function (slider){
	Cute.AbstractControl.call(this , slider);	
	
	this.config = {
		css_class : 'br-slideinfo',
		align     : 'bottom'
	}
	
	this.domElement = document.createElement('div');
	this.content    = document.createElement('div');
	
	this.poition = 0;
	
};

Cute.rotatorControls.slideinfo = Cute.SlideInfo;
Cute.SlideInfo.prototype = new Cute.AbstractControl();
Cute.SlideInfo.prototype.constructor = Cute.SlideInfo;

Cute.SlideInfo.prototype.setup = function(config_ele){
	Cute.AbstractControl.prototype.setup.call(this , config_ele);
	
	this.domElement.style.overflow = 'hidden';
	this.domElement.style.position = 'absolute';
	this.domElement.style.display = 'none';
		
	this.content.className	    = 'br-infocontent';
	this.content.style.position = 'relative';
	
	this.eff = config_ele.getAttribute('data-effect') || 'slide';
	
	this.domElement.appendChild(this.content);
};

Cute.SlideInfo.prototype.update = function(){
	if(this.data){
		if(this.eff == 'fade')
			setOpacity(this.content , this.position);
		else
			this.content.style[this.data.align] = this.position + 'px';
	}
		
	
	//if(this.data.align == 'bottom' && this.slider.bartimer){
	//	this.slider.bartimer.domElement.style.bottom = this.content.offsetHeight + this.position + 'px';
	//}
};

Cute.SlideInfo.prototype.show = function(){	
	this.domElement.style.display = '';
	
	if(this.showTween)
		this.showTween.stop();
	
	this.data = this.slider.getCurrentSlide().pluginData.info;
	
	if(!this.data){
		this.disable = true;
		this.content.className = '';
		this.content.innerHTML = '';
		return;
	}else
		this.disable = false;
	
	this.content.innerHTML = this.data.text;

	this.content.className	    = 'br-infocontent ' + this.data.align + ' ' + this.data._class || '';
	
	this.domElement.style.width  = ((this.data.align == 'left'   || this.data.align == 'right') ? 'auto' : '100%' ) ;
	this.domElement.style.height = ((this.data.align == 'bottom' || this.data.align == 'top')   ? 'auto' : '100%' ) ;

	this.domElement.style.left   = '';
	this.domElement.style.right  = '';
	this.domElement.style.bottom = '';
	this.domElement.style.top    = '';
	
	this.content.style.left   = '';
	this.content.style.right  = '';
	this.content.style.bottom = '';
	this.content.style.top    = '';
	
	if(this.eff == 'slide')
		this.position = -(this.data.align == 'bottom' || this.data.align == 'top'   ? this.content.offsetHeight : this.content.offsetWidth);
	else
		this.position = 0;
		
	this.domElement.style[this.data.align] = '0px';
	
	this.update();
			
	this.showTween = new TWEEN.Tween(this).to( {position:(this.eff == 'slide')?0:100} , 950).easing(TWEEN.Easing.Quartic.EaseInOut).onUpdate(this.update).start();
	TWEEN.add(this.showTween);

};

Cute.SlideInfo.prototype.hide = function(){
	if(this.disable) return;
	
	if(this.showTween)
		this.showTween.stop();
		
	this.showTween = new TWEEN.Tween(this)
					.to( {position:
						(this.eff != 'slide') ? 0 : -(this.data.align == 'bottom' || this.data.align == 'top'   ? this.content.offsetHeight : this.content.offsetWidth)} , 850)
					.easing(TWEEN.Easing.Quartic.EaseInOut)
					.onUpdate(this.update)
					.start();
					
	TWEEN.add(this.showTween);
};