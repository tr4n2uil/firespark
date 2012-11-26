/**
 *	@helper DataState
 *
 *	@param html
 *	@param state
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/FireSpark.smart.helper.dataState = function($html, $state){
	var $el = $(FireSpark.smart.constant.statusdiv);
	var $data = $el.html();
	$el.html($html).stop(true, true);
	if($state || false){
		$el.hide().slideDown(500).delay(FireSpark.smart.constant.statusdelay).slideUp(FireSpark.smart.constant.statusduration);
	}
	else {
		$el.hide().slideDown(500);
	}
}
