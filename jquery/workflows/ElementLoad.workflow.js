/**
 *	@service ElementContent
 *
 *	@param selector string [message]
 *	@param data html/text [message|memory] optional default ''
 *	@param animation string [message] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout')
 *	@param duration integer [message] optional default 1000
 *	@param delay integer [message] optional default 0
 *
**/
ServiceClient.jquery.renderer.ElementContent = {
	run : function(message, memory){
		var element = $(message.selector);
		element.hide()
		element.html(message.data || memory.data || '');
		element.delay(message.delay || 0);
		
		var animation = message.animation || 'fadein';
		var duration = message.duration || 1000;
		
		switch(animation){
			case 'fadein' :
				element.fadeIn(duration);
				break;
			case 'fadeout' :
				element.fadeOut(duration);
				break;
			case 'slidein' :
				element.slideIn(duration);
				break;
			case 'slideout' :
				element.slideOut(duration);
				break;
			default :
				element.html('Animation type not supported').fadeIn(duration);
				break;
		}
		
		return true;
	}
};
