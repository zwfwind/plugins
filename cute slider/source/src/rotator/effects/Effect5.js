Cute.Effect5 = function (param){
	
	Aroma.Effect.prototype.constructor.call(this);
	
	param = param || {};
	
	this.side 			= param.side  || 'r';
	this.zmove 			= param.zmove || 0;
	this.rotation_axis 	= 'y';
	this.rotation_dir 	= 1;
	this.xspace 		= param.xspace || 0;
	this.yspace 		= param.yspace || 0;
	this.stack 			= param.stack  || false;
	this.balance 		= param.blance || 0.5; 
	this.ease 	        = param.ease   || TWEEN.Easing.Linear;
	
	this.isStatic = false;
	
};

Cute.Effect5.prototype = new Aroma.Effect();
Cute.Effect5.prototype.constructor = Cute.Effect5;

Cute.Effect5.prototype.createFrames = function(to_vars1 , to_vars2){
	if(!this.stack){
		to_vars1.z = this.zmove;
		to_vars2.z = 0;
		
		to_vars1.x = (this.piece.col - Math.floor(this.view.col * 0.5)) * this.xspace;
		to_vars1.y = (this.piece.row - Math.floor(this.view.row * 0.5)) * this.yspace;
		
		to_vars2.y = to_vars2.x = 0;
		
		this.addFrame(0.5 , to_vars1 , {ease:this.ease.EaseIn});
		this.addFrame(0.5 , to_vars2 , {ease:this.ease.EaseOut});
	}else{
		var moveVars = {};
		
		moveVars.x = (this.piece.col - Math.floor(this.view.col * 0.5)) * this.xspace;
		moveVars.y = (this.piece.row - Math.floor(this.view.row * 0.5)) * this.yspace;
		moveVars.z = this.zmove;
		
		this.addFrame(this.balance*.5 	, moveVars , {ease:this.ease.EaseInOut});
		this.addFrame(1 - this.balance  , to_vars2 , {ease:this.ease.EaseInOut});
		this.addFrame(this.balance*.5 , {z:0 , x:0 , y:0 } , {ease:this.ease.EaseInOut});
		
	}
}

Cute.Effect5.prototype.getToVars = function(){
	var to_vars1 = {};
	var to_vars2 = {};
	
	if(this.rotation_axis == 'y'){
		to_vars1.rotationY = 45 * this.rotation_dir;
		to_vars2.rotationY = 90 * this.rotation_dir;
	}else{
		to_vars1.rotationX = 45 * this.rotation_dir;
		to_vars2.rotationX = 90 * this.rotation_dir;
	}
	
	this.createFrames(to_vars1 , to_vars2);
};
		
Cute.Effect5.prototype.getFromVars = function(){ return {};	};
		
Cute.Effect5.prototype.checkSidePos = function() {
			
	switch(this.side){
		case 'r':
			this.pieceOptions.newImageLocation = this.piece.side_dic.right;
			this.pieceOptions.depth = this.piece.bounds.width;
			this.rotation_axis = 'y';
			this.rotation_dir = 1;
			break;
		case 'l':
			this.pieceOptions.newImageLocation = this.piece.side_dic.left;
			this.pieceOptions.depth = this.piece.bounds.width;
			this.rotation_axis = 'y';
			this.rotation_dir = -1;	
			break;
		case 't':
			this.pieceOptions.newImageLocation = this.piece.side_dic.top;
			this.pieceOptions.depth = this.piece.bounds.height;
			this.rotation_axis = 'x';
			this.rotation_dir = 1;
			break;
		case 'b':
			this.pieceOptions.newImageLocation = this.piece.side_dic.bottom;
			this.pieceOptions.depth = this.piece.bounds.height;
			this.rotation_axis = 'x';
			this.rotation_dir = -1;
			break;
	}
	
}
		
		
Cute.Effect5.prototype.prepare = function(){
	this.getFrom = this.getFrom ||  this.getFromVars;
	this.getTo =  this.getTo 	|| this.getToVars;
}

Cute.Effect5.prototype.getPieceOptions = function(){
	this.checkSidePos();
	return this.pieceOptions;
}
