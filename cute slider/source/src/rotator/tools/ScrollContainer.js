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

