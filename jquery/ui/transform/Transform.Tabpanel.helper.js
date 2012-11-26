/**
 *	@helper TransformTabpanel
 *
 *	@param element
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.helper.transformTabpanel = function($element, $config){
	$element.hide();
	
	var $tab = new Array();
	var $index = $config['indexstart'];
	
	var $options = {
		cache : $config['cache'],
		collapsible : $config['collapsible'],
		event : $config['event'],
		tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>",
		add: function($event, $ui) {
			$tab[$index] = $($ui.panel);
		}
	};
	
	if($config['tablink']){
		$options.load = function($event, $ui) {
			$('a', $ui.panel).click(function() {
				$($ui.panel).load(this.href);
				return false;
			});
		}
	}
	
	var $tabpanel = $element.tabs($options);
	$element.fadeIn(1000);
	
	$('.ui-icon-close').live( "click", function() {
		var $indx = $("li", $tabpanel).index($(this).parent());
		$tabpanel.tabs( "remove", $indx );
	});
	$index--;
	
	Snowblozm.Registry.save($config['savekey'], {
		add : function($tabtitle, $autoload, $taburl){
			$index++;
			var $url = '#ui-tab-' + $index;
			if($autoload || false){
				$url = $taburl;
			}
			$tabpanel.tabs('add', $url, $tabtitle);
			$tabpanel.tabs('select', '#ui-tab-' + $index);
			return $tab[$index];
		}
	});
	return $element;
}
