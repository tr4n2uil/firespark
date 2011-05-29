/**
 *	TemplateUI renderer
 *
 *	@param loadurl string
 *	@param loadparams object
 *
**/
ServiceClient.extjs.renderer.TemplateUI = function(params){
	var loadurl = params.loadurl;
	var loadparams = params.loadparams;
	
	/**
	 * @param view View
	 * @param template Template
	**/
	this.render = function(memory){
		memory.view.dom.innerHTML = '<p>Loading ...</p>';
		Ext.Ajax.request({
			url: loadurl,
			params: loadparams,
			success : function(response){
				var data = Ext.decode(response.responseText);
				memory.template.overwrite(memory.view, data);
				memory.view.fadeIn({ 
					duration: 1,
					easing: 'easeBoth'
				});
			},
			failure : function(response){
				memory.view.dom.innerHTML = '<p>The requested resource could not be loaded</p>';
			}
		});
	}
}
