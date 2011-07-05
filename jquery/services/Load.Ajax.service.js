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
 *	@param errorflow	Workflow [message] optional default []
 *
 *	@param process boolean [message] optional default false
 *	@param status string [message] optional default valid
 *	@param processflow Workflow [message] optional default false
 *	@param replace string [message] optional default false
 *
 *	@return data string [memory]
 *	@return status integer Status code [memory]
 *	@return error string [memory] optional
 *	@return response string [memory] optional
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
			processData : memory.request || true,
			
			success : function(data, status, request){
				var success = true;
				
				memory.data = data;
				memory.status = status;
				
				/**
				 *	If process is true, check for status value in JSON data received and set success variable accordingly
				**/
				if(message.process || false){
					var key = message.status || 'valid';
					
					if(data[key] || false){
						success = true;
						
						/**
						 *	Check for processflow definitions and execute them
						**/
						var run = data[message.processflow] || false;
						if(run){
							for(var i in run){
								run[i].service = FireSpark.Registry.get(run[i].service);
							}
							return FireSpark.Kernel.run(run);
						}
					}
					else {
						success = false;
					}
					
					/**
					 *	Replace data with data to be processed further using replace index
					**/
					if(message.replace || false){
						memory.response = data;
						memory.data = data[message.replace];
					}
				}
				
				/**
				 *	If success is true, run the workflow; otherwise run the errorflow if exists
				**/
				if(success){
					FireSpark.Kernel.run(message.workflow, memory);
				}
				else {
					if(message.errorflow || false){
						FireSpark.Kernel.run(message.errorflow, memory);
					}
				}
			},
			
			error : function(request, status, error){
				memory.error = error;
				memory.status = status;
				memory.data = FireSpark.core.constant.loaderror;
				
				/**
				 *	Run the errorflow if any
				**/
				if(message.errorflow || false){
					ServiceClient.Kernel.run(message.errorflow, memory);
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
