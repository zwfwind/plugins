Cute.Effect8 = function(param) {
	
	param = param || {};
	
	Cute.Effect5.prototype.constructor.call(this,param);

	this.sideColor 		= param.sidecolor || 0;
	this.depth 			= param.depth 	  || -1;
	this.dir 			= param.dir       || 'u';
	this.rotation_axis 	= 'x';
	this.rotation_dir 	= 1;
}

Cute.Effect8.prototype = new Cute.Effect5();
Cute.Effect8.prototype.constructor = Cute.Effect8;

Cute.Effect8.prototype.getToVars = function() {
	var to_vars1 = {};
	var to_vars2 = {};
	
	if(this.rotation_axis == 'y'){
		to_vars1.rotationY = 90 *  this.rotation_dir;
		to_vars2.rotationY = 180 * this.rotation_dir;
	}else{
		to_vars1.rotationX = 90 *  this.rotation_dir;
		to_vars2.rotationX = 180 * this.rotation_dir;
	}
	
	this.createFrames(to_vars1 , to_vars2);
}
		
Cute.Effect8.prototype.updateConfig = function(){
	this.pieceOptions.sideColor = this.sideColor;
	this.pieceOptions.depth = (this.depth <= 0 ? (this.dir == 'u' || this.dir == 'd' ? this.piece.bounds.height: this.piece.bounds.width) : this.depth);
	
	this.rotation_axis = (this.dir == 'u' || this.dir == 'd') ? 'x' : 'y';
	this.rotation_dir  = (this.dir == 'u' || this.dir == 'r') ?  1  : -1 ;
	this.pieceOptions.flipX = this.pieceOptions.flipY = (this.dir == 'u' || this.dir == 'd');
};
		
Cute.Effect8.prototype.getPieceOptions = function(){
	this.updateConfig();
	return this.pieceOptions;
}