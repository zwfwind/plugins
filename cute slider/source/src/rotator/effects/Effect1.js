Cute.Effect1 = function (param){
	
	Aroma.Effect.prototype.constructor.call(this);
	
	param = param || {};
	
	this.ease = param.ease || TWEEN.Easing.Linear;
	
	this.isStatic = true;
};

Cute.Effect1.prototype = new Aroma.Effect();
Cute.Effect1.prototype.constructor = Cute.Effect1;

Cute.Effect1.prototype.getToVars = function(){
	this.addFrame(1 , {  opacity:100   } ,  {ease:this.ease.EaseOut} );
};
		
Cute.Effect1.prototype.getFromVars = function(){ return {opacity:0 , slide:100  };};

Cute.Effect1.prototype.prepare = function(){
	this.getFrom = this.getFrom ||  this.getFromVars;
	this.getTo =  this.getTo 	|| this.getToVars;
}
