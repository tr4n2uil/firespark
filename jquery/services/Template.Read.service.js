/**
 *	@service TemplateRead
 *	@desc Reads template definition into memory
 *
 *	@param data.template string [memory]
 *	@param template string [message] optional default FireSpark.jquery.template.Default
 *
 *	@param template template [memory]
 *
**/
FireSpark.jquery.service.TemplateRead = {
	run : function(message, memory){
		if((memory.data && memory.data.template) || false){
			memory.template = $.template(memory.data.template);
		}
		else if(message.template || false){
			memory.template = FireSpark.Registry.get(message.template);
		}
		else{
			memory.template = FireSpark.jquery.template.Default;
		}
		
		return true;
	}
};
