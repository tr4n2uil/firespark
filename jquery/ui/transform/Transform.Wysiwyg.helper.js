/**
 *	@helper TransformWysiwyg
 *
 *	@param element
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.helper.transformWysiwyg = function($element, $config){
	$element.children($config['sel']).wysiwyg();
	return $element;
}
