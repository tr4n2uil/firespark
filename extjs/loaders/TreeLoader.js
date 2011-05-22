ServiceClient.extjs.loader.TreeLoader = function(){
	this.load = function(config){
		var treeLoader = new Ext.tree.TreeLoader({
			dataUrl: config.tloadurl
		});
		return treeLoader;
	}
}
