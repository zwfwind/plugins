Cute.Effect12 = function(param){
	Cute.Effect11.prototype.constructor.call(this , param);
	
	this.dir_name_arr =  ['tl','tr','bl','br'];
};

Cute.Effect12.prototype = new Cute.Effect11();
Cute.Effect12.prototype.constructor = Cute.Effect12;

Cute.Effect12.prototype.getPieceOptions = function(){
	this.dir = this.dir_name_arr[Math.round(parseInt(Math.random() * 3))];
	
	this.updateConfig();
	return this.pieceOptions;
};