/**
 *	@service WindowReload
 *	@desc Reloads the window
 *
 *	@param continue string [message] optional default false
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.service.WindowReload = {
	input : function(){
		return {
			'optional' : { 'continue' : false }
		};
	},
	
	run : function($memory){
		//window.location.hash = '';
		if($memory['continue']){
			window.location = $memory['continue'];
		}
		else {
			window.location.reload();
		}
		$memory['valid'] = false;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
