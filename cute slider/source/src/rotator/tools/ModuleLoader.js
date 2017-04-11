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
