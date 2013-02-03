/**
 *	@service InterfaceCollect
 *	@desc Initializes navigator, collects data, launch workflows
 *
 *	@param selector string [memory]
 *	@param attribute string [memory] optional default 'href'
 *	@param event string [memory] optional default 'click'
 *	@param nav string [memory] optional default false
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.smart.service.InterfaceCollect = {
	input : function(){
		return {
			required : ['selector'],
			optional : { 
				event : 'click', 
				attribute : 'href',
				nav : false
			}
		};
	},
	
	run : function($memory){
		$($memory['selector']).live($memory['event'], function(){
			FireSpark.smart.service.InterfaceUrl.idle = false;
			
			var $block = $(this).parent();
			var $url = $(this).attr($memory['attribute']);
			
			var $message = { 
				root : $(this) 
			};
			var $history = { 
				root : FireSpark.smart.constant.hststatusdiv
			};
			
			var serialize = function($index, $el){
				if($(this).attr('name') || false){
					$message[$(this).attr('name')] =  $(this).val();
					$history[$(this).attr('name')] =  $(this).val();
				}
			}
			$history[ 'ld' ] = FireSpark.smart.constant.hststatus;
			$block.children('input').each(serialize);
			
			/** 
			 *	@note SmartURL using HTML5 History 
			**/
			if($memory['nav'] || false){
				try {
					window.history.pushState({ 
						navigator : $memory['navigator'],
						message : $history
					},"", $url);
				} catch($id){
					if(console || false){
						console.log('Exception : ' + $id);
					}
				}

				//FireSpark.smart.service.InterfaceUrl.base = $navigator;
			}
			else {
				//window.history.pushState({},"", ' ');
			}
			
			var $result = $message['navigator'].launch($message);
			FireSpark.smart.service.InterfaceUrl.idle = true;
			return $result || false;
		});
		
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
