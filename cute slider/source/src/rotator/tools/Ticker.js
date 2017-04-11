// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
 

    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };


Cute.Ticker = Cute.Ticker || {
	
	list : [],
	__stoped : true,
	
	add : function (listener , ref){
		Cute.Ticker.list.push([listener , ref]);
		return Cute.Ticker.list.length;
	},
	
	remove : function (listener , ref) {
		for(var i = 0 , l = Cute.Ticker.list.length ; i<l ; ++i){
			if(Cute.Ticker.list[i] && Cute.Ticker.list[i][0] == listener && Cute.Ticker.list[i][1] == ref){
				Cute.Ticker.list.splice(i , 1);
			}
		}
	},
	
	start : function (){
		if(!Cute.Ticker.__stoped) return;
		
		Cute.Ticker.__stoped = false;
		Cute.Ticker.__tick();
	},
	
	stop : function (){
		Cute.Ticker.__stoped = true;
	},
	
	__tick : function () {
		if(Cute.Ticker.__stoped) return;
		
		for(var i = 0 ;i<Cute.Ticker.list.length ; ++i){
			Cute.Ticker.list[i][0].call(Cute.Ticker.list[i][1]);
		}

		requestAnimationFrame(Cute.Ticker.__tick);
	}
	
};
