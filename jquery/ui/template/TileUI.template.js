/**
 *	@template Tiles
**/
FireSpark.ui.template.Tiles = $.template('\
	<ul class="hover-menu horizontal tls-${key}-${id}">\
		<span class="tilehead">\
			${tilehead}\
			{{if FireSpark.core.helper.dataEquals(close, true)}}\
				<a class="launch close hover" href="#/close/${key}/${id}/${ins}" title="Close"></a>\
			{{/if}}\
		</span>\
		{{each tiles}}\
		<li>\
			{{if FireSpark.core.helper.dataEquals(!privileged || (privileged && admin), true)}}\
				{{if tpl}}\
					{{tmpl tpl}}\
				{{else urlhash}}\
					<a href="${urlhash}" class="navigate tile ${style}">${name}</a>\
				{{else}}\
					<a href="!/view/${tile}-${id}" class="navigate tile ${style}">${name}</a>\
				{{/if}}\
			{{/if}}\
		</li>\
		{{/each}}\
	</ul>\
');

Snowblozm.Registry.save('tpl-tiles', FireSpark.ui.template.Tiles);

/**
 *	@template Bands
**/
FireSpark.ui.template.Bands = $.template('\
	{{each tiles}}\
		<span></span>\
		{{if $value.tiletpl}}\
			{{tmpl $value.tiletpl}}\
		{{/if}}\
	{{/each}}\
');

Snowblozm.Registry.save('tpl-bands', FireSpark.ui.template.Bands);

/**
 *	@template Container
**/
FireSpark.ui.template.Container = $.template('\
	<div class="tiles"></div>\
	{{if inline}}<div class="bands"></div>{{/if}}\
');

Snowblozm.Registry.save('tpl-container', FireSpark.ui.template.Container);
