Cute.BarTimer = function(slider){
	Cute.AbstractControl.call(this , slider);
	
	this.config = {
		css_class : 'br-bar-timer'
	};
	
	this.domElement = document.createElement('div');
	this.prog = 0;
	
};


Cute.rotatorControls.bartimer = Cute.BarTimer; 
Cute.BarTimer.prototype = new Cute.AbstractControl();
Cute.BarTimer.prototype.constructor = Cute.BarTimer;

Cute.BarTimer.prototype.update = function(e){
	if(this.drawTween)
		this.drawTween.stop();
		
	this.drawTween = new TWEEN.Tween(this).to( {prog:this.slider.delayProgress() * 0.01} , 500).easing(TWEEN.Easing.Quartic.EaseOut).onUpdate(this.draw).start();
};


Cute.BarTimer.prototype.draw = function(){
	var pos = this.prog * this.slider.width;
	this.glow.style.left = pos -  this.glow.offsetWidth + 'px';
	this.bar.style.width = Math.max(0 , pos -  5 ) + 'px';	
};

Cute.BarTimer.prototype.setup = function(config_ele){
	Cute.AbstractControl.prototype.setup.call(this,config_ele);
	
	this.slider.bartimer = this;
	
	this.domElement.style.width = '100%';
	this.domElement.style.overflow = 'hidden';
	
	this.glow = document.createElement('div');
	this.glow.className = 'br-timer-glow';
	this.glow.style.position = 'relative';
	
	this.bar = document.createElement('div');
	this.bar.className = 'br-timer-bar';
	
	
	this.domElement.appendChild(this.glow);
	this.domElement.appendChild(this.bar);
	
	
	this.slider.addEventListener(Cute.SliderEvent.WATING , this.update , this);
	this.draw();
};
