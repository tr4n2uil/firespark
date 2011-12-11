/**
 *	@service ElementToggle
 *	@desc Toggles element with another content and animates it and returns element in memory
 *
 *	@param element string [memory]
 *	@param select boolean [memory] optional default false
 *	@param content string [memory] optional default false
 *	@param child string [memory] optional default '.tile-content'
 *	@param animation string [memory] optional default 'fadein' ('fadein', 'slidein')
 *	@param duration integer [memory] optional default 1000
 *	@param delay integer [memory] optional default 0
 *
 *	@return element element [memory]
 *
**/
FireSpark.jquery.service.ElementToggle = {
	input : function(){
		return {
			required : ['element'],
			optional : { 
				select : false,
				content : false,
				child : '.tile-content',
				animation : 'fadein',
				duration : 500,
				delay : 0
			}
		};
	},
	
	run : function($memory){
		if($memory['select'] || false){
			var $element = $($memory['element']);
			if(!$element.length){
				$element = $('#main-container');
			}
		}
		else {
			$element = $memory['element'];
		}
		
		$element.children($memory['child']).hide();
		
		if($memory['content'] || false){
			$element = $element.children($memory['content']);
		}
		
		var $animation = $memory['animation'];
		var $duration = $memory['duration'];
		
		$element.trigger('load');
		$element.delay($memory['delay']);
		
		switch($animation){
			case 'fadein' :
				$element.fadeIn($duration);
				break;
			case 'slidein' :
				$element.slideDown($duration);
				break;
			default :
				$element.html('Animation type not supported').fadeIn($duration);
				break;
		}
		
		$memory['element'] = $element;
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['element'];
	}
};
