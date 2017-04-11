/*
* Sprite3D.js - v2.0.1
* https://github.com/boblemarin/Sprite3D.js
*
* Copyright (c) 2010 boblemarin emeric@minimal.be http://www.minimal.be
* 
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
* 
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/

var Sprite3D = Sprite3D || {
	
	/********* [PUBLIC STATIC] isSupported() ***********/
	isSupported: function(){
		// init if needed
		if ( !this._isInit ) this._init();
		// return support value
		return this._isSupported;
	},
	
	/********* [PUBLIC STATIC] stage() ***********/
	stage: function(element) {
		// init if needed
		if ( !this._isInit ) this._init();
		// tweak or create root element
		var c,s;
		if (element){
			c = element;
			s = element.style;
			if(s.position === "static" ) s.position = "relative";
		} else {
			c = document.createElement("div");
			s = c.style;
			//s[this._browserPrefix+"PerspectiveOrigin"] = "0 0";
			//s[this._browserPrefix+"TransformOrigin"] = "0 0";
			s.position = "absolute";
			//s.top = "50%";
			//s.left = "50%";
			s.margin = "0px";
			s.padding = "0px";
			//document.body.appendChild(c);
		}
		s[this._browserPrefix+"Perspective"] = "800px";
		s[this._browserPrefix+"Transform"] = "translateZ(0px)";
		s[this._browserPrefix+"TransformStyle"] = "preserve-3d";
		return this.create(c);
	},
	
	/********* [PUBLIC STATIC] create() ***********/
	create: function(element){
		// init Sprite3D if needed
		if ( !this._isInit ) this._init();
		
		// create or tweak html element
		if ( arguments.length === 0 ) {
			element = document.createElement("div");
			element.style.margin = "0px";
			element.style.padding = "0px";
			element.style.position = "absolute";
		} else if ( typeof(element) === "string" ) {
			var str = element;
			element = document.createElement("div");
			element.style.margin = "0px";
			element.style.padding = "0px";
			element.style.position = "absolute";
			this._handleStringArgument(element,str);
		} else if ( element.style.position == "static" ) {
			element.style.position = "relative";
		}
		element.style[ this._browserPrefix + "TransformStyle" ] = "preserve-3d";
		element.style[ this._transformProperty ] = "translateZ(0px)";
		element.style[ this._browserPrefix +'BackfaceVisibility'] = 'hidden';
		// extend element with 3D methods
		for(prop in this._props) {
			if (this._props.hasOwnProperty(prop)){
				element[prop] = this._props[prop];
			}
		}
		
		// add private properties
		element._string = [
			"translate3d(", 0, "px,", 0, "px,", 0, "px) ", 
			"rotateX(", 0, "deg) ", 
			"rotateY(", 0, "deg) ", 
			"rotateZ(", 0, "deg) ", 
			"scale3d(", 1, ", ", 1, ", ", 1, ") "
		];
		element._positions = [
			 1,  3,  5, // x, y, z
			 8, 11, 14, // rotationX, rotationY, rotationZ
			17, 19, 21 // scaleX, scaleY, scaleZ
		];
		element._ox = 0;
		element._oy = 0;
		element._oz = 0;
		
		// return
		return element;
	},
	
	/********* [PUBLIC STATIC] box() ***********/
	box: function(width,height,depth,idOrClassName) {
		// init if needed
		if ( !this._isInit ) this._init();
		
		// create container element
		var box = this.create();
		
		if ( arguments.length === 1 ) {
			height = width;
			depth = width;
		} else if ( arguments.length === 2 && typeof(arguments[1]) === "string" ) {	
			this._handleStringArgument(box,arguments[1]);
			height = width;
			depth = width;
		} else if ( idOrClassName && typeof(idOrClassName) === "string" ) {
			this._handleStringArgument(box,idOrClassName);
		}
		
		// add faces
		var hwidth = width*.5,
			hheight = height*.5,
			hdepth = depth*.5;
			
		box.appendChild( Sprite3D.create(".front").position( -hwidth, -hheight, hdepth).size(width,height).update() );
		box.appendChild( Sprite3D.create(".back").position( -hwidth, -hheight, -hdepth).size(width,height).rotationY(180).update() );
		box.appendChild( Sprite3D.create(".left").position( -hwidth-hdepth, -hheight, 0).size(depth,height).rotationY(-90).update() );
		box.appendChild( Sprite3D.create(".right").position( hwidth-hdepth, -hheight, 0).size(depth,height).rotationY(90).update() );
		box.appendChild( Sprite3D.create(".bottom").position( -hwidth, hheight-hdepth, 0).size(width,depth).rotationX(-90).update() );
		box.appendChild( Sprite3D.create(".top").position( -hwidth, -hheight-hdepth, 0).size(width,depth).rotationX(90).update() );
		
		return box;
	},
	
	/********* [PUBLIC STATIC] prefix() ***********/
	prefix: function(cssPropertyName) {
		return Sprite3D._browserPrefix + cssPropertyName;
	},

	/********* [PRIVATE STATIC] library's global properties ***********/
	_isInit: false,
	_isSupported: false,
	_browserPrefix: "webkit",
	_transformProperty: "webkitTransform",

	/********* [PRIVATE STATIC] _init() ***********/	
	_init: function(){
		var d = document.createElement("div"), 
			prefixes = ["", "webkit", "Moz", "O", "ms" ],
			n = prefixes.length, i;
			
		Sprite3D._isInit = true;
		// check for 3D transforms
		for( i = 0; i < n; i++ ) {
			if ( ( prefixes[i] + "Perspective" ) in d.style ) {
				Sprite3D._transformProperty = prefixes[i] + "Transform";
				Sprite3D._isSupported = true;
				Sprite3D._browserPrefix = prefixes[i];
				if ( i==2 ) Sprite3D._props.update = Sprite3D._props.updateJoin;
				//console.log( "Sprite3D found support for 3D transforms using prefix: " + prefixes[i] );
				return true;
			}
		}

		// no transform support
		//alert("Sorry, but your browser does not support CSS 3D transfroms.");
		return false;
	},
	
	/********* [PRIVATE STATIC] _handleStringArgument() ***********/
	_handleStringArgument: function( element, str ){
		switch( str[0] ) {
			case ".":
				element.className = str.substr(1);
				break;
			case "#":
				element.id = str.substr(1);
				break;
			default:
				element.id = str;
				break;
		}
	},
	
	/********* Sprite3D objects properties ***********/
	_props: {
		
		  /////////////////////////////////////////////
		 //////////// Position / absolute ////////////
		/////////////////////////////////////////////
		x : function(px) {
			if ( arguments.length ) {
				this._string[this._positions[0]] = px - this._ox;
				return this;
			} else {
				return this._string[this._positions[0]] + this._ox;
			}
		},
		y : function(py) {
			if ( arguments.length ) {
				this._string[this._positions[1]] = py - this._oy;
				return this;
			} else {
				return this._string[this._positions[1]] + this._oy;
			}
		},
		z : function(pz) {
			if ( arguments.length ) {
				this._string[this._positions[2]] = pz - this._oz;
				return this;
			} else {
				return this._string[this._positions[2]] + this._oz;
			}
		},
		position : function( px, py, pz) {
			this._string[this._positions[0]] = px - this._ox;
			this._string[this._positions[1]] = py - this._oy;
			if ( arguments.length >= 3 ) this._string[this._positions[2]] = pz - this._oz;
			return this;
		},
		
		  /////////////////////////////////////////////
		 //////////// Position / relative ////////////
		/////////////////////////////////////////////
		move : function(px,py,pz) {
			this._string[this._positions[0]] += px;
			this._string[this._positions[1]] += py;
			if ( arguments.length >= 3 ) this._string[this._positions[2]] += pz;
			return this;
		},
		
		  /////////////////////////////////////////////
		 //////////// Rotation / absolute ////////////
		/////////////////////////////////////////////
		rotationX : function(rx) {
			if ( arguments.length ) {
				this._string[this._positions[3]] = rx;
				return this;
			} else {
				return this._string[this._positions[3]];
			}
		},
		rotationY : function(ry) {
			if ( arguments.length ) {
				this._string[this._positions[4]] = ry;
				return this;
			} else {
				return this._string[this._positions[4]];
			}
		},
		rotationZ : function(rz) {
			if ( arguments.length ) {
				this._string[this._positions[5]] = rz;
				return this;
			} else {
				return this._string[this._positions[5]];
			}
		},
		rotation : function(rx,ry,rz) {
			this._string[this._positions[3]] = rx;
			this._string[this._positions[4]] = ry;
			this._string[this._positions[5]] = rz;
			return this;
		},
		
		  /////////////////////////////////////////////
		 //////////// Rotation / relative ////////////
		/////////////////////////////////////////////
		rotate : function(rx,ry,rz) {
			this._string[this._positions[3]] += rx;
			this._string[this._positions[4]] += ry;
			this._string[this._positions[5]] += rz;
			return this;
		},
		
		  /////////////////////////////////////////////
		 /////////////////   Scale  //////////////////
		/////////////////////////////////////////////
		scaleX : function(sx) {
			if ( arguments.length ) {
				this._string[this._positions[6]] = sx;
				return this;
			} else {
				return this._string[this._positions[6]];
			}
		},
		scaleY : function(sy) {
			if ( arguments.length ) {
				this._string[this._positions[7]] = sy;
				return this;
			} else {
				return this._string[this._positions[7]];
			}
		},
		scaleZ : function(sz) {
			if ( arguments.length ) {
				this._string[this._positions[8]] = sz;
				return this;
			} else {
				return this._string[this._positions[8]];
			}
		},
		scale : function(sx,sy,sz) {
			switch(arguments.length){
				case 0:
					return this._string[this._positions[6]];
				case 1: 
					this._string[this._positions[6]] = sx;
					this._string[this._positions[7]] = sx;
					this._string[this._positions[8]] = sx;
					return this;
				case 2:
					this._string[this._positions[6]] = sx;
					this._string[this._positions[7]] = sy;
					//this._string[this._positions[8]] = 1;
					return this;
				case 3:
					this._string[this._positions[6]] = sx;
					this._string[this._positions[7]] = sy;
					this._string[this._positions[8]] = sz;
					return this;
			}
			return this;
		},
		
		  /////////////////////////////////////////////
		 /////////////////  Origin  //////////////////
		/////////////////////////////////////////////
		origin : function(ox,oy,oz) {
			// failed attempt at auto-centering the registration point of the object
			if ( typeof(ox) === "string" ) {
				/*
				switch(ox){
					case "center":
						this._string[this._positions[0]] = -this.offsetWidth>>1;
						this._string[this._positions[1]] = -this.offsetHeight>>1;
						debugger
						console.log("centering");
						break;
				}
				*/
				var cs = window.getComputedStyle(this,null);
				console.log(cs);
				console.log("w:"+ cs.getPropertyValue("width") + " || h: " + cs.height );
			} else {
				if (arguments.length<3) oz = 0;
				this._string[this._positions[0]] += this._ox - ox;
				this._string[this._positions[1]] += this._oy - oy;
				this._string[this._positions[2]] += this._oz - oz;
				this._ox = ox;
				this._oy = oy;
				this._oz = oz;
			}
			return this;
		},

		  /////////////////////////////////////////////
		 ////////////  Transform Origin  /////////////
		/////////////////////////////////////////////
		transformOrigin : function(tx,ty) {
			this.style[ Sprite3D._browserPrefix + "TransformOrigin" ] = (Number(tx)?tx+"px":tx) + " " + (Number(ty)?ty+"px":ty);
			return this;
		},
		
		  /////////////////////////////////////////////
		 ////////////  Transform String  /////////////
		/////////////////////////////////////////////
		transformString : function(s) {
			var parts = s.toLowerCase().split(" "),
				numParts = parts.length,
				i = 0,
				strings = [],
				positions = [ 0,0,0, 0,0,0, 0,0,0 ],
				n = 0;
				
			for(i;i<numParts;i++){
				switch( parts[i] ){
					case "p":
					case "position":
					case "translate":
					// todo: use rx ry rz (regPoint) when re-defining transform order
						n = strings.push( "translate3d(", this._string[this._positions[0]], "px,", this._string[this._positions[1]], "px,", this._string[this._positions[2]], "px) " );
						positions[0] = n-6;	
						positions[1] = n-4;
						positions[2] = n-2;
						break;
					case "rx":
					case "rotatex":
					case "rotationx":
						n = strings.push( "rotateX(", this._string[this._positions[3]], "deg) " );
						positions[3] = n-2;
						break;
					case "ry" :
					case "rotatey":
					case "rotationy":
						n = strings.push( "rotateY(", this._string[this._positions[4]], "deg) " );
						positions[4] = n-2;
						break;
					case "rz":
					case "rotatez":
					case "rotationz":
						n = strings.push( "rotateZ(", this._string[this._positions[5]], "deg) " );
						positions[5] = n-2;
						break;
					case "s":
					case "scale":
						n = strings.push( "scale3d(", this._string[this._positions[6]], ",", this._string[this._positions[7]], ",", this._string[this._positions[8]], ") " );
						positions[6] = n-6;	
						positions[7] = n-4;
						positions[8] = n-2;
						break;
				}
			}
			
			this._string = strings;
			this._positions = positions;
			
			return this;
		},
		
		  /////////////////////////////////////////////
		 /////////////////  Update  //////////////////
		/////////////////////////////////////////////	
		updateJoin : function(){
			this.style[Sprite3D._transformProperty] = this._string.join("");
			return this;
		},

		update : function(){
			var s = "";
			this._string.every( function(value){ s += value; return true; } );
			this.style[Sprite3D._transformProperty] = s;
			return this;
		},

		  /////////////////////////////////////////////
		 ////////////  Helper Functions //////////////
		/////////////////////////////////////////////
	
		//////////// Perspective helper function ////////////
		perspective : function(value) {
			switch(arguments.length) {
				case 0:
					return this.style[Sprite3D._browserPrefix + "Perspective"];
		
				case 1:
					this.style[Sprite3D._browserPrefix + "Perspective"] = (typeof(value)==="string")?value:value+"px";
					return this;
			}
		},
	
		//////////// CSS helper function ////////////
		css : function(name, value) {
			switch(arguments.length) {
				case 0:
					return this.style;
				case 1:
					return this.style[name];
				case 2:
					this.style[name] = value;
					return this;
				case 3:
					this.style[Sprite3D._browserPrefix + name] = value;
					return this;
			}
		},
		
		//////////// HTML helper function ////////////
		html : function(value) {
			if (arguments.length){
				this.innerHTML = value;
				return this;
			}else{
				return this.innerHTML;
			}
			return this;
		},
		
		//////////// SIZE helper function ////////////
		size: function(width, height){
			this.style.width = Number(width)?width+"px":width;
			this.style.height = Number(height)?height+"px":height;
			return this;
		},
		
		//////////// BIND helper function ////////////
		bind: function(events){
			if(typeof(events)==="object"){
				for( var i in events ){
					this.addEventListener( i, events[i], false );
				}
			} else if(arguments.length===2) {
				this.addEventListener( arguments[0], arguments[1], false );
			}
			return this;
		},
		
		//////////// UNBIND helper function ////////////
		unbind: function(events){
			if(typeof(events)==="object"){
				for( var i in events ){
					this.removeEventListener( i, events[i], false );
				}
			} else if(arguments.length===2) {
				this.removeEventListener( arguments[0], arguments[1], false );
			}
			return this;
		},
				
		//////////// Spritesheet helper functions ////////////
		tileWidth: 0,
		tileHeight: 0,
		tileSize : function(width, height) {
			this.tileWidth = width;
			this.tileHeight = height;
			return this;
		},
		tilePosition : function(tilePosX, tilePosY) {
			this.style.backgroundPosition = "-" + (tilePosX * this.tileWidth) + "px -" + (tilePosY * this.tileHeight) + "px";
			return this;
		},

		//////////// Generic setter for chaining ////////////
		set : function(name, value) {
			this[name] = value;
			return this;
		}
		
	}
};
Aroma.Vector3D = function(x , y , z ){
	this.x = x;
	this.y = y;
	this.z = z;
};

