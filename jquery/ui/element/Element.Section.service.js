/**
 *	@service ElementSection
 *	@desc Toggles element with another content and animates it and returns element in memory
 *
 *	@param element string [memory] optional default parent of content
 *	@param select boolean [memory] optional default false
 *	@param content string [memory] optional default false
 *	@param child string [memory] optional default '.tile-content'
 *	@param none boolean [memory] optional default false
 *	@param animation string [memory] optional default 'fadein' ('fadein', 'slidein')
 *	@param duration integer [memory] optional default 1000
 *	@param delay integer [memory] optional default 0
 *
 *	@return element element [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.service.ElementSection = {
	input : function(){
		return {
			optional : { 
				element : false,
				select : false,
				content : false,
				child : '.tile-content',
				none : false,
				animation : false,
				duration : 500,
				delay : 0
			}
		};
	},
	
	run : function($memory){
		if($memory['select'] && $memory['element']){
			var $element = $($memory['element']);
			if(!$element.length){
				return { valid : false };
			}
		}
		else if($memory['select'] && $memory['content']){
			var $element = $($memory['content']).parent();
			if(!$element.length){
				return { valid : false };
			}
		}
		else {
			$element = $memory['element'];
		}
		
		//$element.show();
		$element.children($memory['child']).hide();
		
		if(!$memory['none']){
			if($memory['content']){
				$element = $element.children($memory['content']);
			}
			else {
				$element = $element.children($memory['child']).eq(0);
			}
			
			var $animation = $memory['animation'];
			var $duration = $memory['duration'];
			
			$element.trigger('load');
	
			if( $animation ){
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
			}
			else {
				$element.show();
			}
		}
		
		$memory['element'] = $element;
		$memory['valid'] = false;
		return $memory;
	},
	
	output : function(){
		return ['element'];
	}
};
