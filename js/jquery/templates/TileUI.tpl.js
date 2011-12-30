/**
 *	@template Tiles
**/
FireSpark.jquery.template.Tiles = $.template('\
	<div id="{tilesid}">\
		<p class="tilehead">${tilehead}</p>\
		<p>\
			{{each tiles}}\
				{{if tpl}}\
					{{tmpl tpl}}\
				{{else}}\
				<a href="#showtile:key=${key}:ins=#${instance}:tile=${tile}" class="navigate tile ${style}">${name}</a>\
				{{/if}}\
			{{/each}}\
			{{if close}}\
			<a href="#close:key=${key}:ins=#${instance}" class="navigate tile close">Close</a>\
			{{/if}}\
		</p>\
	</div>\
');

Snowblozm.Registry.save('tpl-tiles', FireSpark.jquery.template.Tiles);

/**
 *	@template Bands
**/
FireSpark.jquery.template.Bands = $.template('\
	{{each tiles}}\
		{{tmpl tiletpl}}\
	{{/each}}\
');

Snowblozm.Registry.save('tpl-bands', FireSpark.jquery.template.Bands);

/**
 *	@template Container
**/
FireSpark.jquery.template.Container = $.template('\
	<div class="tiles"></div>\
	{{if inline}}<div class="bands"></div>{{/if}}\
');

Snowblozm.Registry.save('tpl-container', FireSpark.jquery.template.Container);
