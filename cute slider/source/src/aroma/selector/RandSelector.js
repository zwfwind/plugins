// class RandSelector extends AbstractSelector
Aroma.RandSelector = function(selectNum){
	
	this.selectNum = selectNum || 1;
	this.id_rand_list = [];
	
	this.shuffle = function(array){
		var r_index = Math.floor(Math.random() * array.length);
		var value = array[r_index];
		
		array.splice(r_index , 1);
		
		return value;
	}
	
}

Aroma.RandSelector.prototype = new Aroma.AbstractSelector();
Aroma.RandSelector.prototype.constructor = Aroma.RandSelector;

Aroma.RandSelector.prototype.setup = function(effect, view){
	Aroma.AbstractSelector.prototype.setup.call(this , effect , view);
	for(var i = 0, l = view.col * view.row; i <l ; ++i) this.id_rand_list[i] = i;
}

Aroma.RandSelector.prototype.getPieceList = function(){
	var list = [];
	var index = 0;
	
	for(var i = 0 ; i < this.selectNum ; ++i){
		index = this.shuffle(this.id_rand_list);
		list[i] = this.view.getPieceAt( Math.floor(index / this.view.row) , index % this.view.row , this.effect);
	}
		
	return list;
}