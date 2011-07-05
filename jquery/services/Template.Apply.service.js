/**
 *	@service TemplateApply
 *	@desc Applies template
 *
 *	@param template Template [message|memory]
 *	@param data object [message|memory]
 *
 *	@return data html [memory]
 *
**/
FireSpark.jquery.service.TemplateApply = {
	run : function(message, memory){
		memory.data = $.tmpl(message.template || memory.template, message.data || memory.data);
		return true;
	}
};
