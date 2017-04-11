Cute.Loading = function(){
	this.domElement = document.createElement('div');
	this.domElement.className = 'br-loading';
	this.domElement.style.display = 'none';
	this.animEle = document.createElement('div');
	this.animEle.className = 'img';
	this.domElement.appendChild(this.animEle);
	
	
	this.opacity = 0;
}

Cute.Loading.prototype = {
	constructor : Cute.Loading,
	
	opacityUpdate :function() {
		setOpacity(this.domElement , this.opacity);
	},
	
	show : function(){
		if(this.showTween)
			this.showTween.stop();
		this.domElement.style.display = '';
		this.showTween = new TWEEN.Tween(this).to( {opacity:100} , 450).onUpdate(this.opacityUpdate).start();
		
	},
	
	hide : function(){
		if(this.showTween)
			this.showTween.stop();
		
		this.showTween = new TWEEN.Tween(this).to( {opacity:0} , 450).onUpdate(this.opacityUpdate).start();		
		this.domElement.style.display = 'none';
	}
};
