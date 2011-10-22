/**
 *	@template Default
**/
FireSpark.jquery.template.Default = $.template('\
	<p class="{{if valid}}success{{else}}error{{/if}}">${msg}</p>\
');

FireSpark.Registry.save('tpl-default', FireSpark.jquery.template.Default);
