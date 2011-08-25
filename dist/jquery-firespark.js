/**
 *	@project FireSpark
 *	@desc JavaScript Service Computing Platform
 *
 *	@class FireSpark
 *	@desc Provides Registry and Kernel functionalities
 *	
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
 *	@desc Services are generic modules providing resuable stateless functionalities
 *
 *	@interface Service {
 *		public function input(){
 *			... returns array of required parameters and object of optional parameters
 *		}
 *		public function run(message, memory){
 *			... uses memory during execution for receiving and returning parameters
 *			... save reference in Registry, if required, instead of returning objects
 *		}
 *		public function output(){
 *			... returns array of parameters to return 
 *		}
 *	}
 *
 *	@format Message {
 *		service : (reference),
 *		... parameters ...
 *	}
 *
 *	@desc Workflows are array of services that use common memory for state management
 *
 *	@format workflow = [{	
 *		service : ...,
 *		( ... params : ... )
 *	}];
 *
 * 	@desc Navigator is compact way of representing messages
 *	@format Navigator root:name=value:name=value
 *
 *	@example #testtab:tabtitle=Krishna:loadurl=test.php
 *
 *	@escapes basic '=' with '~'
 *
 *	@escapes limited for usage in form id
 *	'#' by '_' 
 *	'=' by '.'
 *
 *	@escapes advanced (not implemented yet) using URL encoding
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
	var $references = new Array();
	
	/**
	 *	@var navigator roots array
	 *	@desc an array that saves roots to service workflows
	 *
	**/
	var $navigators = new Array();
	
	return {
		/**
		 *	@var Registry object
		 *	@desc manages references and navigator roots
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
			save : function($index, $reference){
				$references[$index] = $reference;
			},
			
			/**
			 *	@method get
			 *	@desc gets the Reference for index
			 *
			 *	@param index string
			 *
			**/
			get : function($index){
				return $references[$index];
			},
			
			/**
			 *	@method remove
			 *	@desc removes a Reference with index
			 *
			 *	@param index string
			 *
			**/
			remove : function($index){
				$references[$index] = 0;
			},
			
			/**
			 *	@method add
			 *	@desc adds a Navigator root 
			 *
			 *	@param root string
			 *	@param workflow object
			 *
			**/
			add : function($root, $workflow){
				$navigators[$root] = $workflow;
			},
			
			/**
			 *	@method removeNavigator
			 *	@desc removes a Navigator root
			 *
			 *	@param root string
			 *
			**/
			removeNavigator : function($root){
				$navigators[$root] = 0;
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
			 *	@method execute
			 *	@desc executes a workflow with the given definition
			 *
			 *	@param message object Workflow definition
			 *	@param memory object optional default {}
			 *
			**/
			execute : function($workflow, $memory){
				/**
				 *	create a new memory if not passed
				**/
				$memory = $memory || {};
				$memory['valid'] = $memory['valid'] || true;
			
				for(var $i in $workflow){
					var $message = $workflow[$i];
					
					/**
					 *	Check for non strictness
					**/
					var $nonstrict = $message['nonstrict'] || false;
					
					/**
					 *	Continue on invalid state if non-strict
					**/
					if($memory['valid'] !== true && $nonstrict !== true)
						continue;
					
					/**
					 *	run the service with the message and memory
					**/
					$memory = this.run($message, $memory);
				}
				
				return $memory;
			},
			
			/** 
			 *	@method run
			 *	@desc runs a service with the given definition
			 *
			 *	@param message object Service definition
			 *	@param memory object optional default {}
			 *
			**/
			run : function($message, $memory){
				/**
				 *	Read the service instance
				**/
				var $service = $message['service'];
				
				/**
				 *	Read the service arguments
				**/
				var $args = $message['args'] || [];
				
				/**
				 *	Copy arguments if necessary
				**/
				for(var $i in $args){
					var $key = $args[$i];
					$message[$key] = $message[$key] || $memory[$key] || false
				}
				
				/**
				 *	Read the service input
				**/
				var $input = $message['input'] || {};
				var $sin = $service.input();
				var $sinreq = $sin['required'] || [];
				var $sinopt = $sin['optional'] || {};
				
				/**
				 *	Copy required input if not exists (return valid false if value not found)
				**/
				for(var $i in $sinreq){
					var $key = $sinreq[$i];
					var $param = $input[$key] || $key;
					$message[$key] = $message[$key] || $memory[$param] || false;
					if($message[$key] === false){
						$memory['valid'] = false;
						return $memory;
					}
				}
				
				/**
				 *	Copy optional input if not exists
				**/
				for(var $key in $sinopt){
					var $param = $input[$key] || $key;
					$message[$key] = $message[$key] || $memory[$param] || $sinopt[$key];
				}
				
				/**
				 *	Run the service with the message as memory
				**/
				$message = $service.run($message);
				
				/**
				 *	Read the service output and return if not valid
				**/
				var $output = [];
				$memory['valid'] = $message['valid'] || false;
				if($memory['valid']){
					$output = $message['output'] || [];
				}
				else {
					return $memory;
				}
				var $sout = $service.output();
				
				/**
				 *	Copy output
				**/
				for(var $i in $sout){
					var $key = $sout[$i];
					var $param = $output[$key] || $key;
					$memory[$param] = $message[$key] || false;
				}
				
				/**
				 *	Return the memory
				**/
				return $memory;
			},
			
			/**
			 *	@method launch
			 *	@desc processes the navigator received to launch workflows
			 *
			 *	@param navigator string
			 *	@param escaped boolean optional default false
			 *
			**/
			launch : function($navigator, $escaped){
				
				/**
				 *	Process escaped navigator
				**/
				if($escaped || false){
					$navigator = $navigator.replace(/_/g, '#');
					$navigator = $navigator.replace(/\./g, '=');
				}
				//$navigator = $navigator.replace(/\+/g, '%20');
				
				/**
				 *	Parse navigator
				 **/
				var $req = $navigator.split(':');
				var $index = $req[0];
				
				/**
				 *	Construct message for workflow
				**/
				var $message = {};
				for(var $i=1, $len=$req.length; $i<$len; $i++){
					var $param = ($req[$i]).split('=');
					var $arg = $param[1];
					$arg = $arg.replace(/~/g, '=');
					//$arg = unescape($arg);
					$message[$param[0]] = $arg;
				}
				
				/**
				 *	Run the workflow and return the valid value
				**/
				if($navigators[$index] || false){
					$message['service'] = $navigators[$index];
					$message = this.run($message, {});
					return $message['valid'];
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
/** *	@service LoadConfirm *	@desc Confirms whether to continue  * *	@param confirm boolean [memory] optional default false *	@param value string [memory] ***/FireSpark.core.service.LoadConfirm = {	input : function(){		return {			required : ['value'],			optional : { confirm : false }		}	},		run : function($memory){		if($memory['confirm']){			$memory['valid'] = confirm($memory['value']);			return $memory;		}		$memory['valid'] = true;		return $memory;	},		output : function(){		return [];	}};/** *	@service WindowReload *	@desc Reloads the window ***/FireSpark.core.service.WindowReload = {	input : function(){		return {};	},		run : function($memory){		window.location.reload();		$memory['valid'] = false;		return $memory;	},		output : function(){		return [];	}};/** *	@helper DataSplit * *	@param data *	@param separator optional default : ***/FireSpark.core.helper.dataSplit = function($data, $separator){	$separator = $separator || ':';	return $data.split($separator);}/** *	Equals helper * *	@param value1 *	@param value2 ***/FireSpark.core.helper.equals = function(value1, value2){	return value1==value2;}/** *	GetDate helper * *	@param time ***/FireSpark.core.helper.getDate = function(time){	var d = new Date(time);	return d.toDateString();}/** *	@helper GetFrame * *	@param name ***/FireSpark.core.helper.getFrame = function(name){	for (var i = 0; i < frames.length; i++){		if (frames[i].name == name)			return frames[i];	}		return false;}/**
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
/** *	@service CookieMake *	@desc Creates a new Cookie * *	@param key string [message] *	@param value string [message] *	@param expires integer[message] default 1 day ***/FireSpark.jquery.service.CookieMake = {	input : function(){		return {			required : ['key', 'value'],			optional : { expires : 1 }		};	},		run : function($memory){		$.cookie($memory['key'], $memory['value'], {			expires : $memory['expires']		});		$memory['valid'] = true;		return $memory;	},		output : function(){		return [];	}};/** *	@service DataEncode *	@desc Encodes data from url-encoded other formats * *	@param type string [memory] optional default 'url' ('url', 'json', 'rest-id') *	@param data string [memory] optional default false *	@param url string [memory] optional default false * *	@return data object [memory] *	@return result string [memory] *	@return mime string [memory] *	@return url string [memory] ***/FireSpark.jquery.service.DataEncode = {	input : function(){		return {			optional : { type : 'url', data : false, url : '' }		}	},		run : function($memory){		var $data = $memory['data'];		var $type = $memory['type'];		var $mime =  'application/x-www-form-urlencoded';				if($data !== false && $data != ''){			$data = $data.replace(/\+/g, '%20');			if($type != 'url'){				var $params = $data.split('&');				var $result = {};				for(var $i=0, $len=$params.length; $i<$len; $i++){					var $prm = ($params[$i]).split('=');					$result[$prm[0]] = unescape($prm[1]);				}				$memory['data'] = $data = $result;			}						switch($type){				case 'json' :					$data = JSON.stringify($data);					$mime =  'application/json';					break;								case 'rest-id' :					$memory['url'] = $memory['url'] + '/' + $data['id'];									case 'url' :				default :					break;			}		}				$memory['result'] = $data;		$memory['mime'] = $mime;		$memory['valid'] = true;		return $memory;	},		output : function(){		return ['data', 'result', 'mime', 'url'];	}};/** *	@service ElementButton *	@desc creates button UI element * *	@param selector string [memory] ***/FireSpark.jquery.service.ElementButton = {	input : function(){		return {};	},		run : function($memory){		$($memory['selector']).button();		$memory['valid'] = true;		return $memory;	},		output : function(){		return [];	}};/**
 *	@service ElementContent
 *	@desc Fills element with content and animates it and returns element in memory
 *
 *	@param element string [memory]
 *	@param select boolean [memory] optional default false
 *	@param data html/text [memory] optional default ''
 *	@param animation string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout')
 *	@param duration integer [memory] optional default 1000
 *	@param delay integer [memory] optional default 0
 *
 *	@return element element [memory]
 *
**/
FireSpark.jquery.service.ElementContent = {
	input : function(){
		return {
			required : ['element'],
			optional : { 
				select : false,
				data : '',
				animation : 'fadein',
				duration : 1000,
				delay : 0
			}
		};
	},
	
	run : function($memory){
		if($memory['select'] || false){
			var $element = $($memory['element']);
			if(!$element.length){
				$element = $('#main-container');
			}
		}
		else {
			$element = $memory['element'];
		}
		
		var $animation = $memory['animation'];
		var $duration = $memory['duration'];
		
		if($animation == 'fadein' || $animation == 'slidein'){
			$element.hide();
		}
		
		$element.html($memory['data']);
		$element.trigger('load');
		$element.delay($memory['delay']);
		
		switch($animation){
			case 'fadein' :
				$element.fadeIn($duration);
				break;
			case 'fadeout' :
				$element.fadeOut($duration);
				break;
			case 'slidein' :
				$element.slideDown($duration);
				break;
			case 'slideout' :
				$element.slideUp($duration);
				break;
			default :
				$element.html('Animation type not supported').fadeIn($duration);
				break;
		}
		
		$memory['element'] = $element;
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['element'];
	}
};
/** *	@service ElementEditor *	@desc creates editor UI element * *	@param selector string [memory] ***/FireSpark.jquery.service.ElementEditor = {	input : function(){		return {};	},		run : function($memory){		$element = $($memory['selector']);		$temp = $element;				$element.each(function($index, $el){			$name = $temp.attr('id') || $temp.attr('name');			$instance = CKEDITOR.instances[$name] || false;			if($instance){				try {					CKEDITOR.remove($instance);				}				catch(e) {}				delete $instance;			}			$temp = $temp.slice(1);		});				$element.ckeditor();		$memory['valid'] = true;		return $memory;	},		output : function(){		return [];	}};/** *	@service ElementState *	@desc Enables and disables element * *	@param element string [memory] optional default false *	@param disabled boolean [memory] optional default false ***/FireSpark.jquery.service.ElementState = {	input : function(){		return {			optional : { element : false, disabled : false }		};	},		run : function($memory){		if($memory['element']){			if($memory['disabled']){				$($memory['element']).attr('disabled', true);			}			else {				$($memory['element']).removeAttr('disabled');			}		}		$memory['valid'] = true;		return $memory;	},		output : function(){		return [];	}};/**
 *	@service ElementTab
 *	@desc Creates a new tab and returns the element
 *
 *	@param tabui string [memory]
 *  @param title string [memory]
 *  @param autoload boolean [memory] optional default false
 *  @param taburl string [memory] optional default false
 *
 *	@return element Element [memory]
 *
**/
FireSpark.jquery.service.ElementTab = {
	input : function(){
		return {
			required : ['tabui', 'title'],
			optional : { autoload : false,	taburl : false }
		};
	},
	
	run : function($memory){
		var $tabui = FireSpark.Registry.get($memory['tabui']);
		$memory['element'] = $tabui.add($memory['title'], $memory['autoload'], $memory['taburl']);
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['element'];
	}
};
/**
 *	@service ElementTabpanel
 *	@desc Creates a Tabpanel at element and saves a reference
 *
 *	@param element string [memory]
 *	@param select boolean [memory] optional default false
 *	@param savekey string [memory]
 *	@param cache boolean [memory] optional default false
 *	@param collapsible boolean [memory] optional default false
 *	@param event string [memory] optional default 'click'
 *	@param tablink boolean [memory] optional default false
 *	@param indexstart integer [memory] optional default 0
 *
 *	@save tabpanel object
 *
**/
FireSpark.jquery.service.ElementTabpanel = {
	input : function(){
		return {
			required : ['element', 'savekey'],
			optional : { 
				select : false, 
				cache : false,	
				collapsible : false, 
				event : 'click', 
				tablink : false, 
				indexstart : 0 
			}
		};
	},
	
	run : function($memory){
		if($memory['select']){
			var $element = $($memory['element']);
		}
		else {
			var $element = $memory['element'];
		}
		$element.hide();
		
		var $tab = new Array();
		var $index = $memory['indexstart'];
		
		var $options = {
			cache : $memory['cache'],
			collapsible : $memory['collapsible'],
			event : $memory['event'],
			tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>",
			add: function($event, $ui) {
				$tab[$index] = $($ui.panel);
			}
		};
		
		if($memory['tablink']){
			$options.load = function($event, $ui) {
				$('a', $ui.panel).click(function() {
					$($ui.panel).load(this.href);
					return false;
				});
			}
		}
		
		var $tabpanel = $element.tabs($options);
		$element.fadeIn(1000);
		
		$('.ui-icon-close').live( "click", function() {
			var $indx = $("li", $tabpanel).index($(this).parent());
			$tabpanel.tabs( "remove", $indx );
		});
		$index--;
		
		FireSpark.Registry.save($memory['savekey'], {
			add : function($tabtitle, $autoload, $taburl){
				$index++;
				var $url = '#ui-tab-' + $index;
				if($autoload || false){
					$url = $taburl;
				}
				$tabpanel.tabs('add', $url, $tabtitle);
				$tabpanel.tabs('select', '#ui-tab-' + $index);
				return $tab[$index];
			}
		});
		
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
/** *	@service FormRead *	@desc Serializes form into url-encoded data and reads form submit parameters * *	@param form string [memory] * *	@return url string [memory] *	@return request string [memory] *	@return data object [memory] ***/FireSpark.jquery.service.FormRead = {	input : function(){		return {			required : ['form']		};	},		run : function($memory){		var $form = $($memory['form']);				$memory['url'] = $form.attr('action');		$memory['request'] = $form.attr('method').toUpperCase();				var $params = $form.serialize();		var $d= new Date();		$params = $params + '&_ts=' +  $d.getTime();		$memory['data'] = $params;				$memory['valid'] = true;		return $memory;	},		output : function(){		return ['url', 'request', 'data'];	}};/** *	@service FormValidate *	@desc Validates form input values (required and email) using style class * *	@style .required *	@style .email * *	@param form string [memory] *	@param error string [memory] optional default p ***/FireSpark.jquery.service.FormValidate = {	input : function(){		return {			required : ['form'],			optional : { error : 'p' }		};	},		run : function($memory){		var $result = true;		var $error = $memory['error'];				var checkRequired = function($index, $el){			if($(this).val() == ''){				$result = false;				$(this).parent()					.next($error + '.error')					.slideDown(1000)					.delay(5000)					.slideUp(1000);				return false;			}		}		$($memory['form'] + ' .required').each(checkRequired);				var $emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;		var checkEmail = function($index, $el){			if(!$emailRegex.test($(this).val())){				$result = false;				$(this).parent()					.next($error + '.error')					.slideDown(1000)					.delay(5000)					.slideUp(1000);				return false;			}		}		$($memory['form'] + ' .email').each(checkEmail);				$memory['valid'] = $result;		return $memory;	},		output : function(){		return [];	}};/** *	@service LaunchMessage *	@desc Processes data to run workflows * *	@param data object [memory] optional default {} *	@param launch boolean [memory] optional default false *	@param status string [memory] optional default 'valid' *	@param message string [memory] optional default 'firespark' ***/FireSpark.jquery.service.LaunchMessage = {	input : function(){		return {			optional : { data : {}, launch : false, status : 'valid', message : 'firespark' }		};	},		run : function($memory){		if($memory['launch']){			var $status = $memory['status'];			var $data = $memory['data'] || {};			if($data[$status] || false){				var $key = $memory['message'];				var $workflow = $data[$key] || false;				if($workflow){					for(var $i in $workflow){						$workflow[$i].service = FireSpark.Registry.get($workflow[$i].service);					}					return FireSpark.Kernel.execute($workflow);				}			}		}			$memory['valid'] = true;		return $memory;	},		output : function(){		return [];	}};/**
 *	@service LoadAjax
 *	@desc Uses AJAX to load data from server
 *
 *	@param url string [memory]
 *	@param data object [memory] optional default ''
 *	@param type string [memory] optional default 'json'
 *	@param request string [memory] optional default 'POST'
 *	@param process boolean [memory] optional default false
 *	@param mime string [memory] optional default 'application/x-www-form-urlencoded'
 *
 *	@param workflow Workflow [memory]
 *	@param errorflow	Workflow [memory] optional default false
 *	@param stop boolean [memory] optional default false
 *
 *	@return data string [memory]
 *	@return error string [memory] optional
 *
**/
FireSpark.jquery.service.LoadAjax = {
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
				stop : false
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
				$memory['data'] = $data;
				//$memory['status'] = $status;
				
				/**
				 *	Run the workflow
				**/
				FireSpark.Kernel.execute($memory['workflow'], $memory);
			},
			
			error : function($request, $status, $error){
				$memory['error'] = $error;
				//$memory['status'] = $status;
				$memory['data'] = FireSpark.core.constant.loaderror + ' [Error : ' + $error + ']';
				
				/**
				 *	Run the errorflow if any
				**/
				if($memory['errorflow']){
					FireSpark.Kernel.execute($memory['errorflow'], $memory);
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
/**
 *	@service LoadIframe
 *	@desc Uses IFRAME to load data from server
 *
 *	@param agent string [memory] 
 *	@param type string [memory] optional default 'json' ('json', 'html')
 *
 *	@param workflow Workflow [memory]
 *	@param errorflow	Workflow [memory] optional default false
 *
 *	@return data string [memory]
 *	@return error string [memory] optional
 *
**/
FireSpark.jquery.service.LoadIframe = {
	input : function(){
		return {
			required : ['agent', 'workflow'],
			optional : { 
				type : 'json', 
				errorflow : false
			}
		}
	},
	
	run : function($memory){
		
		/**
		 *	Genarate unique framename
		**/
		var $d= new Date();
		var $framename = 'firespark_iframe_' + $d.getTime();
		
		/**
		 *	Set target attribute to framename in agent
		**/
		$($memory['agent']).attr('target', $framename);
		
		/**
		 *	Create IFRAME and define callbacks
		**/
		var $iframe = $('<iframe id="' + $framename + '" name="'+ $framename + '" style="width:0;height:0;border:0px solid #fff;"></iframe>')
			.insertAfter($memory['agent'])
			.bind('load', function(){
				try {
					var $frame = FireSpark.core.helper.getFrame($framename);
					var $data = $frame.document.body.innerHTML;
					switch($memory['type']){
						case 'html' :
							$memory['data'] = $data;
							break;
						case 'json' :
						default :
							$memory['data'] = $.parseJSON($data);
							break;
					}
					
					/**
					 *	Run the workflow
					**/
					FireSpark.Kernel.execute($memory['workflow'], $memory);
				}
				catch($error){
					$memory['error'] = $error.description;
					$memory['result'] = FireSpark.core.constant.loaderror + '[Error :' + $error.description + ']';
					
					/**
					 *	Run the errorflow if any
					**/
					if($memory['errorflow']){
						FireSpark.Kernel.execute($memory['errorflow'], $memory);
					}
				}
			})
			.bind('error', function($error){
				$memory['error'] = $error;
				$memory['result'] = FireSpark.core.constant.loaderror;
				
				/**
				 *	Run the errorflow if any
				**/
				if($memory['errorflow']){
					FireSpark.Kernel.execute($memory['errorflow'], $memory);
				}
			});
			
		/**
		 *	Remove IFRAME after timeout (150 seconds)
		**/
		window.setTimeout(function(){
			$iframe.remove();
		}, 150000);
		
		/**
		 *	@return true 
		 *	to continue default browser event with target on iframe
		**/
		return { valid : true };
	},
	
	output : function(){
		return [];
	}
};
/** *	@service NavigatorInit *	@desc Initializes navigator launch triggers * *	@param selector string [memory] *	@param event string [memory] optional default 'click' *	@param attribute string [memory] *	@param escaped boolean [memory] optional default false ***/FireSpark.jquery.service.NavigatorInit = {	input : function(){		return {			required : ['selector', 'attribute'],			optional : { event : 'click', escaped : false }		};	},		run : function($memory){		$($memory['selector']).live($memory['event'], function(){			var $navigator = $(this).attr($memory['attribute']);			if($memory['attribute'] == 'href' || false){				$navigator = unescape($navigator);			}			return FireSpark.Kernel.launch($navigator, $memory['escaped']);		});		$memory['valid'] = true;		return $memory;	},		output : function(){		return [];	}};/**
 *	@service TemplateApply
 *	@desc Applies template
 *
 *	@param template Template [memory]
 *	@param data object [memory] optional default {}
 *
 *	@return result html [memory]
 *
**/
FireSpark.jquery.service.TemplateApply = {
	input : function(){
		return {
			required : ['template'],
			optional : { data : {} }
		};
	},
	
	run : function($memory){
		$memory['result'] = $.tmpl($memory['template'], $memory['data']);
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['result'];
	}
};
/**
 *	@service TemplateRead
 *	@desc Reads template definition into memory
 *
 *	@param data object [memory] optional default {}
 *	@param key string [memory] optional default 'template'
 *	@param template string [memory] optional default 'tpl-default' (FireSpark.jquery.template.Default)
 *
 *	@param result Template [memory]
 *	@param data object [memory]
 *
**/
FireSpark.jquery.service.TemplateRead = {
	input : function(){
		return {
			optional : { data : {}, key : 'template', template : 'tpl-default' }
		};
	},
	
	run : function($memory){
		if($memory['data'][$memory['key']]){
			$memory['result'] = $.template($memory['data'][$memory['key']]);
		}
		else if ($memory['data']['message'] && $memory['data']['message'][$memory['key']]){
			$memory['result'] = $.template($memory['data']['message'][$memory['key']]);
			$memory['data']['content'] = $memory['data']['message']['content'] || false;
		}
		else {
			$memory['result'] = FireSpark.Registry.get($memory['template']);
		}
		
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['result', 'data'];
	}
};
/** *	@workflow BindTemplate *	@desc Binds template with data into element * *	@param cntr string [memory] *	@param select boolean [memory] optional default true *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout') *	@param dur integer [memory] optional default 1000 *	@param dly integer [memory] optional default 0 * *	@param key string [memory] optional default 'template' *	@param tpl string [memory] optional default 'tpl-default' *	@param arg string [memory] optional default {} * *	@return element element [memory] ***/FireSpark.jquery.workflow.BindTemplate = {	input : function(){		return {			required : ['cntr'],			optional : { 				select : true, 				anm : 'fadein',				dur : 1000,				dly : 0, 				key : 'template', 				tpl : 'tpl-default' ,				arg : ''			}		};	},		run : function($memory){		$memory = FireSpark.Kernel.execute([{			service : FireSpark.jquery.service.DataEncode,			input : { data : 'arg' },			type : 'json'		},{ 			service : FireSpark.jquery.workflow.TemplateApply,			input : {				element : 'cntr',				template : 'tpl', 				animation : 'anm',				duration : 'dur',				delay : 'dly'			}		}], $memory);				$memory['valid'] = true;		return $memory;	},		output : function(){		return ['element'];	}};/** *	@workflow CookieLogin *	@desc Sign in using Cookie * *	@param key string [message] optional default 'sessionid' *	@param value string [message] *	@param expires integer[message] default 1 day ***/FireSpark.jquery.workflow.CookieLogin = {	input : function(){		return {			required : ['value'],			optional : { key : 'sessionid', expires : 1 }		}	},		run : function($memory){		return FireSpark.Kernel.execute([{			service : FireSpark.jquery.service.CookieMake		},{			service : FireSpark.core.service.WindowReload		}], $memory);	},		output : function(){		return [];	}};/** *	@workflow ElementHtml *	@desc Loads HTML content into container * *	@param url URL [memory] *	@param cntr string [memory] *	@param ld string [memory] optional default FireSpark.core.constant.loadmsg *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout') *	@param dur integer [memory] optional default 1000 *	@param dly integer [memory] optional default 0 ***/FireSpark.jquery.workflow.ElementHtml = {	input : function(){		return {			required : ['url', 'cntr'],			optional : { 				loaddata : FireSpark.core.constant.loadmsg,				anm : 'fadein',				dur : 1000,				dly : 0			}		};	},		run : function($memory){		return FireSpark.Kernel.execute([{			service : FireSpark.jquery.workflow.LoadHtml,			input : { element : 'cntr', animation : 'anm', duration : 'dur', delay : 'dly', loaddata : 'ld' },			select : true		}], $memory);	},		output : function(){		return [];	}};/** *	@workflow ElementTemplate *	@desc Loads template with data into container * *	@param cntr string [message] * *	@param loader object [memory] optional default FireSpark.jquery.service.LoadAjax *	@param agent string [memory] optional default false * *	@param loaddata string [memory] optional default FireSpark.core.constant.loadmsg *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout') *	@param dur integer [memory] optional default 1000 *	@param dly integer [memory] optional default 0 * *	@param key string [memory] optional default 'template' *	@param tpl string [memory] optional default 'tpl-default' * *	@param cf boolean [memory] optional default false *	@param confirmmsg string [memory] optional default 'Are you sure you want to continue ?' *	@param sel string [memory] optional default false *	@param ec string [memory] optional default 'url' ('url', 'json') * *	@param url URL [memory] *	@param arg string [memory] optional default '' *	@param type string [memory] optional default 'json' *	@param request string [memory] optional default 'POST' *	@param workflowend Workflow [memory] optional default { service : FireSpark.jquery.workflow.TemplateApply } *	@param errorflowend Workflow [memory] optional default { service : FireSpark.jquery.service.ElementContent } * *	@param ln boolean [memory] optional default false *	@param status string [memory] optional default 'valid' *	@param message string [memory] optional default 'firespark' ***/FireSpark.jquery.workflow.ElementTemplate = {	input : function(){		return {			required : ['cntr', 'url'],			optional : { 				loader : FireSpark.jquery.service.LoadAjax,				agent : false,				loaddata : FireSpark.core.constant.loadmsg,				anm : 'fadein',				dur : 1000,				dly : 0, 				key : 'template', 				tpl : 'tpl-default' ,				cf : false,				confirmmsg : 'Are you sure you want to continue ?',				sel : false,				ec : 'url',				arg : '',				type : 'json',				request : 'POST',				workflowend : { service : FireSpark.jquery.workflow.TemplateApply },				errorflowend :  { service : FireSpark.jquery.service.ElementContent },				ln : false,				status : 'valid',				message : 'firespark'			}		};	},		run : function($memory){		return FireSpark.Kernel.execute([{			service : FireSpark.jquery.workflow.LoadTemplate,			input : { 				element : 'cntr', 				template : 'tpl', 				data : 'arg', 				confirm : 'cf', 				selector : 'sel', 				encode : 'ec', 				launch : 'ln' ,				animation : 'anm',				duration : 'dur',				delay : 'dly'			},			select : true,			stop : true		}], $memory);	},		output : function(){		return [];	}};/** *	@workflow FormSubmit *	@desc Submits form using ajax or iframe and loads template with response data into div.status in form * *	@param sel form-parent selector string *	@param iframe string [memory] optional default false *	@param error string [memory] optional default p * *	@param loaddata string [memory] optional default FireSpark.core.constant.loadmsg *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout') *	@param dur integer [memory] optional default 1000 *	@param dly integer [memory] optional default 0 * *	@param key string [memory] optional default 'template' *	@param tpl string [memory] optional default 'tpl-default' * *	@param cf boolean [memory] optional default false *	@param confirmmsg string [memory] optional default 'Are you sure you want to continue ?' *	@param ec string [memory] optional default 'url' ('url', 'json') * *	@param type string [memory] optional default 'json' *	@param workflowend Workflow [memory] optional default { service : FireSpark.jquery.workflow.TemplateApply } *	@param errorflowend Workflow [memory] optional default { service : FireSpark.jquery.service.ElementContent } * *	@param ln boolean [memory] optional default false *	@param status string [memory] optional default 'valid' *	@param message string [memory] optional default 'firespark' ***/FireSpark.jquery.workflow.FormSubmit = {	input : function(){		return {			required : ['sel'],			optional : { 				iframe : false,				error : 'p',				loaddata : FireSpark.core.constant.loadmsg,				anm : 'fadein',				dur : 1000,				dly : 0, 				key : 'template', 				tpl : 'tpl-default' ,				cf : false,				confirmmsg : 'Are you sure you want to continue ?',				ec : 'url',				type : 'json',				workflowend : { service : FireSpark.jquery.workflow.TemplateApply },				errorflowend : { service : FireSpark.jquery.service.ElementContent },				ln : false,				status : 'valid',				message : 'firespark'			}		};	},		run : function($memory){		if($memory['iframe']){			var $loader = FireSpark.jquery.service.LoadIframe;		}		else {			var $loader = FireSpark.jquery.service.LoadAjax;		}				return FireSpark.Kernel.execute([{			service : FireSpark.jquery.service.FormValidate,			form : $memory['sel'] + ' form'		},{			service : FireSpark.jquery.service.FormRead,			form : $memory['sel'] + ' form'		},{			service : FireSpark.jquery.workflow.LoadTemplate,			input : { 				template : 'tpl', 				confirm : 'cf', 				encode : 'ec', 				launch : 'ln' ,				animation : 'anm',				duration : 'dur',				delay : 'dly'			},			loader : $loader,			element : $memory['sel'] +' div.status',			select : true,			selector : $memory['sel'] + ' input[name=submit]',			agent : $memory['sel'] + ' form'		}], $memory);	},		output : function(){		return [];	}};/** *	@workflow LoadHtml *	@desc Loads HTML content into element * *	@param url URL [memory] *	@param element string [memory] *	@param select boolean [memory] optional default false *	@param loaddata string [memory] optional default FireSpark.core.constant.loadmsg *	@param animation string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout') *	@param duration integer [memory] optional default 1000 *	@param delay integer [memory] optional default 0 * *	@return element element [memory] ***/FireSpark.jquery.workflow.LoadHtml = {	input : function(){		return {			required : ['url', 'element'],			optional : { 				select : false, 				loaddata : FireSpark.core.constant.loadmsg,				animation : 'fadein',				duration : 1000,				delay : 0			}		};	},		run : function($memory){		return FireSpark.Kernel.execute([{			service : FireSpark.jquery.service.ElementContent,			input : { data : 'loaddata' },			duration : 5		},{			service : FireSpark.jquery.service.LoadAjax,			type : 'html',			args : ['element', 'animation', 'duration', 'delay'],			workflow : [{				service : FireSpark.jquery.service.ElementContent			}],			errorflow : [{				service : FireSpark.jquery.service.ElementContent			}]		}], $memory);	},		output : function(){		return [];	}};/** *	@workflow LoadTemplate *	@desc Loads template with data into element * *	@param loader object [memory] optional default FireSpark.jquery.service.LoadAjax *	@param agent string [memory] optional default false * *	@param element string [memory] *	@param select boolean [memory] optional default false *	@param loaddata string [memory] optional default FireSpark.core.constant.loadmsg *	@param animation string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout') *	@param duration integer [memory] optional default 1000 *	@param delay integer [memory] optional default 0 * *	@param key string [memory] optional default 'template' *	@param template string [memory] optional default 'tpl-default' * *	@param confirm boolean [memory] optional default false *	@param confirmmsg string [memory] optional default 'Are you sure you want to continue ?' *	@param selector string [memory] optional default false *	@param encode string [memory] optional default 'url' ('url', 'json') * *	@param url URL [memory] *	@param data string [memory] optional default  *	@param type string [memory] optional default 'json' *	@param request string [memory] optional default 'POST' *	@param workflowend Workflow [memory] optional default { service : FireSpark.jquery.workflow.TemplateApply } *	@param errorflowend Workflow [memory] optional default { service : FireSpark.jquery.service.ElementContent } *	@param stop boolean [memory] optional default false * *	@param launch boolean [memory] optional default false *	@param status string [memory] optional default 'valid' *	@param message string [memory] optional default 'firespark' * *	@return element element [memory] ***/FireSpark.jquery.workflow.LoadTemplate = {	input : function(){		return {			required : ['element', 'url'],			optional : { 				loader : FireSpark.jquery.service.LoadAjax,				agent : false,				select : false, 				loaddata : FireSpark.core.constant.loadmsg,				animation : 'fadein',				duration : 1000,				delay : 0, 				key : 'template', 				template : 'tpl-default' ,				confirm : false,				confirmmsg : 'Are you sure you want to continue ?',				selector : false,				encode : 'url',				data : '',				type : 'json',				request : 'POST',				workflowend : { service : FireSpark.jquery.workflow.TemplateApply },				errorflowend :  { service : FireSpark.jquery.service.ElementContent },				stop : false,				launch : false,				status : 'valid',				message : 'firespark'			}		};	},		run : function($memory){		return FireSpark.Kernel.execute([{			service : FireSpark.core.service.LoadConfirm,			input : { value : 'confirmmsg' }		},{			service : FireSpark.jquery.service.DataEncode,			input : { type : 'encode' },			output : { result : 'data' }		},{			service : FireSpark.jquery.service.ElementState,			input : { element : 'selector' },			disabled : true		},{			service : FireSpark.jquery.service.ElementContent,			input : { data : 'loaddata' },			duration : 5		},{			service : $memory['loader'],			args : ['element', 'selector', 'template', 'animation', 'duration', 'delay', 'key', 'launch', 'status', 'message'],			workflow : [{				service : FireSpark.jquery.service.ElementState,				input : { element : 'selector' }			},{				service : FireSpark.jquery.service.LaunchMessage			},				$memory['workflowend']			],			errorflow : [{				service : FireSpark.jquery.service.ElementState,				input : { element : 'selector' }			}, 				$memory['errorflowend']			]		}], $memory);	},		output : function(){		return [];	}};/** *	@workflow TabTemplate *	@desc Loads template with data into new tab in tabui * *	@param tabui string [message] optional default 'tabuipanel' *	@param title string [message] optional default 'Krishna' * *	@param loader object [memory] optional default FireSpark.jquery.service.LoadAjax *	@param agent string [memory] optional default false * *	@param loaddata string [memory] optional default FireSpark.core.constant.loadmsg *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout') *	@param dur integer [memory] optional default 1000 *	@param dly integer [memory] optional default 0 * *	@param key string [memory] optional default 'template' *	@param tpl string [memory] optional default 'tpl-default' * *	@param cf boolean [memory] optional default false *	@param confirmmsg string [memory] optional default 'Are you sure you want to continue ?' *	@param sel string [memory] optional default false *	@param ec string [memory] optional default 'url' ('url', 'json') * *	@param url URL [memory] *	@param arg string [memory] optional default '' *	@param type string [memory] optional default 'json' *	@param request string [memory] optional default 'POST' *	@param workflowend Workflow [memory] optional default { service : FireSpark.jquery.workflow.TemplateApply } *	@param errorflowend Workflow [memory] optional default { service : FireSpark.jquery.service.ElementContent } * *	@param ln boolean [memory] optional default false *	@param status string [memory] optional default 'valid' *	@param message string [memory] optional default 'firespark' ***/FireSpark.jquery.workflow.TabTemplate = {	input : function(){		return {			required : ['url'],			optional : { 				tabui : 'tabuipanel',				title : 'Krishna',				loader : FireSpark.jquery.service.LoadAjax,				agent : false,				loaddata : FireSpark.core.constant.loadmsg,				anm : 'fadein',				dur : 1000,				dly : 0, 				key : 'template', 				tpl : 'tpl-default' ,				cf : false,				confirmmsg : 'Are you sure you want to continue ?',				sel : false,				ec : 'url',				arg : '',				type : 'json',				request : 'POST',				workflowend : { service : FireSpark.jquery.workflow.TemplateApply },				errorflowend :  { service : FireSpark.jquery.service.ElementContent },				ln : false,				status : 'valid',				message : 'firespark'			}		};	},		run : function($memory){		return FireSpark.Kernel.execute([{			service : FireSpark.jquery.service.ElementTab		},{			service : FireSpark.jquery.workflow.LoadTemplate,			input : { 				template : 'tpl', 				data : 'arg', 				confirm : 'cf', 				selector : 'sel', 				encode : 'ec', 				launch : 'ln' ,				animation : 'anm',				duration : 'dur',				delay : 'dly'			},			stop : true		}], $memory);	},		output : function(){		return [];	}};/** *	@workflow TemplateApply *	@desc Applies template with data * *	@param element string [memory] *	@param select boolean [memory] optional default false *	@param template string [memory] optional default 'tpl-default' *	@param data object [memory] optional default {} *	@param key string [memory] optional default 'template' *	@param animation string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout') *	@param duration integer [memory] optional default 1000 *	@param delay integer [memory] optional default 0 * *	@return element element [memory] ***/FireSpark.jquery.workflow.TemplateApply = {	input : function(){		return {			required : ['element'],			optional : { 				select : false, 				data : {}, 				key : 'template', 				template : 'tpl-default' ,				animation : 'fadein',				duration : 1000,				delay : 0			}		};	},		run : function($memory){		return FireSpark.Kernel.execute([{				service : FireSpark.jquery.service.TemplateRead			},{				service : FireSpark.jquery.service.TemplateApply,				input : { template : 'result' }			},{				service : FireSpark.jquery.service.ElementContent,				input : { data : 'result' }			}], $memory);	},		output : function(){		return ['element'];	}};/**
 *	@template Default
**/
FireSpark.jquery.template.Default = $.template('\
	<p class="{{if valid}}success{{else}}error{{/if}}">${msg}</p>\
');

FireSpark.Registry.save('tpl-default', FireSpark.jquery.template.Default);
