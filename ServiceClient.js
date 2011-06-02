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
