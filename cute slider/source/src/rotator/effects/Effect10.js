Cute.Effect10 = function(param){
	Cute.Effect9.prototype.constructor.call(this , param);
	this.counter = 0;
	this._move = param.dir || 'vertical';
};

Cute.Effect10.prototype = new Cute.Effect9();
Cute.Effect10.prototype.constructor = Cute.Effect10;

Cute.Effect10.prototype.getPieceOptions = function(){
	this.dir = this.dir_name_arr[((this.counter ++ %2)?0:1) + ((this._move == 'vertical')? 2 : 0)];
	
	this.updateConfig();
	return this.pieceOptions;
};
