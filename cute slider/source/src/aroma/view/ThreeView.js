// Class ThreeView extends AbstractView

Aroma.ThreeView = function(row , col){
	
	Aroma.AbstractView.call(this, row , col);
	
	this.sort = true;
	
	this.needRendering = true;
	
	this.viewport = document.createElement('canvas');
	this.viewport_cx = this.viewport.getContext('2d');
		
	this.renderer = new THREE.CanvasRenderer({canvas:this.viewport});
	
	this.renderer.autoClear = false;
	
	THREE.removeGaps = (row > 3 &&  col > 3);
	
}

	Aroma.ThreeView.prototype = new Aroma.AbstractView;
	Aroma.ThreeView.prototype.constructor = Aroma.ThreeView;


	Aroma.ThreeView.prototype.setup = function() {
	  	//setup Camera
	  	
	  	var pos = 1500;
	  	var fov = 2 * Math.atan( this.vpHeight / ( 2 * pos ) ) * 180 / Math.PI;
		this.camera = new THREE.PerspectiveCamera(fov, this.vpWidth/this.vpHeight , 0.1 , 10000); 
		this.camera.position.z =  pos;
		
		
		
		var img = new Image();
		img.src = this.oldSource.src;
		var org_bounds = {width:img.width , height:img.height};
		img = null;
		
		this.oldSource = Aroma.CanvasTools.resizeImage(this.oldSource , org_bounds , {width:this.width , height:this.height});
		this.newSource = Aroma.CanvasTools.resizeImage(this.newSource , org_bounds , {width:this.width , height:this.height});
	};
	
	Aroma.ThreeView.prototype.setViewPortSize = function(width , height){
		
		Aroma.AbstractView.prototype.setViewPortSize.call(this, width , height);
		this.renderer.setSize(width  , height );
	}
	
	Aroma.ThreeView.prototype.getPieceAt = function(col , row , effect){ 	
		var id = this.posToID(col , row);
					
		if(this._pieceList[id] != null)
			return this._pieceList[id];
		
		var piece = new Aroma.ThreeCubePiece();
		var pieceBounds = this.getPieceBounds(col , row);
		
		piece.col = col;
		piece.row = row;
		piece.bounds = pieceBounds;
		piece.view = this;
		effect.piece = piece;
		ConcatObject.concat(piece.options , effect.getPieceOptions() );
		
		piece.setup(Aroma.CanvasTools.createBitmapSlice(pieceBounds, this.newSource) , 
				 	Aroma.CanvasTools.createBitmapSlice(pieceBounds, this.oldSource) );
		
		this._pieceList[id] = piece;
		
		return piece;
	}
	
	Aroma.ThreeView.prototype.dispose = function(){
		Aroma.AbstractView.prototype.dispose.call(this);
		
		this.renderer.clear();
	}

	Aroma.ThreeView.prototype.render = function(){
		this.renderer.clear();
		
		this.viewport_cx.clearRect(0,0,this.vpWidth , this.vpHeight);
		
		for(var i = 0 , l = this._pieceList.length; i<l ; ++i)
			this.renderer.render( this._pieceList[i].scene, this.camera );
			
	}
 