Aroma.Vector3D.prototype.toString = function() {
  return String('['+ this.x + ' ,' + this.y + ' ,' + this.z + ']');
};

Aroma.Vector3D.dotProduct = function(a , b) {
  	return a.x * b.x + a.y * b.y + a.z * b.z;
};

Aroma.Vector3D.rotate = function(vector , x , y , z){
	vector = Aroma.Vector3D.rotateAxis(vector , 'x' , x);
	vector = Aroma.Vector3D.rotateAxis(vector , 'y' , y);
	vector = Aroma.Vector3D.rotateAxis(vector , 'z' , z);
	
	return vector;
};

Aroma.Vector3D.rotateAxis = function(vector , axis , theta) {
  theta = theta * Math.PI / 180;
  
  var ct = Math.cos(theta);
  var st = Math.sin(theta);
  
  switch(axis){
  	case 'x':
  		return new Aroma.Vector3D(vector.x ,
  								  vector.y * ct - vector.z * st ,
  								  vector.y * st + vector.z * ct );
  	break;
  	case 'y':
  		return new Aroma.Vector3D(vector.z * st + vector.x * ct ,
  								  vector.y ,
  								  vector.z * ct - vector.x * st );
  	break;
  	case 'z':
  		return new Aroma.Vector3D(vector.x * ct - vector.y * st ,
  								  vector.x * st + vector.y * ct ,
  								  vector.z);
  	break
  }
};



