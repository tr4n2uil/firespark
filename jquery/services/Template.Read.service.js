/**
 *	@service TemplateRead
 *	@desc Reads template definition into memory
 *
 *	@param data.template string [memory]
 *	@param template string [message]
 *
 *	@param template template [memory]
 *
**/
FireSpark.jquery.service.TemplateRead = {
	run : function(message, memory){
		if(memory.data.template || false){
			memory.template = $.template(memory.data.template);
		}
		else {
			memory.template = FireSpark.Registry.get(message.template);
		}
		return true;
	}
};
