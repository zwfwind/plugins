Cute.Effect6 = function(param){
	Cute.Effect5.prototype.constructor.call(this , param);
	this.slide_name_arr = ['l','r','b','t'];
}

Cute.Effect6.prototype = new Cute.Effect5();
Cute.Effect6.prototype.constructor = Cute.Effect6;

Cute.Effect6.prototype.getPieceOptions = function(){
	this.side = this.slide_name_arr[Math.round(parseInt(Math.random() * 3))];
	
	this.checkSidePos();
	return this.pieceOptions;
}

