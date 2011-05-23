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
