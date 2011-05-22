ServiceClient.extjs.renderer.TemplateRenderer = function(){
	var datastore = null;
	var view = null;
	
	this.load = function(){
		view.dom.innerHTML = "Loading ...";
		datastore.load();
	}
	
	this.render = function(config){
		view = config.view;
		var template = config.template;
		var trurl = config.trurl;
		
		datastore = new Ext.data.JsonStore({ 
			url : trurl,
			listeners: {
				load: {
					fn : function(store, records, options){
						template.overwrite(view, datastore.getAt(0).data);
						view.fadeIn({ 
							duration: 1,
							easing: 'easeBoth'
						});
					}
				}
			}
		});
		
		this.load();
	}
}
