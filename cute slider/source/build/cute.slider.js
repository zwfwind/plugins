//src/tween/Tween.js
/**
 * @author sole / http://soledadpenades.com
 * @author mr.doob / http://mrdoob.com
 * @author Robert Eisele / http://www.xarg.org
 * @author Philippe / http://philippe.elsass.me
 * @author Robert Penner / http://www.robertpenner.com/easing_terms_of_use.html
 * @author Paul Lewis / http://www.aerotwist.com/
 * @author lechecacharro
 * @author Josh Faul / http://jocafa.com/
 */

var TWEEN = TWEEN || ( function () {

	var i, tl, interval, time, fps = 60, autostart = false, tweens = [], num_tweens;

	return {
	
		setFPS: function ( f ) {

			fps = f || 60;

		},

		start: function ( f ) {
			
			if( arguments.length != 0 ) {
				this.setFPS( f );
			}
			
			interval = setInterval( this.update, 1000 / fps );

		},

		stop: function () {

			clearInterval( interval );

		},

		setAutostart: function ( value ) {

			autostart = value;
			
			if(autostart && !interval) {
				this.start();
			}

		},

		add: function ( tween ) {

			tweens.push( tween );

			if (autostart && !interval) {

				this.start();

			}

		},

		getAll: function() {

			return tweens;

		},

		removeAll: function() {

			tweens = [];

		},

		remove: function ( tween ) {

			i = tweens.indexOf( tween );

			if ( i !== -1 ) {

				tweens.splice( i, 1 );

			}

		},

		update: function (_time) {

			var _i = 0;
			var time = _time || Date.now();
		
			while ( _i <  tweens.length ) {
				
				if ( tweens[ _i ].update( time ) ) {
					_i++;
				} else {
					tweens.splice( _i, 1 );
				}

			}

			if (num_tweens == 0 && autostart == true) {

				this.stop();

			}

		}

	};

} )();

TWEEN.Tween = function ( object ) {

	var _object = object,
	_valuesStart = {},
	_valuesDelta = {},
	_valuesEnd = {},
	_duration = 1000,
	_delayTime = 0,
	_startTime = null,
	_easingFunction = TWEEN.Easing.Linear.EaseNone,
	_chainedTween = null,
	_onUpdateCallback = null,
	_onCompleteCallback = null;

	this.to = function ( properties, duration ) {

		if( duration !== null ) {

			_duration = duration;

		}

		for ( var property in properties ) {

			// This prevents the engine from interpolating null values
			if ( _object[ property ] === null ) {

				continue;

			}

			// The current values are read when the tween starts;
			// here we only store the final desired values
			_valuesEnd[ property ] = properties[ property ];

		}

		return this;

	};

	this.start = function (_time) {
		
		TWEEN.add( this );

		_startTime = _time ? _time + _delayTime : Date.now() + _delayTime;
		//_startTime = _time ? _time + _delayTime : new Date().getTime() + _delayTime;

		for ( var property in _valuesEnd ) {

			// Again, prevent dealing with null values
			if ( _object[ property ] === null ) {

				continue;

			}

			_valuesStart[ property ] = _object[ property ];
			_valuesDelta[ property ] = _valuesEnd[ property ] - _object[ property ];

		}

		return this;
	};

	this.stop = function () {

		TWEEN.remove( this );
		return this;

	};

	this.delay = function ( amount ) {

		_delayTime = amount;
		return this;

	};

	this.easing = function ( easing ) {

		_easingFunction = easing;
		return this;

	};

	this.chain = function ( chainedTween ) {

		_chainedTween = chainedTween;

	};

	this.onUpdate = function ( onUpdateCallback ) {

		_onUpdateCallback = onUpdateCallback;
		return this;

	};

	this.onComplete = function ( onCompleteCallback ) {

		_onCompleteCallback = onCompleteCallback;
		return this;

	};

	this.update = function ( time ) {

		var property, elapsed, value;

		if ( time < _startTime ) {

			return true;

		}

		elapsed = ( time - _startTime ) / _duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

		value = _easingFunction( elapsed );

		for ( property in _valuesDelta ) {

			_object[ property ] = _valuesStart[ property ] + _valuesDelta[ property ] * value;

		}

		if ( _onUpdateCallback !== null ) {

			_onUpdateCallback.call( _object, value );

		}

		if ( elapsed == 1 ) {

			if ( _onCompleteCallback !== null ) {

				_onCompleteCallback.call( _object );

			}

			if ( _chainedTween !== null ) {

				_chainedTween.start();

			}

			return false;

		}

		return true;

	};

	/*
	this.destroy = function () {

		TWEEN.remove( this );

	};
	*/
}

TWEEN.Easing = { Linear: {}, Quadratic: {}, Cubic: {}, Quartic: {}, Quintic: {}, Sinusoidal: {}, Exponential: {}, Circular: {}, Elastic: {}, Back: {}, Bounce: {} };


TWEEN.Easing.Linear.EaseNone = function ( k ) {

	return k;

};

//

TWEEN.Easing.Quadratic.EaseIn = function ( k ) {

	return k * k;

};

TWEEN.Easing.Quadratic.EaseOut = function ( k ) {

	return - k * ( k - 2 );

};

TWEEN.Easing.Quadratic.EaseInOut = function ( k ) {

	if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
	return - 0.5 * ( --k * ( k - 2 ) - 1 );

};

//

TWEEN.Easing.Cubic.EaseIn = function ( k ) {

	return k * k * k;

};

TWEEN.Easing.Cubic.EaseOut = function ( k ) {

	return --k * k * k + 1;

};

TWEEN.Easing.Cubic.EaseInOut = function ( k ) {

	if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
	return 0.5 * ( ( k -= 2 ) * k * k + 2 );

};

//

TWEEN.Easing.Quartic.EaseIn = function ( k ) {

	return k * k * k * k;

};

TWEEN.Easing.Quartic.EaseOut = function ( k ) {

	 return - ( --k * k * k * k - 1 );

}

TWEEN.Easing.Quartic.EaseInOut = function ( k ) {

	if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
	return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );

};

//

TWEEN.Easing.Quintic.EaseIn = function ( k ) {

	return k * k * k * k * k;

};

TWEEN.Easing.Quintic.EaseOut = function ( k ) {

	return ( k = k - 1 ) * k * k * k * k + 1;

};

TWEEN.Easing.Quintic.EaseInOut = function ( k ) {

	if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
	return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );

};

// 

TWEEN.Easing.Sinusoidal.EaseIn = function ( k ) {

	return - Math.cos( k * Math.PI / 2 ) + 1;

};

TWEEN.Easing.Sinusoidal.EaseOut = function ( k ) {

	return Math.sin( k * Math.PI / 2 );

};

TWEEN.Easing.Sinusoidal.EaseInOut = function ( k ) {

	return - 0.5 * ( Math.cos( Math.PI * k ) - 1 );

};

//

TWEEN.Easing.Exponential.EaseIn = function ( k ) {

	return k == 0 ? 0 : Math.pow( 2, 10 * ( k - 1 ) );

};

TWEEN.Easing.Exponential.EaseOut = function ( k ) {

	return k == 1 ? 1 : - Math.pow( 2, - 10 * k ) + 1;

};

TWEEN.Easing.Exponential.EaseInOut = function ( k ) {

	if ( k == 0 ) return 0;
        if ( k == 1 ) return 1;
        if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 2, 10 * ( k - 1 ) );
        return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );

};

// 

TWEEN.Easing.Circular.EaseIn = function ( k ) {

	return - ( Math.sqrt( 1 - k * k ) - 1);

};

TWEEN.Easing.Circular.EaseOut = function ( k ) {

	return Math.sqrt( 1 - --k * k );

};

TWEEN.Easing.Circular.EaseInOut = function ( k ) {

	if ( ( k /= 0.5 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
	return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);

};

//

TWEEN.Easing.Elastic.EaseIn = function( k ) {

	var s, a = 0.1, p = 0.4;
	if ( k == 0 ) return 0; if ( k == 1 ) return 1; if ( !p ) p = 0.3;
	if ( !a || a < 1 ) { a = 1; s = p / 4; }
	else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
	return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );

};

TWEEN.Easing.Elastic.EaseOut = function( k ) {

	var s, a = 0.1, p = 0.4;
	if ( k == 0 ) return 0; if ( k == 1 ) return 1; if ( !p ) p = 0.3;
	if ( !a || a < 1 ) { a = 1; s = p / 4; }
	else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
	return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );

};

TWEEN.Easing.Elastic.EaseInOut = function( k ) {

	var s, a = 0.1, p = 0.4;
	if ( k == 0 ) return 0; if ( k == 1 ) return 1; if ( !p ) p = 0.3;
        if ( !a || a < 1 ) { a = 1; s = p / 4; }
        else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
        if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
        return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;

};

//

TWEEN.Easing.Back.EaseIn = function( k ) {

	var s = 1.70158;
	return k * k * ( ( s + 1 ) * k - s );

};

TWEEN.Easing.Back.EaseOut = function( k ) {

	var s = 1.70158;
	return ( k = k - 1 ) * k * ( ( s + 1 ) * k + s ) + 1;

};

TWEEN.Easing.Back.EaseInOut = function( k ) {

	var s = 1.70158 * 1.525;
	if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
	return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );

};

// 

TWEEN.Easing.Bounce.EaseIn = function( k ) {

	return 1 - TWEEN.Easing.Bounce.EaseOut( 1 - k );

};

TWEEN.Easing.Bounce.EaseOut = function( k ) {

	if ( ( k /= 1 ) < ( 1 / 2.75 ) ) {

		return 7.5625 * k * k;

	} else if ( k < ( 2 / 2.75 ) ) {

		return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;

	} else if ( k < ( 2.5 / 2.75 ) ) {

		return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;

	} else {

		return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;

	}

};

TWEEN.Easing.Bounce.EaseInOut = function( k ) {

	if ( k < 0.5 ) return TWEEN.Easing.Bounce.EaseIn( k * 2 ) * 0.5;
	return TWEEN.Easing.Bounce.EaseOut( k * 2 - 1 ) * 0.5 + 0.5;

};

//src/aroma/Engine.js
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

//src/aroma/view/AbstractView.js
// Class AbstractView

