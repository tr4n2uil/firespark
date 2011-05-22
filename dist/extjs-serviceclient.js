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

	this.getView = function(config){
		var tabconfig = {
			title: config.tabtitle,
			iconCls: config.tabcls,
			closable: config.isclosable,
			autoScroll: true,
		};
		if(config.autoload){
				tabconfig.autoLoad = {
					url: config.taburl
				};
		}
		var newtab = tabpanel.add(tabconfig);
		newtab.show();
		return newtab.body;
	}
}
ServiceClient.extjs.loader.TreeLoader = function(){
	this.load = function(config){
		var treeLoader = new Ext.tree.TreeLoader({
			dataUrl: config.tloadurl
		});
		return treeLoader;
	}
}
ServiceClient.extjs.renderer.TemplateRenderer = function(){

	var CardUI = function(body, tpl, url){
		this.tpl = tpl;
		this.datastore = null;
		this.url = url;
		this.body = body;
	
		this.load = function() {
			this.body.dom.innerHTML = "Loading ...";
			this.datastore.load();
		}
		
		this.init = function(){
			this.datastore = new Ext.data.JsonStore({ 
				url : this.url,
				listeners: {
					load: {
						fn : function(store, records, options){
							this.tpl.overwrite(this.body, this.datastore.getAt(0).data);
							this.body.fadeIn({ 
								duration: 1,
								easing: 'easeBoth'
							});
						},
						scope: this
					}
				}
			});
			this.load();
		}
		this.init();
	}
	
	this.render = function(config){
		var view = config.sccontainer;
		var template = config.sctpl;
		var turl = config.trurl;
		
		new CardUI(view, template, turl);
	}
}
ServiceClient.extjs.renderer.TreeRenderer = function(){

	this.render = function(config){
		var rootnode = new Ext.tree.AsyncTreeNode({
			text: config.roottext,
			id: config.rootid,
			iconCls: config.rooticoncls
		});
		
		var tree = new Ext.tree.TreePanel({ 
			renderTo: config.sccontainer,
			border: config.trborder, 		//false
			useArrows: config.trusearrows,		//true
			autoScroll: true,
			loader: config.scdataloader,
			root: rootnode,
			listeners: {
				'render': function(tp){
					tp.getSelectionModel().on('selectionchange', function(tree, node){
						switch(node.attributes.type){
							case 'service' :
								sckernel.start(node.attributes.service);
								break;
							default : break;
						}
					});
				}
			}
		});
		rootnode.expand();
		
		var filter = new Ext.tree.TreeFilter(this.tree,  {
            clearBlank: true,
			autoClear: true
        });
		
		var filterTree = function(text){
			tree.expandAll();
			if(!text){
				filter.clear();
				return;
			}
			var re = new RegExp('^' + Ext.escapeRe(text), 'i');
			filter.filterBy(function(n){
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
				tooltip: 'Expand All',
				handler: function(){ 
					rootnode.expand(true); 
				}
			}, {
				iconCls: 'icon-collapse-all',
				tooltip: 'Collapse All',
				handler: function(){ 
					rootnode.collapse(true); 
				}
			}, '-'
		];
	}
}
