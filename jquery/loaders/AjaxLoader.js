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
			url: message.loadurl || message.loadurl,
			data: message.loadparams || {},
			dataType : message.datatype || 'json',
			type : message.request || 'POST',
			success : function(data, status, request){
				memory.data = data;
				memory.status = status;
				ServiceClient.Kernel.run(message.workflow, memory);
			},
			error : function(request, status, error){
				memory.view.html('<p class="error">The requested resource could not be loaded</p>');
			}
		});
		return true;
	}
};
