Cute.Effect4 = function (param){
	Cute.Effect3.prototype.constructor.call(this , param);
	this.counter = 0;
	this.rotation_dir = param.dir || 'vertical';
};

Cute.Effect4.prototype = new Cute.Effect3();
Cute.Effect4.prototype.constructor = Cute.Effect4;

Cute.Effect4.prototype.getPieceOptions = function(){
	this.pieceOptions.dir = this.dir_name_arr[((this.counter ++ %2)?0:1) + ((this.rotation_dir == 'vertical')? 2 : 0)];
	return this.pieceOptions;
}