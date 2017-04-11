Cute.Effect9 = function(param){
	Cute.Effect8.prototype.constructor.call(this , param);
	
	this.dir_name_arr = ['l','r','u','d'];
};

Cute.Effect9.prototype = new Cute.Effect8();
Cute.Effect9.prototype.constructor = Cute.Effect9;

Cute.Effect9.prototype.getPieceOptions = function(){
	this.dir = this.dir_name_arr[Math.round(parseInt(Math.random() * 3))];
	
	this.updateConfig();
	return this.pieceOptions;
};