/** *	@service InterfaceTrigger *	@desc Initializes navigator launch triggers * *	@format #/path/!/view * *	@param selector string [memory] *	@param event string [memory] optional default 'click' *	@param attribute string [memory] *	@param escaped boolean [memory] optional default false *	@param hash boolean [memory] optional default false *	@param nav string [memory] optional default false * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.smart.service.InterfaceTrigger = {	input : function(){		return {			required : ['selector', 'attribute'],			optional : { 				event : 'click', 				escaped : false, 				hash : false, 				nav : false			}		};	},		run : function($memory){		$($memory['selector']).live($memory['event'], function(){			FireSpark.smart.helper.InterfaceUrl.idle = false;						var $navigator = $(this).attr($memory['attribute']);						if($memory['attribute'] == 'href'){				$navigator = unescape($navigator);			}						/** 			 *	@note SmartURL using HTML5 History 			**/			if($memory['nav']){				if($memory['nav'] === true){					window.history.pushState({},"", ' ');				}				else {					window.history.pushState({ 						nav : $memory['nav'] + $navigator, 						escaped : $memory['escaped'],						hash : $memory['hash']					},"", FireSpark.smart.constant.urlstart + $navigator);										$navigator = $memory['nav'] + $navigator;				}			}						$result = FireSpark.smart.helper.InterfaceUrl.launch($navigator, $memory['escaped'], $(this), true, $memory['hash']);						FireSpark.smart.helper.InterfaceUrl.idle = true;			return $result;		});				$memory['valid'] = true;		return $memory;	},		output : function(){		return [];	}};