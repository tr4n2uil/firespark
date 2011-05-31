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
	 *	renderers are output generators that use the view and optional template to display the content appropriately 
	 *	interface Renderer {
	 *		function render(object memory);
	 *	}
	**/
	var renderers = new Array();
	
	/**
	 *	modules are generic operations 
	 *	interface Module {
	 *		function execute(object args);
	 *	}
	**/
	var modules = new Array();
	
	return {
		/**
		 *	Registry manages references to
		 * 	ViewGenerators
		 *	Templates
		 *	Renderers
		 *	Modules
		**/
		Registry : {
			/**
			 *	adds a ViewGenerator with index
			**/
			addView : function(index, view){
				views[index] = view;
			},
			
			/**
			 *	adds a template with index
			**/
			addTemplate : function(index, template){
				templates[index] = template;
			},
			
			/**
			 *	adds a renderer with index
			**/
			addRenderer : function(index, renderer){
				renderers[index] = renderer;
			},
			
			/**
			 *	adds a module with index
			**/
			addModule : function(index, module){
				modules[index] = module;
			}
		},
		/**
		 *	Kernel manages the following client tasks when required
		 *		initializes the view into memory
		 *		initializes the template into memory
		 *		instantiates the renderer
		 *		calls render method of renderer which can access the view and/or template initialized in memory
		 *		executes modules
		**/
		Kernel : {
			/**
			 *	paints the view using the renderer with optional template
			**/
			paint : function(config){
				var task = config.task;
				var params = config.params;
				var memory = {};
				
				if(task.view !== false){
					memory.view = views[task.view].getView(params);
				}
					
				if(task.template !== false){
					memory.template = templates[task.template];
				}
				
				if(task.renderer !== false){
					var renderer = new (renderers[task.renderer])(params);
					renderer.render(memory);
					return renderer;
				}
				
				return renderer;
			},
			
			/** 
			 *	starts the kernel to execute the module after instantiation
			**/
			run : function(config){
				return modules[config.module].execute(config.args);
			}
		}
	};
})();
ServiceClient.jquery = {};

ServiceClient.jquery.view = {};
ServiceClient.jquery.module = {};
ServiceClient.jquery.renderer = {};
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
				if(data.service||false)
					ServiceClient.client.Kernel.run(data.service);
			},
			error : function(request, status, error){
				memory.view.html('<p>The requested resource could not be loaded</p>');
			}
		});
	}
}
/** *	Alert module * *	@param title string *	@param data content (text/html) ***/ServiceClient.jquery.module.Alert = (function(){	return {		execute : function(args){			alert(args.title + " : " + args.data);		}	};})();