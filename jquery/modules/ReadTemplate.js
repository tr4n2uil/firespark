/**
 *	ReadTemplate module
 *
 *	@param data.template string [memory]
 *	@param tpl string [message]
 *
 *	@param tpl template
 *
**/
ServiceClient.jquery.module.ReadTemplate = {
	run : function(message, memory){
		if(memory.data.template || false){
			memory.tpl = $.template(memory.data.template);
		}
		else {
			memory.tpl = ServiceClient.Registry.get(message.tpl);
		}
		return true;
	}
};
