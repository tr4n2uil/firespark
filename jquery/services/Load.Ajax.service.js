/**
 *	@service LoadAjax
 *	@desc Uses AJAX to load data from server
 *
 *	@param url string [memory]
 *	@param data object [memory]
 *	@param type string [memory] optional default 'json'
 *	@param request string [memory] optional default 'POST'
 *	@param process boolean [memory] optional default false
 *	@param mime string [memory] optional default 'application/x-www-form-urlencoded'
 *
 *	@param workflow Workflow [memory]
 *	@param errorflow	Workflow [memory] optional default false
 *
 *	@return result string [memory]
 *	@return status integer Status code [memory]
 *	@return error string [memory] optional
 *
**/
FireSpark.jquery.service.LoadAjax = {
	input : function(){
		return {
			required : ['url', 'workflow']
			optional : { 
				data : {}, 
				type : 'json', 
				request : 'POST', 
				process : false, 
				mime : 'application/x-www-form-urlencoded' ,
				errorflow : false
			}
		}
	},
	
	run : function($memory){
		
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
			
			success : function($data, $status, $request){
				$memory['result'] = $data;
				$memory['status'] = $status;
				
				/**
				 *	Run the workflow
				**/
				FireSpark.Kernel.execute($memory['workflow'], $memory);
			},
			
			error : function($request, $status, $error){
				$memory['error'] = $error;
				$memory['status'] = $status;
				$memory['result'] = FireSpark.core.constant.loaderror + ' [Error : ' + $error + ']';
				
				/**
				 *	Run the errorflow if any
				**/
				if($memory['errorflow']){
					FireSpark.Kernel.run($memory['errorflow'], $memory);
				}
			}
		});
		
		/**
		 *	@return false 
		 *	to stop default browser event
		**/
		$memory['valid'] = false;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
