TestTemplate = (function(){
	var tpl = $.template( '<p id="abc">Name: ${name}</p>'
						+'<p>Time: ${time}</p>' );
	tpl.compile();
	return tpl;
})();
