/** *	NavigatorInit module * *	@param selector string *	@param event string *	@param attribute string ***/ServiceClient.jquery.module.NavigatorInit = {	run : function(message, memory){		var result = $(message.selector);		result.live(message.event || 'click', function(){			ServiceClient.Kernel.navigate($(this).attr(message.attribute));			return false;		});		return true;	}};