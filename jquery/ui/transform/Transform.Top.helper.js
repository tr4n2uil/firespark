/**
 *	@helper TransformTop
 *
 *	@param element
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.helper.transformTop = function($element, $config){
	$($config['sel']).animate({
		scrollTop: 0
	}, 850);
	return false;
}
