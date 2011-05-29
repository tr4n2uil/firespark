/**
 * ElementView view
 *
 * @param elementid string
**/
ServiceClient.jquery.view.ElementView = (function(){
	return {
		getView : function(params){
			return $(params.elementid);
		}
	};
})();