Aroma.CSS3DView = function(row , col ){
	Aroma.AbstractView.call(this, row , col);
	
	this.viewport = document.createElement('div');
	this.viewport.style.overflow = 'hidden';
	this.sort = true;
	
	this.stage = Sprite3D.stage();
	
	this.alignstage = function(){
		this.stage.style.position = 'relative';
		this.stage.style.left     = (this.vpWidth  - this.width)  / 2 + 'px';
		this.stage.style.top      = (this.vpHeight - this.height) / 2 + 'px';
	}
}

Aroma.CSS3DView.prototype = new Aroma.AbstractView;
Aroma.CSS3DView.prototype.constructor = Aroma.CSS3DView;

Aroma.CSS3DView.prototype.setup = function() {
	this.stage.perspective(1500);
		
	this.stage.style[Sprite3D._browserPrefix+"PerspectiveOrigin"] = "50% 50%";
	this.stage.style[Sprite3D._browserPrefix+"TransformStyle"] = '';
	this.viewport.appendChild(this.stage);
};

Aroma.CSS3DView.prototype.setSize = function(width , height){
		
	Aroma.AbstractView.prototype.setSize.call(this, width , height);
	this.stage.style.width  = width  + 'px';
	this.stage.style.height = height + 'px';
	
	this.alignstage();
}


