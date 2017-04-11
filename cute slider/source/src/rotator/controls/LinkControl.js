Cute.LinkControl = function(slider){
	Cute.AbstractControl.call(this , slider);
	this.config = {css_class:'br-link'}
	this.domElement = document.createElement('div');
	this.domElement.style.position = 'absolute'
};

Cute.rotatorControls.link = Cute.LinkControl;
Cute.LinkControl.prototype = new Cute.AbstractControl();
Cute.LinkControl.prototype.constructor = Cute.LinkControl;

Cute.LinkControl.prototype.setup = function(config_ele){
	Cute.AbstractControl.prototype.setup.call(this , config_ele);
	this.domElement.lc = this;
	this.domElement.style.width = '100%';
	this.domElement.style.height = '100%';
	this.domElement.style.cursor = 'pointer';
};

Cute.LinkControl.prototype.gotoURL = function(){
	window.open(this.lc.link.href , this.lc.link.target || '_self');
};

Cute.LinkControl.prototype.show = function(){
	
	this.link = this.slider.getCurrentSlide().pluginData.link;
	
	if(this.link){
		this.domElement.style.display = '';
		this.domElement.onclick = this.gotoURL;
	}else{
		this.domElement.style.display = 'none';
		this.domElement.onclick = null;
	}
};

Cute.LinkControl.prototype.hide = function(){
	this.domElement.style.display = 'none';
	this.domElement.onclick = null;
};