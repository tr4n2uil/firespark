/**
 *	@service TransformTrigger
 *	@desc Initializes transform triggers
 *
 *	@param transforms array [memory] optional default FireSpark.core.constant.transforms
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.service.TransformTrigger = {
	input : function(){
		return {
			optional : { 'transforms' : FireSpark.ui.constant.transforms }
		};
	},
	
	run : function($memory){
		var $transforms = $memory['transforms'];
		
		for(var $i in $transforms){
			$tx = $transforms[$i];
			$($tx['cls']).live('load', function(){
				var $helper = $tx['helper'];
				$helper($(this), $tx['config']);
			});
		}
	
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
