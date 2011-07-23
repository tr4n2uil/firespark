/**
 *	@service ElementTabpanel
 *	@desc Creates a Tabpanel at element and saves a reference
 *
 *	@param element string [memory]
 *	@param select boolean [memory] optional default false
 *	@param savekey string [memory]
 *	@param cache boolean [memory] optional default false
 *	@param collapsible boolean [memory] optional default false
 *	@param event string [memory] optional default 'click'
 *	@param tablink boolean [memory] optional default false
 *	@param indexstart integer [memory] optional default 0
 *
 *	@save tabpanel object
 *
**/
FireSpark.jquery.service.ElementTabpanel = {
	input : function(){
		return {
			required : ['element', 'savekey'],
			optional : { 
				select : false, 
				cache : false,	
				collapsible : false, 
				event : 'click', 
				tablink : false, 
				indexstart : 0 
			}
		};
	},
	
	run : function($memory){
		if($memory['select']){
			var $element = $($memory['element']);
		}
		else {
			var $element = $memory['element'];
		}
		$element.hide();
		
		var $tab = new Array();
		var $index = $memory['indexstart'];
		
		var $options = {
			cache : $memory['cache'],
			collapsible : $memory['collapsible'],
			event : $memory['event'],
			tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>",
			add: function($event, $ui) {
				$tab[$index] = $($ui.panel);
			}
		};
		
		if($memory['tablink']){
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
		
		FireSpark.Registry.save($memory['savekey'], {
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
		
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
