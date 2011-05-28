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