Aroma.CSS3DView.prototype.setViewPortSize = function(width , height){
	this.vpWidth = width;
	this.vpHeight = height;
	
	this.viewport.style.width = width + 'px';
	this.viewport.style.height = height + 'px';
	
	
	this.alignstage();
}

Aroma.CSS3DView.prototype.dispose = function(){
	
	this.stage.setAttribute('style' , '');
	
	Aroma.AbstractView.prototype.dispose.call(this);
}


Aroma.CSS3DView.prototype.getPieceAt = function(col , row , effect){
		
	var id = this.posToID(col , row);
				
	if(this._pieceList[id] != null)
		return this._pieceList[id];
	
	var piece = new Aroma.CSS3DCube();
	var pieceBounds = this.getPieceBounds(col , row);
	
	piece.col = col;
	piece.row = row;
	piece.bounds = pieceBounds;
	piece.view = this;
	piece.stage = this.stage;
	effect.piece = piece;
	ConcatObject.concat(piece.options , effect.getPieceOptions() );
	piece.setup(this.newSource , this.oldSource );
	
	this.stage.appendChild(piece.cube);	
	
	this._pieceList[id] = piece;
	
	return piece;
}

Aroma.CSS3DView.prototype.sortParts = function(){
	Aroma.AbstractView.prototype.sortParts.call(this);
	for(var i = 0 , l = this._pieceList.length; i<l ; ++i){
		this._pieceList[i].cube.style.zIndex = i;
	}
}

