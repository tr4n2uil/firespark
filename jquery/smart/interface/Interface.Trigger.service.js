/**
 *	@service InterfaceTrigger
 *	@desc Initializes navigator launch triggers
 *
 *	@format #/path/!/view
 *
 *	@param selector string [memory]
 *	@param event string [memory] optional default 'click'
 *	@param attribute string [memory]
 *	@param escaped boolean [memory] optional default false
 *	@param hash boolean [memory] optional default false
 *	@param nav string [memory] optional default false
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.smart.service.InterfaceTrigger = {
	input : function(){
		return {
			required : ['selector', 'attribute'],
			optional : { 
				event : 'click', 
				escaped : false, 
				hash : false, 
				nav : false
			}
		};
	},
	
	run : function($memory){
		$($memory['selector']).live($memory['event'], function(){
			FireSpark.smart.service.InterfaceUrl.idle = false;
			
			var $navigator = $(this).attr($memory['attribute']);
			var $cache = FireSpark.smart.constant.uicache ? !($(this).hasClass('force')) : $(this).hasClass('nofrc');
			
			if($memory['attribute'] == 'href'){
				$navigator = unescape($navigator);
			}
			
			/** 
			 *	@note SmartURL using HTML5 History 
			**/
			if($memory['nav']){
				if($memory['nav'] === true){
					//window.history.pushState({},"", ' ');
				}
				else {
					window.history.pushState({ 
						nav : $memory['nav'] + $navigator, 
						escaped : $memory['escaped'],
						hash : $memory['hash']
					},"", FireSpark.smart.constant.urlstart + $navigator);
					
					$navigator = $memory['nav'] + $navigator;
					//FireSpark.smart.service.InterfaceUrl.base = $navigator;
				}
			}
			
			var $result = {
				service : FireSpark.smart.service.InterfaceUrl,
				navigator : $navigator,
				escaped :$memory['escaped'],
				root : $(this),
				event : true,
				save : $memory['hash'],
				nofrc : $cache
			};
			$result = $result.run({});
			
			FireSpark.smart.service.InterfaceUrl.idle = true;
			return $result['valid'] || false;
		});
		
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
