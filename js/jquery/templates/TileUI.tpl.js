/**
 *	@template Tiles
**/
FireSpark.jquery.template.Tiles = $.template('\
	<div id="">\
		<p class="tilehead">${tilehead}</p>\
		<p>\
			{{each tiles}}\
				{{if FireSpark.core.helper.equals(tpl, true)}}\
					{{tmpl tpl}}\
				{{else}}\
				<a href="#showtile:ins=${instance}:tile=${tile}" class="navigate tile ${style}">${name}</a>\
				{{/if}}\
			{{/each}}\
			{{if FireSpark.core.helper.equals(close, true)}}\
			<a href="#close:ins=${instance}" class="navigate tile close">Close</a>\
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
		<span></span>{{tmpl $value.tiletpl}}\
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
