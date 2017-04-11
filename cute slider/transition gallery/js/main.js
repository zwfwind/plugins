window.CodeLayer = function(layer,close_btn,block){
	this.layer = layer;
	this.close_btn = close_btn;
	this.block = block;
	this.close_btn.cl = this;
	this.close_btn.onclick = function(){this.cl.hide()};
	
	this.layer.style.opacity = '0';
	this.layer.style.zIndex = '0';	
}

CodeLayer.prototype = {
	constructor : CodeLayer,
	
	show : function(data){
		this.block.innerHTML = '<pre>'+data.split('\n').join('<br />')+'</pre>';
		this.layer.style.opacity = '1';
		this.layer.style.zIndex = '20';
		if(isIE) this.layer.style.display = '';
	},
	
	hide : function(){
		this.layer.style.opacity = '0';
		this.layer.style.zIndex = '0';
		if(isIE) this.layer.style.display = 'none';
	}
}

window.TransitionObject = function(id){
	this.element = document.createElement('li');
	this._id = id;
	this.selected = false;
	
	this.check = document.createElement('span');
	this.check.className = 'icon check';
	this.check.setAttribute('title' , 'Add to list');
	this.check.to = this;
	this.check.onclick = function(){
		this.to.checkClicked();
	}
	
	this.view  = document.createElement('span');
	this.view.className = 'icon view-code';
	this.view.setAttribute('title' , 'View transition code');
	this.view.to = this;
	this.view.onclick = function(){
		this.to.showCode();
	}
	
	
	this.text = document.createElement('p');

	this.element.appendChild(this.text);


	this.tt = $(this.element).qtip({
         // Create content DIV with unique ID for swfObject replacement
         content: '<iframe id="tr_'+ this._id+'" scrolling="no" width="370" height="200"></iframe>',
         position: {
            corner: {
               tooltip: 'bottomMiddle', // ...and position it center of the screen
               target: 'topMiddle' // ...and position it center of the screen
            }
         },
         show: {
            when: 'mouseover', // Show it on click...
            solo: true // ...and hide all others when its shown
         },
         hide: 'mouseout', // Hide it when inactive...
         style: {
            width: 370,
            height: 200,
             border: {
		      width: 1,
		      radius: 5,
		      color:"#FFFFFF"
		   }
         },
         api: {
            onShow: function(){        	
              var ele = document.getElementById('tr_'+ this._id);
              ele.setAttribute('src' , 'br/br-tg.html#/'+ this._tr+'/'+this._2d);
            },

            onHide: function(){
            	var ele = document.getElementById('tr_'+ this._id);
               ele.setAttribute('src' , '');
            }
         }
      });
      
   
}

TransitionObject.prototype = {
	
	constructor : TransitionObject ,
	
	name : function(value){
		if(!value) return this._name;
		
		this.text.innerHTML = value;
		
		this.text.appendChild(this.check);
		this.text.appendChild(this.view);
		this._tr = value.slice(12);
		this._name = value;
		
		this.tt.qtip("api")._id = this._id;
      	this.tt.qtip("api")._tr = this._tr;
      	this.tt.qtip("api")._2d = this._2d;
      	
	},
	
	code : function(value){
		if(!value) return this._code;
		this._code = value;
	},
	
	showCode : function(){
		CodeLayer.instance.layer.className = "code-layer";
		CodeLayer.instance.show(this._code);
	},
	
	checkClicked : function(){
		if(!this.selected)
			this.check.style.opacity = '1';
		else{
			this.check.style.opacity = null;
			this.group.check.style.opacity = null;
			this.group.checked = false;
		}
			
			
		this.selected = !this.selected;
	}
};

window.TransitionGroup = function(){
	this.element = document.createElement('div');
	this.element.className = 'transition-group';
	
	this.title   = document.createElement('div');
	this.title.className = 'title';
	
	this.element.appendChild(this.title);

	this.ul		= document.createElement('ul');
	this.element.appendChild(this.ul);
	this.element.tg = this;
	this.element.onmouseover = function(){this.tg.title.style.backgroundColor = '#7da7d9';};
	this.element.onmouseout  = function(){this.tg.title.style.backgroundColor = '#656565';};
	
	this.check = document.createElement('span');
	this.check.className = 'icon check check-all';
	this.check.setAttribute('title', 'Check all');
	this.check.tg = this;
	this.check.onclick = function(){this.tg.checkAll()};
	
	this.text = document.createElement('p');
	
	this.title.appendChild(this.text);
	
	this.trans_list = [];
	this.i = 0;
	this.checked = false;
	
	
}

TransitionGroup.id = 1;

TransitionGroup.prototype = {
	constructor : TransitionGroup,
	
	addTitle : function(value){
		this.text.innerHTML = value;
		this.text.appendChild(this.check);
	},
	
	addTransition : function(trans){
		this.ul.appendChild(trans.element);
		this.trans_list.push(trans);
		trans.group = this;
	},
	
	checkAll : function(){
		
		this.check.style.opacity = (!this.checked? '1' : null);
		
		for(var i=0 , l=this.trans_list.length; i<l ; ++i){
			this.trans_list[i].selected = !this.checked;
			this.trans_list[i].check.style.opacity = (!this.checked? '1' : null);
		}
		
		this.checked = !this.checked;
	}
};

window.TransitionGallery = function( element , transitions){
	this.transitions = transitions;
	this.element = element;
	this.id = TransitionGroup.id;
	TransitionGroup.id+=100;
	this.trans_list = [];
}

TransitionGallery.prototype  = {
	constructor : TransitionGallery ,
	
	create : function(_2d){
		var trans_obj;
		var trans_group;
	
		var ii=0;
			
		for(var i=0 , l = this.transitions.length; i<l ; ++i){
			trans_group = new TransitionGroup();
			trans_group.addTitle(this.transitions[i].name);
			for(var j=0 , l2 = this.transitions[i].trans.length; j<l2 ; ++j){
				trans_obj = new TransitionObject(this.id*ii++);
				trans_obj._2d = (_2d?'2d':'');
				trans_obj.name(this.transitions[i].trans[j].name);
				trans_obj.code(this.transitions[i].trans[j].code);
				trans_group.addTransition(trans_obj);
				this.trans_list.push(trans_obj);
			}
			
			this.element.appendChild(trans_group.element);
		}
		
		return this;
	}
}

window.Builder = function(_3dtrans , _2dtrans , codelayer){
	this._2dtrans = _2dtrans;
	this._3dtrans = _3dtrans;
	this.cl		  = codelayer;
}

Builder.prototype = {
	constructor : Builder,
	
	__gen: function(value){
		var r = '';
		var trans_code = []
		for(var i=0 , l=value.trans_list.length; i<l ; ++i){
			if(value.trans_list[i].selected)
				trans_code.push(value.trans_list[i]._code.split('\n').join('<br />'));
		}
		
		return trans_code.join(',<br />');
	},
	
	build : function(){
		
		var code =  '/** <br /> * Cute Slider Transitions. <br /> * Recommended use javascript packer with Base62 encode for compressing this file. <br /> * Javascript compressor version 3.0 : http://dean.edwards.name/packer/ <br /> */ <br />'+
					'window.Transitions3D = { <br />' + this.__gen(this._3dtrans) + '<br />};<br /><br />'+
					'window.Transitions2D = { <br />' + this.__gen(this._2dtrans) + '<br />};';
		
		this.cl.layer.className = "code-layer build-code-layer";
		this.cl.show(code);
	}
}