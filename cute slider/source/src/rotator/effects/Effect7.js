Cute.Effect7 = function(param){
	Cute.Effect6.prototype.constructor.call(this , param);
	this.counter = 0;
	this._move  = param.dir || 'vertical';
}

Cute.Effect7.prototype = new Cute.Effect6();
Cute.Effect7.prototype.constructor = Cute.Effect7;

Cute.Effect7.prototype.getPieceOptions = function(){
	this.side = this.slide_name_arr[((this.counter ++ %2)?0:1) + ((this._move == 'vertical')? 2 : 0)];
	
	this.checkSidePos();
	return this.pieceOptions;
}

