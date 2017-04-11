Cute.FallBack = function(){
	
}

Cute.FallBack.CANVAS = 'canvas';
Cute.FallBack.CSS3D  = 'css3d';
Cute.FallBack.DOM2D  = 'dom2d';
Cute.FallBack.ua     = new UAParser().result;

Cute.FallBack.prototype = {
		
	force  : null, // 2d , canvas , css
	
	__result : null ,

	getType : function(){
		if(this.__result) return this.__result;
		
		if(this.force){
			switch(this.force.toLowerCase()){
				case '2d':
					this.__result = Cute.FallBack.DOM2D;
				break;
				case 'canvas':
					this.__result = Cute.FallBack.CANVAS;
				break;
				case 'css':
					this.__result = Cute.FallBack.CSS3D;
				break;
			}
			
			if (this.__result) return this.__result;
		}
		
		
		var ua = Cute.FallBack.ua;
		var type = Cute.FallBack.DOM2D;
		
		var os = ua.os.name.toLowerCase();
		var browser = ua.browser.name.toLowerCase();
		var noResult = false;
		
		switch (os){
			case 'windows':
			case 'mac os' :
			case 'linux'  :
			case 'ubuntu' :
				if (browser == 'chrome' || browser == 'safari' || browser == 'chromium' || ua.engine.name == 'AppleWebKit')
					type = Cute.FallBack.CSS3D;
				else if((browser == 'ie' && parseInt(ua.browser.major) >= 9) || browser == 'firefox' || browser == 'opera')
					type = Cute.FallBack.CANVAS;
			break;
			
			//Mobile Devices
			case 'ios' :
				type = Cute.FallBack.CSS3D;
			break;
			case 'android':
				if(parseInt(ua.os.version.charAt(0)) >= 4)
					type = Cute.FallBack.CSS3D;
			break;
			case 'windows phone os' :
				type = Cute.FallBack.DOM2D;
			break;
			
			default:
				noResult = true;
		}
		
		if(window.Modernizr){
			if(type == Cute.FallBack.CANVAS && !Modernizr.canvas) 
				type = Cute.FallBack.DOM2D;
			else if(type == Cute.FallBack.CSS3D && !Modernizr.csstransforms3d)
				type = Cute.FallBack.DOM2D;
			else if(noResult){
				if(Modernizr.csstransforms3d)
					type = Cute.FallBack.CSS3D;
				else if(Modernizr.canvas)
					type = Cute.FallBack.CANVAS;
			}
		}
		
		
		this.__result = type;
		return type;
	}
	
};

Cute.FallBack.isIE  = Cute.FallBack.ua.browser.name == 'IE';
Cute.FallBack.isIE7 = Cute.FallBack.isIE && Cute.FallBack.ua.browser.major == 7;
Cute.FallBack.isIE8 = Cute.FallBack.isIE && Cute.FallBack.ua.browser.major == 8;

Cute.FallBack.isMobileDevice = (Cute.FallBack.ua.os.name.toLowerCase() == 'android' || Cute.FallBack.ua.os.name.toLowerCase() == 'ios'  || Cute.FallBack.ua.os.name.toLowerCase() == 'windows phone os'),