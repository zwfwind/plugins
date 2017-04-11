//Class Effect

Aroma.Effect = function(){

	//this.data;
	//this.fromData = null;
	//this.getTo = null;
	//this.getFrom = null;
	this.pieceOptions = {};
	//this.view = null;
	//this.selector = null;
	this.isStatic = false;
	//this.piece = null;
};

Aroma.Effect.prototype.addFrame = function(time  , to , options){
	this.data.push({time:time , to:to , options:options});
};

Aroma.Effect.prototype.getToData = function(){
	if(this.data != null && this.isStatic)
		return this.data;
	
	this.data = new Array();
	this.getTo();
	
	
	return this.data;	
};

Aroma.Effect.prototype.getFromData = function() {
	if(this.fromData != null && this.isStatic)
		return this.fromData;
	else if(this.isStatic){
		this.fromData = this.getFrom();
		return this.fromData;
	}else
		return this.getFrom();
};

Aroma.Effect.prototype.prepare = function() {};
Aroma.Effect.prototype.getPieceOptions = function() {return this.pieceOptions;};

