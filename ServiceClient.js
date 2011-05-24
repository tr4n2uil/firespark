var ServiceClient = {};

ServiceClient.client = {};

/*
*	Kernel manages the following client tasks if required
*		initializes the view into memory
*		initializes the template into memory
*		initializes the renderer
*		calls render method of renderer which can access the view and/or template initialized in memory
*/
ServiceClient.client.Kernel = (function(){
	/* 
	*	views are factories/containers that generates the element where the output must be rendered 
	*	interface ViewFactory {
	*		function getView(object params);
	*	}
	*/
	var views = new Array();
	
	/* 
	*	templates are factories of compiled html that is fed with data from the server and rendered to the view 
	*	interface TemplateFactory {
	*		function getTemplate(object params);
	*	}
	*/
	var templates = new Array();
	
	/* 
	*	renderers are output generators that use the view, template and loader to display the content appropriately 
	*	interface RendererFactory {
	*		function getRenderer(object params);
	*	}
	*
	*	render used by the kernel
	*	interface Renderer {
	*		function render(object memory);
	*	}
	*/
	var renderers = new Array();
	
	return {
		/*
		*	add a viewfactory with index
		*/
		addView : function(index, view){
			views[index] = view;
		},
		
		/*
		*	add a templatefactory with index
		*/
		addTemplate : function(index, template){
			templates[index] = template;
		},
		
		/*
		*	add a rendererfactory with index
		*/
		addRenderer : function(index, renderer){
			renderers[index] = renderer;
		},
		
		/* 
		*	starts the kernel to do the task defined by the config and returns the renderer initialized
		*/
		start : function(config){
			var task = config.task;
			var params = config.params;
			var memory = {};
			
			if(task.view !== false){
				memory.view = views[task.view].getView(params);
			}
				
			if(task.template !== false){
				memory.template = templates[task.template].getTemplate(params);
			}
			
			if(task.renderer !== false){
				var renderer = renderers[task.renderer].getRenderer(params);
				renderer.render(memory);
			}
			
			return renderer;
		}
	};
})();
