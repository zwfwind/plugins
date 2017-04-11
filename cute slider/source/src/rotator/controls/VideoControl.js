Cute.VideoControl = function(slider){
	
	Cute.AbstractControl.call(this , slider);
	
	this.config = {
		css_class : 'br-video',
		width	  : 300,
		height	  : 200
	}
	
	this.domElement = document.createElement('div');
	this.video_ele	= document.createElement('iframe');
	this.closeBtn   = document.createElement('div')
	this.overPlay	= document.createElement('div');
	this.videoContainer = document.createElement('div');
	
	this.domElement.style.position = 'absolute';
	
	this.vopacity = 0;
	
	this.videoFade = function(){setOpacity(this.videoContainer , this.vopacity);}
	
};

Cute.rotatorControls.video = Cute.VideoControl;
Cute.VideoControl.prototype = new Cute.AbstractControl();
Cute.VideoControl.prototype.constructor = Cute.VideoControl;

Cute.VideoControl.prototype.setup = function(config_ele){
	Cute.AbstractControl.prototype.setup.call(this , config_ele);

	this.video_ele.setAttribute('allowFullScreen' , '');
	this.video_ele.setAttribute('frameborder' , '0');

	this.overPlay.targ = this;
	this.overPlay.onclick = function(){this.targ.showVideo();};
	this.overPlay.className = 'play-btn';
	
	this.closeBtn.targ = this;
	this.closeBtn.onclick = function(){this.targ.hideVideo();};
	this.closeBtn.className = 'close-btn';
	
	this.videoContainer.className = 'video-cont'
	
	this.domElement.style.width  = '100%';
	this.domElement.style.height = '100%';
	
	this.video_ele.style.width  = '100%';
	this.video_ele.style.height = '100%';
	this.video_ele.style.background = 'black';
	
	this.domElement.appendChild(this.overPlay);
	this.domElement.appendChild(this.videoContainer);
	
	this.videoContainer.appendChild(this.closeBtn);
	this.videoContainer.style.display = 'none';
	
	setOpacity(this.videoContainer , 0);
	
};

Cute.VideoControl.prototype.showVideo = function(){
	this.videoContainer.style.display = '';
	this.videoContainer.appendChild(this.video_ele);
	
	this.video_ele.className = this.data.className || this.config.css_class;

	if(this.video_ele.getAttribute('src') != this.data.getAttribute('href'))
		this.video_ele.setAttribute('src', this.data.getAttribute('href')  || 'about:blank');
	
	if(this.videoTween)
			this.videoTween.stop();
	
	this.videoTween = new TWEEN.Tween(this).to( {vopacity:100} , 400).onUpdate(this.videoFade).start();
	this.slider.rotator.pause()
};

Cute.VideoControl.prototype.hideVideo = function(){
	if(this.videoTween)
			this.videoTween.stop();
	
	this.videoTween = new TWEEN.Tween(this).to( {vopacity:0} , 400).onUpdate(this.videoFade).start();
	
	this.videoTween.onComplete(function(){
		this.video_ele.setAttribute('src', 'about:blank');
		this.videoContainer.removeChild(this.video_ele);
		this.videoContainer.style.display = 'none';
	});

};

Cute.VideoControl.prototype.show = function(){
	this.data = this.slider.getCurrentSlide().pluginData.video;
	
	if(!this.data){
		this.domElement.style.display = 'none';
		return;
	} 
	
	this.domElement.style.display = '';
	Cute.AbstractControl.prototype.show.call(this);
};

Cute.VideoControl.prototype.hide = function(){
	Cute.AbstractControl.prototype.hide.call(this);
	
	this.showTween.onComplete(function(){
		if(this.video_ele.parentElement)this.videoContainer.removeChild(this.video_ele);
		this.domElement.style.display = 'none';
		this.videoContainer.style.display = 'none';
		if(this.videoTween)this.videoTween.stop();
	});
	
};