Aroma.CSS3DCube = function(){
	Aroma.Piece.call(this);
	
	this.proxy = null;
	
	this.cube      = null;
	this.stage     = null;
	this.depth     = 0;

	// piece Options
	this.options = {flipX : false , flipY:false , sideColor: 0xAAAAAA , newImageLocation : 1 , depth : 800}; 
	
	this.side_dic = {
		right	: 3,
		front	: 0,
		left 	: 2,
		back 	: 1,
		top	 	: 5,
		bottom 	: 4
	};
	
	this.getImage = function(source , flipX , flipY){
		var img = new Image();
		img.src = source.src;
		img.style.width  = this.view.width  + 'px';
		img.style.height = this.view.height + 'px';
		
		img.style.position = 'relative';
		
		img.style.left  = -this.bounds.x + 'px';
		img.style.top   = -this.bounds.y + 'px';
		
		if(flipX) {
			img.style[Sprite3D._browserPrefix + 'Transform']	+= ' rotateX(180deg)';
			img.style.left  = -this.view.width + (this.bounds.x + this.bounds.width) + 'px';
		}
		if(flipY) {
			img.style[Sprite3D._browserPrefix + 'Transform']	+= ' rotateY(180deg)';
			img.style.top   = -this.view.height + (this.bounds.y + this.bounds.height) + 'px';
		}
		
		return img;
	}
	
}

