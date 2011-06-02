/**
 *	ServiceClient
 *	JavaScript UI Framework for consuming Services 
 *	
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *	
**/

var ServiceClient = {};

ServiceClient.client = (function(){
	/**
	 *	views are containers/generators that generates the element where the output must be rendered 
	 *	interface ViewGenerator {
	 *		function getView(object params);
	 *	}
	**/
	var views = new Array();
	
	/**
	 *	templates are compiled html that is fed with data from the server and rendered to the view 
	**/
	var templates = new Array();
	
	/**
	 *	requestors are data request managers controlling the generation of a request for data from server
	**/
	var requestors = new Array();
	
	/**
	 *	renderers are output generators that use the view and optional template to display the content appropriately 
	 *	interface Renderer {
	 *		function render(object memory);
	 *	}
	**/
	var renderers = new Array();
	
	/**
	 *	modules are generic operations 
	 *	interface Module {
	 *		function execute(object params);
	 *	}
	**/
	var modules = new Array();
	
	/**
	 *	navigators are JSON objects that pass messages to the kernel
	 *	navigator = {	
	 *		service : 'paint'
	 *		... other properties for paint() ... 
	 *	};
	**/
	var navigators = new Array();
	
	return {
		/**
		 *	Registry manages references to
		 * 	ViewGenerators
		 *	Templates
		 *	Requestors
		 *	Renderers
		 *	Modules
		 *	Navigators
		**/
		Registry : {
			/**
			 *	adds a ViewGenerator with index
			**/
			addView : function(index, view){
				views[index] = view;
			},
			
			/**
			 *	adds a Template with index
			**/
			addTemplate : function(index, template){
				templates[index] = template;
			},
			
			/**
			 *	adds a Requestor with index
			**/
			addRequestor : function(index, requestor){
				requestors[index] = requestor;
			},
			
			/**
			 *	adds a Renderer with index
			**/
			addRenderer : function(index, renderer){
				renderers[index] = renderer;
			},
			
			/**
			 *	adds a Module with index
			**/
			addModule : function(index, module){
				modules[index] = module;
			},
			
			/**
			 *	adds a Navigator with index
			**/
			addNavigator : function(index, navigator){
				navigators[index] = navigator;
			}
		},
		/**
		 *	Kernel manages the following client tasks when required
		 *		initializes the view into memory
		 *		initializes the template into memory
		 *		initializes the requestor into memory
		 *		instantiates the renderer
		 *		calls render method of renderer which can access the view and/or template initialized in memory
		 *		executes modules
		 *		processes navigator requests when received
		**/
		Kernel : {
			/**
			 *	paints the view using the renderer with optional template
			**/
			paint : function(config){
				var params = config.params;
				var memory = {};
				
				if(config.view || false){
					memory.view = views[config.view].getView(params);
				} else {
					return 0;
				}
					
				if(config.template || false){
					memory.template = templates[config.template];
				}
				
				if(config.requestor || false){
					memory.requestor = new (requestors[config.requestor])(params);
				}
				
				if(config.renderer || false){
					var renderer = new (renderers[config.renderer])(params);
					renderer.render(memory);
					return renderer;
				}
				
				return 0;
			},
			
			/** 
			 *	executes the module with the given arguments
			**/
			run : function(config){
				if(config.module || false){
					return modules[config.module].execute(config.params);
				}
				
				return 0;
			},
			
			/**
			 *	processes the navigator request received to provide services defined above like paint and run
			**/
			navigate : function(request){
				var req = request.split(':');
				var index = req[0];
				var lastresult = 0;
				
				var config = new Array();
				for(var i=1, len=req.length; i<len; i++){
					var param = (req[i]).split('=');
					config[param[0]] = param[1];
				}
				
				if(navigators[index] || false){
					var navigator = new (navigators[index])(config);
					for(var i in navigator){
						switch(navigator[i].service){
							case 'paint' :
								lastresult = this.paint(navigator[i]);
								break;
							case 'run' :
								lastresult = this.run(navigator[i]);
								break;
							default :
								break;
						}
					}
				}
				
				return lastresult;
			}
		}
	};
})();
ServiceClient.jquery = {};

