// Class DivView extends AbstractView

Aroma.DivView = function(row , col ){
	Aroma.AbstractView.call(this, row , col);
	
	this.stage =  document.createElement('div');
	this.viewport  =  document.createElement('div');
	
	this.stageFrag = document.createDocumentFragment();
	
	//this.viewport.style.overflow = 'hidden';
	
	this.viewport.appendChild(this.stage);
	
	this.alignstage = function(){
		this.stage.style.position = 'absolute';
		this.stage.style.left     = (this.vpWidth  - this.width)  / 2 + 'px';
		this.stage.style.top      = (this.vpHeight - this.height) / 2 + 'px';
	}
}

Aroma.DivView.prototype = new Aroma.AbstractView;
Aroma.DivView.prototype.constructor = Aroma.DivView;


Aroma.DivView.prototype.setup = function() {
	this.stage.style.background = 'url("'+ this.oldSource.src +'") no-repeat';	
	this.stage.style.position = 'absolute';
	this.stage.style.overflow = 'hidden';
};

Aroma.DivView.prototype.dispose = function() {
	Aroma.AbstractView.prototype.dispose.call(this);
	this._pieceList = [];
	this.viewport.removeChild(this.stage);
}

Aroma.DivView.prototype.setSize = function(width , height){
		
	Aroma.AbstractView.prototype.setSize.call(this, width , height);
	this.stage.style.width  = width  + 'px';
	this.stage.style.height = height + 'px';
	
	this.alignstage();
}


Aroma.DivView.prototype.setViewPortSize = function(width , height){
		
	Aroma.AbstractView.prototype.setViewPortSize.call(this, width , height);
	this.viewport.style.width  = width  + 'px';
	this.viewport.style.height = height + 'px';
	this.alignstage();
	
}

Aroma.DivView.prototype.prepare = function() { 
	this.stage.appendChild(this.stageFrag);
	this.stageFrag = null;
};	

Aroma.DivView.prototype.getPieceAt = function(col , row , effect){
		
	var id = this.posToID(col , row);
				
	if(this._pieceList[id] != null)
		return this._pieceList[id];
	
	var piece = new Aroma.DivPiece();
	var pieceBounds = this.getPieceBounds(col , row);
	
	piece.col = col;
	piece.row = row;
	piece.bounds = pieceBounds;
	piece.view = this;
	effect.piece = piece;
	ConcatObject.concat(piece.options , effect.getPieceOptions() );
	
	piece.setup(this.newSource , this.oldSource );
	
	this.stageFrag.appendChild(piece.div);	
	
	this._pieceList[id] = piece;
	
	return piece;
}