/**
 *	@project FireSpark
 *	@desc JavaScript Service Architecture and Workflow Framework
 *
 *	@class FireSpark
 *	@desc Provides Registry and Kernel functionalities
 *	
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
 *	Services are generic modules providing resuable stateless functionalities
 *
 *	interface Service {
 *		public function run(message, memory){
 *			... use message for receiving configurations ...
 *			... use memory for managing state in workflows ...
 *			... save reference in Registry instead of returning objects ...
 *		}
 *	}
 *
 *	Workflows are array of services that use common memory for state management
 *
 *	workflow = [{	
 *		service : ...,
 *		( ... params : ... )
 *	}];
 *
 * 	Navigator is index (workflow alias) followed by parameters to be overrided delimited by ':'
 *	indexes usually starts with # (href programming)
 *
 *	example #testtab:tabtitle=Krishna:loadurl=test.php
 *
 *	escapes for usage in form id
 *	# by _ 
 *	= by .
 *	
**/

var FireSpark = (function(){
	/**
	 *	@var references array
	 *	@desc an array for saving references
	 *	
	 *	references may be accessed through the Registry
	 *
	**/
	var references = new Array();
	
	/**
	 *	@var navigators array
	 *	@desc an array that saves indexes to service workflows
	 *
	**/
	var navigators = new Array();
	
	return {
		/**
		 *	@var Registry object
		 *	@desc manages references and navigators
		 *
		**/
		Registry : {
			/**
			 *	@method save
			 *	@desc saves a Reference with index
			 *
			 *	@param index string
			 *	@param reference object or any type
			 *
			**/
			save : function(index, reference){
				references[index] = reference;
			},
			
			/**
			 *	@method get
			 *	@desc gets the Reference for index
			 *
			 *	@param index string
			 *
			**/
			get : function(index){
				return references[index];
			},
			
			/**
			 *	@method remove
			 *	@desc removes a Reference with index
			 *
			 *	@param index string
			 *
			**/
			remove : function(index){
				references[index] = 0;
			},
			
			/**
			 *	@method add
			 *	@desc adds a Navigator index
			 *
			 *	@param index string
			 *	@param workflow object
			 *
			**/
			add : function(index, workflow){
				navigators[index] = workflow;
			},
			
			/**
			 *	@method removeNavigator
			 *	@desc removes a Navigator index
			 *
			 *	@param index string
			 *
			**/
			removeNavigator : function(index){
				navigators[index] = 0;
			}
		},
		
		/**
		 *	@var Kernel object
		 *	
		 *	@desc manages the following tasks
		 *		runs services and workflows when requested
		 *		processes navigators when received and launch workflows
		 *
		**/
		Kernel : {			
			/** 
			 *	@method run
			 *	@desc executes a workflow with the given definition
			 *
			 *	@param config object
			 *	@param mem object optional default {}
			 *
			**/
			run : function(config, mem){
				/**
				 *	create a new memory if not passed
				**/
				var memory = mem || {};
				var result = true;
				
				for(var i in config){
					var service = config[i].service;
					var message = config[i];
					var strict = config[i].strict || true;
					
					/**
					 *	continue on invalid state
					**/
					if(result !== true && strict === true)
						continue;
					
					/**
					 *	run the service with the message and memory
					**/
					result = service.run(message, memory);
				}
				
				return result;
			},
			
			/**
			 *	@method launch
			 *	@desc processes the navigator received to launch workflows
			 *
			 *	@param navigator string
			 *	@param escaped boolean optional default false
			 *
			**/
			launch : function(navigator, escaped){
				
				/**
				 *	Process escaped navigator
				**/
				if(escaped || false){
					navigator = navigator.replace(/_/g, '#');
					navigator = navigator.replace(/\./g, '=');
				}
				
				/**
				 *	Parse navigator
				 **/
				var req = navigator.split(':');
				var index = req[0];
				
				/**
				 *	Construct message for workflow
				**/
				var message = new Array();
				for(var i=1, len=req.length; i<len; i++){
					var param = (req[i]).split('=');
					message[param[0]] = param[1];
				}
				
				/**
				 *	Run the workflow
				**/
				if(navigators[index] || false){
					$message['service'] = navigators[index];
					return this.run([$message]);
				}
				
				return false;
			}
		}
	};
})();
FireSpark.core = {};

FireSpark.core.service = {};
FireSpark.core.workflow = {};

FireSpark.core.helper = {};
FireSpark.core.constant = {};

