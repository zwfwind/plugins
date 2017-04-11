Cute.Slider = function(){
	this.slides          = [];
	this.controls        = [];
	this.slideManager   = new Cute.SlideManager();
	this.imgLoaded       = false;
	this.mlcl            = false;
	this.api 			 = this.slideManager;
}

Cute.Slider.prototype = {
	
	constructor : Cute.Slider,
	
	setup : function (element_id , wrapper_id){
		
		this.fallBack = new Cute.FallBack();
		
		this.element  = document.getElementById(element_id);
		this.wrapper  = document.getElementById(wrapper_id);
		
		if(Cute.FallBack.isIE8)
			this.element.className += ' cute-ie8';
		
		this.wrapper.slider = this;
		
		window.addResizeListener(this.__onresize , this);
			
		this.aspect	 			   = Number(this.element.getAttribute('data-width')) / Number(this.element.getAttribute('data-height')); ///Number(this.element.getAttribute('data-aspect')) || 1;
		
		this.__setSize();
		this.slideManager.resize();
		
		this.slideManager.rotator  = this;
		
		this.controlLayer = document.createElement('div');
		this.controlLayer.style.visibility = 'hidden';
				
		this.contentLoading = new Cute.Loading();
		this.contentLoading.domElement.className = 'br-large-loading';
		this.contentLoading.show();
		this.element.appendChild(this.contentLoading.domElement);
		
		if(this.element.getAttribute('data-force'))
			this.fallBack.force = this.element.getAttribute('data-force');
		
		var ulElements = this.element.getElementsByTagName('ul');
		
		for(var i = 0, l = ulElements.length; i<l ; ++i){
			
			if(ulElements[i].getAttribute('data-type') == 'slides')
				this.slidesElement = ulElements[i];
			else if(ulElements[i].getAttribute('data-type') == 'controls')
				this.controlsElement = ulElements[i];
				
		}
		
		this.__createSlides();
		if(this.controlsElement)
			this.__createControls();
		
		this.element.appendChild(this.slideManager.domElement);
		
		var loader = new Cute.ModuleLoader(this.fallBack);
		
		loader.loadModule();
		loader.onComplete = {listener : this.__onModuleReady , ref:this };
	},
	
	__setSize : function(){
		this.slideManager.width    = this.wrapper.clientWidth;
		this.slideManager.height   = this.wrapper.clientWidth / this.aspect;
		this.slideManager.vpWidth  = this.slideManager.width + this.slideManager.width * .2;
		this.slideManager.vpHeight = this.slideManager.height + this.slideManager.height * .2;
		
				
		this.element.style.width  = this.slideManager.width + 'px';
		this.element.style.height = this.slideManager.height + 'px';		
	},
	
		
	__onresize : function(){
		this.__setSize();
		this.slideManager.resize();

	},
	
	__onModuleReady : function() {
		this.mlcl = true;
		if(this.imgLoaded) this.__start();
	},
	
	__onImgLoaded : function () {
		this.slide.addContent(this);
		
		if(this.rotator.mlcl)
			this.rotator.__start();
			
		this.rotator.imgLoaded = true;
		
		this.slide   = null;
		this.rotator = null;
	},
	
	__start : function(){
		
		var module_type = this.fallBack.getType();
		
		
		switch (module_type){
			case Cute.FallBack.CANVAS:
				this.slideManager._viewClass = Aroma.ThreeView;
			break;
			case Cute.FallBack.CSS3D:
				this.slideManager._viewClass = Aroma.CSS3DView;
				Aroma.CSS3DCube.light = !Cute.FallBack.isMobileDevice;
			break;
			case Cute.FallBack.DOM2D:
				this.slideManager._viewClass = Aroma.DivView;
			break;
		}
		
		this.showControls();
		this.slideManager.start();
		
		if(!Cute.Ticker.Tweenisadded){
			Cute.Ticker.add(TWEEN.update , TWEEN);
			Cute.Ticker.Tweenisadded = true;
		}
		
		Cute.Ticker.add(this.slideManager._timer.update , this.slideManager._timer);
		
		Cute.Ticker.start();
		
		this.element.removeChild(this.contentLoading.domElement);
	},
	
	__parseTransValues : function(value , _2d){
		var re_array = [];
		var value_parts = value.split(' ').join().split(',');
		
		for(var i=0,l=value_parts.length; i<l ; i++){
			if(_2d){
				if(Transitions2D[value_parts[i]])
					re_array.push(Transitions2D[value_parts[i]]);
			}else{
				if(Transitions3D[value_parts[i]])
					re_array.push(Transitions3D[value_parts[i]]);
			}
			
		}
		
		//set default transitions here 
		
		value_parts = null;
		return re_array;		
	},

	__createSlides : function(){
		
		var newSlide = null;
		var i = 0;
		
		while(this.slidesElement.children.length != 0){
			
			var slide_ele = this.slidesElement.firstElementChild || this.slidesElement.children[0];
			
			newSlide = new Cute.Slide(this.slideManager);
			newSlide.dataElement 	= slide_ele;
			newSlide.delay       	= slide_ele.getAttribute('data-delay');
			newSlide.transitions2D 	= this.__parseTransValues(slide_ele.getAttribute('data-trans2d') , true);
			newSlide.transitions3D 	= this.__parseTransValues(slide_ele.getAttribute('data-trans3d') , false);
			newSlide.rotator 		= this;
			
			var slideDataElements = slide_ele.children;
			
			for(var ii=0,ll=slideDataElements.length; ii<ll ; ++ii){
				
				if(slideDataElements[ii].nodeName === 'IMG'){
					if(i == 0){
						newSlide.src = slideDataElements[ii].getAttribute('src');
						var img     = new Image();
						img.slide   = newSlide;
						img.rotator = this;
						img.onload = this.__onImgLoaded;
						img.src     = newSlide.src;
					}else{
						newSlide.src = slideDataElements[ii].getAttribute('data-src');
					}
					

					newSlide.thumb = slideDataElements[ii].getAttribute('data-thumb');
					
					continue;
				}
				
				if(slideDataElements[ii].nodeName === 'DIV' && slideDataElements[ii].getAttribute('data-type') == 'info'){
					newSlide.pluginData.info = {text:slideDataElements[ii].innerHTML , _class:slideDataElements[ii].className , align :slideDataElements[ii].getAttribute('data-align') || 'bottom'};
					continue;
				}
				
				if(slideDataElements[ii].nodeName === 'UL' && slideDataElements[ii].getAttribute('data-type') == 'captions'){
					newSlide.pluginData.captions = slideDataElements[ii];
					continue;
				}
				
				if(slideDataElements[ii].nodeName === 'A' && slideDataElements[ii].getAttribute('data-type') == 'video'){
					newSlide.pluginData.video = slideDataElements[ii];
					continue;
				}
				
				if(slideDataElements[ii].nodeName === 'A' && slideDataElements[ii].getAttribute('data-type') == 'link'){
					newSlide.pluginData.link = {href:slideDataElements[ii].getAttribute('href') , target:slideDataElements[ii].getAttribute('target') };
					continue;
				}
				
				
				// Plugins setup here 
				
			}
			
			this.slides.push(newSlide);
			this.slideManager.pushSlide(newSlide);
			
			this.slidesElement.removeChild(slide_ele);
			
			i++;
		}// end of while
		
		// removes slides ul from banner rotator element
		this.element.removeChild(this.slidesElement);
	
	},
	
	__createControls:function(){
		var controls_element = this.controlsElement.getElementsByTagName('li');
		var control_type;
		var control;
		
		this.element.appendChild(this.controlLayer);
		this.controlLayer.className = 'br-controls';		
		
		if(this.element.getAttribute('data-overpause') != 'false' && !Cute.FallBack.isMobileDevice){
			this.controlLayer.slideManager = this.slideManager;
			this.controlLayer.rotator = this;
			
			var over = function(){
				if(this.slideManager._status == 'changing' || this.slideManager._status == 'loading') return;
				this.slideManager.setAutoPlay(false);
			};
			
			var out = function (){
				if(!Cute.AbstractControl.paused){
					if(this.slideManager._status == 'changing' || this.slideManager._status == 'loading') {
						this.rotator.ap = true;
						return;
					}
					
					this.rotator.ap = false;
					this.slideManager.setAutoPlay(true);
				}
			}
			
			this.controlLayer.onmouseover = over;
			this.controlLayer.onmouseout = out;
			
			this.slideManager.addEventListener(Cute.SliderEvent.CHANGE_END   , this.__effEnd   , this);
		}
		
		var touchControl = new Cute.TouchNavigation(this.controlLayer , this.api);
		
		
		
		this.controlLayer.style.width  = '100%';
		this.controlLayer.style.height = '100%';

		
		for(var i=0 , l=controls_element.length; i<l; ++i){
			control_type = controls_element[i].getAttribute('data-type');
			
			if(control_type && Cute.rotatorControls[control_type]){
				control = new Cute.rotatorControls[control_type](this.slideManager);
				
				this.controlLayer.appendChild(control.domElement);
				control.setup(controls_element[i]);// todo add config
				
				this.controls.push(control);
			}
		}
		
		this.loading = new Cute.Loading();
		this.element.appendChild(this.loading.domElement);
		
		this.slideManager.addEventListener(Cute.SliderEvent.WATING_FOR_NEXT , this.showLoading , this);
		this.slideManager.addEventListener(Cute.SliderEvent.CHANGE_START    , this.hideLoading , this);
		
		this.element.removeChild(this.controlsElement);
		
	},
	

	
	__effEnd : function(event) {		
		if(this.ap)
			this.slideManager.setAutoPlay(true);
		
	},
	
	showLoading : function(e){
		this.lis = true;
		this.loading.show();
	},
	
	hideLoading : function(e){
		if(this.lis){
			this.lis = false;
			this.loading.hide();
		}
	},
	
	showControls : function(){
		this.contentLoading.hide();
		this.controlLayer.style.visibility = 'visible';
	},
	
	play : function (){
		Cute.AbstractControl.paused = false;
		this.api.setAutoPlay(true);
	},
	
	pause : function(){
		Cute.AbstractControl.paused = true;
		this.api.setAutoPlay(false);
	}
}
