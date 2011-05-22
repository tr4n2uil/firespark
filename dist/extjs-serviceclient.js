var ServiceClient = {};

ServiceClient.client = {};

ServiceClient.client.Kernel = function(){
	var views = new Array();
	var templates = new Array();
	var loaders = new Array();
	var renderers = new Array();
	
	this.addView = function(index, view){
		views[index] = view;
	}
	
	this.addTemplate = function(index, template){
		templates[index] = template;
	}
	
	this.addLoader = function(index, loader){
		loaders[index] = loader;
	}
	
	this.addRenderer = function(index, renderer){
		renderers[index] = renderer;
	}
	
	this.start = function(config){
		if(config.view != false)
			config.view = views[config.view].getView(config);
		if(config.template != false)
			config.template = templates[config.template].getTemplate(config);
		//if(!config.loader)
			//config.loader = loaders[config.loader].load(config);
		if(config.renderer != false)
			config.renderer = renderers[config.renderer].render(config);
	}
}
ServiceClient.extjs = {};

ServiceClient.extjs.view = {};
ServiceClient.extjs.loader = {};
ServiceClient.extjs.renderer = {};
ServiceClient.extjs.template = {};
ServiceClient.extjs.view.ElementView = function(){
	this.getView = function(config){
		return Ext.get(config.elid);
	}
}
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
