/**
 *	@service LoadAjax
 *	@desc Uses AJAX to load data from server and optionally process it
 *
 *	@param loadurl string [message|memory]
 *	@param loadparams object [message|memory]
 *	@param datatype string [message|memory] optional default 'json'
 *	@param request string [message|memory] optional default 'POST'
 *	@param processData boolean [message] optional default true
 *
 *	@param workflow Workflow [message]
 *	@param errorflow	Workflow [message] optional default false
 *
 *	@return data string [memory]
 *	@return status integer Status code [memory]
 *	@return error string [memory] optional
 *
**/
FireSpark.jquery.service.LoadAjax = {
	run : function(message, memory){
		
		/**
		 *	Load data from server using AJAX
		**/
		$.ajax({
			url: message.loadurl || memory.loadurl,
			data: message.loadparams || memory.loadparams || {},
			dataType : message.datatype || memory.datatype || 'json',
			type : message.request || memory.request || 'POST',
			processData : memory.processData || true,
			
			success : function(data, status, request){
				memory.data = data;
				memory.status = status;
				
				/**
				 *	Run the workflow
				**/
				FireSpark.Kernel.run(message.workflow, memory);
			},
			
			error : function(request, status, error){
				memory.error = error;
				memory.status = status;
				memory.data = FireSpark.core.constant.loaderror;
				
				/**
				 *	Run the errorflow if any
				**/
				if(message.errorflow || false){
					FireSpark.Kernel.run(message.errorflow, memory);
				}
			}
		});
		
		/**
		 *	@return false 
		 *	to stop default browser event
		**/
		return false;
	}
};
