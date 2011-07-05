/**
 *	@service ElementContent
 *	@desc Fills element with content and animates it and returns element in memory
 *
 *	@param element string [message|memory]
 *	@param data html/text [message|memory] optional default ''
 *	@param animation string [message] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout')
 *	@param duration integer [message] optional default 1000
 *	@param delay integer [message] optional default 0
 *
 *	@return element element [memory]
 *
**/
FireSpark.jquery.service.ElementContent = {
	run : function(message, memory){
		if(message.element || false){
			var element = $(message.element);
		}
		else {
			var element = memory.element;
		}
		
		var animation = message.animation || 'fadein';
		var duration = message.duration || 1000;
		
		if(animation == 'fadein' || animation == 'slidein'){
			element.hide();
		}
		
		element.html(message.data || memory.data || '');
		element.delay(message.delay || 0);
		
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
		
		memory.element = element;
		
		return true;
	}
};
