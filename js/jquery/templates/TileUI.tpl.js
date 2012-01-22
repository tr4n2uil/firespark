/**
 *	@template Tiles
**/
FireSpark.jquery.template.Tiles = $.template('\
	<ul class="hover-menu horizontal tls-${key}-${id}">\
		<span class="tilehead">${tilehead}</span>\
		{{each tiles}}\
		<li>\
			{{if FireSpark.core.helper.equals(!privileged || (privileged && admin), true)}}\
				{{if FireSpark.core.helper.equals(tpl, true)}}\
					{{tmpl tpl}}\
				{{else urlhash}}\
					<a href="${urlhash}" class="navigate tile ${style}">${name}</a>\
				{{else}}\
					<a href="#showtile:ins=${instance}:tile=${tile}-${id}" class="navigate tile ${style}">${name}</a>\
				{{/if}}\
			{{/if}}\
		</li>\
		{{/each}}\
		{{if FireSpark.core.helper.equals(close, true)}}\
			<li><a href="#close:ins=${instance}" class="navigate tile close">Close</a></li>\
		{{/if}}\
		</li>\
	</ul>\
');

Snowblozm.Registry.save('tpl-tiles', FireSpark.jquery.template.Tiles);

/**
 *	@template Bands
**/
FireSpark.jquery.template.Bands = $.template('\
	{{each tiles}}\
		<span></span>\
		{{if $value.tiletpl}}\
			{{tmpl $value.tiletpl}}\
		{{/if}}\
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
