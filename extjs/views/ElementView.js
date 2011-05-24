ServiceClient.extjs.view.ElementView = function(){
	this.getView = function(params){
		return Ext.get(params.elementid);
	}
}
