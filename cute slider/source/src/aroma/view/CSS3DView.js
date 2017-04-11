Aroma.CSS3DView = function(row , col ){
	Aroma.AbstractView.call(this, row , col);
	
	this.viewport = document.createElement('div');
	this.viewport.style.overflow = 'hidden';
	this.sort = true;
	
	this.stage = Sprite3D.stage();
	
	this.alignstage = function(){
		this.stage.style.position = 'relative';
		this.stage.style.left     = (this.vpWidth  - this.width)  / 2 + 'px';
		this.stage.style.top      = (this.vpHeight - this.height) / 2 + 'px';
	}
}

Aroma.CSS3DView.prototype = new Aroma.AbstractView;
Aroma.CSS3DView.prototype.constructor = Aroma.CSS3DView;

Aroma.CSS3DView.prototype.setup = function() {
	this.stage.perspective(1500);
		
	this.stage.style[Sprite3D._browserPrefix+"PerspectiveOrigin"] = "50% 50%";
	this.stage.style[Sprite3D._browserPrefix+"TransformStyle"] = '';
	this.viewport.appendChild(this.stage);
};

Aroma.CSS3DView.prototype.setSize = function(width , height){
		
	Aroma.AbstractView.prototype.setSize.call(this, width , height);
	this.stage.style.width  = width  + 'px';
	this.stage.style.height = height + 'px';
	
	this.alignstage();
}


Aroma.CSS3DView.prototype.setViewPortSize = function(width , height){
	this.vpWidth = width;
	this.vpHeight = height;
	
	this.viewport.style.width = width + 'px';
	this.viewport.style.height = height + 'px';
	
	
	this.alignstage();
}

Aroma.CSS3DView.prototype.dispose = function(){
	
	this.stage.setAttribute('style' , '');
	
	Aroma.AbstractView.prototype.dispose.call(this);
}


Aroma.CSS3DView.prototype.getPieceAt = function(col , row , effect){
		
	var id = this.posToID(col , row);
				
	if(this._pieceList[id] != null)
		return this._pieceList[id];
	
	var piece = new Aroma.CSS3DCube();
	var pieceBounds = this.getPieceBounds(col , row);
	
	piece.col = col;
	piece.row = row;
	piece.bounds = pieceBounds;
	piece.view = this;
	piece.stage = this.stage;
	effect.piece = piece;
	ConcatObject.concat(piece.options , effect.getPieceOptions() );
	piece.setup(this.newSource , this.oldSource );
	
	this.stage.appendChild(piece.cube);	
	
	this._pieceList[id] = piece;
	
	return piece;
}

Aroma.CSS3DView.prototype.sortParts = function(){
	Aroma.AbstractView.prototype.sortParts.call(this);
	for(var i = 0 , l = this._pieceList.length; i<l ; ++i){
		this._pieceList[i].cube.style.zIndex = i;
	}
}
