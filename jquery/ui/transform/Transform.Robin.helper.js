/**
 *	@helper TransformRobin
 *
 *	@param element
 *	@param selector
 *	@param total
 *	@param interval
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.helper.transformRobin = function($element, $config){
	
	(function(){
		var $total = $config['total'];
		var $current = 0;
		window.setInterval(function txrobin(){
			$current++;
			$current %= $total;
			$element.children($config['selector']).stop(true, true).fadeOut(500).eq($current).delay(500).fadeIn(500);
		}, $config['interval']);
	})();
	
	return $element;
}
