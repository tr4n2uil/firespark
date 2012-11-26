/**
 *	@service ElementLoading
 *	@desc Enables and disables loader
 *
 *	@param element string [memory] optional default false
 *	@param data string [memory] optional default FireSpark.smart.constant.loadmsg
 *
 *	@return loading html [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.service.ElementLoading = {
	input : function(){
		return {
			optional : { element : false, disabled : false, data : FireSpark.smart.constant.loadmsg }
		};
	},
	
	run : function($memory){
		if($memory['element']){
			$memory['loading'] = $($memory['element']).html();
			$($memory['element']).html($memory['data']);
		}
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['loading'];
	}
};
