/**
 *	@service ElementTab
 *	@desc Creates a new tab and returns the element
 *
 *	@param tabui string [memory]
 *  @param tabtitle string [memory]
 *  @param autoload boolean [memory] optional default false
 *  @param taburl string [memory] optional default false
 *
 *	@return element Element [memory]
 *
**/
FireSpark.jquery.service.ElementTab = {
	input : function(){
		return {
			required : ['tabui', 'tabtitle'],
			optional : { autoload : false,	taburl : false }
		};
	},
	
	run : function($memory){
		var $tabui = FireSpark.Registry.get($memory['tabui']);
		$memory['element'] = $tabui.add($memory['tabtitle'], $memory['autoload'], $memory['taburl']);
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['element'];
	}
};
