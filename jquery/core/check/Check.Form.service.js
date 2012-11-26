/**
 *	@service CheckForm
 *	@desc Validates form input values (required and email) using style class
 *
 *	@param form string [memory]
 *	@param validations array [memory] optional default FireSpark.core.constant.validations
 *	@param error string [memory] optional default span
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.service.CheckForm = {
	result : true,
	
	input : function(){
		return {
			required : ['form'],
			optional : { error : 'span', validations : FireSpark.core.constant.validations }
		};
	},
	
	run : function($memory){
		FireSpark.core.service.CheckForm.result = true;
		FireSpark.core.constant.validation_status = $memory['error'];
		
		$validations = $memory['validations'];
		
		for(var $i in $validations){
			$check = $validations[$i];
			$($memory['form'] + ' ' + $check['cls']).each($check['helper']);
			if(!FireSpark.core.service.CheckForm.result)
				break;
		}
		
		$memory['valid'] = FireSpark.core.service.CheckForm.result;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
