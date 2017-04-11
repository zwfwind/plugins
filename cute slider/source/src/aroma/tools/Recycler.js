(function (){
	window.Recycler = window.Recycler || {
		__content:{},
		
		empty:function (){
			
			for(var key in Recycler.__content)
				Recycler.__content[key] = null;
			
			Recycler.__content = {};
		},
		
		remove:function(element){
			
			if(element.parentNode)
				element.parentNode.removeChild(element);
			
			element.setAttribute('style' , '');
			element.setAttribute('class' , '');
			element.setAttribute('id' , '');
			
			element.style.display = '';
			
			var node_name = element.nodeName.toLowerCase();
			
			if(!Recycler.__content[node_name])
				Recycler.__content[node_name] = [];
			
			Recycler.__content[node_name].push(element);
			
			element = null;
		},
		
		create:function(elementName){
			if(Recycler.__content[elementName] && Recycler.__content[elementName].length > 0){
				var ele = Recycler.__content[elementName].pop();
				ele.removeAttribute('style');
				
				return ele;
			}else{
				return document.createElement(elementName);
			}
		}
	}
})();
