//Class AbstractSelector

Aroma.AbstractSelector = function(){
	this.selectNum = 1;
	//this.effect = null;
	//this.view = null;
}

Aroma.AbstractSelector.prototype.getCount = function(){ return Math.floor(this.view.getCount() / this.selectNum); }

Aroma.AbstractSelector.prototype.setup = function(effect , view){
	 this.effect = effect;
	 this.view = view;
	 effect.selector = this;
	 effect.view = view;
}

Aroma.AbstractSelector.prototype.reset = function() {
	
}