Aroma.AbstractView = function(row , col){
	
	this.sort = false;
	//this.oldSource = null;
	//this.newSource = null;
	this.col = col;
	this.row = row;
	this.part_width = 0;
	this.part_height = 0;
	this._pieceList = [];
	this.width = 0;
	this.height = 0;
	this.vpWidth = 0;
	this.vpHeight = 0;
	//this.engine = null;
	this.needRendering = false;
	
	this.extra_part_width  = 0,
	this.extra_part_height = 0;
		
	this.posToID = function(col , row){ return row * this.col + col; }
	
	this.getPieceBounds = function(col, row){
		var bounds = {width:0 , height:0 , x:0 , y:0};
		
		if(this.extra_part_width == 0){
			bounds.x = col * this.part_width;
			bounds.width = this.part_width;
		}else{
			bounds.width = (col > this.extra_part_width)? this.part_width : this.part_width + 1;
			bounds.x = (col > this.extra_part_width)? (this.part_width + 1) * this.extra_part_width + (col - this.extra_part_width) * this.part_width : (this.part_width + 1) * col;			
		}
		
		if(this.extra_part_height == 0){
			bounds.y = row * this.part_height;
			bounds.height = this.part_height;
		}else{
			bounds.height = (row > this.extra_part_height)? this.part_height : this.part_height + 1;
			bounds.y = (row > this.extra_part_height)? (this.part_height + 1) * this.extra_part_height + (row - this.extra_part_height) * this.part_height : (this.part_height + 1) * row;
		}
			
		return bounds;
	}
	
	this.swapchildren_col = function( start , end){		
		for(var i = 0, l = (end - start)/2; i < l  ; ++i){
			var temp = this._pieceList[start+i];
			this._pieceList[start+i] = this._pieceList[end-i];
			this._pieceList[end-i] = temp;
		}
	}
	
	this.swapchildren_row = function( array_index){
		for(var i = 0, l = array_index.length ; i < l/2 ; ++i){
			var temp = this._pieceList[array_index[i]];
			this._pieceList[array_index[i]] = this._pieceList[array_index[l-i-1]];
			this._pieceList[array_index[l-i-1]] = temp;
		}
	}
	
	this.sortInCols = function(){
		if(this.col == 1) return;
		
		var middle_col = Math.floor(this.col >> 1);
		
		for(var l = this._pieceList.length , i = middle_col; i < l ; i += this.col){
			this.swapchildren_col(i , i +( this.col - middle_col) - 1);
		}
	}
		
	this.sortInRows = function(){
		if(this.row == 1) return;
		
		var middle_row = Math.floor(this.row >> 1);
		var list = new Array();
		
		for(var i = 0; i < this.col ; ++i){
			for(var j = 0; j < this.row - middle_row ; ++j){
				list.push((middle_row  * this.col + i) + j * this.col);
			}
			this.swapchildren_row(list);
			list = new Array();
		}
			
	}
}

	Aroma.AbstractView.prototype.getCount = function() { return this.row * this.col; };

	Aroma.AbstractView.prototype.prepare = function() {  };

	Aroma.AbstractView.prototype.setSize = function (width, height) {
		
		this.part_height = Math.floor(height/this.row);
		this.extra_part_height = height % this.row;
		this.part_width = Math.floor(width/this.col);
		this.extra_part_width = width % this.col;
		
		
		this.width = width;
		this.height = height;
	}
	
	Aroma.AbstractView.prototype.setViewPortSize = function(width , height){
		this.vpWidth = width;
		this.vpHeight = height;
	}
	
	Aroma.AbstractView.prototype.dispose = function() {
		for (var i = 0 , l = this._pieceList.length; i<l ; ++i){
			if(this._pieceList[i])
				this._pieceList[i].dispose();
			this._pieceList[i] = null;
		}
		
		this._pieceList = [];
	}
	
	Aroma.AbstractView.prototype.sortParts = function(){
		this.sortInCols();
		this.sortInRows();
	}
	

//src/aroma/tools/ObjectTools.js
// Class CloneObject

window.CloneObject = window.ConcatObject || {};

CloneObject.clone = function(obj){
	if(obj == null) return {};
	var n_obj = {};
	
	for(var key in obj)
		n_obj[key] = obj[key];
		
	return n_obj;
}

ConcatObject = {};
ConcatObject.concat = function(obj , obj2){
	for(var key in obj2)
		obj[key] = obj2[key];
	return obj
}


window.setOpacity = function(element , value){	
	element.style.filter 		= 'alpha(opacity=' + value + ')';
	element.style.opacity 		=  value * .01;
	element.style.MozOpacity 	=  value * .01;
    element.style.KhtmlOpacity 	=  value * .01;
    element.style.MSOpacity 	=  value * .01;
};
//src/aroma/selector/AbstractSelector.js
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

//src/aroma/selector/SerialSelector.js
//Class SerialSelector extends AbstractSelector

Aroma.SerialSelector = function(dir, zigzag , selectNum){
	
	this.row     = 0;
	this.col  	= 0;
	this.row_len = 0;
	this.col_len = 0;
	
	this.selectNum = selectNum || 1;
	this.zigzag = zigzag;
	this.dir = dir || 'tlr';  
	    
	this.convertPoint = function(row , col){
		switch(this.dir){
			case 'tlr':
				return {row:row , col:col};
			break;
			case 'tld':
				return {row:col , col:row};
			break;
			case 'trl':
				return {row:row , col: this.col_len - col - 1};
			break;
			case 'trd':
				return {row:col , col:this.row_len - row - 1};
			break;
			case 'brl':
				return {row:this.row_len - row - 1, col: this.col_len - col - 1};
			break;
			case 'bru':
				return {row:this.col_len - col - 1 , col:this.row_len - row - 1};
			break;
			case 'blr':
				return {row:row_len - row - 1 , col:col};
			break;
			case 'blu':
				return {row:this.col_len - col - 1 , col:row};
			break;
		}
		
		return {row:row , col:col};
	}
}

Aroma.SerialSelector.prototype = new Aroma.AbstractSelector();
Aroma.SerialSelector.prototype.constructor = Aroma.SerialSelector;


Aroma.SerialSelector.prototype.getPieceList = function(){
	var list = [];
	var point = {};
	
	if(this.dir.charAt(2) == 'u' || this.dir.charAt(2) == 'd'){
		this.col_len = this.view.row;
		this.row_len = this.view.col;
	}else{
		this.col_len = this.view.col;
		this.row_len = this.view.row;
		
	}
	for(var i = 0 ; i < this.selectNum ; i++ ){
		point = this.convertPoint(this.row , ((this.zigzag && this.row % 2 != 0)? this.col_len - this.col - 1 : this.col));
		
		list.push(this.view.getPieceAt(point.col , point.row , this.effect));
		
		this.col ++;
		
		if(this.col == this.col_len){
			this.col = 0;
			this.row ++;
		}
				
	}
		
	return list;
}

Aroma.SerialSelector.prototype.reset = function(){
	this.row = 0;
	this.col = 0;
}

//src/aroma/selector/DiagonalSelector.js
// class DiagonalSelector extends AbstractSelector

Aroma.DiagonalSelector = function(startPoint , selectNum){
	
	this.selectNum = selectNum || 1;
	this.startPoint = startPoint || 'tl';
	
	 var  row_select = 0,
		  col_select = 0,
		  col_start  = 0,
		  row_start  = 0,
		  extra_col  = 0,
		  first_select = true;
		  
	this.getList = function(){
		
		var list =[];
		
		for (var i = 0 ; i < this.selectNum; i++) {
			switch(this.startPoint) {
				case 'tl':
					if (first_select) {
						first_select = false;
					}else if (col_select != 0 && row_select != this.view.row -1) {
						col_select--;
						row_select++;
					}else {
						col_select = ++ col_start;
						if (col_select > this.view.col - 1 ) {
							row_select = ++extra_col;
							col_select = this.view.col - 1;
						}else {
							row_select = 0;
						}
					}
					break;
				case 'tr':
					if (first_select) {
						first_select = false;
						col_select = this.view.col - 1;
					}else if (col_select != this.view.col-1 && row_select != this.view.row -1) {
						col_select++;
						row_select++;
					}else {
						col_select = (this.view.col-1) - (++ col_start);
						if (col_select < 0 ) {
							row_select = ++extra_col;
							col_select = 0;
						}else {
							row_select = 0;
						}
					}
					break;
				case 'bl':
					if (first_select) {
						first_select = false; 
						row_select = this.view.row -1;
					}else if (col_select != 0 && row_select != 0) {
						col_select--;
						row_select--;
					}else {
						col_select = ++ col_start;
						if (col_select > this.view.col-1 ) {
							row_select = (this.view.row -1) - (++extra_col);
							col_select = this.view.col -1;
						}else {
							row_select = this.view.row -1;
						}
					}
					break;
				case 'br':
					if (first_select) {
						first_select = false; 
						row_select = this.view.row - 1;
						col_select = this.view.col -1;
					}else if (col_select != this.view.col -1 && row_select != 0) {
						col_select++;
						row_select--;
					}else {
						col_select = (this.view.col-1) - (++ col_start);
						if (col_select < 0  ) {
							row_select = (this.view.row -1) - (++extra_col);
							col_select = 0;
						}else {
							row_select = this.view.row -1;
						}
					}
					break;
			}
			
			list[i] = this.view.getPieceAt(col_select , row_select , this.effect);
		}
		
		return list;
	}	  
	
	this._reset = function(){
		row_select = 0,
		col_select = 0,
		col_start  = 0,
		row_start  = 0,
		extra_col  = 0,
		first_select = true;
	}
	
}

Aroma.DiagonalSelector.prototype = new Aroma.AbstractSelector();
Aroma.DiagonalSelector.prototype.constructor = Aroma.DiagonalSelector;

Aroma.DiagonalSelector.TOP_LEFT     = 'tl'; 
Aroma.DiagonalSelector.BOTTOM_LEFT  = 'bl'; 
Aroma.DiagonalSelector.TOP_RIGHT    = 'tr'; 
Aroma.DiagonalSelector.BOTTOM_RIGHT = 'br'; 

Aroma.DiagonalSelector.prototype.getPieceList = function(){
	return this.getList();
}

Aroma.DiagonalSelector.prototype.reset = function(){
	return this._reset();
}



//src/aroma/selector/RandSelector.js
// class RandSelector extends AbstractSelector
Aroma.RandSelector = function(selectNum){
	
	this.selectNum = selectNum || 1;
	this.id_rand_list = [];
	
	this.shuffle = function(array){
		var r_index = Math.floor(Math.random() * array.length);
		var value = array[r_index];
		
		array.splice(r_index , 1);
		
		return value;
	}
	
}

Aroma.RandSelector.prototype = new Aroma.AbstractSelector();
Aroma.RandSelector.prototype.constructor = Aroma.RandSelector;

Aroma.RandSelector.prototype.setup = function(effect, view){
	Aroma.AbstractSelector.prototype.setup.call(this , effect , view);
	for(var i = 0, l = view.col * view.row; i <l ; ++i) this.id_rand_list[i] = i;
}

Aroma.RandSelector.prototype.getPieceList = function(){
	var list = [];
	var index = 0;
	
	for(var i = 0 ; i < this.selectNum ; ++i){
		index = this.shuffle(this.id_rand_list);
		list[i] = this.view.getPieceAt( Math.floor(index / this.view.row) , index % this.view.row , this.effect);
	}
		
	return list;
}
//src/aroma/piece/Piece.js
//Class Piece
Aroma.Piece = function(){
	
	this.col = 0;
	this.row = 0;
	this.bounds = {};
	
	//Origin
	this.origin_x = 0;
	this.origin_y = 0;
	this.origin_z = 0;
	
	/*this.proxy     = null;
	this.oldSource = null;
	this.newSource = null;
	this.view      = null;*/
	this.options   = {}; 
	
}

//src/aroma/effect/Effect.js
//Class Effect

Aroma.Effect = function(){

	//this.data;
	//this.fromData = null;
	//this.getTo = null;
	//this.getFrom = null;
	this.pieceOptions = {};
	//this.view = null;
	//this.selector = null;
	this.isStatic = false;
	//this.piece = null;
};

Aroma.Effect.prototype.addFrame = function(time  , to , options){
	this.data.push({time:time , to:to , options:options});
};

Aroma.Effect.prototype.getToData = function(){
	if(this.data != null && this.isStatic)
		return this.data;
	
	this.data = new Array();
	this.getTo();
	
	
	return this.data;	
};

Aroma.Effect.prototype.getFromData = function() {
	if(this.fromData != null && this.isStatic)
		return this.fromData;
	else if(this.isStatic){
		this.fromData = this.getFrom();
		return this.fromData;
	}else
		return this.getFrom();
};

Aroma.Effect.prototype.prepare = function() {};
Aroma.Effect.prototype.getPieceOptions = function() {return this.pieceOptions;};


//src/uaparser/ua-parser.js
// UA-Parser.js v0.2.0
// Lightweight JavaScript-based user-agent parser
// https://github.com/faisalman/ua-parser-js
//
// Copyright © 2012 Faisalman
// Licensed under GPLv2

