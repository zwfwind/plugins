// Class AbstractView

Aroma.AbstractView = function(row , col){
	
	this.sort = false;
	//this.oldSource = null;
	//this.newSource = null;
	this.col = col;
	this.row = row;
	this.part_width = 0;
	this.part_height = 0;
	this._pieceList = [];
	this.width = 0;
	this.height = 0;
	this.vpWidth = 0;
	this.vpHeight = 0;
	//this.engine = null;
	this.needRendering = false;
	
	this.extra_part_width  = 0,
	this.extra_part_height = 0;
		
	this.posToID = function(col , row){ return row * this.col + col; }
	
	this.getPieceBounds = function(col, row){
		var bounds = {width:0 , height:0 , x:0 , y:0};
		
		if(this.extra_part_width == 0){
			bounds.x = col * this.part_width;
			bounds.width = this.part_width;
		}else{
			bounds.width = (col > this.extra_part_width)? this.part_width : this.part_width + 1;
			bounds.x = (col > this.extra_part_width)? (this.part_width + 1) * this.extra_part_width + (col - this.extra_part_width) * this.part_width : (this.part_width + 1) * col;			
		}
		
		if(this.extra_part_height == 0){
			bounds.y = row * this.part_height;
			bounds.height = this.part_height;
		}else{
			bounds.height = (row > this.extra_part_height)? this.part_height : this.part_height + 1;
			bounds.y = (row > this.extra_part_height)? (this.part_height + 1) * this.extra_part_height + (row - this.extra_part_height) * this.part_height : (this.part_height + 1) * row;
		}
			
		return bounds;
	}
	
	this.swapchildren_col = function( start , end){		
		for(var i = 0, l = (end - start)/2; i < l  ; ++i){
			var temp = this._pieceList[start+i];
			this._pieceList[start+i] = this._pieceList[end-i];
			this._pieceList[end-i] = temp;
		}
	}
	
	this.swapchildren_row = function( array_index){
		for(var i = 0, l = array_index.length ; i < l/2 ; ++i){
			var temp = this._pieceList[array_index[i]];
			this._pieceList[array_index[i]] = this._pieceList[array_index[l-i-1]];
			this._pieceList[array_index[l-i-1]] = temp;
		}
	}
	
	this.sortInCols = function(){
		if(this.col == 1) return;
		
		var middle_col = Math.floor(this.col >> 1);
		
		for(var l = this._pieceList.length , i = middle_col; i < l ; i += this.col){
			this.swapchildren_col(i , i +( this.col - middle_col) - 1);
		}
	}
		
	this.sortInRows = function(){
		if(this.row == 1) return;
		
		var middle_row = Math.floor(this.row >> 1);
		var list = new Array();
		
		for(var i = 0; i < this.col ; ++i){
			for(var j = 0; j < this.row - middle_row ; ++j){
				list.push((middle_row  * this.col + i) + j * this.col);
			}
			this.swapchildren_row(list);
			list = new Array();
		}
			
	}
}

	Aroma.AbstractView.prototype.getCount = function() { return this.row * this.col; };

	Aroma.AbstractView.prototype.prepare = function() {  };

	Aroma.AbstractView.prototype.setSize = function (width, height) {
		
		this.part_height = Math.floor(height/this.row);
		this.extra_part_height = height % this.row;
		this.part_width = Math.floor(width/this.col);
		this.extra_part_width = width % this.col;
		
		
		this.width = width;
		this.height = height;
	}
	
	Aroma.AbstractView.prototype.setViewPortSize = function(width , height){
		this.vpWidth = width;
		this.vpHeight = height;
	}
	
	Aroma.AbstractView.prototype.dispose = function() {
		for (var i = 0 , l = this._pieceList.length; i<l ; ++i){
			if(this._pieceList[i])
				this._pieceList[i].dispose();
			this._pieceList[i] = null;
		}
		
		this._pieceList = [];
	}
	
	Aroma.AbstractView.prototype.sortParts = function(){
		this.sortInCols();
		this.sortInRows();
	}
	
