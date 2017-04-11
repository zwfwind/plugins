Cute.Effect11 = function(param){
	
	Cute.Effect8.call(this , param);
	
	param = param || {};
	
	this.rotation_x = 0;
	this.rotation_y = 0;
	this.dir = param.dir || 'tr';
	this.pieceOptions.flipX = this.pieceOptions.flipY = true;
};

Cute.Effect11.prototype = new Cute.Effect8();
Cute.Effect11.prototype.constructor = Cute.Effect11;

Cute.Effect11.prototype.getToVars = function() {
  var to_vars1 = {};
  var to_vars2 = {};
	
	if(this.rotation_x != 0){
		to_vars1.rotationX = 90 * this.rotation_x;
		to_vars2.rotationX = 180 * this.rotation_x;
	}
	
	if(this.rotation_y != 0){
		to_vars1.rotationY = 180 * this.rotation_y;
		to_vars2.rotationY = 360 * this.rotation_y;
	}
	
	this.createFrames(to_vars1 , to_vars2);
};
		
Cute.Effect11.prototype.updateConfig = function(){
	
	this.pieceOptions.sideColor = this.sideColor;
	this.pieceOptions.depth = (this.depth <= 0 ? 10 : this.depth);
	
	switch(this.dir.charAt(0)){
		case 't':
			this.rotation_x = -1;
		break;
		case 'b':
			this.rotation_x = 1;
		break;
	}
	
	switch(this.dir.charAt(1)){
		case 'r':
			this.rotation_y = -1;
		break;
		case 'l':
			this.rotation_y = 1;
		break;
	}
	
};

