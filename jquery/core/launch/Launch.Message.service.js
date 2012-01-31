/** *	@service LaunchMessage *	@desc Processes data to run workflows * *	@param data object [memory] optional default {} *	@param launch boolean [memory] optional default false *	@param status string [memory] optional default 'valid' *	@param message string [memory] optional default 'message' ***/FireSpark.core.service.LaunchMessage = {	input : function(){		return {			optional : { data : {}, launch : false, status : 'valid', message : 'message' }		};	},		run : function($memory){		if($memory['launch']){			var $status = $memory['status'];			var $data = $memory['data'] || {};			if($data[$status] || false){				var $key = $memory['message'];				var $message = $data[$key] || false;				if($message){					$message['service'] = Snowblozm.Registry.load($memory['launch']);					return Snowblozm.Kernel.run($message, {});				}			}		}			$memory['valid'] = true;		return $memory;	},		output : function(){		return [];	}};