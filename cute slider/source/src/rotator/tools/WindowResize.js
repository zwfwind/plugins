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

