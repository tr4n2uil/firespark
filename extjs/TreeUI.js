TreeUI = function (container, url, roottext, rooticoncls, tabui, tm, cm){
	this.url = url;
	this.roottext = roottext;
	this.rooticoncls = rooticoncls;
	this.container = container;
	this.tabui = tabui;
	this.tm = tm;
	this.cm = cm;

	this.treeloader = null;
	this.rootnode = null;
	this.tree = null;
	this.filter = null;
	this.menuitems = null;
	
	this.init = function(){
		this.treeLoader = new Ext.tree.TreeLoader({
			dataUrl: this.url
		});
				
		this.rootnode = new Ext.tree.AsyncTreeNode({
			text: this.roottext,
			id: '/',
			iconCls: this.rooticoncls
		});
		
		this.menuitems = [
			new Ext.form.TextField({
				emptyText: 'Filter Tree ...',
				enableKeyEvents: true,
				listeners:{
					keydown: {
						fn: function(t,e){
							var text = t.getValue();
							this.filterTree(text);
						},
						buffer: 350,
						scope: this
					}
				}
			}),
			{
				iconCls: 'icon-expand-all',
				tooltip: 'Expand All',
				handler: function(){ this.rootnode.expand(true); },
				scope: this
			}, {
				iconCls: 'icon-collapse-all',
				tooltip: 'Collapse All',
				handler: function(){ this.rootnode.collapse(true); },
				scope: this
			}, '-'
		];
		
		this.tree = new Ext.tree.TreePanel({ 
			renderTo: this.container,
			border: false,
			useArrows: true,
			autoScroll: true,
			loader: this.treeLoader,
			root: this.rootnode,
			listeners: {
				'render': function(tp){
					tp.getSelectionModel().on('selectionchange', function(tree, node){
						switch(node.attributes.tabtype)
						{
							case 'tpltab' :
							{
								var newtab = tabui.createRawTab(node.attributes.text, node.attributes.iconCls, true);
								var tpl = tm.get(node.attributes.tplindex);
								var card = new CardUI(newtab.body, tpl, node.attributes.tabhref);
								break;
							}
							case 'comptab' :
							{
								var newtab = tabui.createRawTab(node.attributes.text, node.attributes.iconCls, true);
								var f = cm.get(node.attributes.compindex);
								var cmp = new f(newtab.body, node.attributes.compurl);
								newtab.body.fadeIn({ 
									duration: 1,
									easing: 'easeBoth'
								});
								break;
							}
							case 'urltab' :
							{
								var newtab = tabui.createURLTab(node.attributes.text, node.attributes.tabhref, node.attributes.iconCls, true);
								break;
							}
						}
					})
				}
			}
		});
		
		this.filter = new Ext.tree.TreeFilter(this.tree,  {
            clearBlank: true,
			autoClear: true
        });
		
		this.rootnode.expand();
	}
	
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
		//this.filter.filter(text, 'text', this.rootnode);
	}
	
	this.init();
}	