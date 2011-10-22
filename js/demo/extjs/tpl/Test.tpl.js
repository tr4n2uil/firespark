TestTemplate = (function(){
	var tpl =new Ext.XTemplate( '<p id="abc">Name: {name}</p>'
						+'<p>Time: {time}</p>' );
	tpl.compile();
	return tpl;
})();
