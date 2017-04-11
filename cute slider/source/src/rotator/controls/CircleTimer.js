Cute.CircleTimer = function(slider){
	Cute.AbstractControl.call(this , slider);
	this.domElement = document.createElement('div');
	
	this.lbrowser = (Cute.FallBack.ua.browser.name.toLowerCase() == 'ie'  && parseInt(Cute.FallBack.ua.browser.major) < 9);
	
	if(this.lbrowser) return;
	

	this.config = {
		color : '#A2A2A2',
		stroke : 10,
		radius: 4,
		css_class : 'br-circle-timer'
	};
	
	this.overpause = false;
	
	this.canvas     = document.createElement('canvas');
	this.dot        = document.createElement('div');	
	this.ctx		= this.canvas.getContext('2d');
	this.prog		= 0;
	this.drawTween  = null;
};

Cute.rotatorControls.circletimer = Cute.CircleTimer;
Cute.CircleTimer.prototype = new Cute.AbstractControl();
Cute.CircleTimer.prototype.constructor = Cute.CircleTimer;

Cute.CircleTimer.prototype.setup = function(config_ele){
	if(this.lbrowser) return;
	
	Cute.AbstractControl.prototype.setup.call(this , config_ele);
	
	this.config.color  = config_ele.getAttribute('data-color') || this.config.color;
	if(config_ele.getAttribute('data-stroke')) this.config.stroke = parseInt(config_ele.getAttribute('data-stroke'));
	if(config_ele.getAttribute('data-radius')) this.config.radius = parseInt(config_ele.getAttribute('data-radius'));
	
	this.__w = (this.config.radius + this.config.stroke) * 2;

	
	this.canvas.width  = this.__w;
	this.canvas.height = this.__w;
	this.canvas.className = 'br-timer-stroke';
	this.canvas.style.position = 'absolute';
	
	
	this.dot.className      = 'br-timer-dot';
	this.dot.style.position = 'relative';
	this.dot.style.left     = (this.__w - 10)  * .5 + 'px';
	this.dot.style.top      = (this.__w - 12) * .5 + 'px';
	
	this.domElement.slider = this.slider;
	this.domElement.onclick = function(){
		if(!Cute.AbstractControl.paused) {
			Cute.AbstractControl.paused = true;
			this.slider.setAutoPlay(false);
		}else {
		 	Cute.AbstractControl.paused = false;
			this.slider.setAutoPlay(true);
		 }
	};
	
	this.slider.addEventListener(Cute.SliderEvent.WATING , this.update , this);
	
	this.domElement.appendChild(this.canvas);
	this.domElement.appendChild(this.dot);
};

Cute.CircleTimer.prototype.update = function(e){
	if(this.drawTween)
		this.drawTween.stop();
		
	this.drawTween = new TWEEN.Tween(this).to( {prog:this.slider.delayProgress() * 0.01} , 300).easing(TWEEN.Easing.Circular.EaseOut).onUpdate(this.draw).start();
};

Cute.CircleTimer.prototype.draw = function(){
	this.ctx.clearRect(0 , 0,  this.__w ,  this.__w);
	this.ctx.beginPath(); 
	this.ctx.arc(this.__w * .5 , this.__w * .5 ,this.config.radius , Math.PI * 1.5 , Math.PI * 1.5 + 2 * Math.PI * this.prog, false);
	this.ctx.strokeStyle = this.config.color;
	this.ctx.lineWidth = this.config.stroke;
	this.ctx.stroke();
};

Cute.CircleTimer.prototype.show = function() {Cute.AbstractControl.prototype.show.call(this); this.domElement.style.cursor = 'pointer';};
Cute.CircleTimer.prototype.hide = function() {Cute.AbstractControl.prototype.hide.call(this); this.domElement.style.cursor = '';};
