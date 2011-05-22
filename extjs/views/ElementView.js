ServiceClient.extjs.view.ElementView = function(){
	this.getView = function(config){
		return Ext.get(config.elid);
	}
}
