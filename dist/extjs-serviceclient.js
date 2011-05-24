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
ServiceClient.extjs = {};

ServiceClient.extjs.view = {};
ServiceClient.extjs.loader = {};
ServiceClient.extjs.renderer = {};
ServiceClient.extjs.template = {};
ServiceClient.extjs.view.ElementView = function(){
	this.getView = function(params){
		return Ext.get(params.elementid);
	}
}
ServiceClient.extjs.view.TabView = function(config){
	var tabpanel = new Ext.TabPanel({
		renderTo: config.container,
		border: config.border,	//false
		resizeTabs: true,
		minTabWidth: 115,
		tabWidth: 135,
		enableTabScroll: true,
		plain: config.plain,		//true
		defaults: {
			autoScroll: true,
			autoHeight: config.autoHeight		//true
		},
		//plugins: new Ext.ux.TabCloseMenu(),
	});

	this.getView = function(params){
		var tabconfig = {
			title: params.tabtitle,
			iconCls: params.tabcls,
			closable: params.isclosable,
			autoScroll: true,
		};
		if(params.autoload){
				tabconfig.autoLoad = {
					url: params.taburl
				};
		}
		var newtab = tabpanel.add(tabconfig);
		newtab.show();
		return newtab.body;
	}
}
ServiceClient.extjs.renderer.TemplateRenderer = function(){

	var CardUI = function(params){
		this.loadurl = params.loadurl;
		this.params = params.loadparams;
		
		this.render = function(memory){
			Ext.Ajax.request({
				url: this.loadurl,
				params: this.loadparams,
				success : function(response){
					var data = Ext.decode(response.responseText);
					memory.template.overwrite(memory.view, data);
					memory.view.fadeIn({ 
						duration: 1,
						easing: 'easeBoth'
					});
				},
				failure : function(response){
				
				}
			});
		}
	}

	this.getRenderer = function(params){
		return new CardUI(params);
	}
}
ServiceClient.extjs.renderer.TreeRenderer = function(){
	var TreeUI = function(params){
		this.tree = null;
		this.border = params.border;
		this.useArrows = params.useArrows;
		
		this.rootnode = new Ext.tree.AsyncTreeNode({
			text: params.roottext,
			id: params.rootid,
			iconCls: params.rooticoncls
		});
		
		this.treeLoader = new Ext.tree.TreeLoader({
			dataUrl: params.loadurl
		});
		
		this.filter = new Ext.tree.TreeFilter(this.tree,  {
            clearBlank: true,
			autoClear: true
        });
		
		this.filterTree = function(text){
			this.tree.expandAll();
			if(!text){
				this.filter.clear();
				return;
			}
			var re = new RegExp('^' + Ext.escapeRe(text), 'i');
			this.filter.filterBy(function(n){
				return !n.attributes.leaf || re.test(n.text);
			}, this);
		}
		
		this.menuitems = [
			new Ext.form.TextField({
				emptyText: 'Filter Tree ...',
				enableKeyEvents: true,
				listeners:{
					keydown: {
						fn: function(t,e){
							var text = t.getValue();
							filterTree(text);
						},
						buffer: 350
					}
				}
			}),
			{
				iconCls: 'icon-expand-all',
				tooltip: 'Expand/Collapse All',
				enableToggle: true,
				toggleHandler: function(item, pressed){
					if(pressed === true)
						this.rootnode.expand(true);
					else
						this.rootnode.collapse(true);
				},
				pressed: false,
				scope: this
			}
		];
		
		this.render = function(memory){
			this.tree = new Ext.tree.TreePanel({
				renderTo: memory.view,
				border: this.border, 		//false
				useArrows: this.useArrows,		//true
				autoScroll: true,
				loader: this.treeLoader,
				root: this.rootnode,
				listeners: {
					'render': function(tp){
						tp.getSelectionModel().on('selectionchange', function(tree, node){
							switch(node.attributes.type){
								case 'service' :
									ServiceClient.client.Kernel.start(node.attributes.service);
									break;
								default : break;
							}
						});
					}
				}
			});
			this.rootnode.expand();
		}
	}
	
	this.getRenderer = function(params){
		return new TreeUI(params);
	}
	
}
