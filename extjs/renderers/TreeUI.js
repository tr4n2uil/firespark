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
}