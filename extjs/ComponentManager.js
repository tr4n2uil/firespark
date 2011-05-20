ComponentManager = function(){
	this.comps = null;

	this.init = function(){
		this.comps = new Array();
					
		var testcomp = function(container){
			new Ext.Button({
				renderTo: container, 
				text: "Add Tab",  
				iconCls: "icon-tabs" 
			}); 
		}
		this.comps['test'] = testcomp;
	}
	
	this.add = function(index, component){
		this.comps[index] = component;
	}
					
	this.get = function(index){
		return this.comps[index];
	}
					
	this.init();
}
