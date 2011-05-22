TestTemplate = function(){
	var tpl =new Ext.XTemplate( '<p id="abc">Name: {name}</p>'
						+'<p>Time: {city}, {time}</p>' );
	tpl.compile();
			
	this.getTemplate = function(config){
		return tpl;
	}
}