function UAParser (uastring) {

    var ua = uastring || window.navigator.userAgent;

    // regexp mapper
    var regxMap = function (ua) {
        var result;
        var i, j, k, l;
        for (i = 1; i < arguments.length; i += 2) {
            var regex = arguments[i];
            var props = arguments[i + 1];
            var isMatchFound = false;
            for (j = 0; j < regex.length; j++) {
                var match = regex[j].exec(ua);
                //console.log(match);
                if (!!match) {
                    result = {};
                    l = 1;
                    for (k = 0; k < props.length; k++) {
                        if (typeof props[k] === 'object' && props[k].length === 2) {
                            result[props[k][0]] = props[k][1];
                            l -= 1;
                        } else if (typeof props[k] === 'object' && props[k].length === 3) {
                            result[props[k][0]] = (!!match[k + l]) ? match[k + l].replace(props[k][1], props[k][2]) : undefined;
                        } else {
                            result[props[k]] = (!!match[k + l]) ? match[k + l] : undefined;
                        }
                    }
                    isMatchFound = true;
                    break;
                }
            }
            if (!isMatchFound) {
                result = {};
                for (k in props) {
                    if (props.hasOwnProperty(k)) {
                        if (typeof props[k] == 'object') {
                            result[props[k][0]] = undefined;
                        } else {
                            result[props[k]] = undefined;
                        }
                    }
                }
            } else {
                return result;
            }
        }
        return result;
    };

    var mapper = {
        os : {        
            win: function (str, match) {
                switch (match.toLowerCase()) {
                    case 'nt 5.0':
                        return '2000';
                    case 'nt 5.1':
                    case 'nt 5.2':
                        return 'XP';
                    case 'nt 6.0':
                        return 'Vista';
                    case 'nt 6.1':
                        return '7';
                    case 'nt 6.2':
                        return '8';
                    default:
                        return match;
                };
            }
        }
    };

    this.getBrowser = function (uastring) {

        return regxMap(uastring || ua, [

            // Mixed
            /(kindle)\/((\d+)?[\w\.]+)/i,                                       // Kindle
            /(lunascape|maxthon|netfront|jasmine)[\/\s]?((\d+)?[\w\.]+)/i,      // Lunascape/Maxthon/Netfront/Jasmine
            
            // Presto based
            /(opera\smini)\/((\d+)?[\w\.-]+)/i,                                 // Opera Mini
            /(opera\smobi)\/((\d+)?[\w\.-]+)/i,                                 // Opera Mobile
            /(opera).*\/((\d+)?[\w\.]+)/i,                                      // Opera

            // Trident based
            /(avant\sbrowser|iemobile|slimbrowser)[\/\s]?((\d+)?[\w\.]*)/i,     // Avant/IEMobile/SlimBrowser
            /ms(ie)\s((\d+)?[\w\.]+)/i,                                         // Internet Explorer

            // Webkit/KHTML based
            /(chromium|flock|rockmelt|midori|epiphany)\/((\d+)?[\w\.]+)/i,      // Chromium/Flock/RockMelt/Midori/Epiphany
            /(chrome|omniweb|arora|dolfin)\/((\d+)?[\w\.]+)/i,                  // Chrome/OmniWeb/Arora/Dolphin
            ], ['name', 'version', 'major'], [
            /android.+crmo\/((\d+)?[\w\.]+)/i,                                  // Chrome for Android
            ], [['name', 'Chrome'], 'version', 'major'], [
            /(mobile\ssafari|safari|konqueror)\/((\d+)?[\w\.]+)/i,              // Safari/Konqueror
            /(applewebkit|khtml)\/((\d+)?[\w\.]+)/i,

            // Gecko based
            /(iceweasel|camino|fennec|maemo|minimo)[\/\s]?((\d+)?[\w\.\+]+)/i,  // Iceweasel/Camino/Fennec/Maemo/Minimo
            /(firefox|seamonkey|netscape|navigator|k-meleon|icecat|iceape)\/((\d+)?[\w\.]+)/i,
                                                                                // Firefox/SeaMonkey/Netscape/K-Meleon/IceCat/IceApe
            /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i,                          // Mozilla

            // Other
            /(lynx|dillo|icab)[\/\s]?((\d+)?[\w\.]+)/i,                         // Lynx/Dillo/iCab
            ], ['name', 'version', 'major']);  
    };

    this.getEngine = function (uastring) {

        return regxMap(uastring || ua, [

            /(presto)\/([\w\.]+)/i,                                             // Presto
            /([aple]*webkit|trident)\/([\w\.]+)/i,                              // Webkit/Trident
            /(khtml)\/([\w\.]+)/i                                               // KHTML
            ], ['name', 'version'], [

            /rv\:([\w\.]+).*(gecko)/i                                           // Gecko
            ], ['version', 'name']);
    };

    this.getOS = function (uastring) { 

        return regxMap(uastring || ua, [

            // Windows based
            /(windows\sphone\sos|windows)\s+([\w\.\s]+)*/i,                     // Windows
            ], ['name', ['version', /(nt\s[\d\.]+)/gi, mapper.os.win]], [

            // Mobile/Embedded OS
            /(blackberry).+version\/([\w\.]+)/i,                                // Blackberry
            /(android|symbianos|symbos|webos|palm\os|qnx|bada|rim\stablet\sos)[\/\s-]?([\w\.]+)*/i,
                                                                                // Android/Symbian/WebOS/Palm/QNX/Bada/RIM
            /(nintendo|playstation)\s([wids3portable]+)/i,                      // Nintendo/Playstation

            // GNU/Linux based
            /(mint)[\/\s\(]?(\w+)*/i,                                           // Mint
            /(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk)[\/\s-]?([\w\.-]+)*/i,
                                                                                // Joli/Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware
                                                                                // Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk
            /(gnu|linux)\s?([\w\.]+)*/i                                         // Other GNU/Linux
            ], ['name', 'version'], [

            /cros\s([\w\.\s]+)/i                                                // Chromium OS
            ], [['name', 'Chromium OS'], 'version'],[

            // Solaris
            /sunos\s?([\w\.\s]+)*/i                                             // Solaris
            ], [['name', 'Solaris'], 'version'], [

            // BSD based
            /\s(\w*bsd|dragonfly)\s?([\w\.]+)*/i,                               // FreeBSD/NetBSD/OpenBSD/DragonFly
            ], ['name', 'version'],[

            /(ip[honead]+).*os\s*([\w]+)*\slike\smac/i                          // iOS
            ], [['name', /.+/g, 'iOS'], ['version', /_/g, '.']], [

            /(mac\sos)\sx\s([\w\s\.]+)/i,                                       // Mac OS
            ], ['name', ['version', /_/g, '.']], [

            // Other
            /(macintosh|unix|minix|beos)[\/\s]?()*/i
            ], ['name', 'version']);
    };

    this.getDevice = function (uastring) { 

        return regxMap(uastring || ua, [

            /\((ip[honead]+|playbook);/i,                                       // iPod/iPhone/iPad/PlayBook
            /(blackberry)[\s-]?(\w+)/i,                                         // BlackBerry
            /(blackberry|benq|nokia|palm(?=\-)|sonyericsson)[\s-]?([\w-]+)*/i,  // BenQ/Nokia/Palm/Sony-Ericsson
            /(hp)\s([\w\s]+)/i,                                                 // HP iPAQ
            /(hp).+(touchpad)/i,                                                // HP TouchPad
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /(lg)[e;\s-]+(\w+)*/i,                                              // LG
            /(nintendo|playstation)\s([wids3portable]+)/i                       // Nintendo/Playstation
            ], ['name', 'version'], [
            
            /(htc)[;_\s-]+([\w\s]+(?=\))|[\w]+)*/i,                             // HTC
            /(zte)-([\w]+)*/i
            ], ['name', ['version', /_/g, ' ']], [
                        
            /\s(milestone|mz601|droid[2x]?|xoom)[globa\s]*\sbuild\//i,          // Motorola
            /mot[\s-]?(\w+)*/i
            ], [['name', 'Motorola'], 'version'], [
            
            /(s[cgp]h-\w+|gt-\w+|galaxy\snexus)/i,                              // Samsung
            /sam[sung]*[\s-]*(\w+-?[\w-]*)*/i,
            /sec-(sgh\w+)/i
            ], [['name', 'Samsung'], 'version'], [

            /sie-(\w+)*/i                                                       // Siemens
            ], [['name', 'Siemens'], 'version']);
    };

    this.setUA = function (uastring) {
        ua = uastring || ua;
        return this.result = {
            browser : this.getBrowser(),
            engine  : this.getEngine(),
            os      : this.getOS(),
            device  : this.getDevice()
        };
    };

    this.setUA(ua);
};

//src/rotator/Cute.js
window.Cute = {
	version : 2.1,
	name	: 'Cute Slider',
	author	: 'Averta Group'
}

//src/rotator/effects/Effect1.js
Cute.Effect1 = function (param){
	
	Aroma.Effect.prototype.constructor.call(this);
	
	param = param || {};
	
	this.ease = param.ease || TWEEN.Easing.Linear;
	
	this.isStatic = true;
};

Cute.Effect1.prototype = new Aroma.Effect();
Cute.Effect1.prototype.constructor = Cute.Effect1;

Cute.Effect1.prototype.getToVars = function(){
	this.addFrame(1 , {  opacity:100   } ,  {ease:this.ease.EaseOut} );
};
		
Cute.Effect1.prototype.getFromVars = function(){ return {opacity:0 , slide:100  };};

Cute.Effect1.prototype.prepare = function(){
	this.getFrom = this.getFrom ||  this.getFromVars;
	this.getTo =  this.getTo 	|| this.getToVars;
}

//src/rotator/effects/Effect2.js
Cute.Effect2 = function (param){
	
	Aroma.Effect.prototype.constructor.call(this);
	
	param = param || {};
	
	this.pieceOptions.dir  = param.dir  || 'r';
	this.pieceOptions.push = param.push;
	this.ease = param.ease || TWEEN.Easing.Linear;
	this.fade = param.fade;
	
	this.isStatic = true;
};

Cute.Effect2.prototype = new Aroma.Effect();
Cute.Effect2.prototype.constructor = Cute.Effect2;

Cute.Effect2.prototype.getToVars = function(){
	this.addFrame(1 , this.fade ? {opacity:100 , slide:100} : {slide:100} ,  {ease:this.ease.EaseInOut} );
};
		
Cute.Effect2.prototype.getFromVars = function(){ return this.fade ? {opacity:0 , slide:0} : {slide:0};};

Cute.Effect2.prototype.prepare = function(){
	this.getFrom = this.getFrom ||  this.getFromVars;
	this.getTo =  this.getTo 	|| this.getToVars;
};


//src/rotator/effects/Effect3.js
Cute.Effect3 = function (param){
	Cute.Effect2.prototype.constructor.call(this , param);
	this.dir_name_arr = ['r','l','t','b'];
};

Cute.Effect3.prototype = new Cute.Effect2();
Cute.Effect3.prototype.constructor = Cute.Effect3;

Cute.Effect3.prototype.getPieceOptions = function(){
	this.pieceOptions.dir = this.dir_name_arr[Math.round(parseInt(Math.random() * 3))];
	return this.pieceOptions;
}


//src/rotator/effects/Effect4.js
Cute.Effect4 = function (param){
	Cute.Effect3.prototype.constructor.call(this , param);
	this.counter = 0;
	this.rotation_dir = param.dir || 'vertical';
};

Cute.Effect4.prototype = new Cute.Effect3();
Cute.Effect4.prototype.constructor = Cute.Effect4;

Cute.Effect4.prototype.getPieceOptions = function(){
	this.pieceOptions.dir = this.dir_name_arr[((this.counter ++ %2)?0:1) + ((this.rotation_dir == 'vertical')? 2 : 0)];
	return this.pieceOptions;
}
//src/rotator/effects/Effect5.js
Cute.Effect5 = function (param){
	
	Aroma.Effect.prototype.constructor.call(this);
	
	param = param || {};
	
	this.side 			= param.side  || 'r';
	this.zmove 			= param.zmove || 0;
	this.rotation_axis 	= 'y';
	this.rotation_dir 	= 1;
	this.xspace 		= param.xspace || 0;
	this.yspace 		= param.yspace || 0;
	this.stack 			= param.stack  || false;
	this.balance 		= param.blance || 0.5; 
	this.ease 	        = param.ease   || TWEEN.Easing.Linear;
	
	this.isStatic = false;
	
};

Cute.Effect5.prototype = new Aroma.Effect();
Cute.Effect5.prototype.constructor = Cute.Effect5;

Cute.Effect5.prototype.createFrames = function(to_vars1 , to_vars2){
	if(!this.stack){
		to_vars1.z = this.zmove;
		to_vars2.z = 0;
		
		to_vars1.x = (this.piece.col - Math.floor(this.view.col * 0.5)) * this.xspace;
		to_vars1.y = (this.piece.row - Math.floor(this.view.row * 0.5)) * this.yspace;
		
		to_vars2.y = to_vars2.x = 0;
		
		this.addFrame(0.5 , to_vars1 , {ease:this.ease.EaseIn});
		this.addFrame(0.5 , to_vars2 , {ease:this.ease.EaseOut});
	}else{
		var moveVars = {};
		
		moveVars.x = (this.piece.col - Math.floor(this.view.col * 0.5)) * this.xspace;
		moveVars.y = (this.piece.row - Math.floor(this.view.row * 0.5)) * this.yspace;
		moveVars.z = this.zmove;
		
		this.addFrame(this.balance*.5 	, moveVars , {ease:this.ease.EaseInOut});
		this.addFrame(1 - this.balance  , to_vars2 , {ease:this.ease.EaseInOut});
		this.addFrame(this.balance*.5 , {z:0 , x:0 , y:0 } , {ease:this.ease.EaseInOut});
		
	}
}

Cute.Effect5.prototype.getToVars = function(){
	var to_vars1 = {};
	var to_vars2 = {};
	
	if(this.rotation_axis == 'y'){
		to_vars1.rotationY = 45 * this.rotation_dir;
		to_vars2.rotationY = 90 * this.rotation_dir;
	}else{
		to_vars1.rotationX = 45 * this.rotation_dir;
		to_vars2.rotationX = 90 * this.rotation_dir;
	}
	
	this.createFrames(to_vars1 , to_vars2);
};
		
Cute.Effect5.prototype.getFromVars = function(){ return {};	};
		
Cute.Effect5.prototype.checkSidePos = function() {
			
	switch(this.side){
		case 'r':
			this.pieceOptions.newImageLocation = this.piece.side_dic.right;
			this.pieceOptions.depth = this.piece.bounds.width;
			this.rotation_axis = 'y';
			this.rotation_dir = 1;
			break;
		case 'l':
			this.pieceOptions.newImageLocation = this.piece.side_dic.left;
			this.pieceOptions.depth = this.piece.bounds.width;
			this.rotation_axis = 'y';
			this.rotation_dir = -1;	
			break;
		case 't':
			this.pieceOptions.newImageLocation = this.piece.side_dic.top;
			this.pieceOptions.depth = this.piece.bounds.height;
			this.rotation_axis = 'x';
			this.rotation_dir = 1;
			break;
		case 'b':
			this.pieceOptions.newImageLocation = this.piece.side_dic.bottom;
			this.pieceOptions.depth = this.piece.bounds.height;
			this.rotation_axis = 'x';
			this.rotation_dir = -1;
			break;
	}
	
}
		
		
Cute.Effect5.prototype.prepare = function(){
	this.getFrom = this.getFrom ||  this.getFromVars;
	this.getTo =  this.getTo 	|| this.getToVars;
}

Cute.Effect5.prototype.getPieceOptions = function(){
	this.checkSidePos();
	return this.pieceOptions;
}

//src/rotator/effects/Effect6.js
Cute.Effect6 = function(param){
	Cute.Effect5.prototype.constructor.call(this , param);
	this.slide_name_arr = ['l','r','b','t'];
}

Cute.Effect6.prototype = new Cute.Effect5();
Cute.Effect6.prototype.constructor = Cute.Effect6;

Cute.Effect6.prototype.getPieceOptions = function(){
	this.side = this.slide_name_arr[Math.round(parseInt(Math.random() * 3))];
	
	this.checkSidePos();
	return this.pieceOptions;
}


//src/rotator/effects/Effect7.js
Cute.Effect7 = function(param){
	Cute.Effect6.prototype.constructor.call(this , param);
	this.counter = 0;
	this._move  = param.dir || 'vertical';
}

Cute.Effect7.prototype = new Cute.Effect6();
Cute.Effect7.prototype.constructor = Cute.Effect7;

Cute.Effect7.prototype.getPieceOptions = function(){
	this.side = this.slide_name_arr[((this.counter ++ %2)?0:1) + ((this._move == 'vertical')? 2 : 0)];
	
	this.checkSidePos();
	return this.pieceOptions;
}


//src/rotator/effects/Effect8.js
Cute.Effect8 = function(param) {
	
	param = param || {};
	
	Cute.Effect5.prototype.constructor.call(this,param);

	this.sideColor 		= param.sidecolor || 0;
	this.depth 			= param.depth 	  || -1;
	this.dir 			= param.dir       || 'u';
	this.rotation_axis 	= 'x';
	this.rotation_dir 	= 1;
}

Cute.Effect8.prototype = new Cute.Effect5();
Cute.Effect8.prototype.constructor = Cute.Effect8;

Cute.Effect8.prototype.getToVars = function() {
	var to_vars1 = {};
	var to_vars2 = {};
	
	if(this.rotation_axis == 'y'){
		to_vars1.rotationY = 90 *  this.rotation_dir;
		to_vars2.rotationY = 180 * this.rotation_dir;
	}else{
		to_vars1.rotationX = 90 *  this.rotation_dir;
		to_vars2.rotationX = 180 * this.rotation_dir;
	}
	
	this.createFrames(to_vars1 , to_vars2);
}
		
Cute.Effect8.prototype.updateConfig = function(){
	this.pieceOptions.sideColor = this.sideColor;
	this.pieceOptions.depth = (this.depth <= 0 ? (this.dir == 'u' || this.dir == 'd' ? this.piece.bounds.height: this.piece.bounds.width) : this.depth);
	
	this.rotation_axis = (this.dir == 'u' || this.dir == 'd') ? 'x' : 'y';
	this.rotation_dir  = (this.dir == 'u' || this.dir == 'r') ?  1  : -1 ;
	this.pieceOptions.flipX = this.pieceOptions.flipY = (this.dir == 'u' || this.dir == 'd');
};
		
Cute.Effect8.prototype.getPieceOptions = function(){
	this.updateConfig();
	return this.pieceOptions;
}
//src/rotator/effects/Effect9.js
Cute.Effect9 = function(param){
	Cute.Effect8.prototype.constructor.call(this , param);
	
	this.dir_name_arr = ['l','r','u','d'];
};

Cute.Effect9.prototype = new Cute.Effect8();
Cute.Effect9.prototype.constructor = Cute.Effect9;

Cute.Effect9.prototype.getPieceOptions = function(){
	this.dir = this.dir_name_arr[Math.round(parseInt(Math.random() * 3))];
	
	this.updateConfig();
	return this.pieceOptions;
};
//src/rotator/effects/Effect10.js
Cute.Effect10 = function(param){
	Cute.Effect9.prototype.constructor.call(this , param);
	this.counter = 0;
	this._move = param.dir || 'vertical';
};

Cute.Effect10.prototype = new Cute.Effect9();
Cute.Effect10.prototype.constructor = Cute.Effect10;

Cute.Effect10.prototype.getPieceOptions = function(){
	this.dir = this.dir_name_arr[((this.counter ++ %2)?0:1) + ((this._move == 'vertical')? 2 : 0)];
	
	this.updateConfig();
	return this.pieceOptions;
};

//src/rotator/effects/Effect11.js
Cute.Effect11 = function(param){
	
	Cute.Effect8.call(this , param);
	
	param = param || {};
	
	this.rotation_x = 0;
	this.rotation_y = 0;
	this.dir = param.dir || 'tr';
	this.pieceOptions.flipX = this.pieceOptions.flipY = true;
};

Cute.Effect11.prototype = new Cute.Effect8();
Cute.Effect11.prototype.constructor = Cute.Effect11;

Cute.Effect11.prototype.getToVars = function() {
  var to_vars1 = {};
  var to_vars2 = {};
	
	if(this.rotation_x != 0){
		to_vars1.rotationX = 90 * this.rotation_x;
		to_vars2.rotationX = 180 * this.rotation_x;
	}
	
	if(this.rotation_y != 0){
		to_vars1.rotationY = 180 * this.rotation_y;
		to_vars2.rotationY = 360 * this.rotation_y;
	}
	
	this.createFrames(to_vars1 , to_vars2);
};
		
Cute.Effect11.prototype.updateConfig = function(){
	
	this.pieceOptions.sideColor = this.sideColor;
	this.pieceOptions.depth = (this.depth <= 0 ? 10 : this.depth);
	
	switch(this.dir.charAt(0)){
		case 't':
			this.rotation_x = -1;
		break;
		case 'b':
			this.rotation_x = 1;
		break;
	}
	
	switch(this.dir.charAt(1)){
		case 'r':
			this.rotation_y = -1;
		break;
		case 'l':
			this.rotation_y = 1;
		break;
	}
	
};


//src/rotator/effects/Effect12.js
Cute.Effect12 = function(param){
	Cute.Effect11.prototype.constructor.call(this , param);
	
	this.dir_name_arr =  ['tl','tr','bl','br'];
};

Cute.Effect12.prototype = new Cute.Effect11();
Cute.Effect12.prototype.constructor = Cute.Effect12;

Cute.Effect12.prototype.getPieceOptions = function(){
	this.dir = this.dir_name_arr[Math.round(parseInt(Math.random() * 3))];
	
	this.updateConfig();
	return this.pieceOptions;
};
//src/rotator/tools/WindowResize.js
(function(){
	window.resizeListeners = [];

	if (window.addEventListener) 
		window.addEventListener('resize', onWindowResize); 
	else if (window.attachEvent)  
		window.attachEvent('onresize', onWindowResize);
	
	function onWindowResize(event){
		for(var i = 0 , l = window.resizeListeners.length; i<l ; ++i){
			window.resizeListeners[i].listener.call(window.resizeListeners[i].ref);
		}
	}
	
	window.addResizeListener = function(listener , ref){
		window.resizeListeners.push({listener:listener , ref:ref});
	}
	
	window.removeResizeListener = function(listener , ref){
		for(var i = 0; i<window.resizeListeners.length; ++i){
			if( window.resizeListeners[i].listener == listener && 
				window.resizeListeners[i].ref == ref)
				window.resizeListeners.splice(i , 1);
		}
	}
})();


//src/rotator/tools/Timer.js
Averta = {};
Averta.Timer = function(delay , autoStart) {
	this.delay = delay;
	this.currentCount = 0;
	this.paused = false;
	this.onTimer = null;
	this.refrence = null;
	
	if(autoStart) this.start();
	
}

Averta.Timer.prototype = {
	
	constructor : Averta.Timer,
	
	start : function(){
		this.paused = false;
		this.lastTime = Date.now();
	},
	
	stop : function(){
		this.paused = true;
	},
	
	reset : function(){
		this.currentCount = 0;
		this.paused = true;
		this.lastTime = Date.now();
	},
	
	update : function(){
		if(this.paused || Date.now() - this.lastTime < this.delay) return;
		this.currentCount ++;
		this.lastTime = Date.now();
		if(this.onTimer)
			this.onTimer.call(this.refrence , this.getTime());
		
	} ,
	
	getTime : function(){
		return this.delay * this.currentCount;
	}
	
}
//src/rotator/tools/Ticker.js
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
 

    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };


