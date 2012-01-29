FireSpark.jquery = {};

FireSpark.jquery.service = {};
FireSpark.jquery.workflow = {};

FireSpark.jquery.helper = {};
FireSpark.jquery.constant = {};

FireSpark.jquery.template = {};

/**
 *	@component HashLaunch
**/
FireSpark.jquery.HashLaunch = {
	idle : true,
	
	current : '',
	
	check : function(){
		if(FireSpark.jquery.HashLaunch.idle && FireSpark.jquery.HashLaunch.current != window.location.hash){
			FireSpark.jquery.HashLaunch.current = window.location.hash;
			Snowblozm.Kernel.launch(FireSpark.jquery.HashLaunch.current);
		}
	}
};

