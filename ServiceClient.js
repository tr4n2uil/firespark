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
