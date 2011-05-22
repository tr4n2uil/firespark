ServiceClient.extjs.renderer.TemplateRenderer = function(){

	var CardUI = function(body, tpl, url){
		this.tpl = tpl;
		this.datastore = null;
		this.url = url;
		this.body = body;
	
		this.load = function() {
			this.body.dom.innerHTML = "Loading ...";
			this.datastore.load();
		}
		
		this.init = function(){
			this.datastore = new Ext.data.JsonStore({ 
				url : this.url,
				listeners: {
					load: {
						fn : function(store, records, options){
							this.tpl.overwrite(this.body, this.datastore.getAt(0).data);
							this.body.fadeIn({ 
								duration: 1,
								easing: 'easeBoth'
							});
						},
						scope: this
					}
				}
			});
			this.load();
		}
		this.init();
	}
	
	this.render = function(config){
		var view = config.sccontainer;
		var template = config.sctpl;
		var turl = config.trurl;
		
		new CardUI(view, template, turl);
	}
}