Cute.Ticker = Cute.Ticker || {
	
	list : [],
	__stoped : true,
	
	add : function (listener , ref){
		Cute.Ticker.list.push([listener , ref]);
		return Cute.Ticker.list.length;
	},
	
	remove : function (listener , ref) {
		for(var i = 0 , l = Cute.Ticker.list.length ; i<l ; ++i){
			if(Cute.Ticker.list[i] && Cute.Ticker.list[i][0] == listener && Cute.Ticker.list[i][1] == ref){
				Cute.Ticker.list.splice(i , 1);
			}
		}
	},
	
	start : function (){
		if(!Cute.Ticker.__stoped) return;
		
		Cute.Ticker.__stoped = false;
		Cute.Ticker.__tick();
	},
	
	stop : function (){
		Cute.Ticker.__stoped = true;
	},
	
	__tick : function () {
		if(Cute.Ticker.__stoped) return;
		
		for(var i = 0 ;i<Cute.Ticker.list.length ; ++i){
			Cute.Ticker.list[i][0].call(Cute.Ticker.list[i][1]);
		}

		requestAnimationFrame(Cute.Ticker.__tick);
	}
	
};

//src/rotator/tools/FallBack.js
Cute.FallBack = function(){
	
}

Cute.FallBack.CANVAS = 'canvas';
Cute.FallBack.CSS3D  = 'css3d';
Cute.FallBack.DOM2D  = 'dom2d';
Cute.FallBack.ua     = new UAParser().result;

