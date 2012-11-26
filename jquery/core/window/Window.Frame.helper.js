/**
 *	@helper WindowFrame
 *
 *	@param name
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.windowFrame = function($name){
	for (var i = window.frames.length -1; i >= 0; i--){
		var $frame = window.frames[i];
		if($frame.name || false){
			if($frame.name == $name){
				return $frame;
			}
		}
	}
	
	return false;
}
