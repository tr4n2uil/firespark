/**
 *	@service ElementContent
 *	@desc Fills element with content and animates it or removes it and returns element in memory
 *
 *	@param element string [memory]
 *	@param select boolean [memory] optional default false
 *	@param data html/text [memory] optional default ''
 *	@param animation string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout', 'none')
 *	@param duration integer [memory] optional default 1000
 *	@param delay integer [memory] optional default 0
 *	@param action string [memory] optional default 'all' ('all', 'first', 'last', 'remove', 'replace', 'hide', 'show')
 *
 *	@return element element [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.service.ElementContent = {
	input : function(){
		return {
			required : ['element'],
			optional : { 
				select : false,
				data : '',
				animation : 'fadein',
				duration : 1000,
				delay : 0,
				action : 'all'
			}
		};
	},
	
	run : function($memory){
		if($memory['select']){
			var $element = $($memory['element']);
			if(!$element.length && $memory['action'] != 'remove'){
				$element = $(FireSpark.ui.constant.maindiv);
			}
		}
		else {
			$element = $memory['element'];
		}
		
		var $animation = $memory['animation'];
		var $duration = $memory['duration'];
		
		if($animation == 'fadein' || $animation == 'slidein'){
			$element.hide();
		}
		
		switch($memory['action']){
			case 'all' :
				$element = $element.html($memory['data']);
				$element.trigger('load');
				break;
			
			case 'first' :
				$element = $element.prepend($memory['data']);
				$element.trigger('load');
				break;
			
			case 'last' :
				$element = $element.append($memory['data']);
				$element.trigger('load');
				break;
			
			case 'replace' :
				$element = $($memory['data']).replaceAll($element);
				$element.trigger('load');
				break;
				
			case 'remove' :
				$element.remove();
				break;
				
			default :
				break;
		}
		
		if($memory['action'] != 'remove'){
			$element.stop(true, true).delay($memory['delay']);
			
			switch($animation){
				case 'fadein' :
					$element.fadeIn($duration);
					break;
				case 'fadeout' :
					$element.fadeOut($duration);
					break;
				case 'slidein' :
					$element.slideDown($duration);
					break;
				case 'slideout' :
					$element.slideUp($duration);
					break;
				case 'none' :
					break;
				default :
					$element.html('Animation type not supported').fadeIn($duration);
					break;
			}
		}
		
		$memory['element'] = $element;
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['element'];
	}
};
