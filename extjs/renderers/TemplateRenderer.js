ServiceClient.extjs.renderer.TemplateRenderer = function(){

	var CardUI = function(params){
		this.loadurl = params.loadurl;
		this.params = params.loadparams;
		
		this.render = function(memory){
			Ext.Ajax.request({
				url: this.loadurl,
				params: this.loadparams,
				success : function(response){
					var data = Ext.decode(response.responseText);
					memory.template.overwrite(memory.view, data);
					memory.view.fadeIn({ 
						duration: 1,
						easing: 'easeBoth'
					});
				},
				failure : function(response){
				
				}
			});
		}
	}

	this.getRenderer = function(params){
		return new CardUI(params);
	}
}
