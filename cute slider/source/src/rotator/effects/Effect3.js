Cute.Effect3 = function (param){
	Cute.Effect2.prototype.constructor.call(this , param);
	this.dir_name_arr = ['r','l','t','b'];
};

Cute.Effect3.prototype = new Cute.Effect2();
Cute.Effect3.prototype.constructor = Cute.Effect3;

Cute.Effect3.prototype.getPieceOptions = function(){
	this.pieceOptions.dir = this.dir_name_arr[Math.round(parseInt(Math.random() * 3))];
	return this.pieceOptions;
}

