/**
 *	@service DataCookie
 *	@desc Creates a new Cookie
 *
 *	@param key string [message]
 *	@param value string [message] optional default null
 *	@param expires integer[message] default 1 day
 *	@param path string [memory] optional default '/'
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.service.DataCookie = {
	input : function(){
		return {
			required : ['key'],
			optional : { expires : 1, value : null, path : '/' }
		};
	},
	
	run : function($memory){
		$.cookie($memory['key'], null, {
			path: $memory['path']
		});
		
		$.cookie($memory['key'], $memory['value'], {
			expires : $memory['expires'],
			path: $memory['path']
		});
		
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
