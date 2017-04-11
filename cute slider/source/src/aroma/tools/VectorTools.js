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


