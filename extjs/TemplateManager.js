TemplateManager = function(){
	this.tpls = null;
					
	this.init = function(){
		this.tpls = new Array();
					
		var testtpl = function(){
			this.tpl =new Ext.XTemplate( '<p id="abc">Name: {name}</p>'
						+ '<p>Company: {company}</p>'
						+'<p>Location: {city}, {state}</p>' );
			this.tpl.compile();
			
			this.get = function(){
				return this.tpl;
			}
		}
			
		this.tpls['test'] = new testtpl;
	}
	
	this.add = function(index, tpl){
		this.tpls[index] = tpl;
	}
					
	this.get = function(index){
		return this.tpls[index].get();
	}
					
	this.init();
}