FireSpark.core.constant.loadmsg = '<p class="loading">Loading ...</p>';
FireSpark.core.constant.loaderror = '<p class="error">The requested resource could not be loaded</p>';
/** *	@service LoadConfirm *	@desc Confirms whether to continue  * *	@param confirm boolean [message] *	@param value string [message] ***/FireSpark.core.service.LoadConfirm = {	run : function(message, memory){		if(message.confirm || false){			return confirm(message.value);		}		return true;	}};/** *	@service WindowReload *	@desc Reloads the window ***/FireSpark.core.service.WindowReload = {	run : function(message, memory){		window.location.reload();		return false;	}};/** *	Equals helper * *	@param value1 *	@param value2 ***/ServiceClient.jquery.helper.equals = function(value1, value2){	return value1==value2;}/** *	GetDate helper * *	@param time ***/ServiceClient.jquery.helper.getDate = function(time){	var d = new Date(time);	return d.toDateString();}/**
 *	@helper readFileSize
 *
**/
ServiceClient.jquery.helper.readFileSize = function(size){
	var kb = size/1024.0;
	if(kb > 1024.0){
		var mb = kb/1024.0;
		return mb.toFixed(2) + ' MB';
	}
	return kb.toFixed(2) + ' KB';
}
FireSpark.jquery = {};

FireSpark.jquery.service = {};
FireSpark.jquery.workflow = {};

FireSpark.jquery.helper = {};
FireSpark.jquery.constant = {};

