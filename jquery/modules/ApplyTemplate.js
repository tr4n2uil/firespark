/**
 *	ApplyTemplate module
 *
 *	@param template Template [memory]
 *	@param data object [memory|message]
 *
 *	@return data html
 *
**/
ServiceClient.jquery.module.ApplyTemplate = {
	run : function(message, memory){
		memory.data = $.tmpl(memory.tpl || message.template, memory.data || message.data);
		return true;
	}
};
