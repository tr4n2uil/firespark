/**
 *	@service ElementToggle
 *	@desc Shows and hides element
 *
 *	@param element string [memory] optional default false
 *	@param notoggle boolean [memory] optional default false
 *	@param hide boolean [memory] optional default false
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.service.ElementToggle = {
	input : function(){
		return {
			optional : { element : false, notoggle : false, hide : false }
		};
	},
	
	run : function($memory){
		if($memory['element']){
			if($memory['notoggle']){
				$($memory['element']).toggle($memory['hide']);
			}
			else {
				$($memory['element']).toggle();
			}
		}
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
