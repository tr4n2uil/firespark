var TestTemplate = (function(){
	var tpl = $.template('{{each data}}<p class="abc">Name: ${$value.name}</p>'
						+'<p>Time: ${$value.time}</p>{{/each}}' );
	return tpl;
})();
