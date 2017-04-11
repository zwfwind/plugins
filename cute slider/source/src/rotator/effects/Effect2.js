Cute.Effect2 = function (param){
	
	Aroma.Effect.prototype.constructor.call(this);
	
	param = param || {};
	
	this.pieceOptions.dir  = param.dir  || 'r';
	this.pieceOptions.push = param.push;
	this.ease = param.ease || TWEEN.Easing.Linear;
	this.fade = param.fade;
	
	this.isStatic = true;
};

Cute.Effect2.prototype = new Aroma.Effect();
Cute.Effect2.prototype.constructor = Cute.Effect2;

Cute.Effect2.prototype.getToVars = function(){
	this.addFrame(1 , this.fade ? {opacity:100 , slide:100} : {slide:100} ,  {ease:this.ease.EaseInOut} );
};
		
Cute.Effect2.prototype.getFromVars = function(){ return this.fade ? {opacity:0 , slide:0} : {slide:0};};

Cute.Effect2.prototype.prepare = function(){
	this.getFrom = this.getFrom ||  this.getFromVars;
	this.getTo =  this.getTo 	|| this.getToVars;
};

