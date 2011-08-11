/**
 *	@service TemplateRead
 *	@desc Reads template definition into memory
 *
 *	@param data object [memory] optional default {}
 *	@param key string [memory] optional default 'template'
 *	@param template string [memory] optional default 'tpl-default' (FireSpark.jquery.template.Default)
 *
 *	@param result Template [memory]
 *	@param data object [memory]
 *
**/
FireSpark.jquery.service.TemplateRead = {
	input : function(){
		return {
			optional : { data : {}, key : 'template', template : 'tpl-default' }
		};
	},
	
	run : function($memory){
		if($memory['data'][$memory['key']]){
			$memory['result'] = $.template($memory['data'][$memory['key']]);
		}
		else if ($memory['data']['message'] && $memory['data']['message'][$memory['key']]){
			$memory['result'] = $.template($memory['data']['message'][$memory['key']]);
			$memory['data']['content'] = $memory['data']['message']['content'] || false;
		}
		else {
			$memory['result'] = FireSpark.Registry.get($memory['template']);
		}
		
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['result', 'data'];
	}
};
