FireSpark.jquery.template.Test = $.template('\
	{{if valid}}\
	{{each data}}\
		<p class="abc">Name: ${$value.name}</p>\
		<p>Time: ${$value.time}</p>\
	{{/each}}\
	{{else}}\
	<p class="error">${msg}</p>\
	{{/if}}');

