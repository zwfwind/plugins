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