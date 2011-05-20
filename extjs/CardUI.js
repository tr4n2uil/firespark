// CardUI Class for general pupose client side templating
function CardUI(body, tpl, url) {

	// template
	this.tpl = tpl;
	
	// datastore
	this.datastore = null;
	this.url = url;
	
	// element reference
	this.body = body;
	
	// load the contents
	this.load = function() {
		this.body.dom.innerHTML = "Loading ...";
		this.datastore.load();
	}
	
	// initialize the card and load the contents
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