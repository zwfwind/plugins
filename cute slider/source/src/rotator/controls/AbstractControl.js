Cute.rotatorControls = {};

Cute.AbstractControl = function(slider){
	
	this.config = null;
	this.slider = slider;
	this.domElement = null;
	this.disable = false;
	this.name = '';
	this.config = {};
	this.opacity = 100;

	this.showTween = null;
}
		
Cute.AbstractControl.prototype = {
	constructor : Cute.AbstractControl,
	
	setup : function(config_ele){
		
		this.config_ele = config_ele;
		
		this.domElement.className = config_ele.className || this.config.css_class;
		
		if(config_ele.getAttribute('style'))
			this.domElement.setAttribute('style' , config_ele.getAttribute('style')); 
		
		this.slider.addEventListener(Cute.SliderEvent.CHANGE_START , this.__effStart , this);
		this.slider.addEventListener(Cute.SliderEvent.CHANGE_END   , this.__effEnd   , this);
	},
	
	opacityUpdate :function() {
		setOpacity(this.domElement , this.opacity);
	},
	
	visible : function(value){
		this.domElement.style.display = !value ? 'none' : '';
	},
	
	show : function(){
		if(this.showTween)
			this.showTween.stop();
	
		this.showTween = new TWEEN.Tween(this).to( {opacity:100} , 450).onUpdate(this.opacityUpdate).start();
		TWEEN.add(this.showTween);
	},
	
	hide : function(){
		if(this.showTween)
			this.showTween.stop();
	
		this.showTween = new TWEEN.Tween(this).to( {opacity:0} , 450).onUpdate(this.opacityUpdate).start();
		TWEEN.add(this.showTween);
	},
	
	/**
	 * dispatches when the slider transition effect complete
	 */
	__effEnd : function(event) {
			
		this.visible(true);
		
		/*if(this.slider.curretnSlide.pluginData.disableControls != null){
			var disableControls = this.slider.curretnSlide.pluginData.disableControls;
			for(var i , l = disableControls.length ; i<l ; ++i)
				if(disableControls[i] == this.name)
					this.visible(false);
		}*/
		
		
		if(!this.config.autoHide) this.show();		
		if(this.ap)
			this.slider.setAutoPlay(true);
		
	},
	
	/**
	 * dispatches when the slider transtision effect start
	 */
	__effStart : function(event){
		this.hide();
	}	

}