FireSpark.jquery.template = {};
/** *	@service CookieMake *	@desc Creates a new Cookie * *	@param key string [message] *	@param value string [message] *	@param expires integer[message] default 1 day ***/FireSpark.jquery.service.CookieMake = {	run : function(message, memory){		$.cookie(message.key, message.value, {			expires : message.expires || 1		});		return true;	}};/**
 *	@service ElementContent
 *	@desc Fills element with content and animates it
 *
 *	@param element string [message|memory]
 *	@param data html/text [message|memory] optional default ''
 *	@param animation string [message] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout')
 *	@param duration integer [message] optional default 1000
 *	@param delay integer [message] optional default 0
 *
**/
FireSpark.jquery.service.ElementContent = {
	run : function(message, memory){
		if(message.element || false){
			var element = $(message.element);
		}
		else {
			var element = memory.element;
		}
		
		element.hide();
		element.html(message.data || memory.data || '');
		element.delay(message.delay || 0);
		
		var animation = message.animation || 'fadein';
		var duration = message.duration || 1000;
		
		switch(animation){
			case 'fadein' :
				element.fadeIn(duration);
				break;
			case 'fadeout' :
				element.fadeOut(duration);
				break;
			case 'slidein' :
				element.slideIn(duration);
				break;
			case 'slideout' :
				element.slideOut(duration);
				break;
			default :
				element.html('Animation type not supported').fadeIn(duration);
				break;
		}
		
		return true;
	}
};
/** *	@service ElementState *	@desc Enables and disables element * *	@param element string [message] *	@param disabled boolean [message] optional default false ***/FireSpark.jquery.service.ElementState = {	run : function(message, memory){		if(message.disabled || false){			$(message.element).attr('disabled', true);		}		else {			$(message.element).removeAttr('disabled');		}		return true;	}};/**
 *	@service ElementTab
 *	@desc Creates a new tab and returns the element
 *
 *	@param tabui string [message]
 *  @param tabtitle string [message]
 *  @param autoload boolean [message] optional default false
 *  @param taburl string [message] optional default false
 *
 *	@return element Element [memory]
 *
**/
FireSpark.jquery.service.ElementTab = {
	run : function(message, memory){
		var tabui = FireSpark.Registry.get(message.tabui);
		memory.element = tabui.add(message.tabtitle, message.autoload || false, message.taburl || false);
		return true;
	}
};
/**
 *	@service ElementTabpanel
 *	@desc Creates a Tabpanel at element and saves a reference
 *
 *	@param element string [message|memory]
 *	@param savekey string [message]
 *	@param cache boolean [message] optional default false
 *	@param collapsible boolean [message] optional default false
 *	@param event string [message] optional default 'click'
 *	@param tablink boolean [message] optional default false
 *	@param indexstart integer [message] optional default 0
 *
 *	@save tabpanel object
 *
**/
FireSpark.jquery.service.ElementTabpanel = {
	run : function(message, memory){
		if(message.element || false){
			var element = $(message.element);
		}
		else {
			var element = memory.element;
		}
		element.hide();
		
		var tab = new Array();
		var index = message.indexstart || 0;
		
		var options = {
			cache : message.cache || false,
			collapsible : message.collapsible || false,
			event : message.event || 'click',
			tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>",
			add: function( event, ui ) {
				tab[index] = $(ui.panel);
			}
		};
		
		if(message.tablink || false){
			options.load = function(event, ui) {
				$('a', ui.panel).click(function() {
					$(ui.panel).load(this.href);
					return false;
				});
			}
		}
		
		var tabpanel = element.tabs(options);
		element.fadeIn(1000);
		
		$('.ui-icon-close').live( "click", function() {
			var indx = $("li", tabpanel).index($(this).parent());
			tabpanel.tabs( "remove", indx );
		});
		index--;
		
		FireSpark.Registry.save(message.savekey, {
			add : function(tabtitle, autoload, taburl){
				index++;
				var url = '#ui-tab-'+index;
				if(autoload || false){
					url = taburl;
				}
				tabpanel.tabs('add', url, tabtitle);
				tabpanel.tabs('select', '#ui-tab-'+index);
				return tab[index];
			}
		});
		return true;
	}	
};
/** *	@service FormRead *	@desc Serializes form into url-encoded data and reads form submit parameters * *	@param form string [message] * *	@return loadurl string [memory] *	@return request string [memory] *	@return loadparams object [memory] ***/FireSpark.jquery.service.FormRead = {	run : function(message, memory){		var form = $(message.form);		memory.loadurl = form.attr('action');		memory.request = form.attr('method').toUpperCase();				var params = form.serialize();		var d= new Date();		params = params + '&_ts='+ d.getTime();		memory.loadparams = params;				return true;	}};/** *	@service FormValidate *	@desc Validates form input values (required and email) using style class * *	@style .required *	@style .email * *	@param form string [message] ***/FireSpark.jquery.service.FormValidate = {	run : function(message, memory){		var result = true;				var checkRequired = function(index, el){			if($(this).val() == ''){				result = false;				$(this).parent()					.next('p.error')					.slideDown(1000)					.delay(5000)					.slideUp(1000);				return false;			}		}		$(message.form + ' .required').each(checkRequired);				var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;		var checkEmail = function(index, el){			if(!emailRegex.test($(this).val())){				result = false;				$(this).parent()					.next('p.error')					.slideDown(1000)					.delay(5000)					.slideUp(1000);				return false;			}		}		$(message.form + ' .email').each(checkEmail);				return result;	}};/**
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
/** *	@service NavigatorInit *	@desc Initializes navigator launch triggers * *	@param selector string [message] *	@param event string [message] optional default 'click' *	@param attribute string [message] *	@param escaped boolean [message] optional default false ***/FireSpark.jquery.service.NavigatorInit = {	run : function(message, memory){		var result = $(message.selector);		result.live(message.event || 'click', function(){			return FireSpark.Kernel.launch($(this).attr(message.attribute), message.escaped || false);		});		return true;	}};/**
 *	@service TemplateApply
 *	@desc Applies template
 *
 *	@param template Template [message|memory]
 *	@param data object [message|memory]
 *
 *	@return data html [memory]
 *
**/
FireSpark.jquery.service.TemplateApply = {
	run : function(message, memory){
		memory.data = $.tmpl(message.template || memory.template, message.data || memory.data);
		return true;
	}
};
/**
 *	@service TemplateRead
 *	@desc Reads template definition into memory
 *
 *	@param data.template string [memory]
 *	@param template string [message]
 *
 *	@param template template [memory]
 *
**/
FireSpark.jquery.service.TemplateRead = {
	run : function(message, memory){
		if(memory.data.template || false){
			memory.template = $.template(memory.data.template);
		}
		else {
			memory.template = FireSpark.Registry.get(message.template);
		}
		return true;
	}
};
/** *	@workflow CookieLogin *	@desc Sign in using Cookie * *	@param key string [message] optional default 'sessionid' *	@param value string [message] *	@param expires integer[message] default 1 day ***/FireSpark.jquery.workflow.CookieLogin = {	run : function(message, memory){		return FireSpark.Kernel.run([{			service : FireSpark.jquery.service.CookieMake,			key : message.key || 'sessionid',			value : message.value,			expires : message.expires || 1		},{			service : FireSpark.core.service.WindowReload		}]);	}};/** *	@workflow LoadHtml * *	@param loadmsg string [message] optional default (FireSpark.core.constant.loadmsg) *	@param cntr string [message] *	@param url URL [message] ***/FireSpark.jquery.workflow.LoadHtml = {	run : function(message, memory){		return FireSpark.Kernel.run([{			service : FireSpark.jquery.service.ElementContent,			element : message.cntr,			data : message.loadmsg || FireSpark.core.constant.loadmsg,			duration : 10		},{			service : ServiceClient.jquery.loader.AjaxLoader,			loadurl : message.url,			datatype : 'html',			workflow : [{				service : ServiceClient.jquery.service.ElementContent,				element : message.cntr			}]		}]);	}};