Cute.FallBack.prototype = {
		
	force  : null, // 2d , canvas , css
	
	__result : null ,

	getType : function(){
		if(this.__result) return this.__result;
		
		if(this.force){
			switch(this.force.toLowerCase()){
				case '2d':
					this.__result = Cute.FallBack.DOM2D;
				break;
				case 'canvas':
					this.__result = Cute.FallBack.CANVAS;
				break;
				case 'css':
					this.__result = Cute.FallBack.CSS3D;
				break;
			}
			
			if (this.__result) return this.__result;
		}
		
		
		var ua = Cute.FallBack.ua;
		var type = Cute.FallBack.DOM2D;
		
		var os = ua.os.name.toLowerCase();
		var browser = ua.browser.name.toLowerCase();
		var noResult = false;
		
		switch (os){
			case 'windows':
			case 'mac os' :
			case 'linux'  :
			case 'ubuntu' :
				if (browser == 'chrome' || browser == 'safari' || browser == 'chromium' || ua.engine.name == 'AppleWebKit')
					type = Cute.FallBack.CSS3D;
				else if((browser == 'ie' && parseInt(ua.browser.major) >= 9) || browser == 'firefox' || browser == 'opera')
					type = Cute.FallBack.CANVAS;
			break;
			
			//Mobile Devices
			case 'ios' :
				type = Cute.FallBack.CSS3D;
			break;
			case 'android':
				if(parseInt(ua.os.version.charAt(0)) >= 4)
					type = Cute.FallBack.CSS3D;
			break;
			case 'windows phone os' :
				type = Cute.FallBack.DOM2D;
			break;
			
			default:
				noResult = true;
		}
		
		if(window.Modernizr){
			if(type == Cute.FallBack.CANVAS && !Modernizr.canvas) 
				type = Cute.FallBack.DOM2D;
			else if(type == Cute.FallBack.CSS3D && !Modernizr.csstransforms3d)
				type = Cute.FallBack.DOM2D;
			else if(noResult){
				if(Modernizr.csstransforms3d)
					type = Cute.FallBack.CSS3D;
				else if(Modernizr.canvas)
					type = Cute.FallBack.CANVAS;
			}
		}
		
		
		this.__result = type;
		return type;
	}
	
};

Cute.FallBack.isIE  = Cute.FallBack.ua.browser.name == 'IE';
Cute.FallBack.isIE7 = Cute.FallBack.isIE && Cute.FallBack.ua.browser.major == 7;
Cute.FallBack.isIE8 = Cute.FallBack.isIE && Cute.FallBack.ua.browser.major == 8;

Cute.FallBack.isMobileDevice = (Cute.FallBack.ua.os.name.toLowerCase() == 'android' || Cute.FallBack.ua.os.name.toLowerCase() == 'ios'  || Cute.FallBack.ua.os.name.toLowerCase() == 'windows phone os'),
//src/rotator/tools/IEDate.js
(function(){
if(Cute.FallBack.ua.browser.name == 'IE' &&  parseInt(Cute.FallBack.ua.browser.major) < 9){
	Date.now = function(){
		return new Date().getTime();
	}
	
	Array.prototype.indexOf = function(object){
		for(var i = 0 , l = this.length; i<l ; ++i) {
			if(this[i] == object) return i;
		}
		return -1;
	}
}
}());
//src/rotator/tools/ModuleLoader.js
Cute.ModuleLoader = function(fb){
	this.fallBack = fb;
	
};
Cute.ModuleLoader.loadedModules = {
	css3d:false,
	canvas:false,
	dom2d:false
};

Cute.ModuleLoader.css3d_files  = ['js/cute/cute.css3d.module.js'];
				  
Cute.ModuleLoader.canvas_files = ['js/cute/cute.canvas.module.js'];
				   
Cute.ModuleLoader.dom2d_files  = ['js/cute/cute.2d.module.js'];


Cute.ModuleLoader.prototype = {
	/*	
	css3d_files : ['js/sprite3d/Sprite3D.js'  ,
	 			   'js/aroma/tools/VectorTools.js', 
				   'js/aroma/view/CSS3DView.js'   ,
				   'js/aroma/piece/CSS3DCube.js'  
				  ],
				  
	canvas_files : ['js/three/ThreeCanvas.js'  ,
	 			   'js/aroma/tools/CanvasTools.js', 
				   'js/aroma/view/ThreeView.js'   ,
				   'js/aroma/piece/ThreeCubePiece.js'  
				   ],
				   
	dom2d_files : ['js/aroma/view/DivView.js'   ,
				   'js/aroma/piece/DivPiece.js'
				   ],
	*/
	
	
		
	onComplete : null , // {listener , ref}
	
	loadModule : function(){
		
		var type = this.fallBack.getType();
		
		if(Cute.ModuleLoader.loadedModules[type]){
			if(this.onComplete){
		  		Cute.ModuleLoader.loadedModules[type] = true;
		  		this.onComplete.listener.call(this.onComplete.ref);
		  	}
		  	
		  	return;
		}
		
		var files = [];
		
		switch (type){
			case Cute.FallBack.CSS3D:
				files = Cute.ModuleLoader.css3d_files;
			break;
			case Cute.FallBack.CANVAS:
				files = Cute.ModuleLoader.canvas_files;
			break;
			case Cute.FallBack.DOM2D:
				files = Cute.ModuleLoader.dom2d_files;
			break;
		}
		
		var $this = this;
		
		yepnope({
		  load: files,
		  complete: function(){
		  	if($this.onComplete){
		  		Cute.ModuleLoader.loadedModules[type] = true;
		  		$this.onComplete.listener.call($this.onComplete.ref);
		  	}
		  }
		});
		
	}
}

//src/rotator/tools/EventDispatcher.js
window.Averta = window.Averta || {};

Averta.EventDispatcher = function(){
	this.listeners = {};
}

Averta.EventDispatcher.extend = function(_proto){
	var instance = new Averta.EventDispatcher();
	for(var key in instance)
		if(key != 'constructor') _proto[key] =  Averta.EventDispatcher.prototype[key];
}

Averta.EventDispatcher.prototype = {
	
	constructor : Averta.EventDispatcher,
	
	addEventListener : function(event , listener , ref){
		if(!this.listeners[event]) this.listeners[event] = [];
		this.listeners[event].push({listener:listener , ref:ref});
		
	},
	
	removeEventListener : function(event , listener , ref){
		if(this.listener[event.type]){
			for(var i = 0 , l = this.listeners[event].length; i < l ; ++i)
				if(listener == this.listeners[event][i].listener && ref == this.listeners[event][i].ref)
					this.listeners[event].splice(i);
			
			if (this.listeners[event].length == 0)
				delete this.listeners[event];
		}
	},
	
	dispatchEvent : function (event) {
		event.target = this;
		if(this.listeners[event.type])
			for(var i = 0 , l = this.listeners[event.type].length; i < l ; ++i){
				this.listeners[event.type][i].listener.call(this.listeners[event.type][i].ref , event);	
				//console.log(event.type ,this.listeners[event.type][i].ref )
			}
	}
}

//src/rotator/tools/SliderEvent.js
Cute.SliderEvent = function (type){
	this.type = type;
}

Cute.SliderEvent.CHANGE_START      = 'changeStart';
Cute.SliderEvent.CHANGE_END        = 'changeEnd';
Cute.SliderEvent.WATING		      = 'wating';
Cute.SliderEvent.AUTOPLAY_CHANGE   = 'autoplayChange';
Cute.SliderEvent.CHANGE_NEXT_SLIDE = 'changeNextSlide';
Cute.SliderEvent.WATING_FOR_NEXT   = 'watingForNextSlide';


//src/rotator/tools/ScrollContainer.js
window.Averta = window.Averta || {};

Averta.ScrollContainer = function(element , content){

	this.element = element;
	this.scrollStartPosY = 0;
	this.scrollStartPosX = 0;
	this.content = content;
	
	this.lastX = 0;
	this.lastY = 0;
	this.moved = false;
	
	this.isTouch = function(){
		try{document.createEvent("TouchEvent");	return true;}
		catch(e){return false;}
	}
	
}


Averta.ScrollContainer.prototype = {
	
	constrcutor : Averta.ScrollContainer,
	
	setup : function(){
		
		if(Cute.FallBack.isIE8 || Cute.FallBack.isIE7) return;
		
		var sc = this;
		var it = this.isTouch();
		
		function onMouseDown(event){

			if(it){
				sc.scrollStartPosX = event.touches[0].pageX;
				sc.scrollStartPosY = event.touches[0].pageY;
			}else{
				sc.scrollStartPosX = event.clientX;
				sc.scrollStartPosY = event.clientY;
			}
			sc.mouseDown = true;
			
			sc.moved = false;
			
			if(window.addEventListener){
				event.preventDefault();
			}
		}
		
		function onMouseMove(event){
			
			if(!sc.mouseDown) return;
			
			if(it){
				var clientX = event.touches[0].pageX;
				var clientY = event.touches[0].pageY;
				
				sc.move(
				clientX - sc.scrollStartPosX + sc.lastX,
				clientY - sc.scrollStartPosY + sc.lastY
				);
				
				sc.scrollStartPosX = clientX;
				sc.scrollStartPosY = clientY;
				
			}else{
				sc.move(
				event.clientX - sc.scrollStartPosX + sc.lastX,
				event.clientY - sc.scrollStartPosY + sc.lastY
				);
				
				sc.scrollStartPosX = event.clientX;
				sc.scrollStartPosY = event.clientY;
			}
			
			
			if(window.addEventListener){
				event.preventDefault();
			}
				
		}
		
		function onMouseUp(event){
			
			if(!sc.mouseDown) return;
			sc.mouseDown = false;
			
			if(window.addEventListener){
				event.preventDefault();
			}
			
			if(it){
				document.removeEventListener("touchend", sc.element, false);	
				return;
			}
			
			if(document.detachEvent) 
                document.detachEvent("onmousemove", sc.element);
            else
                document.removeEventListener("mousemove", sc.element, false);       
		}
		
		if(it){
			
			this.element.addEventListener("touchstart", onMouseDown);
			this.element.addEventListener("touchmove", onMouseMove);
			//document.addEventListener("touchend", onMouseUp ,false);
			return;
		}
		
		
		if(window.addEventListener){
			this.element.addEventListener('mousedown' , onMouseDown , false);
			document.addEventListener('mousemove' , onMouseMove , false);
			document.addEventListener('mouseup'   , onMouseUp   , false);
			return;
		}

		this.element.attachEvent('onmousedown' , onMouseDown , false);
		document.attachEvent('onmousemove' , onMouseMove , false);
		document.attachEvent('onmouseup'   , onMouseUp , false);
		  
	},
	
	move : function (x , y){
		this.moved = true //(Math.abs(x) - Math.abs(this.lastX) > 0) || (Math.abs(y) - Math.abs(this.lastY) > 0)
		//console.log('check -> ',Math.abs(y) - Math.abs(this.lastY));
		
        this.element.scrollTop = -y;
        this.element.scrollLeft = -x;
        
        this.lastX = -this.element.scrollLeft;
      	this.lastY = -this.element.scrollTop;
	},
	
	translate : function(x , y){
		this.move(this.lastX + (x || 0), this.lastY + (y || 0));
	}	
};


