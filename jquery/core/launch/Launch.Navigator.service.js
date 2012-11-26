/**
 *	@service LaunchNavigator
 *	@desc Processes data to launch navigator
 *
 *	@param data array [memory] optional default {}
 *	@param launch boolean [memory] optional default false
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.service.LaunchNavigator = {
	input : function(){
		return {
			optional : { data : [], launch : false }
		};
	},
	
	run : function($memory){
		if($memory['launch']){
			$data = $memory['data'];
			if($data.length){
				for(var $i in $data){
					$data[$i].launch( $memory );
				}
			}
			else {
				$memory['launch'].launch( $memory );
			}
		}
		
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
