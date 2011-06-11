ServiceClient.jquery.template.Test = $.template('\
	{{each data}}\
		<p class="abc">Name: ${$value.name}</p>\
		<p>Time: ${$value.time}</p>\
	{{/each}}');

