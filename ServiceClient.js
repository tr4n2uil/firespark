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
		if(config.scview !== false)
			config.sccontainer = views[config.scview].getView(config);
		if(config.sctemplate !== false)
			config.sctpl = templates[config.sctemplate].getTemplate(config);
		if(config.scloader !== false)
			config.scdataloader = loaders[config.scloader].load(config);
		if(config.screnderer !== false)
			renderers[config.screnderer].render(config);
	}
}
