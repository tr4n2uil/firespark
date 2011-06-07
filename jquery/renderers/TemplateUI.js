/**
 *	TemplateUI renderer
 *
 *	@param template Template
 *
 *	@param data object
 *
**/
ServiceClient.jquery.renderer.TemplateUI = {
	run : function(message, memory){
		memory.view.hide();
		memory.view.html($.tmpl(message.template, memory.data))
		memory.view.fadeIn(1000);
		return true;
	}
};
