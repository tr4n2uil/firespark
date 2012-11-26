/**
 *	@service WriteMode
 *	@desc Enables and disables admin mode during smart write
 *
 *	@param element string [memory] optional default false
 *	@param admin boolean [memory] optional default false
 *	@param dtcntr element [memory] optional default false
 *
 *	@param dtcntr element [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.smart.service.WriteMode = {
	last : false,
	
	input : function(){
		return {
			optional : { element : false, admin : false, dtcntr : false }
		};
	},
	
	run : function($memory){
		if($memory['dtcntr'] || $memory['element']){
			var $el = $memory['dtcntr'] || $($memory['element']).parents(FireSpark.smart.constant.dtclass);
			if($el.length){
				if($memory['admin']){
					try {
						$el.dataTable();
					}catch($id) { 
						if(console || false){ console.log('Exception : ' + $id); }
					}
				}
				else {
					try {
						$el.dataTable().fnDestroy();
						$el.removeAttr('style');
					}catch($id) { 
						if(console || false){ console.log('Exception : ' + $id); }
					}
				}
			}
		}
		
		$memory['valid'] = true;
		$memory['dtcntr'] = $el;
		return $memory;
	},
	
	output : function(){
		return ['dtcntr'];
	}
};
