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