Aroma.CSS3DCube.normals = [
		new Aroma.Vector3D(0  , 0 , 1 ), // front
		new Aroma.Vector3D(0  , 0 , -1), // back
		new Aroma.Vector3D(-1 , 0 , 0 ), // left
		new Aroma.Vector3D(1  , 0 , 0 ), // right
		new Aroma.Vector3D(0  , 1 , 0 ), // bottom
		new Aroma.Vector3D(0  ,-1 , 0 )  // top
	];

Aroma.CSS3DCube.prototype = new Aroma.Piece;
Aroma.CSS3DCube.prototype.constructor = Aroma.CSS3DCube;

Aroma.CSS3DCube.light = true;

Aroma.CSS3DCube.prototype.setup = function(newSource , oldSource ) {
	
	this.proxy = {
		x : 0 , y : 0 , z : 0 ,
		rotationX : 0 , rotationY : 0 , rotationZ : 0 ,
		piece : this
	};
	
	this.newSource = newSource;
	this.oldSource = oldSource;
	this.depth = this.options.depth;
	
	this.bounds.width  = this.bounds.width;
	this.bounds.height = this.bounds.height;
	this.bounds.x 	   = this.bounds.x;
	this.bounds.y 	   = this.bounds.y;
	
	this.cube = Sprite3D.box(this.bounds.width , this.bounds.height, this.depth,  "cube" );
	this.sides = this.cube.children;
	
	for(var i = 0 ; i < 6; ++i){
		if(i == 0){
			this.sides[0].style.overflow = 'hidden';
			this.sides[0].appendChild(this.getImage(this.oldSource));			
		}else if(i == this.options.newImageLocation){
			this.sides[i].style.overflow = 'hidden';
			this.sides[i].appendChild(this.getImage(this.newSource , this.options.flipX , this.options.flipY ));
			
		}else{
			this.sides[i].style.backgroundColor =  '#' + this.options.sideColor.toString(16);
		}
	}
	
	this.origin_x =  this.bounds.x + this.bounds.width/2;
	this.origin_y = this.bounds.y+ this.bounds.height/2;
	this.origin_z = -this.depth>> 1;
	this.cube.style.left = (this.origin_x + 'px');
	this.cube.style.top = (this.origin_y + 'px');
	this.cube.z(this.origin_z);
	this.cube.update();
	this.stage.appendChild(this.cube);
}

Aroma.CSS3DCube.prototype.dispose = function(){
	this.stage.removeChild(this.cube);
	this.cube.html('');
	this.cube  = null;
	this.stage = null;
	this.scene = null;
	this.proxy = null;
}

Aroma.CSS3DCube.prototype.proxyUpdate = function(){

	this.piece.cube.x(this.x );
	this.piece.cube.y(this.y );
	this.piece.cube.z(this.z + this.piece.origin_z);
	this.piece.cube.rotationX((-this.rotationX));
	this.piece.cube.rotationY((-this.rotationY));
	this.piece.cube.rotationZ((-this.rotationZ));
	this.piece.cube.update();
	
	if(Aroma.CSS3DCube.light){
		for(var i = 1 ; i < 6 ; ++i){
			if(i != this.piece.options.newImageLocation){
				var vect 	  = Aroma.Vector3D.rotate(Aroma.CSS3DCube.normals[i] , -this.rotationX , -this.rotationY , -this.rotationZ);
				var light_ins = Aroma.Vector3D.dotProduct(vect , Aroma.CSS3DCube.normals[0]) * 50 ;
				var sc = this.piece.options.sideColor;
				
				if(light_ins < 0) light_ins = 0;
							
				this.piece.cube.children[i].style.backgroundColor = 'rgb('+ parseInt((sc&0xff) + light_ins) + ',' + parseInt(((sc>>8)&0xff) + light_ins) + ',' + parseInt(((sc>>16)&0xff) + light_ins) +')';
				
				vect = null;
			}
		}
	}
}

