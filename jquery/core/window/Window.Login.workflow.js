/**
 *	@workflow WindowLogin
 *	@desc Sign in using Cookie
 *
 *	@param key string [message] optional default 'sessionid'
 *	@param value string [message] optional default null
 *	@param expires integer[message] optional default 1 day
 *	@param path string [memory] optional default '/'
 *	@param continue string [message] optional default false
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.workflow.WindowLogin = {
	input : function(){
		return {
			optional : { key : 'sessionid', value : null, expires : 1, path : '/', 'continue' : false }
		}
	},
	
	run : function($memory){
		return [{
			service : FireSpark.core.service.DataCookie
		},{
			service : FireSpark.core.service.WindowReload
		}].execute( $memory );
	},
	
	output : function(){
		return [];
	}
};
