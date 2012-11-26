/**
 *	@helper CheckRequired
 *
 *	@param index
 *	@param element
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.CheckRequired = (function(){
	return function($index, $el){
		if($(this).val() == ''){
			FireSpark.core.service.CheckForm.result = false;
			FireSpark.core.helper.checkFail($(this), FireSpark.core.constant.validation_status + '.error');
			return false;
		}
	};
})();