//src/rotator/tools/ItemList.js
Cute.ItemList = function(element){
	
	this.frame   = document.createElement('div');
	this.frame.className = 'il-frame';
	
	this.content = document.createElement('div');
	this.content.className = 'il-content';
	
	this.type = 'vertical';
	this.items = [];
	
	this.sc = new Averta.ScrollContainer(this.frame , this.content);
	
	var il = this;
	var dir = 0;
	var down = false;
	
	var it = this.sc.isTouch()
	
	this.__scrollnext = function(e){
		down = true;
		dir = 2;
		Cute.Ticker.add(il.__scrolling , il);
		if(it) e.preventDefault();
	};
	
	this.__scrollprev = function(e){
		down = true;
		dir = -2;
		Cute.Ticker.add(il.__scrolling , il);
		if(it) e.preventDefault();
	};
	
	this.__stopscroll = function(e){ 
		if(!down)return;
		down = false;
		Cute.Ticker.remove(il.__scrolling , il);
		il.sc.moved = false;
		if(it) e.preventDefault();
	};
	
	this.__scrolling = function(){
		if(il.type == 'vertical')
			il.sc.translate(0 , dir);
		else
			il.sc.translate(-dir , 0);
	};
	
	this.upleft = document.createElement('div');
	this.upleft.onmousedown = this.__scrollprev;
	
	this.downright = document.createElement('div');
	this.downright.onmousedown = this.__scrollnext;
	
	document.onmouseup = this.__stopscroll;
	
	
	if(it){
		this.upleft.addEventListener   ('touchstart' , this.__scrollprev , false);
		this.downright.addEventListener('touchstart' , this.__scrollnext , false);
		document.addEventListener('touchend' , this.__stopscroll , false);
	}
	
	
	element.appendChild(this.frame);
	element.appendChild(this.downright);
	element.appendChild(this.upleft);
	this.frame.appendChild(this.content);
	
	this.addItem = function(itemEle){
		this.content.appendChild(itemEle);
		this.items.push(itemEle);
	};
};


//src/rotator/Slide.js
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

//src/rotator/SlideManager.js
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
//src/rotator/controls/AbstractControl.js
Cute.rotatorControls = {};

Cute.AbstractControl = function(slider){
	
	this.config = null;
	this.slider = slider;
	this.domElement = null;
	this.disable = false;
	this.name = '';
	this.config = {};
	this.opacity = 100;

	this.showTween = null;
}
		
Cute.AbstractControl.prototype = {
	constructor : Cute.AbstractControl,
	
	setup : function(config_ele){
		
		this.config_ele = config_ele;
		
		this.domElement.className = config_ele.className || this.config.css_class;
		
		if(config_ele.getAttribute('style'))
			this.domElement.setAttribute('style' , config_ele.getAttribute('style')); 
		
		this.slider.addEventListener(Cute.SliderEvent.CHANGE_START , this.__effStart , this);
		this.slider.addEventListener(Cute.SliderEvent.CHANGE_END   , this.__effEnd   , this);
	},
	
	opacityUpdate :function() {
		setOpacity(this.domElement , this.opacity);
	},
	
	visible : function(value){
		this.domElement.style.display = !value ? 'none' : '';
	},
	
	show : function(){
		if(this.showTween)
			this.showTween.stop();
	
		this.showTween = new TWEEN.Tween(this).to( {opacity:100} , 450).onUpdate(this.opacityUpdate).start();
		TWEEN.add(this.showTween);
	},
	
	hide : function(){
		if(this.showTween)
			this.showTween.stop();
	
		this.showTween = new TWEEN.Tween(this).to( {opacity:0} , 450).onUpdate(this.opacityUpdate).start();
		TWEEN.add(this.showTween);
	},
	
	/**
	 * dispatches when the slider transition effect complete
	 */
	__effEnd : function(event) {
			
		this.visible(true);
		
		/*if(this.slider.curretnSlide.pluginData.disableControls != null){
			var disableControls = this.slider.curretnSlide.pluginData.disableControls;
			for(var i , l = disableControls.length ; i<l ; ++i)
				if(disableControls[i] == this.name)
					this.visible(false);
		}*/
		
		
		if(!this.config.autoHide) this.show();		
		if(this.ap)
			this.slider.setAutoPlay(true);
		
	},
	
	/**
	 * dispatches when the slider transtision effect start
	 */
	__effStart : function(event){
		this.hide();
	}	

}

//src/rotator/controls/Navigation.js
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



//src/rotator/controls/CircleTimer.js
Cute.CircleTimer = function(slider){
	Cute.AbstractControl.call(this , slider);
	this.domElement = document.createElement('div');
	
	this.lbrowser = (Cute.FallBack.ua.browser.name.toLowerCase() == 'ie'  && parseInt(Cute.FallBack.ua.browser.major) < 9);
	
	if(this.lbrowser) return;
	

	this.config = {
		color : '#A2A2A2',
		stroke : 10,
		radius: 4,
		css_class : 'br-circle-timer'
	};
	
	this.overpause = false;
	
	this.canvas     = document.createElement('canvas');
	this.dot        = document.createElement('div');	
	this.ctx		= this.canvas.getContext('2d');
	this.prog		= 0;
	this.drawTween  = null;
};

Cute.rotatorControls.circletimer = Cute.CircleTimer;
Cute.CircleTimer.prototype = new Cute.AbstractControl();
Cute.CircleTimer.prototype.constructor = Cute.CircleTimer;

Cute.CircleTimer.prototype.setup = function(config_ele){
	if(this.lbrowser) return;
	
	Cute.AbstractControl.prototype.setup.call(this , config_ele);
	
	this.config.color  = config_ele.getAttribute('data-color') || this.config.color;
	if(config_ele.getAttribute('data-stroke')) this.config.stroke = parseInt(config_ele.getAttribute('data-stroke'));
	if(config_ele.getAttribute('data-radius')) this.config.radius = parseInt(config_ele.getAttribute('data-radius'));
	
	this.__w = (this.config.radius + this.config.stroke) * 2;

	
	this.canvas.width  = this.__w;
	this.canvas.height = this.__w;
	this.canvas.className = 'br-timer-stroke';
	this.canvas.style.position = 'absolute';
	
	
	this.dot.className      = 'br-timer-dot';
	this.dot.style.position = 'relative';
	this.dot.style.left     = (this.__w - 10)  * .5 + 'px';
	this.dot.style.top      = (this.__w - 12) * .5 + 'px';
	
	this.domElement.slider = this.slider;
	this.domElement.onclick = function(){
		if(!Cute.AbstractControl.paused) {
			Cute.AbstractControl.paused = true;
			this.slider.setAutoPlay(false);
		}else {
		 	Cute.AbstractControl.paused = false;
			this.slider.setAutoPlay(true);
		 }
	};
	
	this.slider.addEventListener(Cute.SliderEvent.WATING , this.update , this);
	
	this.domElement.appendChild(this.canvas);
	this.domElement.appendChild(this.dot);
};

Cute.CircleTimer.prototype.update = function(e){
	if(this.drawTween)
		this.drawTween.stop();
		
	this.drawTween = new TWEEN.Tween(this).to( {prog:this.slider.delayProgress() * 0.01} , 300).easing(TWEEN.Easing.Circular.EaseOut).onUpdate(this.draw).start();
};

Cute.CircleTimer.prototype.draw = function(){
	this.ctx.clearRect(0 , 0,  this.__w ,  this.__w);
	this.ctx.beginPath(); 
	this.ctx.arc(this.__w * .5 , this.__w * .5 ,this.config.radius , Math.PI * 1.5 , Math.PI * 1.5 + 2 * Math.PI * this.prog, false);
	this.ctx.strokeStyle = this.config.color;
	this.ctx.lineWidth = this.config.stroke;
	this.ctx.stroke();
};

Cute.CircleTimer.prototype.show = function() {Cute.AbstractControl.prototype.show.call(this); this.domElement.style.cursor = 'pointer';};
Cute.CircleTimer.prototype.hide = function() {Cute.AbstractControl.prototype.hide.call(this); this.domElement.style.cursor = '';};

//src/rotator/controls/Thumb.js
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

//src/rotator/controls/SlideControl.js
Cute.SlideControl = function(slider) {
	Cute.AbstractControl.call(this,slider);
	
	this.config = {
		css_class : 'br-slidecontrol',
		thumb	  : true,
		thumb_align : 'bottom'
	};
	
	this.domElement = document.createElement('div');
	this.points_ul	= document.createElement('ul');
			
	this.points     = [];

};

Cute.rotatorControls.slidecontrol = Cute.SlideControl;
Cute.SlideControl.prototype = new Cute.AbstractControl();
Cute.SlideControl.prototype.constructor = Cute.SlideControl;

Cute.SlideControl.prototype.setup = function(config_ele) {
	Cute.AbstractControl.prototype.setup.call(this , config_ele);
	
	this.domElement.appendChild(this.points_ul);
	this.slider.addEventListener(Cute.SliderEvent.CHANGE_NEXT_SLIDE , this.update , this);
	
	this.config.thumb       = config_ele.getAttribute('data-thumb') != 'false';
	this.config.thumb_align = config_ele.getAttribute('data-thumbalign') || 'bottom';
	
	var point;
	 
	for(var i=0 , l = this.slider.getSlideList().length; i<l ; ++i){
		point = new Cute.SlideControl.Point(this.slider , this.slider.getSlideList()[i] , this);
		if(i == this.slider.getCurrentSlideIndex()){
			this.selectedPoint = point;
		 	point.select();
		}
		 
		 point.index = i;
		 
		 this.points_ul.appendChild(point.domElement);	
		 this.points.push(point);
	}
	
	
};

Cute.SlideControl.prototype.update = function(){
	if(this.selectedPoint && this.slider.getCurrentSlideIndex() == this.selectedPoint.index) return;
	
	if(this.selectedPoint)
		this.selectedPoint.unselect();
		
	this.selectedPoint = this.points[this.slider.getCurrentSlideIndex()];
	this.selectedPoint.select();
	
};

Cute.SlideControl.prototype.show = function(){
	Cute.AbstractControl.prototype.show.call(this);
	this.disable = false;
	this.domElement.style.cursor = 'pointer';
};

Cute.SlideControl.prototype.hide = function(){
	Cute.AbstractControl.prototype.hide.call(this);
	this.disable = true;
	this.domElement.style.cursor = 'default';
};


