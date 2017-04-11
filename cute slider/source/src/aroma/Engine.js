window.Aroma = {
	version : 2.0,
	author	: 'Averta group'
};
//Class Engine
Aroma.Engine = function(view){
	
	//public proprties
	// {listener , ref}
	//this.onComplete = null;
	
	// private properties
	this._tweenList = [];
	/*this._duration;
	this._overlapping;
	this._selector;
	this._effect;
	this._part_duration;
	this._part_delay;
	this._startDelay;*/
	this._view = view;
	
	this._view.engine = this;
	
	this.startEff = function(){
		
		this._effect.prepare();
		
		this._part_duration = this._duration / (this._selector.getCount() - ( ( 1 - this._overlapping) * ( this._selector.getCount() - 1 )));
		this._part_delay = this._part_duration * this._overlapping;
		
		var piece_list = [],
			tween,
			optionVars,
			delay_buffer = 0,
			frame_delay_buffer = 0,
			eff_data = [],
			from_eff_data,
			lastTween = null;
		
			// get all pieces for effect 
			for(var i = 0,l = this._selector.getCount() ; i < l ; ++i){
				
				piece_list = this._selector.getPieceList();
				
				// get piece pack
				for(var j = 0,l2 = piece_list.length ; j < l2 ; ++j){	
					
					eff_data = this._effect.getToData();
					from_eff_data = this._effect.getFromData();
					// create frames
					for(var k = 0,l3 = eff_data.length; k<l3 ; ++k){
					
						optionVars = CloneObject.clone(eff_data[k].options);
						
						if(k == 0){
							if(optionVars.delay == null )
								optionVars.delay = this._part_delay + delay_buffer + this._startDelay;
							else 
								optionVars.delay += this._part_delay + delay_buffer + this._startDelay;	
						}
						
						this.applyFromProperties(piece_list[j] ,from_eff_data); 
						
						tween = new TWEEN.Tween(piece_list[j].proxy)
							.delay(optionVars.delay*1000  || 0)
							.to( eff_data[k].to , this._part_duration * eff_data[k].time * 1000)
							.easing(optionVars.ease || TWEEN.Easing.Linear.EaseNone)
							.onUpdate(piece_list[j].proxyUpdate);
							
						if(k == 0)
							tween.start();	
													
						if(lastTween != null)
							lastTween.chain(tween);
						
						lastTween = tween;
						
						
						
						if(j+1 == l2 && i+1 == l && k+1 == l3)
							tween.onComplete(this.effComp);
							
						this._tweenList.push(tween);
						
					}
					
					lastTween = null;
				}
				
				delay_buffer += this._part_delay;
			}
			
			
			if(this._view.sort)
				this._view.sortParts();
		
		
		this._view.prepare();

	}
	
	
	this.applyFromProperties = function(piece , fromData){
		for(var key in fromData)
			piece.proxy[key] = fromData[key];
		
		piece.proxyUpdate.call(piece.proxy);
	}
	
	this.effComp = function(){
		if(this.piece.view.engine.onComplete)
			this.piece.view.engine.onComplete.listener.call(this.piece.view.engine.onComplete.ref);
	}
	
}

	// public methods

	Aroma.Engine.prototype.start = function(effect , selector , duration , overlapping , delay ){
		this._selector = selector;
		this._effect = effect;
		this._duration = duration;
		this._overlapping = overlapping || 0.5;
		this._startDelay = delay || 0;
		this._selector.setup(this._effect , this._view);
		
		
		this.startEff();
	}
	
	Aroma.Engine.prototype.reset = function(){
		
		this._selector = null;
		this._effect = null;
		this._duration = 0;
		this._overlapping = 0;
		this._startDelay = 0;
			
		
		
		this._tweenList = [];
		
	}
	
	
	Aroma.Engine.prototype.removeTweens = function() { 
		for (var i = 0 , l = this._tweenList.length ; i < l ; i ++){
			TWEEN.remove(this._tweenList[i]);
			this._tweenList[i] = null;
		}
	};
	
	Aroma.Engine.prototype.getView = function() { return this._view; };
