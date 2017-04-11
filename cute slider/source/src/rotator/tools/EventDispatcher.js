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
