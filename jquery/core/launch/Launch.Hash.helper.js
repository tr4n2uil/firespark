/** *	@helper LaunchHash *	@desc Used to launch hash navigator * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.core.helper.LaunchHash = {	idle : true,		current : '',		launch : function($navigator){		if(FireSpark.core.helper.LaunchHash.idle && FireSpark.core.helper.LaunchHash.current != $navigator){			FireSpark.core.helper.LaunchHash.current = $navigator;			return Snowblozm.Kernel.launch(FireSpark.core.helper.LaunchHash.current);		}		return false;	}};