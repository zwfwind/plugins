// class DiagonalSelector extends AbstractSelector

Aroma.DiagonalSelector = function(startPoint , selectNum){
	
	this.selectNum = selectNum || 1;
	this.startPoint = startPoint || 'tl';
	
	 var  row_select = 0,
		  col_select = 0,
		  col_start  = 0,
		  row_start  = 0,
		  extra_col  = 0,
		  first_select = true;
		  
	this.getList = function(){
		
		var list =[];
		
		for (var i = 0 ; i < this.selectNum; i++) {
			switch(this.startPoint) {
				case 'tl':
					if (first_select) {
						first_select = false;
					}else if (col_select != 0 && row_select != this.view.row -1) {
						col_select--;
						row_select++;
					}else {
						col_select = ++ col_start;
						if (col_select > this.view.col - 1 ) {
							row_select = ++extra_col;
							col_select = this.view.col - 1;
						}else {
							row_select = 0;
						}
					}
					break;
				case 'tr':
					if (first_select) {
						first_select = false;
						col_select = this.view.col - 1;
					}else if (col_select != this.view.col-1 && row_select != this.view.row -1) {
						col_select++;
						row_select++;
					}else {
						col_select = (this.view.col-1) - (++ col_start);
						if (col_select < 0 ) {
							row_select = ++extra_col;
							col_select = 0;
						}else {
							row_select = 0;
						}
					}
					break;
				case 'bl':
					if (first_select) {
						first_select = false; 
						row_select = this.view.row -1;
					}else if (col_select != 0 && row_select != 0) {
						col_select--;
						row_select--;
					}else {
						col_select = ++ col_start;
						if (col_select > this.view.col-1 ) {
							row_select = (this.view.row -1) - (++extra_col);
							col_select = this.view.col -1;
						}else {
							row_select = this.view.row -1;
						}
					}
					break;
				case 'br':
					if (first_select) {
						first_select = false; 
						row_select = this.view.row - 1;
						col_select = this.view.col -1;
					}else if (col_select != this.view.col -1 && row_select != 0) {
						col_select++;
						row_select--;
					}else {
						col_select = (this.view.col-1) - (++ col_start);
						if (col_select < 0  ) {
							row_select = (this.view.row -1) - (++extra_col);
							col_select = 0;
						}else {
							row_select = this.view.row -1;
						}
					}
					break;
			}
			
			list[i] = this.view.getPieceAt(col_select , row_select , this.effect);
		}
		
		return list;
	}	  
	
	this._reset = function(){
		row_select = 0,
		col_select = 0,
		col_start  = 0,
		row_start  = 0,
		extra_col  = 0,
		first_select = true;
	}
	
}

Aroma.DiagonalSelector.prototype = new Aroma.AbstractSelector();
Aroma.DiagonalSelector.prototype.constructor = Aroma.DiagonalSelector;

Aroma.DiagonalSelector.TOP_LEFT     = 'tl'; 
Aroma.DiagonalSelector.BOTTOM_LEFT  = 'bl'; 
Aroma.DiagonalSelector.TOP_RIGHT    = 'tr'; 
Aroma.DiagonalSelector.BOTTOM_RIGHT = 'br'; 

Aroma.DiagonalSelector.prototype.getPieceList = function(){
	return this.getList();
}

Aroma.DiagonalSelector.prototype.reset = function(){
	return this._reset();
}


