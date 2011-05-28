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
		 *  ViewGenerators
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
ServiceClient.extjs = {};

ServiceClient.extjs.view = {};
ServiceClient.extjs.module = {};
ServiceClient.extjs.renderer = {};
/**
 * ElementView view
 *
 * @param elementid string
**/
ServiceClient.extjs.view.ElementView = (function(){
	return {
		getView : function(params){
			return Ext.get(params.elementid);
		}
	};
})();
/**
 *	TabUI renderer and view generator
 *
 *	@param border boolean
 *	@param plain boolean
 *  @param autoHeight boolean
 *
**/
ServiceClient.extjs.view.TabUI = function(params){
	var options = {
		border : params.border,				//false
		resizeTabs : true,
		minTabWidth : 115,
		tabWidth : 135,
		enableTabScroll : true,
		plain : params.plain,						//true
		defaults : {
			autoScroll: true,
			autoHeight: params.autoHeight	//true
		}
		//plugins : new Ext.ux.TabMenu();
	};
	
	/**
	 * @param view View
	**/
	this.render = function(memory){
		options.renderTo = memory.view;
		this.tabpanel = new Ext.TabPanel(options);
	}
	
	/**
	 *  @param tabtitle string
	 *  @param tabiconcls css class
	 *  @param tabclosable boolean
	 *  @param autoload boolean
	 *  @param taburl string
	**/
	this.getView = function(params){
		var tabconfig = {
			title: params.tabtitle,
			iconCls: params.tabiconcls,
			closable: params.isclosable,
			autoScroll: true,
		};
		if(params.autoload){
				tabconfig.autoLoad = {
					url: params.taburl
				};
		}
		var newtab = this.tabpanel.add(tabconfig);
		newtab.show();
		return newtab.body;
	}
}
/**
 *	AccountForm renderer
 *
 *	@param submiturl string
 *	@param frame boolean
 *	@param title string
 *	@param bodyStyle css
 * @param formStyle css
 * @param formType ('Login'|'Register'|'Reset')
 *
**/
ServiceClient.extjs.renderer.AccountForm = function(params){
	this.config = {};
	this.config.url = params.submiturl;
	this.config.frame = params.frame;
	this.config.title = params.title;
	this.config.bodyStyle = params.bodyStyle;
	this.config.style = params.formStyle;
	this.formType = params.formType;
		
	switch(this.formType){
		case 'Login' : 
			this.config.items = [{
					fieldLabel: 'Username',
					name: 'username',
					allowBlank: false,
					vtype: 'alphanum'
				},{
					fieldLabel: 'Password',
					inputType: 'password',
					name: 'password',
					allowBlank: false,
					vtype: 'alphanum'
				}
			];
			break;
		case 'Register' :
		case 'Reset' :
			this.config.items = [{
					fieldLabel: 'Username',
					name: 'username',
					allowBlank: false,
					vtype: 'alphanum'
				},{
					fieldLabel: 'Email',
					name: 'email',
					allowBlank: false,
					vtype: 'email'
				}
			];
			break;
		default :
			break;
	}
	
	/**
	 *	@param view View
	**/
	this.render = function(memory){
		this.config.labelWidth = 75;
		this.config.width = 250;
		this.config.renderTo = memory.view;
		this.config.defaultType = 'textfield';
		this.config.buttons = [{
			text: this.formType,
			handler: function(btn){
				btn.disable();
				this.form.body.mask('Loading...', 'x-mask-loading');
				this.form.getForm().submit({
					success: function(f,a){
						this.form.body.unmask();
						ServiceClient.client.Kernel.run(a.result.msg);
					},
					failure: function(f, a){
						btn.enable();
						this.form.body.unmask();
						if (a.failureType === Ext.form.Action.CONNECT_FAILURE)
							Ext.Msg.alert("Error", "Please check your internet connection");
						else if (a.failureType === Ext.form.Action.SERVER_INVALID)
							Ext.Msg.alert("Error", a.result.msg);
						else
							Ext.Msg.alert("Error", "An error occured while sending request and/or reading response.");
					},
					scope : this
				});
			},
			scope:this
		},{
			text: 'Cancel',
			handler: function(){
				this.form.getForm().reset();
			},
			scope: this
		}];
	
		this.form = new Ext.FormPanel(this.config);
		memory.view.fadeIn({ 
			duration: 1,
			easing: 'easeBoth'
		});
	}
}
/**
 *	TemplateUI renderer
 *
 *	@param loadurl string
 *	@param loadparams object
 *
**/
ServiceClient.extjs.renderer.TemplateUI = function(params){
	var loadurl = params.loadurl;
	var loadparams = params.loadparams;
	
	/**
	 * @param view View
	 * @param template Template
	**/
	this.render = function(memory){
		memory.view.dom.innerHTML = '<p>Loading ...</p>';
		Ext.Ajax.request({
			url: loadurl,
			params: loadparams,
			success : function(response){
				var data = Ext.decode(response.responseText);
				memory.template.overwrite(memory.view, data);
				memory.view.fadeIn({ 
					duration: 1,
					easing: 'easeBoth'
				});
			},
			failure : function(response){
				memory.view.dom.innerHTML = "<p>The requested resource could not be loaded</p>";
			}
		});
	}
}
/**
 *	TreeUI renderer
 *
 *	@param border boolean
 *	@param useArrows boolean
 *	@param roottext string
 *	@param rootid string
 * 	@param rooticoncls css class
 * 	@param loadurl string
 *
**/
ServiceClient.extjs.renderer.TreeUI = function(params){
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
		
	/**
	 * @param view View
	**/
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
							case 'paint' :
								ServiceClient.client.Kernel.paint(node.attributes.paint);
								break;
							case 'run' :
								ServiceClient.client.Kernel.run(node.attributes.run)
							default : break;
						}
					});
				}
			}
		});
		this.rootnode.expand();
	}
}/** *	Alert module * *	@param title string *	@param data content (text/html) ***/ServiceClient.extjs.module.Alert = (function(){	return {		execute : function(args){			Ext.Msg.alert(args.title, args.data);		}	};})();