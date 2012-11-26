/**
 *	@service DataRegistry
 *	@desc Saves a new Reference
 *
 *	@param key string [memory]
 *	@param value object [memory] optional default false
 *	@param expiry integer [memory] optional default false
 *	@param check boolean [memory] optional default false
 *
 *	@return value object [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.service.DataRegistry = {
	input : function(){
		return {
			required : ['key'],
			optional : { value : false, expiry : false, check : false }
		};
	},
	
	run : function($memory){
		if($memory['value'] === false){
			$memory['value'] = $memory['key'].get();
		}
		else {
			if($memory['check'] && ($memory['key'].get() || false)){
				$memory['valid'] = false;
				return $memory;
			}
			
			$memory['key'].save($memory['value']);
		}
		
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['value'];
	}
};
