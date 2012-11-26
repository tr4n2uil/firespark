/**
 *	@service WindowConfirm
 *	@desc Confirms whether to continue 
 *
 *	@param confirm boolean [memory] optional default false
 *	@param value string [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.service.WindowConfirm = {
	input : function(){
		return {
			required : ['value'],
			optional : { confirm : false }
		}
	},
	
	run : function($memory){
		if($memory['confirm']){
			$memory['valid'] = confirm($memory['value']);
			return $memory;
		}
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
