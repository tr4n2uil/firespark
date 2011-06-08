/**
 *	ContentUI renderer
 *
 *	@param template Template
 *
 *	@param data html/text
 *
**/
ServiceClient.jquery.renderer.ContentUI = {
	run : function(message, memory){
		memory.view.hide();
		memory.view.html(memory.data)
		memory.view.fadeIn(1000);
		return true;
	}
};
