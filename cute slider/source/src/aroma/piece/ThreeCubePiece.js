// Class ThreeCubePiece extends Piece

Aroma.ThreeCubePiece = function(){
	
	Aroma.Piece.call(this);
	
	//this.proxy = null;
	
	//this.cube      = null;
	//this.scene     = null;
	this.depth     = 0;
	
	// piece Options
	this.options = {flipX : false , flipY:false , fillSides:true , sideColor: 0x333333 , newImageLocation : 5 /* back */ , depth:800}; 
	
	this.side_dic = {
		right	: 0,
		front	: 4,
		left 	: 1,
		back 	: 5,
		top	 	: 2,
		bottom 	: 3
	};
}

Aroma.ThreeCubePiece.prototype = new Aroma.Piece;
Aroma.ThreeCubePiece.prototype.constructor = Aroma.ThreeCubePiece;

Aroma.ThreeCubePiece.prototype.setup = function(newSource , oldSource , depth) {
	
	this.proxy = {
		x : 0 , y : 0 , z : 0 ,
		rotationX : 0 , rotationY : 0 , rotationZ : 0 ,
		piece : this
	};
	

	
	this.newSource = newSource;
	this.oldSource = oldSource;
	this.depth = depth || this.options.depth;
	
	this.scene = new THREE.Scene();
	this.scene.add(this.view.camera);
	
	light1 = new THREE.PointLight( 0xffffff, 0.3, 110000 );
	light1.position.z = 500
	light1.position.x = 0
	light1.position.y = 0
	
	light2 = new THREE.AmbientLight( this.options.sideColor);
	
	this.scene.add( light2 );
	this.scene.add( light1 );
	
	var materials = [];
	
	Aroma.CanvasTools.flip(this.newSource , this.bounds , this.options.flipX , this.options.flipY);

	for(var i = 0; i < 6 ; ++i){
		if(i == 4)// Front
			materials.push(new THREE.MeshBasicMaterial({ map:new THREE.Texture( oldSource ), overdraw:true}));
		else if(i == this.options.newImageLocation)
			materials.push(new THREE.MeshBasicMaterial({ map:new THREE.Texture( newSource ) , overdraw:true }));
		else 
			materials.push(new THREE.MeshLambertMaterial({shading: THREE.FlatShading, overdraw:true }));
	}
	
	
	var geom = new THREE.CubeGeometry(this.bounds.width , this.bounds.height, this.depth  , 1 , 1 ,1  , materials);
	
	this.cube = new THREE.Mesh(geom  , new THREE.MeshFaceMaterial() );
	
	this.cube.position.x = this.origin_x = -this.view.width/2 + this.bounds.x + this.bounds.width/2;
	this.cube.position.y = this.origin_y = this.view.height/2 - this.bounds.y - this.bounds.height/2;
	this.cube.position.z = this.origin_z = -this.depth>> 1;
	
	this.scene.add(this.cube);

}

Aroma.ThreeCubePiece.prototype.dispose = function(){
	this.scene.remove(this.cube);
	this.cube  = null;
	this.scene = null;
	this.proxy = null;
}

Aroma.ThreeCubePiece.prototype.proxyUpdate = function(){
	this.piece.cube.position.x = this.x + this.piece.origin_x;
	this.piece.cube.position.y = -this.y + this.piece.origin_y;
	this.piece.cube.position.z = this.z + this.piece.origin_z;
	this.piece.cube.rotation.x = this.rotationX * Math.PI / 180;
	this.piece.cube.rotation.y = -this.rotationY * Math.PI / 180;
	this.piece.cube.rotation.z = -this.rotationZ * Math.PI / 180;
}
