/**
 *	@helper CheckMatch
 *
 *	@param index
 *	@param element
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.CheckMatch = (function(){
	var $value = false;
	return function($index, $el){
		if($index && $value && $(this).val()!=$value ){
			FireSpark.core.service.CheckForm.result = false;
			FireSpark.core.helper.checkFail($(this), FireSpark.core.constant.validation_status + '.error');
			return false;
		}
		
		$value = $(this).val();
	}
})();
