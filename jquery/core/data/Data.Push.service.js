/**
 *	@service DataPush
 *	@desc Pushes data into another array
 *
 *	@param data array [memory] optional default {}
 *	@param params array [args] optional default []
 *
 *	@param result array [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.service.DataPush = {
	input : function(){
		return {
			optional : { data : {} }
		};
	},
	
	run : function($memory){
		var $data = $memory['data'];
		var $params = $memory['args'];
		
		for(var $i in $params){
			$value = $params[$i];
			$data[$value] = $memory[$value];
		}
		
		$memory['result'] = $data;
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['result'];
	}
};
