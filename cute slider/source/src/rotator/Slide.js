Cute.Slide = function(slider){
	
	 this.src					= '';	
	// this._backgroundColor	= -1;
	 this.delay					= 0;
	 this.slider				= slider;
	 this.ready					= false;
	 this._index				= 0;
	 this.autoPlay				= true;
	 this.pluginData			= {};
	 this.opacity 				= 100;
	 
	 this.domElement 			 	= document.createElement('div');
	 this.domElement.style.width 	= '100%';
	 this.domElement.style.height	= 'auto';
	 this.domElement.style.overflow = 'hidden';
	 this.domElement.style.position = 'absolute';
	 this.domElement.style.zIndex 	= '1';	 
}


Cute.Slide.prototype = {
	constructor : Cute.Slide,
	
	/**
	 * Loads the slide content(swf or image)
	 */
	loadContent : function(){		
		if(this.src != null){	
			this.image = new Image();
			this.image.slide = this;
			this.image.onload = this.contentLoaded;
			this.image.src = this.src;
			this.image.style.width = "100%";
			this.image.style.height   = "auto";	
		}else{
			this.ready = true;
			this.onReady.listener.call(this.onReady.ref);
		}		
		
	},
	
	
	/**
	 * Stops the loading procedure
	 */
	killLoading : function(){
		this.image.onload = null;
	},
	
	/**
	 * adds directly content to the slide
	 */
	addContent : function (image){
		this.domElement.appendChild(image);
		this.image = image;
		this.image.style.width = "100%";
		this.image.style.height   = "auto";
		this.ready = true;
		if(this.onReady)this.onReady.listener.call(this.onReady.ref);
		
		this.prepareToShow();
		this.showIsDone();
	},
	
	/**
	 * this function calls when the slide showin transition complete
	 */
	showIsDone : function(){},
		
	/**
	 * this function calls when the slide hiding transition complete
	 */
	hideIsDone : function(){},
	
	
	/**
	 * prepare the slide to show content in slider
	 */
	prepareToShow : function(){
		
	},
	
	/**
	 * prepare the slide for hide
	 */
	prepareToHide : function() {} ,
	
	/**
	 * Dispatchs when the slide content loading complete
	 */
	contentLoaded : function() {
		this.slide.domElement.appendChild(this);
		this.slide.ready = true;
		
		if(this.slide.onReady)this.slide.onReady.listener.call(this.slide.onReady.ref);
	},
	
	opacityUpdate : function() {
    	setOpacity(this.domElement , this.opacity);
	}
}