Cute.SlideControl.Point = function(slider ,slide , slideControl){
	this.domElement = document.createElement('li');
	this.slider = slider;	
	this.index = 0;
	this.domElement.point = this;
	this.sc= slideControl;
	
	this.domElement.onclick = function () {
		if(this.point.sc.disable) return;
		this.point.changeSlide();
	};
	
	if(Cute.FallBack.ua.browser.name == 'IE')
		this.domElement.style.filter = 'inherit';
	

	this.selectedElement = document.createElement('span');
	this.selectedElement.className = 'br-control-selected';
	this.selectOpacity = 0;
	this.uo();
	
	
	if(slideControl.config.thumb){
		this.thumb = new Cute.Thumb(slide.thumb , slideControl.config.thumb_align );
		this.domElement.onmouseover = function(){this.point.showThumb();};
		this.domElement.onmouseout  = function(){this.point.hideThumb();};
		this.thumb_pos 		= 0;
		this.drawThumb ();
		this.thumb.domElement.style.display = 'none';	
		this.domElement.appendChild(this.thumb.domElement);
		this.thumb.align = slideControl.config.thumb_align;
	}
			
	this.domElement.appendChild(this.selectedElement);
	
	this.selectTween = null;
	
};



Cute.SlideControl.Point.prototype = {
	constructor : Cute.SlideControl.Point,
	
	align:'bottom',
	
	changeSlide : function(){
		this.slider.gotoSlide(this.index ,true);
	},
	
	uo : function(){
		setOpacity(this.selectedElement , this.selectOpacity);
	},
	
	select : function(){
		if(this.selectTween)
			this.selectTween.stop();
	
		this.selectTween = new TWEEN.Tween(this).to( {selectOpacity:100} , 450).onUpdate(this.uo).start();
		TWEEN.add(this.selectTween);
	},
	
	unselect : function(){
		if(this.selectTween)
			this.selectTween.stop();
	
		this.selectTween = new TWEEN.Tween(this).to( {selectOpacity:0} , 450).onUpdate(this.uo).start();
		TWEEN.add(this.selectTween);
	},
	
	drawThumb : function(){
		setOpacity(this.thumb.domElement , this.thumb_pos);

		if(this.sc.config.thumb_align == 'up')
			this.thumb.domElement.style.top = 10 -this.thumb.frame.offsetHeight + - this.thumb_pos * 0.1 + 'px';
		else
			this.thumb.domElement.style.top = 24 + - this.thumb_pos * 0.1 + 'px';
	},
	
	showThumb :function (){
		this.domElement.style.zIndex = this.slider.getSlideList().length;
		if(this.thumbTween)
			this.thumbTween.stop();
		
		this.thumb.show();
		this.thumb.domElement.style.display = '';
		
		this.thumbTween = new TWEEN.Tween(this).to( {thumb_pos:100} , 700).onUpdate(this.drawThumb).easing(TWEEN.Easing.Quartic.EaseOut).start();
	},
	
	hideThumb : function () {
		this.domElement.style.zIndex = 0;
		if(this.thumbTween)
			this.thumbTween.stop();
			
		this.thumb.reset();
		this.thumbTween = new TWEEN.Tween(this).to( {thumb_pos:0} , 250).onUpdate(this.drawThumb).start().onComplete(function(){
			this.thumb.domElement.style.display = 'none';
		});
	}
};


//src/rotator/controls/SlideInfo.js
Cute.SlideInfo = function (slider){
	Cute.AbstractControl.call(this , slider);	
	
	this.config = {
		css_class : 'br-slideinfo',
		align     : 'bottom'
	}
	
	this.domElement = document.createElement('div');
	this.content    = document.createElement('div');
	
	this.poition = 0;
	
};

Cute.rotatorControls.slideinfo = Cute.SlideInfo;
Cute.SlideInfo.prototype = new Cute.AbstractControl();
Cute.SlideInfo.prototype.constructor = Cute.SlideInfo;

Cute.SlideInfo.prototype.setup = function(config_ele){
	Cute.AbstractControl.prototype.setup.call(this , config_ele);
	
	this.domElement.style.overflow = 'hidden';
	this.domElement.style.position = 'absolute';
	this.domElement.style.display = 'none';
		
	this.content.className	    = 'br-infocontent';
	this.content.style.position = 'relative';
	
	this.eff = config_ele.getAttribute('data-effect') || 'slide';
	
	this.domElement.appendChild(this.content);
};

Cute.SlideInfo.prototype.update = function(){
	if(this.data){
		if(this.eff == 'fade')
			setOpacity(this.content , this.position);
		else
			this.content.style[this.data.align] = this.position + 'px';
	}
		
	
	//if(this.data.align == 'bottom' && this.slider.bartimer){
	//	this.slider.bartimer.domElement.style.bottom = this.content.offsetHeight + this.position + 'px';
	//}
};

Cute.SlideInfo.prototype.show = function(){	
	this.domElement.style.display = '';
	
	if(this.showTween)
		this.showTween.stop();
	
	this.data = this.slider.getCurrentSlide().pluginData.info;
	
	if(!this.data){
		this.disable = true;
		this.content.className = '';
		this.content.innerHTML = '';
		return;
	}else
		this.disable = false;
	
	this.content.innerHTML = this.data.text;

	this.content.className	    = 'br-infocontent ' + this.data.align + ' ' + this.data._class || '';
	
	this.domElement.style.width  = ((this.data.align == 'left'   || this.data.align == 'right') ? 'auto' : '100%' ) ;
	this.domElement.style.height = ((this.data.align == 'bottom' || this.data.align == 'top')   ? 'auto' : '100%' ) ;

	this.domElement.style.left   = '';
	this.domElement.style.right  = '';
	this.domElement.style.bottom = '';
	this.domElement.style.top    = '';
	
	this.content.style.left   = '';
	this.content.style.right  = '';
	this.content.style.bottom = '';
	this.content.style.top    = '';
	
	if(this.eff == 'slide')
		this.position = -(this.data.align == 'bottom' || this.data.align == 'top'   ? this.content.offsetHeight : this.content.offsetWidth);
	else
		this.position = 0;
		
	this.domElement.style[this.data.align] = '0px';
	
	this.update();
			
	this.showTween = new TWEEN.Tween(this).to( {position:(this.eff == 'slide')?0:100} , 950).easing(TWEEN.Easing.Quartic.EaseInOut).onUpdate(this.update).start();
	TWEEN.add(this.showTween);

};

Cute.SlideInfo.prototype.hide = function(){
	if(this.disable) return;
	
	if(this.showTween)
		this.showTween.stop();
		
	this.showTween = new TWEEN.Tween(this)
					.to( {position:
						(this.eff != 'slide') ? 0 : -(this.data.align == 'bottom' || this.data.align == 'top'   ? this.content.offsetHeight : this.content.offsetWidth)} , 850)
					.easing(TWEEN.Easing.Quartic.EaseInOut)
					.onUpdate(this.update)
					.start();
					
	TWEEN.add(this.showTween);
};
//src/rotator/controls/BarTimer.js
Cute.BarTimer = function(slider){
	Cute.AbstractControl.call(this , slider);
	
	this.config = {
		css_class : 'br-bar-timer'
	};
	
	this.domElement = document.createElement('div');
	this.prog = 0;
	
};


Cute.rotatorControls.bartimer = Cute.BarTimer; 
Cute.BarTimer.prototype = new Cute.AbstractControl();
Cute.BarTimer.prototype.constructor = Cute.BarTimer;

Cute.BarTimer.prototype.update = function(e){
	if(this.drawTween)
		this.drawTween.stop();
		
	this.drawTween = new TWEEN.Tween(this).to( {prog:this.slider.delayProgress() * 0.01} , 500).easing(TWEEN.Easing.Quartic.EaseOut).onUpdate(this.draw).start();
};


Cute.BarTimer.prototype.draw = function(){
	var pos = this.prog * this.slider.width;
	this.glow.style.left = pos -  this.glow.offsetWidth + 'px';
	this.bar.style.width = Math.max(0 , pos -  5 ) + 'px';	
};

Cute.BarTimer.prototype.setup = function(config_ele){
	Cute.AbstractControl.prototype.setup.call(this,config_ele);
	
	this.slider.bartimer = this;
	
	this.domElement.style.width = '100%';
	this.domElement.style.overflow = 'hidden';
	
	this.glow = document.createElement('div');
	this.glow.className = 'br-timer-glow';
	this.glow.style.position = 'relative';
	
	this.bar = document.createElement('div');
	this.bar.className = 'br-timer-bar';
	
	
	this.domElement.appendChild(this.glow);
	this.domElement.appendChild(this.bar);
	
	
	this.slider.addEventListener(Cute.SliderEvent.WATING , this.update , this);
	this.draw();
};

//src/rotator/controls/Captions.js
Cute.Captions = function(slider){
	Cute.AbstractControl.call(this , slider);
	
	this.config = {
		css_class : 'br-captions'
	}
	
	this.domElement = document.createElement('div');
	this.captions = [];
	this.overpause = false;
};


Cute.rotatorControls.captions = Cute.Captions;
Cute.Captions.prototype = new Cute.AbstractControl();
Cute.Captions.prototype.constructor = Cute.Captions;

Cute.Captions.prototype.setup = function(config_ele){
	Cute.AbstractControl.prototype.setup.call(this,config_ele);
	this.domElement.style.width  = '100%';
	this.domElement.style.height = '100%';
	this.domElement.style.position = 'absolute';
};	

Cute.Captions.prototype.show = function(){
	
	this.data = this.slider.getCurrentSlide().pluginData.captions;
	this.slide_index = this.slider.getCurrentSlideIndex();
	
	if(!this.captions[this.slide_index] && this.data){
		
		this.captions[this.slide_index] = [];
		
		var cps_li = this.data.getElementsByTagName('li');
		var caption;
		
		for(var i = 0 , l = cps_li.length; i < l ; ++i){
			caption = new Cute.Caption();
			caption.add(cps_li[i].innerHTML , cps_li[i].className);
			caption.delay = Number(cps_li[i].getAttribute('data-delay')) || 0;
			caption.effect = cps_li[i].getAttribute('data-effect') || 'fade';
			this.captions[this.slide_index].push(caption);
		}
	}

	if(this.data){
		for(var i = 0 , l = this.captions[this.slide_index].length ; i < l ; ++i){
			this.domElement.appendChild(this.captions[this.slide_index][i].domElement);
			this.captions[this.slide_index][i].show();
		}
	}
}

Cute.Captions.prototype.hide = function(){
	if(this.captions[this.slide_index]){
		for(var i = 0 , l = this.captions[this.slide_index].length ; i < l ; ++i){
			this.captions[this.slide_index][i].hide();
		}
	}
}


Cute.Caption = function() {
	this.domElement = document.createElement('div');
	this.content = document.createElement('div');
	
	
	//this.domElement.style.filter = 'inherit';
	//this.content.style.filter  = 'inherit';
	
};

Cute.Caption.prototype = {
	constructro : Cute.Caption,
	
	effect : 'fade',
	
	add : function (cont , css_class){
		this.content.innerHTML = cont;
		
		this.content.className = 'br-caption-content';
		this.content.style.position = 'relative';
		
		this.domElement.className = css_class;
		this.domElement.style.overflow = 'hidden';
		
		this.domElement.appendChild(this.content);
		
	},
	
	fade : function(){
		setOpacity(this.domElement, this.show_pos);
	},
	
	slide : function(){
		this.content.style.left = -this.domElement.offsetWidth * ( 1 - this.show_pos * 0.01 ) + 'px';
	},
		
	show : function(){
		if(this.showTween)
			this.showTween.stop();
		
		this.show_pos = 0;
		this[this.effect]();
		
		this.showTween = new TWEEN.Tween(this).to({show_pos:100} , 1000).delay(this.delay)
											  .easing(TWEEN.Easing.Quartic.EaseInOut)
											  .onUpdate(this[this.effect])
											  .delay(this.delay)
											  .start();
		TWEEN.add(this.showTween);
	},
	
	hide : function() {
		if(this.showTween)
			this.showTween.stop();
		 
		this.showTween = new TWEEN.Tween(this).to({show_pos:0} , 1000)//.delay(this.delay)
											  .easing(TWEEN.Easing.Quartic.EaseInOut)
											  .onUpdate(this[this.effect])
											  .onComplete(this.remove)
											  .start();
	},
	
	remove : function (){
		if(this.domElement.parentElement)
			this.domElement.parentElement.removeChild(this.domElement);
	}
}



