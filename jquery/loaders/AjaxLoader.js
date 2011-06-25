/**
 *	AjaxLoader loader
 *
 *	@param loadurl string [memory|message]
 *	@param loadparams object [memory|message]
 *	@param	datatype string [memory|message]
 *	@param request string [memory|message]
 *	@param workflow Workflow [message]
 *	@param errorflow	Workflow [message] optional
 *
 *	@param process boolean [message] optional
 *	@param status string [message] optional
 *	@param processflow Workflow [message] optional
 *	@param replace string [message] optional
 *	
 *	@param view View [memory]
 *
 *	@return data string
 *	@return status integer
 *	@return error string
 *
**/
ServiceClient.jquery.loader.AjaxLoader = {
	run : function(message, memory){
		/**
		 *	Show the loading message
		**/
		memory.view.html('<p class="loading">Loading ...</p>');
		
		/**
		 *	Load data from server using AJAX
		**/
		$.ajax({
			url: memory.loadurl || message.loadurl,
			data: memory.loadparams || message.loadparams || {},
			dataType : memory.datatype || message.datatype || 'json',
			type : memory.request || message.request || 'POST',
			
			success : function(data, status, request){
				var success = true;
				memory.data = data;
				memory.status = status;
				/**
				 *	If process is true, check for status value in JSON data received and set success variable accordingly
				**/
				if(message.process || false){
					if(data[message.status] || false){
						success = true;
						/**
						 *	Check for processflow definitions and execute them
						**/
						var run = data[message.processflow] || false;
						if(run){
							for(var i in run){
								run[i].service = ServiceClient.Registry.get(run[i].service);
							}
							return ServiceClient.Kernel.run(run);
						}
					}
					else {
						success = false;
					}
					/**
					 *	Replace data with data to be processed further using replace index
					**/
					if(message.replace || false){
						memory.data = data[message.replace];
					}
				}
				/**
				 *	If success is true, run the workflow; otherwise run the errorflow or display error message
				**/
				if(success){
					ServiceClient.Kernel.run(message.workflow, memory);
				}
				else {
					if(message.errorflow || false){
						ServiceClient.Kernel.run(message.errorflow, memory);
					}
					else {
						memory.view.html(memory.data);
					}
				}
			},
			error : function(request, status, error){
				memory.error = error;
				memory.status = status;
				memory.data ='<p class="error">The requested resource could not be loaded</p>';
				/**
				 *	Run the errorflow or display error message
				**/
				if(message.errorflow){
					ServiceClient.Kernel.run(message.errorflow, memory);
				}
				else {
					memory.view.html(memory.data);
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
