/** *	@service LaunchHash *	@desc Used to launch hash navigator ***/FireSpark.jquery.service.LaunchHash = {	idle : true,		current : '',		input : function(){		return { };	},		run : function($memory){		if(FireSpark.jquery.service.LaunchHash.idle && FireSpark.jquery.service.LaunchHash.current != window.location.hash){			FireSpark.jquery.service.LaunchHash.current = window.location.hash;			Snowblozm.Kernel.launch(FireSpark.jquery.service.LaunchHash.current);		}				$memory['valid'] = true;		return $memory;	},		output : function(){		return [];	}};