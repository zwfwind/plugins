Cute.SlideManager = function(){
	
	Averta.EventDispatcher.prototype.constructor.call(this);
	
	this.width		= 0;			
	this.height		= 0;	
	this._timer	 			= new Averta.Timer(100);	
	
	this._slideList			= [];	
	this._currentSlideIndex = 0;
	this._delayProgress		= 0;
	this._autoPlay			= true;	
	this._status			= '';

	this.domElement 		= document.createElement('div');
	this.domElement.style.position = 'relative';
	
	this._timer.onTimer = this.onTimer;
	this._timer.refrence = this;
	
}

Cute.SlideManager.prototype =  {
	constructor : Cute.SlideManager,
	
	startTimer : function(){
		if(!this._autoPlay)
			return false;
		
		this._timer.start();
		return true;
	},
	
	skipTimer:function(){
		this._timer.reset();
		this._delayProgress  = 100;
				
		this.dispatchEvent(new Cute.SliderEvent(Cute.SliderEvent.WATING));
	},
		
	onTimer: function (time){
		if(this._timer.getTime() >= this._currentSlide.delay * 1000){
			this._timer.stop();
			if(this._nextSlide.ready)
				this.showSlide(this._nextSlide);
			else
				this.waitForNext();
		}
		
		this._delayProgress = this._timer.getTime() / (this._currentSlide.delay * 10);
		
		this.dispatchEvent(new Cute.SliderEvent(Cute.SliderEvent.WATING));
	},
	
	prepareTransition : function(slide){
		if(this.rotator.fallBack.getType() == Cute.FallBack.DOM2D)
			return slide.transitions2D[parseInt(Math.random() * slide.transitions2D.length)];
		else
			return slide.transitions3D[parseInt(Math.random() * slide.transitions3D.length)];		
	},
	
	/**
	 *  Shows a new slide in slider 
	 * 	@param slide new slide instance 
	 */
	showSlide : function(slide){
		
		var transition = this.prepareTransition(slide);
		//transition.prepare();
		
		this._oldSlide = this._currentSlide;
		this._currentSlide = slide;
		
		this._oldSlide.prepareToHide();
		slide.prepareToShow();
		
		this._view = new this._viewClass(transition.row , transition.col);
		
		this._view.setSize(this.width , this.height);
		this._view.setViewPortSize(this.vpWidth , this.vpHeight);
		this._view.oldSource = this._oldSlide.image;
		this._view.newSource = slide.image;
		this._view.setup();
		
		if(this._view.needRendering)
			Cute.Ticker.add(this._view.render , this._view);
		
		this._engine = new Aroma.Engine(this._view);
		
		transition.selector.reset();
		
		this._engine.start( transition.effect ,  transition.selector , transition.duration , transition.overlapping , 0.45);
		this._engine.onComplete = {ref:this, listener:this.transitionCl};
		
		
		this._replaceTween = new TWEEN.Tween(this._oldSlide).to( {opacity:0} , 450).onUpdate(this._oldSlide.opacityUpdate).start();
		this._replaceTween.slider = this;
		this.newSlide = slide;
		this._replaceTween.onComplete(function(){this.slider.domElement.removeChild(this.domElement);});
		
		this.domElement.appendChild(this._view.viewport);
		
		this._view.viewport.style.position	= "absolute";
		this._view.viewport.style.zIndex	= "0";
		this._view.viewport.style.marginLeft = -(this.vpWidth - this.width) / 2 + 'px';
		this._view.viewport.style.marginTop = -(this.vpHeight - this.height) / 2 + 'px';
		
		this._currentSlideIndex = slide.index;
		
		this._timer.reset();
		this._delayProgress = 0;
		
		this._status = 'changing';
		this.dispatchEvent(new Cute.SliderEvent(Cute.SliderEvent.WATING));
		this.dispatchEvent(new Cute.SliderEvent(Cute.SliderEvent.CHANGE_START));
	},
	
	/**
	 * 	Dispatched whenever it has completed the new slide transition.
	 */
	transitionCl : function(){
		

		this._engine.reset();

		this._currentSlide.opacity = 0;
		//this._currentSlide.opacityUpdate();
		
		this.domElement.appendChild(this._currentSlide.domElement);
		// add z-index here
		
		this._replaceTween2 = new TWEEN.Tween(this._currentSlide).to( {opacity:100} , 450).onUpdate(this._currentSlide.opacityUpdate);
		TWEEN.add( this._replaceTween2 );
		this._replaceTween2.start();
		
		this._replaceTween2.onComplete(function(){
			if(this.slider._view.needRendering)
				Cute.Ticker.remove(this.slider._view.render , this.slider._view);
				
			TWEEN.remove( this.slider._replaceTween2 );
			
			this.slider.domElement.removeChild(this.slider._view.viewport);
				
			this.slider._view.dispose();
			this.slider._view = null;
			
			this.slider._currentSlide.showIsDone();
			this.slider._oldSlide.hideIsDone();
			this.slider._status = 'wating';
			//this.slider._lastSlide = this.slider._currentSlide;
			this.slider.dispatchEvent(new Cute.SliderEvent(Cute.SliderEvent.CHANGE_END));
			
		});
		
		this._engine = null;
		
		this.startTimer()
		
		
		this.gotoSlide(this.getNextIndex());
	},
	
	/**
	 *  Dispatched when new slide has loaded successfully.
	 */
	readyToShow : function(){
		if(this._delayProgress == 100)
			this.showSlide(this._nextSlide);			
	},
	
	waitForNext : function(){
		this._status = 'loading';
		this.dispatchEvent(new Cute.SliderEvent(Cute.SliderEvent.WATING_FOR_NEXT));
	},
	
	//------------------------------ public methods ----------------------------/
	
	resize : function(){
		if(this._status == 'changing'){
			
			//distroy engine and view
			if(this._engine){
				this._engine.removeTweens();
				this._engine.reset();
			}
			
			if(this._view){
				if(this._view.needRendering)
					Cute.Ticker.remove(this._view.render , this._view);
				
				this.domElement.removeChild(this._view.viewport);
				this._view.dispose();
				this._view = null;
				this._engine = null;
			}
			
			// show new slide
			if(this._replaceTween2){
				this._replaceTween2.stop();
				TWEEN.remove(this._replaceTween2);
			}
			if(!this._currentSlide.domElement.parentElement)
				this.domElement.appendChild(this._currentSlide.domElement);
			this._currentSlide.opacity = 100;
			this._currentSlide.opacityUpdate();
			this._currentSlide.showIsDone();
			
			// remove old slide
			if(this._replaceTween){
				this._replaceTween.stop();
				TWEEN.remove(this._replaceTween);
			}
			if(!this._oldSlide.domElement.parentElement)
				this.domElement.appendChild(this._oldSlide.domElement);
			this._oldSlide.opacity = 0;
			this._oldSlide.opacityUpdate();
			this._oldSlide.hideIsDone();
			
			this._status = 'wating';
			this.dispatchEvent(new Cute.SliderEvent(Cute.SliderEvent.CHANGE_END));
			this.startTimer()
			this.gotoSlide(this.getNextIndex());
		}
		

		
	},
	
	/**
	 *  Returns the id of the next slide.
	 */
	getNextIndex : function(){
		if(this._currentSlideIndex + 1 == this._slideList.length)
			return 	0;
		else
			return 	this._currentSlideIndex + 1;
	},
	
	/**
	 *  Returns the id of the previous slide.
	 */
	getPreviousIndex : function(){
		if(this._currentSlideIndex - 1 ==  -1)
			return this._slideList.length - 1;
		else
			return this._currentSlideIndex - 1
	},
	
	/**
	 *  Determines the next slide
	 *  @param index the next slide's index (id)
	 *  @param skipDelay if skipDelay is true ,slider skips the timer and try to shows next slide immediately. 
	 */
	gotoSlide : function(index , skipDelay){

		if(skipDelay){
			this.skipTimer();
		
			if(this._nextSlide && this._nextSlide.index == index){
				if(this._nextSlide.ready)
					this.showSlide(this._nextSlide);
				else
					this.waitForNext();
				
				return;
			}
			
		}
					
		if(this._nextSlide && this._nextSlide.index == index)
			return;
		
		if(this._nextSlide){
			this._nextSlide.killLoading();
			this._nextSlide = null;
		}
		
		this._nextSlide = this._slideList[index];	
		
		if(!this._nextSlide.ready){
			if(skipDelay)this.waitForNext();
			this._nextSlide.onReady = {listener:this.readyToShow , ref:this};
			this._nextSlide.loadContent();
		}else if(this._delayProgress == 100){
			this.showSlide(this._slideList[index]);
		}
		
		this.dispatchEvent(new Cute.SliderEvent(Cute.SliderEvent.CHANGE_NEXT_SLIDE));
	},
	
	
	/**
	 * Starts the slider
	 */
	start : function(){
		this._currentSlide = this._slideList[this._currentSlideIndex];
		
		this.domElement.appendChild(this._currentSlide.domElement);
		
		this.dispatchEvent(new Cute.SliderEvent(Cute.SliderEvent.CHANGE_END));
		
		this.startTimer();
		this.gotoSlide(this.getNextIndex());
		
		this.vpWidth  = this.vpWidth  || this.width;
		this.vpHeight = this.vpHeight || this.height;
	
	},
	
	/**
	 * goes to the next slide
	 */
	next : function(){
		if(this._status == 'changing') return;
		this.gotoSlide(this.getNextIndex() , true);
	},
	
	/**
	 * goes to the previous slide
	 */
	previous : function(){	
		if(this._status == 'changing') return;
		this.gotoSlide(this.getPreviousIndex(), true);
	},
	
	/**
	 * added a new slide object at the ends of slides list and returns new added slide index (id)
	 */
	pushSlide : function(slide){
		this._slideList.push(slide);
		slide.index = this._slideList.length - 1;
		return this._slideList.length - 1;
	},
	
	pause : function(){
		this._timer.stop();
	},
	
	play : function(){
		this._timer.start();
	},
	//---------------------------- properties ----------------------------/
	
	getTimer : function () {return this._timer},
	
	getSlideList : function() { return this._slideList; },
	
	getNextSlide : function() { return this._nextSlide; },
	
	getCurrentSlide : function() { return this._currentSlide; },
	
	getCurrentSlideIndex : function() { return this._currentSlideIndex; },
	
	delayProgress : function() { return this._delayProgress; },
	
	getAutoPlay : function() { return this._autoPlay; },
	setAutoPlay : function (value){
		if (this._autoPlay == value)
			return;
		this._autoPlay = value;
		
		if(!this._autoPlay)
			this._timer.stop();
		else
			this._timer.start();
		
		this.dispatchEvent(new Cute.SliderEvent(Cute.SliderEvent.AUTOPLAY_CHANGE));
	}
			
};

Averta.EventDispatcher.extend(Cute.SlideManager.prototype);