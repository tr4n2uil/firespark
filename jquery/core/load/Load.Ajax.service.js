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
 *	@param barrier boolean [memory] optional default false
 *
 *	@param workflow Workflow [memory]
 *	@param errorflow	Workflow [memory] optional default false
 *	@param function startfn Start Function [memory] optional default false
 *	@param function endfn End Function [memory] optional default false
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
				sync : false,
				barrier : false
			}
		}
	},
	
	run : function($memory){
		
		if( $memory[ 'barrier' ] ){
			FireSpark.core.helper.LoadBarrier.start();
		}
		
		var $mem = {};
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
				
				if($mem['validity'] && ( ($mem['data']['valid'] === false) ||  (($mem['data']['message'] || false) && $mem['data']['message']['valid'] === false) )){
					/**
					 *	Run the errorflow if any
					**/
					try {
						if($memory['errorflow']){
							$memory['errorflow'].execute($mem);
						}
						if( $memory[ 'barrier' ] ){
							FireSpark.core.helper.LoadBarrier.end();
						}
					} catch($id) {
						if( $memory[ 'barrier' ] ){
							FireSpark.core.helper.LoadBarrier.end();
						}
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
						$memory['workflow'].execute($mem);
						if( $memory[ 'barrier' ] ){
							FireSpark.core.helper.LoadBarrier.end();
						}
					} catch($id) {
						if( $memory[ 'barrier' ] ){
							FireSpark.core.helper.LoadBarrier.end();
						}
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
						$memory['errorflow'].execute($mem);
					}
					if( $memory[ 'barrier' ] ){
						FireSpark.core.helper.LoadBarrier.end();
					}
				} catch($id) {
					if( $memory[ 'barrier' ] ){
						FireSpark.core.helper.LoadBarrier.end();
					}
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
