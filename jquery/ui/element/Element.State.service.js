/**
 *	@service ElementState
 *	@desc Enables and disables element
 *
 *	@param element string [memory] optional default false
 *	@param disabled boolean [memory] optional default false
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.service.ElementState = {
	input : function(){
		return {
			optional : { element : false, disabled : false }
		};
	},
	
	run : function($memory){
		if($memory['element']){
			if($memory['disabled']){
				$($memory['element']).attr('disabled', true);
			}
			else {
				$($memory['element']).removeAttr('disabled');
			}
		}
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
