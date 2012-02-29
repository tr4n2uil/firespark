/**
 *	@template Default
**/
FireSpark.ui.template.Default = $.template('\
	<span class="{{if valid}}success{{else}}error{{/if}}">{{html msg}}</span>\
	<span class="hidden">${details}</span>\
');

Snowblozm.Registry.save('tpl-default', FireSpark.ui.template.Default);
