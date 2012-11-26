/**
 *	@helper CheckFail
 *
 *	@param element
 *	@param selector
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.checkFail = function($el, $sel){
	return $el.next($sel).stop(true, true).slideDown(1000).delay(5000).fadeOut(1000);
}
