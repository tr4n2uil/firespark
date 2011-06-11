/**
 *	ApplyTemplate module
 *
 *	@param template Template
 *
 *	@param data object
 *
**/
ServiceClient.jquery.module.ApplyTemplate = {
	run : function(message, memory){
		memory.data = $.tmpl(message.template, memory.data || message.data);
		return true;
	}
};
