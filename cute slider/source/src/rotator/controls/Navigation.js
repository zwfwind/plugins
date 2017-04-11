// Next Control
Cute.Next = function(slider){
	Cute.AbstractControl.prototype.constructor.call(this , slider);
	this.domElement = document.createElement('div');
	
	this.config = {
		css_class : 'br-next'
	};
	

}

//register Next control 
Cute.rotatorControls.next = Cute.Next;

Cute.Next.prototype = new Cute.AbstractControl();
Cute.Next.prototype.constructor = Cute.Next;

Cute.Next.prototype.setup = function(config_ele) {
  	Cute.AbstractControl.prototype.setup.call(this , config_ele);
  	
  	this.domElement.control = this;
  	  
  	this.domElement.onclick = function(){
  		this.control.slider.next();
  	};
};

Cute.Next.prototype.show = function(){
	Cute.AbstractControl.prototype.show.call(this);
	this.domElement.style.cursor = 'pointer';
};

Cute.Next.prototype.hide = function(){
	Cute.AbstractControl.prototype.hide.call(this);
	this.domElement.style.cursor = '';
};


// Previous Control
Cute.Previous = function(slider){
	Cute.Next.call(this , slider);
	
	this.config = { 
		css_class : 'br-previous'
	};
}

//register Previous control
Cute.rotatorControls.previous = Cute.Previous

Cute.Previous.prototype = new Cute.Next();
Cute.Previous.prototype.constructor = Cute.Previous;

Cute.Previous.prototype.setup = function(config){
	Cute.Next.prototype.setup.call(this , config);
	this.domElement.onclick = function(){
		this.control.slider.previous();
	};
};


