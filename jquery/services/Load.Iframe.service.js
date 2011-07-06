/**
 *	@service LoadIframe
 *	@desc Uses IFRAME to load data from server
 *
 *	@param agent string [message] 
 *	@param datatype string [message|memory] optional default 'json' ('json', 'html')
 *
 *	@param workflow Workflow [message]
 *	@param errorflow	Workflow [message] optional default false
 *
 *	@return data string [memory]
 *	@return error string [memory] optional
 *
**/
FireSpark.jquery.service.LoadIframe = {
	run : function(message, memory){
		
		/**
		 *	Genarate unique framename
		**/
		var d= new Date();
		var framename = 'firespark_iframe_' + d.getTime();
		
		/**
		 *	Set target attribute to framename in agent
		**/
		$(message.agent).attr('target', framename);
		
		/**
		 *	Create IFRAME and define callbacks
		**/
		var iframe = $('<iframe id="'+framename+'" name="'+framename+'" style="width:0;height:0;border:0px solid #fff;"></iframe>')
			.insertAfter(message.agent)
			.bind('load', function(){
				try {
					var frame = FireSpark.core.helper.getFrame(framename);
					var data = frame.document.body.innerHTML;
					switch(message.datatype){
						case 'html' :
							memory.data = data;
							break;
						case 'json' :
						default :
							memory.data = $.parseJSON(data);
							break;
					}
					
					/**
					 *	Run the workflow
					**/
					FireSpark.Kernel.run(message.workflow, memory);
				}
				catch(error){
					memory.error = error.description;
					memory.data = FireSpark.core.constant.loaderror + '[Error :' + error.description + ']';
					
					/**
					 *	Run the errorflow if any
					**/
					if(message.errorflow || false){
						FireSpark.Kernel.run(message.errorflow, memory);
					}
				}
			})
			.bind('error', function(error){
				memory.error = error;
				memory.data = FireSpark.core.constant.loaderror;
				
				/**
				 *	Run the errorflow if any
				**/
				if(message.errorflow || false){
					FireSpark.Kernel.run(message.errorflow, memory);
				}
			});
			
		/**
		 *	Remove IFRAME after timeout (150 seconds)
		**/
		window.setTimeout(function(){
			iframe.remove();
		}, 150000);
		
		/**
		 *	@return true 
		 *	to continue default browser event on iframe
		**/
		return true;
	}
};