//src/rotator/controls/VideoControl.js
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
//src/rotator/controls/LinkControl.js
Cute.LinkControl = function(slider){
	Cute.AbstractControl.call(this , slider);
	this.config = {css_class:'br-link'}
	this.domElement = document.createElement('div');
	this.domElement.style.position = 'absolute'
};

Cute.rotatorControls.link = Cute.LinkControl;
Cute.LinkControl.prototype = new Cute.AbstractControl();
Cute.LinkControl.prototype.constructor = Cute.LinkControl;

Cute.LinkControl.prototype.setup = function(config_ele){
	Cute.AbstractControl.prototype.setup.call(this , config_ele);
	this.domElement.lc = this;
	this.domElement.style.width = '100%';
	this.domElement.style.height = '100%';
	this.domElement.style.cursor = 'pointer';
};

Cute.LinkControl.prototype.gotoURL = function(){
	window.open(this.lc.link.href , this.lc.link.target || '_self');
};

Cute.LinkControl.prototype.show = function(){
	
	this.link = this.slider.getCurrentSlide().pluginData.link;
	
	if(this.link){
		this.domElement.style.display = '';
		this.domElement.onclick = this.gotoURL;
	}else{
		this.domElement.style.display = 'none';
		this.domElement.onclick = null;
	}
};

Cute.LinkControl.prototype.hide = function(){
	this.domElement.style.display = 'none';
	this.domElement.onclick = null;
};
//src/rotator/controls/Loading.js
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

//src/rotator/controls/ThumbList.js
Cute.ThumbList = function(slider , type) {
	Cute.AbstractControl.call(this,slider);
		
	this.config = {
		css_class : 'br-thumblist',
		type	  : 'vertical'
	};
	
	this.domElement = document.createElement('div');		
	this.thumbs  = [];
};

Cute.rotatorControls.thumblist = Cute.ThumbList;
Cute.ThumbList.prototype = new Cute.AbstractControl();
Cute.ThumbList.prototype.constructor = Cute.ThumbList;

Cute.ThumbList.prototype.setup = function(config_ele) {
	Cute.AbstractControl.prototype.setup.call(this , config_ele);
	
	this.config.type    = config_ele.getAttribute('data-dir')  || 'vertical';
	this.config.autohide    = config_ele.getAttribute('data-autohide')  == 'true';
	
	this.domElement.className += ' ' + this.config.type;
	
	this.list = new Cute.ItemList(this.domElement);
	this.list.type = this.config.type;	

	this.list.frame.className = 'br-thumblist-frame';
	this.list.content.className = 'br-thumblist-content';
	this.list.downright.className = 'br-thumblist-next';
	this.list.upleft.className = 'br-thumblist-previous';
	
	this.slider.addEventListener(Cute.SliderEvent.CHANGE_NEXT_SLIDE , this.update , this);

	var thumb;
	 
	for(var i=0 , l = this.slider.getSlideList().length; i<l ; ++i){
		thumb = new Cute.ListThumb(this.slider.getSlideList()[i].thumb , this.slider , this);
		
		thumb.index = i;
		this.thumbs.push(thumb);
		
		this.list.addItem(thumb.element);
	}	
	
	this.list.sc.setup();
};

Cute.ThumbList.prototype.update = function(){
	if(this.selectedThumb && this.slider.getCurrentSlideIndex() == this.selectedThumb.index) return;
	
	if(this.selectedThumb)
		this.selectedThumb.unselect();
		
	this.selectedThumb = this.thumbs[this.slider.getCurrentSlideIndex()];
	this.selectedThumb.select();
};

Cute.ThumbList.prototype.show = function(){
	if(this.config.autohide)
		Cute.AbstractControl.prototype.show.call(this);
		
	this.disable = false;
};

Cute.ThumbList.prototype.hide = function(){
	if(this.config.autohide)
		Cute.AbstractControl.prototype.hide.call(this);
	this.disable = true;
};


/*--------------------- Thumb -------------------- */

Cute.ListThumb = function(src , slider , thumblist){
 	this.img = new Image();
	this.img.src = src;
	
	this.element = document.createElement('div');
	this.element.className = 'br-list-thumb';
	
	this.select_ele = document.createElement('div');
	this.select_ele.className = 'br-list-thumb-select';
	
	this.element.appendChild(this.img);
	this.element.appendChild(this.select_ele);
	
	setOpacity(this.select_ele , 0);
	this.opacity = 0;

	var thumb = this;
	
	if(thumblist.list.sc.isTouch()){
		this.element.addEventListener('touchend' , function(event){
			if(thumb.selected || thumblist.disable || thumblist.list.sc.moved) return;
			slider.gotoSlide(thumb.index , true);
			event.preventDefault();
			event.stopPropagation();
		} , false);
	}else{
		this.element.onclick = function(){
			if(thumb.selected || thumblist.disable || thumblist.list.sc.moved) return;
			slider.gotoSlide(thumb.index , true);
		};
	}
}

Cute.ListThumb.prototype = {
	constructor : Cute.ListThumb,
	
	opacityUpdate : function(){
		setOpacity(this.select_ele , this.opacity);
	},
	
	select : function(){
		if(this.selected) return;
		this.selected = true;
		if(this.showTween) this.showTween = null;
		this.showTween = new TWEEN.Tween(this).to( {opacity:100} , 450).onUpdate(this.opacityUpdate).start();
	},
	
	unselect : function(){
		if(!this.selected) return;
		this.selected = false;
		if(this.showTween) this.showTween = null;
		this.showTween = new TWEEN.Tween(this).to( {opacity:0} , 450).onUpdate(this.opacityUpdate).start();
	}
}


//src/rotator/controls/InfoList.js
Cute.InfoList = function(slider , type) {
	Cute.AbstractControl.call(this,slider);
		
	this.config = {
		css_class : 'br-infolist',
		type	  : 'vertical'
	};
	
	this.domElement = document.createElement('div');		
	this.items  = [];
};

Cute.rotatorControls.infolist = Cute.InfoList;
Cute.InfoList.prototype = new Cute.AbstractControl();
Cute.InfoList.prototype.constructor = Cute.InfoList;

Cute.InfoList.prototype.setup = function(config_ele) {
	Cute.AbstractControl.prototype.setup.call(this , config_ele);
	
	this.config.type    = config_ele.getAttribute('data-dir')  || 'vertical';
	this.config.autohide= config_ele.getAttribute('data-autohide')  == 'true';
	
	this.domElement.className += ' ' + this.config.type;
	
	this.list = new Cute.ItemList(this.domElement);
	this.list.type = this.config.type;	

	this.list.frame.className     = 'br-infolist-frame';
	this.list.content.className   = 'br-infolist-content';
	this.list.downright.className = 'br-infolist-next';
	this.list.upleft.className    = 'br-infolist-previous';
	
	this.slider.addEventListener(Cute.SliderEvent.CHANGE_NEXT_SLIDE , this.update , this);

	var item;
	 
	for(var i=0 , l = this.slider.getSlideList().length; i<l ; ++i){
		item = new Cute.ListItem(this.slider.getSlideList()[i].pluginData.info , this.slider , this);
		
		item.index = i;
		this.items.push(item);
		
		this.list.addItem(item.element);
	}	
	
	this.list.sc.setup();
};

Cute.InfoList.prototype.update = function(){
	if(this.selectedThumb && this.slider.getCurrentSlideIndex() == this.selectedThumb.index) return;
	
	if(this.selectedThumb)
		this.selectedThumb.unselect();
		
	this.selectedThumb = this.items[this.slider.getCurrentSlideIndex()];
	this.selectedThumb.select();
};

Cute.InfoList.prototype.show = function(){
	if(this.config.autohide)
		Cute.AbstractControl.prototype.show.call(this);
		
	this.disable = false;
};

Cute.InfoList.prototype.hide = function(){
	if(this.config.autohide)
		Cute.AbstractControl.prototype.hide.call(this);
	this.disable = true;
};


/*--------------------- List Item -------------------- */

Cute.ListItem = function(info , slider , infolist){	
	this.element = document.createElement('div');
	this.element.className = 'br-slist-item';
	
	this.select_ele = document.createElement('div');
	this.select_ele.className = 'br-slist-item-select';
	
	this.content = document.createElement('div');
	this.content.innerHTML = info ? info.text : '';
	this.content.className = 'br-slist-item-content';
	
	this.element.appendChild(this.select_ele);
	this.element.appendChild(this.content);
	
	setOpacity(this.select_ele , 0);
	this.opacity = 0;

	var item = this;
	
	if(infolist.list.sc.isTouch()){
		this.element.addEventListener('touchend' , function(event){
			if(item.selected || infolist.disable || infolist.list.sc.moved) return;
			slider.gotoSlide(item.index , true);
			event.preventDefault();
			event.stopPropagation();
		} , false);
	}else{
		this.element.onclick = function(){
			if(item.selected || infolist.disable || infolist.list.sc.moved) return;
			slider.gotoSlide(item.index , true);
		};
	}
}

Cute.ListItem.prototype = {
	constructor : Cute.ListThumb,
	
	opacityUpdate : function(){
		setOpacity(this.select_ele , this.opacity);
	},
	
	select : function(){
		if(this.selected) return;
		this.selected = true;
		if(this.showTween) this.showTween = null;
		this.showTween = new TWEEN.Tween(this).to( {opacity:100} , 450).onUpdate(this.opacityUpdate).start();
	},
	
	unselect : function(){
		if(!this.selected) return;
		this.selected = false;
		if(this.showTween) this.showTween = null;
		this.showTween = new TWEEN.Tween(this).to( {opacity:0} , 450).onUpdate(this.opacityUpdate).start();
	}
}


//src/rotator/controls/TouchNavigation.js
Cute.TouchNavigation = function(element , slider){
	
	this.isTouch = function(){
		try{document.createEvent("TouchEvent");	return true;}
		catch(e){return false;}
	}
	
	var it = this.isTouch();
	var down = false;
	var start_x = 0;
	var last_x  = 0;
	var timeout;

	//var trace = document.createElement('div');
	//element.appendChild(trace)


	this.__touchStart = function(e){
		down = true;		
		last_x = start_x = e.touches[0].pageX;
		
		timeout = setTimeout(function(){down=false} , 3000);
		
		//e.preventDefault();
	};
	
	this.__touchMove = function(e){ 
		if(!down)return;
		
		if(Math.abs(last_x - e.touches[0].pageX) >= 10)	e.preventDefault();
		last_x = e.touches[0].pageX;
	};
	
	
	this.__touchEnd = function(e){ 
		if(!down)return;
		down = false;
		
		clearTimeout(timeout);
		
		//trace.innerHTML = last_x + ' ----  '+ start_x + " === " + element.offsetWidth;
		
		if(last_x - start_x > element.offsetWidth / 10)
			slider.next();
		else if(last_x - start_x < -element.offsetWidth / 10)
			slider.previous();
			
		start_x = last_x  = 0;
			
		//e.preventDefault();
	};
		
	if(it){
		element.addEventListener  ('touchstart' , this.__touchStart);
		element.addEventListener  ('touchmove' , this.__touchMove);
		element.addEventListener('touchend' , this.__touchEnd);
	}
	
};


//src/rotator/Slider.js
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

