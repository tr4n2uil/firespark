/**
 *	@service DataSelect
 *	@desc Selects data from another array
 *
 *	@param data array [memory] optional default {}
 *	@param params array [memory] optional default {}
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.service.DataSelect = {
	out : [],
	
	input : function(){
		return {
			optional : { data : {}, params : {} }
		};
	},
	
	run : function($memory){
		var $data = $memory['data'];
		var $params = $memory['params'];
		FireSpark.core.service.DataSelect.out = [];
		
		for(var $i in $params){
			var $value = $params[$i];
			$memory[$value] = $data[$i];
			FireSpark.core.service.DataSelect.out.push($value);
		}
		
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return FireSpark.core.service.DataSelect.out;
	}
};
