/**
 *	AjaxLoader loader
 *
 *	@param loadurl string
 *	@param loadparams object
 *	@param	datatype string
 *	@param request string
 *	@param workflow Workflow
 *	
 *	@param view View
 *
 *	@return data string
 *	@return status integer
 *
**/
ServiceClient.jquery.loader.AjaxLoader = {
	run : function(message, memory){
		memory.view.html('<p class="loading">Loading ...</p>');
		$.ajax({
			url: memory.loadurl || message.loadurl,
			data: memory.loadparams || message.loadparams || {},
			dataType : memory.datatype || message.datatype || 'json',
			type : memory.request || message.request || 'POST',
			success : function(data, status, request){
				memory.data = data;
				memory.status = status;
				ServiceClient.Kernel.run(message.workflow, memory);
			},
			error : function(request, status, error){
				memory.view.html('<p class="error">The requested resource could not be loaded</p>');
			}
		});
		
		/**
		 *	@return false 
		 *	to stop default browser event
		**/
		return false;
	}
};
