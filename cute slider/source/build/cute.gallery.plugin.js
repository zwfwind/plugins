Cute.CuteGallery = function(){
	
	this.element = document.createElement('div');
	this.element.className = 'br-cutegallery';
	
	this.fs_btn	 = document.createElement('div');
	this.fs_btn.className = 'br-fullscreen-btn';
	
	this.slider_wrapper = document.createElement('div');
	this.slider_wrapper.className = 'br-gallery-wrapper';
	
	this.top_cont 		= document.createElement('div');
	this.top_cont.className = 'br-top';
	
	this.bot_cont		= document.createElement('div');
	this.bot_cont.className = 'br-bottom';
	
	this.play_btn		= document.createElement('div');
	this.play_btn.className = 'br-play-btn';

}

Cute.CuteGallery.prototype = {
	constructor : Cute.CuteGallery,
	
	setup: function(slider){
		
		this.slider = slider;
		
		var parent = slider.element.parentElement;
		var empty  = document.createElement('div');
		
		parent.removeChild(slider.element);
		parent.appendChild(this.element)
		
		this.slider_wrapper.appendChild(slider.element);
	
		this.thumbList = new Cute.ThumbList(slider.slideManager);
		this.thumbList.config.type = 'horizontal';
		this.thumbList.setup(empty);
		this.thumbList.list.type = 'horizontal';
		
		this.next = new Cute.Next(slider.slideManager);
		this.next.setup(empty);
		
		this.prev = new Cute.Previous(slider.slideManager);
		this.prev.setup(empty);
		
		this.bot_cont.appendChild(this.play_btn);
		this.bot_cont.appendChild(this.thumbList.domElement);
		
		if(!Cute.FallBack.isIE7 && !Cute.FallBack.isIE8) this.element.appendChild(this.fs_btn);
		
		
		this.top_cont.appendChild(this.slider_wrapper);
		this.top_cont.appendChild(this.next.domElement);
		this.top_cont.appendChild(this.prev.domElement);
		this.element.appendChild(this.top_cont);
		this.element.appendChild(this.bot_cont);
		
		var element = this.element;
		var isFull = false;
		var gal = this;
		
		var enterFS = function(){
			isFull = true;
				
			if (element.mozRequestFullScreen)		       element.mozRequestFullScreen();
			else if (element.webkitRequestFullScreen)      element.webkitRequestFullScreen();
		    else{
		    	gal.element.style.position = 'fixed';
		    	gal.element.style.left = '0';
		    	gal.element.style.top = '0';
		    	gal.element.style.height   = window.innerHeight + 'px';
		    }	
		    
		    slider.__setSize();
			slider.slideManager.resize();
			
			gal.bot_cont.className += ' fullscreen';
		    gal.slider_wrapper.className += ' fullscreen';
		    gal.fs_btn.className += ' fullscreen';
		    gal.__onresize();
		    
		    window.addResizeListener(gal.__onresize , gal);
		}
		
		var exitFS = function(){
			isFull = false;
		   		
		   	if (document.mozCancelFullScreen)  			document.mozCancelFullScreen();
			else if (document.webkitCancelFullScreen)   document.webkitCancelFullScreen();    
			else{
		    	gal.element.style.position = '';
		    	gal.element.style.height   = '';
		    	gal.element.style.left = '';
		    	gal.element.style.top = '';
		    }	
		   		slider.__setSize();
				slider.slideManager.resize();
		    	
		    	gal.element.style.height   = 'auto';
		    	
		    	gal.bot_cont.className = 'br-bottom';
		    	gal.slider_wrapper.className = 'br-gallery-wrapper';
		    	gal.fs_btn.className = 'br-fullscreen-btn';
		    
		    
		    slider.element.style.top = '';
		    window.removeResizeListener(gal.__onresize , gal);
		}
		
		var fullscreen = function(){
			if(!isFull)	enterFS()		
		    else exitFS()
		}
		
		this.__onresize = function(){
			if(isFull){
				slider.element.style.top = ((window.innerHeight - gal.bot_cont.offsetHeight) - parseInt(slider.element.style.height))/2 + 'px';
				gal.element.style.height   = window.innerHeight + 'px';
			}
		}

		this.fs_btn.onclick = fullscreen;
		
		if(element.mozRequestFullScreen || element.webkitRequestFullScreen){
			document.addEventListener("mozfullscreenchange",function(){
			    if(!document.mozFullScreen && isFull) exitFS()
			}, false);
			
			document.addEventListener("webkitfullscreenchange",function(){
			     if(!document.webkitIsFullScreen && isFull) exitFS();
			}, false);
			
		}
		
		slider.wrapper = this.slider_wrapper;
		slider.__setSize();
		slider.slideManager.resize();
		
		if(!Cute.AbstractControl.paused)
			this.play_btn.className += ' br-pause-btn';
			
		this.play_btn.onclick = function(){
			if(Cute.AbstractControl.paused){
				gal.slider.play();
				this.className = 'br-play-btn';
			}else{
				gal.slider.pause();
				this.className += ' br-pause-btn';
			}
		}

	}
	
}
	
