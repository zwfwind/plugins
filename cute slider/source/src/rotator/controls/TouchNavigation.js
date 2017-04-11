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

