/**
 * ElementView view
 *
 * @param elementid string
 *
 *	@return view object
 *
**/
ServiceClient.jquery.view.ElementView = {
	run : function(message, memory){
		memory.view = $(message.elementid);
		return true;
	}
};
