Averta = {};
Averta.Timer = function(delay , autoStart) {
	this.delay = delay;
	this.currentCount = 0;
	this.paused = false;
	this.onTimer = null;
	this.refrence = null;
	
	if(autoStart) this.start();
	
}

Averta.Timer.prototype = {
	
	constructor : Averta.Timer,
	
	start : function(){
		this.paused = false;
		this.lastTime = Date.now();
	},
	
	stop : function(){
		this.paused = true;
	},
	
	reset : function(){
		this.currentCount = 0;
		this.paused = true;
		this.lastTime = Date.now();
	},
	
	update : function(){
		if(this.paused || Date.now() - this.lastTime < this.delay) return;
		this.currentCount ++;
		this.lastTime = Date.now();
		if(this.onTimer)
			this.onTimer.call(this.refrence , this.getTime());
		
	} ,
	
	getTime : function(){
		return this.delay * this.currentCount;
	}
	
}