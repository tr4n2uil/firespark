/**
 *	@service LaunchMessage
 *	@desc Processes data to run workflows
 *
 *	@param data object [memory] optional default {}
 *	@param launch boolean [memory] optional default false
 *	@param status string [memory] optional default 'valid'
 *	@param message string [memory] optional default 'message'
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.service.LaunchMessage = {
	input : function(){
		return {
			optional : { 
				data : {}, 
				launch : false, 
				status : 'valid', 
				message : 'message' 
			}
		};
	},
	
	run : function($memory){
		if($memory['launch']){
			var $data = $memory['data'] || {};
			if($data[$memory['status']] || false){
				var $key = $memory['message'];
				var $message = $data[$key] || false;
				
				if($message && $memory['launch'].get() || false){
					$message['service'] = $memory['launch'].get();
					return $message.run( {} );
				}
				else {
					return $memory['launch'].launch( {} );
				}
			}
		}
	
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
