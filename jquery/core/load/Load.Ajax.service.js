/**
 *	@service LoadAjax
 *	@desc Uses AJAX to load data from server
 *
 *	@param url string [memory]
 *	@param data object [memory] optional default ''
 *	@param type string [memory] optional default 'json'
 *	@param request string [memory] optional default 'POST'
 *	@param process boolean [memory] optional default false
 *	@param mime string [memory] optional default 'application/x-www-form-urlencoded'
 *	@param sync boolean [memory] optional default false
 *
 *	@param workflow Workflow [memory]
 *	@param errorflow	Workflow [memory] optional default false
 *	@param stop boolean [memory] optional default false
 *	@param validity boolean [memory] optional default false
 *
 *	@return data string [memory]
 *	@return error string [memory] optional
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.service.LoadAjax = {
	input : function(){
		return {
			required : ['url', 'workflow'],
			optional : { 
				data : '', 
				type : 'json', 
				request : 'POST', 
				process : false, 
				mime : 'application/x-www-form-urlencoded' ,
				errorflow : false,
				stop : false,
				validity : false,
				sync : false
			}
		}
	},
	
	run : function($memory){
		
		FireSpark.core.helper.LoadBarrier.start();
		
		$mem = {};
		for(var $i in $memory){
			$mem[$i] = $memory[$i];
		}
		
		/**
		 *	Load data from server using AJAX
		**/
		$.ajax({
			url: $memory['url'],
			data: $memory['data'],
			dataType : $memory['type'],
			type : $memory['request'],
			processData : $memory['process'],
			contentType : $memory['mime'],
			async : $memory['sync'] ? false : true,
			
			success : function($data, $status, $request){
				$mem['data'] = $data;
				//$mem['status'] = $status;
				
				if($mem['validity'] && ( (($mem['data']['valid'] || false) && $mem['data']['valid'] === false) ||  (($mem['data']['message'] || false) && ($mem['data']['message']['valid'] || false) && $mem['data']['message']['valid'] === false) )){
					/**
					 *	Run the errorflow if any
					**/
					try {
						if($memory['errorflow']){
							Snowblozm.Kernel.execute($memory['errorflow'], $mem);
						}
						FireSpark.core.helper.LoadBarrier.end();
					} catch($id) {
						FireSpark.core.helper.LoadBarrier.end();
						if(console || false){
							console.log('Exception : ' + $id);
						}
					}
				}
				else {
					/**
					 *	Run the workflow
					**/
					try {
						Snowblozm.Kernel.execute($memory['workflow'], $mem);
						FireSpark.core.helper.LoadBarrier.end();
					} catch($id) {
						FireSpark.core.helper.LoadBarrier.end();
						if(console || false){
							console.log('Exception : ' + $id);
						}
					}
				}
			},
			
			error : function($request, $status, $error){
				$mem['error'] = $error;
				//$mem['status'] = $status;
				$mem['data'] = FireSpark.core.constant.loaderror + '<span class="hidden"> [Error : ' + $error + ']</span>';
				
				/**
				 *	Run the errorflow if any
				**/
				try {
					if($memory['errorflow']){
						Snowblozm.Kernel.execute($memory['errorflow'], $mem);
					}
					FireSpark.core.helper.LoadBarrier.end();
				} catch($id) {
					FireSpark.core.helper.LoadBarrier.end();
					if(console || false){
						console.log('Exception : ' + $id);
					}
				}
			}
		});
		
		/**
		 *	@return false 
		 *	to stop default browser event
		**/
		return { valid : $memory['stop'] };
	},
	
	output : function(){
		return [];
	}
};
