/**
 *	TabUIAdd view
 *
 *	@param tabui string
 *  @param tabtitle string
 *  @param autoload boolean
 *  @param taburl string
 *
 *	@return view View
 *
**/
ServiceClient.jquery.view.TabUIAdd = {
	run : function(message, memory){
		var tabui = ServiceClient.Registry.get(message.tabui);
		memory.view = tabui.add(message.tabtitle, message.autoload || false, message.taburl || false);
		return true;
	}
};
