//Class SerialSelector extends AbstractSelector

Aroma.SerialSelector = function(dir, zigzag , selectNum){
	
	this.row     = 0;
	this.col  	= 0;
	this.row_len = 0;
	this.col_len = 0;
	
	this.selectNum = selectNum || 1;
	this.zigzag = zigzag;
	this.dir = dir || 'tlr';  
	    
	this.convertPoint = function(row , col){
		switch(this.dir){
			case 'tlr':
				return {row:row , col:col};
			break;
			case 'tld':
				return {row:col , col:row};
			break;
			case 'trl':
				return {row:row , col: this.col_len - col - 1};
			break;
			case 'trd':
				return {row:col , col:this.row_len - row - 1};
			break;
			case 'brl':
				return {row:this.row_len - row - 1, col: this.col_len - col - 1};
			break;
			case 'bru':
				return {row:this.col_len - col - 1 , col:this.row_len - row - 1};
			break;
			case 'blr':
				return {row:row_len - row - 1 , col:col};
			break;
			case 'blu':
				return {row:this.col_len - col - 1 , col:row};
			break;
		}
		
		return {row:row , col:col};
	}
}

Aroma.SerialSelector.prototype = new Aroma.AbstractSelector();
Aroma.SerialSelector.prototype.constructor = Aroma.SerialSelector;


Aroma.SerialSelector.prototype.getPieceList = function(){
	var list = [];
	var point = {};
	
	if(this.dir.charAt(2) == 'u' || this.dir.charAt(2) == 'd'){
		this.col_len = this.view.row;
		this.row_len = this.view.col;
	}else{
		this.col_len = this.view.col;
		this.row_len = this.view.row;
		
	}
	for(var i = 0 ; i < this.selectNum ; i++ ){
		point = this.convertPoint(this.row , ((this.zigzag && this.row % 2 != 0)? this.col_len - this.col - 1 : this.col));
		
		list.push(this.view.getPieceAt(point.col , point.row , this.effect));
		
		this.col ++;
		
		if(this.col == this.col_len){
			this.col = 0;
			this.row ++;
		}
				
	}
		
	return list;
}

Aroma.SerialSelector.prototype.reset = function(){
	this.row = 0;
	this.col = 0;
}
