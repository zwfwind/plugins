Aroma.CanvasTools = {}

Aroma.CanvasTools.createBitmapSlice = function(pieceBounds , source ){
	var canvas = document.createElement('canvas');
	
	canvas.setAttribute('width', pieceBounds.width);
	canvas.setAttribute('height' , pieceBounds.height);
	//console.log(source,pieceBounds.x,pieceBounds.y,pieceBounds.width,pieceBounds.height,0,0,pieceBounds.width,pieceBounds.height);
	
	var context = canvas.getContext('2d');
	
	context.drawImage(source,pieceBounds.x,pieceBounds.y,pieceBounds.width,pieceBounds.height,0,0,pieceBounds.width,pieceBounds.height);			
		
	return canvas;
}

Aroma.CanvasTools.resizeImage = function(img , org , bounds){
	var canvas = document.createElement('canvas');
	
	canvas.setAttribute('width'	 , Math.floor(bounds.width) + 1);
	canvas.setAttribute('height' , Math.floor(bounds.height) + 1);
	
	var context = canvas.getContext('2d');
	
	
	context.drawImage(img , 0 , 0 , org.width   , org.height, 
							0 , 0 , bounds.width, bounds.height);			
		
	return canvas;
}


Aroma.CanvasTools.flip = function (source , bounds , x , y){
	if(!x && !y) return;
		
	var ctx = source.getContext('2d');
	ctx.save();
   	ctx.translate(x? bounds.width : 0, y ?bounds.height : 0);
   	ctx.scale(x? -1 : 1 ,y? -1: 1);  
   	ctx.drawImage(source ,0 ,0);
    ctx.restore();
}