ServiceClient.jquery.view = {};
ServiceClient.jquery.module = {};
ServiceClient.jquery.renderer = {};
ServiceClient.jquery.navigator = {};
ServiceClient.jquery.requestors = {};
/**
 * ElementView view
 *
 * @param elementid string
**/
ServiceClient.jquery.view.ElementView = (function(){
	return {
		getView : function(params){
			return $(params.elementid);
		}
	};
})();
/**
 *	TabUI renderer and view generator
 *
 *	@param cache boolean
 *	@param collapsible boolean
 *	@param event string
 *	@param tablink boolean
 *	@param indexstart integer
 *
**/
ServiceClient.jquery.view.TabUI = function(params){
	var tab = new Array();
	var index = params.indexstart || 0;
	var options = {
		cache : params.cache || false,
		collapsible : params.collapsible || false,
		event : params.event || 'click',
		tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>",
		add: function( event, ui ) {
			tab[index] = $(ui.panel);
		}
	};
	if(params.tablink || false){
		options.load = function(event, ui) {
			$('a', ui.panel).click(function() {
				$(ui.panel).load(this.href);
				return false;
			});
		}
	}
	var tabpanel = null;
	
	/**
	 * @param view View
	**/
	this.render = function(memory){
		tabpanel = memory.view.tabs(options);
		memory.view.fadeIn(1000);
		$('.ui-icon-close').live( "click", function() {
			var indx = $("li", tabpanel).index($(this).parent());
			tabpanel.tabs( "remove", indx );
		});
		index--;
	}
	
	/**
	 *  @param tabtitle string
	 *  @param autoload boolean
	 *  @param taburl string
	**/
	this.getView = function(params){
		index++;
		var url = '#ui-tab-'+index;
		if(params.autoload){
			url = params.taburl;
		}
		tabpanel.tabs('add', url, params.tabtitle);
		tabpanel.tabs('select', '#ui-tab-'+index);
		return tab[index];
	}
}
/**
 *	TemplateUI renderer
 *
 *	@param loadurl string
 *	@param loadparams object
 *
**/
ServiceClient.jquery.renderer.TemplateUI = function(params){
	var loadurl = params.loadurl;
	var loadparams = params.loadparams;
	
	/**
	 * @param view View
	 * @param template Template
	**/
	this.render = function(memory){
		memory.view.html('<p>Loading ...</p>');
		$.ajax({
			url: loadurl,
			data: loadparams,
			dataType : 'json',
			type : 'POST',
			success : function(data, status, request){
				memory.view.hide();
				memory.view.html($.tmpl(memory.template, data.tpldata))
				memory.view.fadeIn(1000);
				
				if(data.services||false){
					for(var i in data.services)
						ServiceClient.client.Kernel.run(data.services[i]);
				}
			},
			error : function(request, status, error){
				memory.view.html('<p>The requested resource could not be loaded</p>');
			}
		});
	}
}
/** *	Alert module * *	@param title string *	@param data content (text/html) ***/ServiceClient.jquery.module.Alert = (function(){	return {		execute : function(params){			alert(params.title + " : " + params.data);		}	};})();/** *	NavigatorInit module * *	@param selector string *	@param attribute string ***/ServiceClient.jquery.module.NavigatorInit = (function(){	return {		execute : function(params){			var links = $(params.selector);			links.bind('click', function(){				ServiceClient.client.Kernel.navigate($(this).attr(params.attribute));				return false;			});		}	};})();/** *	TestTab navigator * *	@param tabtitle string ***/ServiceClient.jquery.navigator.TestTab = function(config){	return [{		service : 'paint',		view : 'tabui',		template : 'test',		renderer : 'tplui',		params : {			tabtitle : config.tabtitle || 'Testing',			isclosable : true,			autoload : false,			loadurl : config.loadurl || 'data.json.php',			loadparams : {}		}	}];}