/**
 *	@service LoadBarrier
 *	@desc Sets barrier workflow
 *
 *	@param barrier array [memory] optional default false
 *
 *	@return barrier array [memory] default false
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.service.LoadBarrier = {
	input : function(){
		return {
			optional : { barrier : false }
		};
	},
	
	run : function($memory){
		if($memory['barrier']){
			FireSpark.core.helper.LoadBarrier.barrier(function(){
				Snowblozm.Kernel.execute($memory['barrier'], $memory);
			});
		}
		
		$memory['barrier'] = false;
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['barrier'];
	}
};
