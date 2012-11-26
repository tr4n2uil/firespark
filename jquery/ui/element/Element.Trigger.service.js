/**
 *	@service ElementTrigger
 *	@desc Triggers event on element
 *
 *	@param element string [memory] optional default false
 *	@param event string [memory] optional default false
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.service.ElementTrigger = {
	input : function(){
		return {
			optional : { element : false, event : false }
		};
	},
	
	run : function($memory){
		if($memory['element'] && $memory['event']){
			$($memory['element']).trigger($memory['event']);
		}
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
