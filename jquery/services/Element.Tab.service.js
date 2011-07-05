/**
 *	@service ElementTab
 *	@desc Creates a new tab and returns the element
 *
 *	@param tabui string [message]
 *  @param tabtitle string [message]
 *  @param autoload boolean [message] optional default false
 *  @param taburl string [message] optional default false
 *
 *	@return element Element [memory]
 *
**/
FireSpark.jquery.service.ElementTab = {
	run : function(message, memory){
		var tabui = FireSpark.Registry.get(message.tabui);
		memory.element = tabui.add(message.tabtitle, message.autoload || false, message.taburl || false);
		return true;
	}
};
