// Class CloneObject

window.CloneObject = window.ConcatObject || {};

CloneObject.clone = function(obj){
	if(obj == null) return {};
	var n_obj = {};
	
	for(var key in obj)
		n_obj[key] = obj[key];
		
	return n_obj;
}

ConcatObject = {};
ConcatObject.concat = function(obj , obj2){
	for(var key in obj2)
		obj[key] = obj2[key];
	return obj
}


window.setOpacity = function(element , value){	
	element.style.filter 		= 'alpha(opacity=' + value + ')';
	element.style.opacity 		=  value * .01;
	element.style.MozOpacity 	=  value * .01;
    element.style.KhtmlOpacity 	=  value * .01;
    element.style.MSOpacity 	=  value * .01;
};