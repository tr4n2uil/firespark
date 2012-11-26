/**
 *	@helper TransformCKEditor
 *
 *	@param element
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.helper.transformCKEditor = function($element, $config){
	var $temp = $element;
		
	$element.each(function($index, $el){
		var $name = $temp.attr('id') || $temp.attr('name');
		var $instance = CKEDITOR.instances[$name] || false;
		if($instance){
			try {
				CKEDITOR.remove($instance);
			}
			catch(e) {}
			delete $instance;
		}
		$temp = $temp.slice(1);
	});
	
	$element.ckeditor();
	return $element;
}
