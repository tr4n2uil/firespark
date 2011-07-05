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
 *	basic escape = with ~
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
				var message = {};
				for(var i=1, len=req.length; i<len; i++){
					var param = (req[i]).split('=');
					var arg = param[1];
					arg = arg.replace(/~/g, '=');
					message[param[0]] = arg;
				}
				
				/**
				 *	Run the workflow
				**/
				if(navigators[index] || false){
					message['service'] = navigators[index];
					return this.run([message]);
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
/** *	@service LoadConfirm *	@desc Confirms whether to continue  * *	@param confirm boolean [message] *	@param value string [message] ***/FireSpark.core.service.LoadConfirm = {	run : function(message, memory){		if(message.confirm || false){			return confirm(message.value);		}		return true;	}};/** *	@service WindowReload *	@desc Reloads the window ***/FireSpark.core.service.WindowReload = {	run : function(message, memory){		window.location.reload();		return false;	}};/** *	Equals helper * *	@param value1 *	@param value2 ***/FireSpark.core.helper.equals = function(value1, value2){	return value1==value2;}/** *	GetDate helper * *	@param time ***/FireSpark.core.helper.getDate = function(time){	var d = new Date(time);	return d.toDateString();}/**
 *	@helper readFileSize
 *
**/
FireSpark.core.helper.readFileSize = function(size){
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
 *	@desc Fills element with content and animates it and returns element in memory
 *
 *	@param element string [message|memory]
 *	@param data html/text [message|memory] optional default ''
 *	@param animation string [message] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout')
 *	@param duration integer [message] optional default 1000
 *	@param delay integer [message] optional default 0
 *
 *	@return element element [memory]
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
		
		var animation = message.animation || 'fadein';
		var duration = message.duration || 1000;
		
		if(animation == 'fadein' || animation == 'slidein'){
			element.hide();
		}
		
		element.html(message.data || memory.data || '');
		element.delay(message.delay || 0);
		
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
		
		memory.element = element;
		
		return true;
	}
};
/** *	@service ElementState *	@desc Enables and disables element * *	@param element string [message] *	@param disabled boolean [message] optional default false ***/FireSpark.jquery.service.ElementState = {	run : function(message, memory){		if(message.element || false){			if(message.disabled || false){				$(message.element).attr('disabled', true);			}			else {				$(message.element).removeAttr('disabled');			}		}		return true;	}};/**
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
/** *	@service FormRead *	@desc Serializes form into url-encoded data and reads form submit parameters * *	@param form string [message] * *	@return loadurl string [memory] *	@return request string [memory] *	@return loadparams object [memory] ***/FireSpark.jquery.service.FormRead = {	run : function(message, memory){		var form = $(message.form);				memory.loadurl = form.attr('action');		memory.request = form.attr('method').toUpperCase();				var params = form.serialize();		var d= new Date();		params = params + '&_ts='+ d.getTime();		memory.loadparams = params;				return true;	}};/** *	@service FormValidate *	@desc Validates form input values (required and email) using style class * *	@style .required *	@style .email * *	@param form string [message] ***/FireSpark.jquery.service.FormValidate = {	run : function(message, memory){		var result = true;				var checkRequired = function(index, el){			if($(this).val() == ''){				result = false;				$(this).parent()					.next('p.error')					.slideDown(1000)					.delay(5000)					.slideUp(1000);				return false;			}		}		$(message.form + ' .required').each(checkRequired);				var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;		var checkEmail = function(index, el){			if(!emailRegex.test($(this).val())){				result = false;				$(this).parent()					.next('p.error')					.slideDown(1000)					.delay(5000)					.slideUp(1000);				return false;			}		}		$(message.form + ' .email').each(checkEmail);				return result;	}};/**
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
/** *	@service NavigatorInit *	@desc Initializes navigator launch triggers * *	@param selector string [message] *	@param event string [message] optional default 'click' *	@param attribute string [message] *	@param escaped boolean [message] optional default false ***/FireSpark.jquery.service.NavigatorInit = {	run : function(message, memory){		var result = $(message.selector);		result.live(message.event || 'click', function(){			return FireSpark.Kernel.launch($(this).attr(message.attribute), message.escaped || false);		});		return true;	}};/** *	@service RequestWrite *	@desc Processes loadparams from url-encoded other formats * *	@param type string [message] optional default 'url' ('url', 'json') *	@param loadparams object [message|memory] optional default false * *	@return loadparams object [memory] ***/FireSpark.jquery.service.RequestWrite = {	run : function(message, memory){		var arg = message.loadparams || memory.loadparams || false;		var type = message.type || 'url';				if(arg !== false){			if(type != 'url'){				var params = arg.split('&');				var result = new Object();				for(var i=0, len=params.length; i<len; i++){					var prm = (params[i]).split('=');					result[prm[0]] = prm[1];				}				arg = result;			}						switch(type){				case 'json' :					arg = JSON.stringify(arg);					break;									case 'url' :				default :					break;			}		}		memory.loadparams = arg;				return true;	}};/** *	@service ResponseRead *	@desc Processes response to run workflows * *	@param data object [memory] *	@param process boolean [message] optional default false *	@param status string [message] optional default 'valid' *	@param processflow Workflow [message] optional default 'run' *	@param replace string [message] optional default false * *	@return response object [memory] optional ***/FireSpark.jquery.service.ResponseRead = {	run : function(message, memory){		if(message.process || false){			var status = message.status || 'valid';			var data = memory.data || {};			if(data[status] || false){				var runkey = message.processflow || 'run';				var run = data[runkey] || false;				if(run){					for(var i in run){						run[i].service = FireSpark.Registry.get(run[i].service);					}					return FireSpark.Kernel.run(run);				}			}			if(message.replace || false){				memory.response = data;				memory.data = data[message.replace];			}		}			return true;	}};/**
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
 *	@param template string [message] optional default FireSpark.jquery.template.Default
 *
 *	@param template template [memory]
 *
**/
FireSpark.jquery.service.TemplateRead = {
	run : function(message, memory){
		if(memory.data.template || false){
			memory.template = $.template(memory.data.template);
		}
		else if(message.template || false){
			memory.template = FireSpark.Registry.get(message.template);
		}
		else{
			memory.template = FireSpark.jquery.template.Default;
		}
		
		return true;
	}
};
/** *	@workflow AjaxSubmit * *	@param sel form-parent selector string *	@param loadmsg string [message] optional default (FireSpark.core.constant.loadmsg) *	@param tpl string [message|memory] *	@param cf boolean [message] optional default false ***/FireSpark.jquery.workflow.AjaxSubmit = {	run : function(message, memory){		return FireSpark.Kernel.run([{			service : FireSpark.jquery.service.FormValidate,			form : message.sel + ' form'		},{			service : FireSpark.jquery.service.FormRead,			form : message.sel + ' form'		},{			service : FireSpark.jquery.workflow.LoadTemplate,			url : message.url,			element : message.sel +' div.status',			template : message.tpl || false,			confirm : message.cf || false,			loadmsg : message.loadmsg || false		}], memory);	}};/** *	@workflow CookieLogin *	@desc Sign in using Cookie * *	@param key string [message] optional default 'sessionid' *	@param value string [message] *	@param expires integer[message] default 1 day ***/FireSpark.jquery.workflow.CookieLogin = {	run : function(message, memory){		return FireSpark.Kernel.run([{			service : FireSpark.jquery.service.CookieMake,			key : message.key || 'sessionid',			value : message.value,			expires : message.expires || 1		},{			service : FireSpark.core.service.WindowReload		}]);	}};/** *	@workflow ElementHtml *	@desc Loads HTML content into element * *	@param loadmsg string [message] optional default (FireSpark.core.constant.loadmsg) *	@param cntr string [message] *	@param url URL [message] ***/FireSpark.jquery.workflow.ElementHtml = {	run : function(message, memory){		return FireSpark.Kernel.run([{			service : FireSpark.jquery.workflow.LoadHtml,			url : message.url,			element : message.cntr		}], memory);	}};/** *	@workflow ElementTemplate * *	@param cntr string [message] *	@param loadmsg string [message] optional default (FireSpark.core.constant.loadmsg) *	@param url URL [message] *	@param tpl string [message|memory]  *	@param arg string [message] optional default false *	@param cf boolean [message] optional default false ***/FireSpark.jquery.workflow.ElementTemplate = {	run : function(message, memory){		return FireSpark.Kernel.run([{			service : FireSpark.jquery.workflow.LoadTemplate,			url : message.url,			element : message.cntr,			template : message.tpl || false,			confirm : message.cf || false,			loadparams : message.arg || false		}], memory);	}};/** *	@workflow IframeSubmit * *	@param sel form selector string *	@param val string ***/FireSpark.jquery.workflow.IframeSubmit = {		run : function(message, memory){		return FireSpark.Kernel.run([{			service : FireSpark.jquery.service.ElementState,			selector : message.sel + ' input[name=submit]',			disabled : true		},{			service : FireSpark.jquery.service.ElementContent,			element : message.sel + ' div.status',			data : message.loadmsg || FireSpark.core.constant.loadmsg,			duration : 10		}]);	}};	/** *	@workflow LoadHtml *	@desc Loads HTML content into element * *	@param url URL [message] *	@param element element [message|memory] ***/FireSpark.jquery.workflow.LoadHtml = {	run : function(message, memory){		return FireSpark.Kernel.run([{				service : FireSpark.jquery.service.ElementContent,				element : message.element || false,				data : message.loadmsg || FireSpark.core.constant.loadmsg,				duration : 10			},{			service : FireSpark.jquery.service.LoadAjax,			loadurl : message.url,			datatype : 'html',			workflow : [{				service : FireSpark.jquery.service.ElementContent			}],			errorflow : [{				service : FireSpark.jquery.service.ElementContent			}]		}], memory);	}};/** *	@workflow LoadTemplate * *	@param url URL [message] *	@param loadparams string/object [message|memory] *	@param encode string [message] optional default false *  *	@param element element [message|memory] *	@param loadmsg string [message] optional default (FireSpark.core.constant.loadmsg) * *	@param confirm boolean [message] optional default false *	@param confirmmsg string [message] optional default 'Are you sure you want to continue ?' *	@param selector string [message] optional default false * *	@param process boolean [message] optional default false * 	@param status string [message] optional default false * 	@param processflow string [message] optional default false * *	@param template string [message|memory] optional default false (FireSpark.jquery.template.Default) ***/FireSpark.jquery.workflow.LoadTemplate = {	run : function(message, memory){		return FireSpark.Kernel.run([{			service : FireSpark.core.service.LoadConfirm,			confirm : message.confirm || false,			value : message.confirmmsg || 'Are you sure you want to continue ?'		},{			service : FireSpark.jquery.service.RequestWrite,			loadparams : message.loadparams || false,			type : message.encode || false		},{			service : FireSpark.jquery.service.ElementState,			selector : message.selector || false,			disabled : true		},{			service : FireSpark.jquery.service.ElementContent,			element : message.element || false,			data : message.loadmsg || FireSpark.core.constant.loadmsg,			duration : 10		},{			service : FireSpark.jquery.service.LoadAjax,			loadurl : message.url,			processData : false,			workflow : [{				service : FireSpark.jquery.service.ResponseRead,				process : message.process || true,				status : message.status || false,				processflow : message.processflow || false,			},{				service : FireSpark.jquery.service.TemplateRead,				template : message.template || false			},{				service : FireSpark.jquery.service.TemplateApply			},{				service : FireSpark.jquery.service.ElementContent			}],			errorflow : [{				service : FireSpark.jquery.service.ElementState,				selector : message.selector || false			},{				service : FireSpark.jquery.service.ElementContent			}]		}], memory);	}};/** *	@workflow TabTemplate * *	@param tabui string [message] optional default 'tabuipanel' *	@param title string [message] optional default 'Krishna' *	@param loadmsg string [message] optional default (FireSpark.core.constant.loadmsg) *	@param url URL [message] optional default 'data.json.php' *	@param tpl string [message|memory]  ***/FireSpark.jquery.workflow.TabTemplate = {	run : function(message, memory){		return FireSpark.Kernel.run([{			service : FireSpark.jquery.service.ElementTab,			tabui : message.tabui || 'tabuipanel',			tabtitle : message.title || 'Krishna'		},{			service : FireSpark.jquery.workflow.LoadTemplate,			url : message.url || 'data.json.php',			template : message.tpl || 'tpl-test',			loadmsg : message.loadmsg || false		}], memory);	}};/**
 *	@template Default
**/
FireSpark.jquery.template.Default = $.template('\
	<p class="{{if valid}}success{{else}}error{{/if}}">${msg}</p>\
');

