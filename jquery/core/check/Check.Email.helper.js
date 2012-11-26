/**
 *	@helper CheckEmail
 *
 *	@param index
 *	@param element
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.CheckEmail = (function(){
	var $emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	return function($index, $el){
		if(!$emailRegex.test($(this).val())){
			FireSpark.core.service.CheckForm.result = false;
			FireSpark.core.helper.checkFail($(this), FireSpark.core.constant.validation_status + '.error');
			return false;
		}
	};
})();
