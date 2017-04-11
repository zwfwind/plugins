Cute.Thumb = function(src , type){
	
	this.domElement = document.createElement('div');
	this.domElement.className = 'br-thumb-'+type;
	
	this.imgCont = document.createElement('div');
	this.imgCont.className = 'br-thumb-img';
	this.imgCont.style.overflow = 'hidden';
	
	this.img 		= new Image();
	this.img.thumb = this;
	this.img.onload = this.thumbLoaded;
	this.img.src    = src;
	this.img.style.position = 'absolute';
	this.img.style.filter   = 'inherit';
	
	this.frame		= document.createElement('div');
	this.frame.style.position = 'absolute';
	this.frame.style.zIndex	  = '1';
	this.frame.className 	  = 'br-thumb-frame';
	this.frame.style.filter   = 'inherit';
	
	this.thumb_pos = 1;
	
	this.imgCont.appendChild(this.img);
	
	this.domElement.appendChild(this.imgCont);
	this.domElement.appendChild(this.frame);
};

Cute.Thumb.prototype = {
	constructor : Cute.Thumb,
	
	thumbLoaded : function(){
		this.thumb.imgLoaded = true;
		if(this.thumb.rts)
			this.thumb.show();
	},
	
	ut:function(){
		this.img.style.transform 		= "scale("+this.thumb_pos+")";
		this.img.style.webkitTransform 	= "scale("+this.thumb_pos+")";
		this.img.style.MozTransform 	= "scale("+this.thumb_pos+") rotate(0.1deg)";
		this.img.style.msTransform 		= "scale("+this.thumb_pos+")";
		this.img.style.OTransform 		= "scale("+this.thumb_pos+")";
	},
	
	show : function() {
		if(!this.imgLoaded){
			this.rts = true;
			return;
		}
		
		/*if(this.st)
			this.st.stop();
		this.thumb_pos = 1;
		this.ut();
		this.st = new TWEEN.Tween(this).to( {thumb_pos:1.13} , 5200).onUpdate(this.ut).start();*/

	},
	
	reset : function() {
		this.rts = false;
		
		if(this.st){
			this.st.stop();
			//TWEEN.remove(this.st);
			this.st = null;
		}
		
		/*this.thumb_pos = 1;
		this.ut();*/
	}
	
};
