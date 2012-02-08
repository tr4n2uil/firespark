/**
 * @initialize FireSpark
**/
FireSpark = {
	core : {
		service : {},
		workflow : {},
		helper : {},
		constant : {}
	},
	ui : {
		service : {},
		workflow : {},
		helper : {},
		constant : {},
		template : {}
	},
	smart : {
		service : {},
		workflow : {},
		helper : {},
		constant : {}
	}
};

/** *	@helper CheckEmail * *	@param index *	@param element * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.core.helper.CheckEmail = (function(){	var $emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;	return function($index, $el){		if(!$emailRegex.test($(this).val())){			FireSpark.core.service.CheckForm.result = false;			FireSpark.core.helper.checkFail($(this), FireSpark.core.constant.validation_status + ' .error');			return false;		}	}})();/** *	@helper CheckFail * *	@param element *	@param selector * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.core.helper.checkFail = function($el, $sel){	return $el.next($sel).stop(true, true).slideDown(1000).delay(5000).fadeOut(1000);}/** *	@service CheckForm *	@desc Validates form input values (required and email) using style class * *	@param form string [memory] *	@param validations array [memory] optional default FireSpark.core.constant.validations *	@param error string [memory] optional default span * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.core.service.CheckForm = {	result : true,		input : function(){		return {			required : ['form'],			optional : { error : 'span', validations : FireSpark.core.constant.validations }		};	},		run : function($memory){		FireSpark.core.service.CheckForm.result = true;		FireSpark.core.constant.validation_status = $memory['error'];				$validations = $memory['validations'];				for(var $i in $validation){			$check = $validation[$i];			$($memory['form'] + ' ' + $check['cls']).each($check['helper']);			if(!FireSpark.core.service.CheckForm.result)				break;		}				$memory['valid'] = FireSpark.core.service.CheckForm.result;		return $memory;	},		output : function(){		return [];	}};/** *	@helper CheckMatch * *	@param index *	@param element * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.core.helper.CheckMatch = (function(){	var $value = false;	return function($index, $el){		if($index && $value && $(this).val()!=$value ){			FireSpark.core.service.CheckForm.result = false;			FireSpark.core.helper.checkFail($(this), FireSpark.core.constant.validation_status + ' .error');			return false;		}				$value = $(this).val();	}})();/** *	@helper CheckRequired * *	@param index *	@param element * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.core.helper.CheckRequired = (function(){	return function($index, $el){		if($(this).val() == ''){			FireSpark.core.service.CheckForm.result = false;			FireSpark.core.helper.checkFail($(this), FireSpark.core.constant.validation_status + ' .error');			return false;		}	}})();/** *	@service DataCookie *	@desc Creates a new Cookie * *	@param key string [message] *	@param value string [message] optional default null *	@param expires integer[message] default 1 day *	@param path string [memory] optional default '/' * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.core.service.DataCookie = {	input : function(){		return {			required : ['key'],			optional : { expires : 1, value : null, path : '/' }		};	},		run : function($memory){		$.cookie($memory['key'], null, {			path: $memory['path']		});				$.cookie($memory['key'], $memory['value'], {			expires : $memory['expires'],			path: $memory['path']		});				$memory['valid'] = true;		return $memory;	},		output : function(){		return [];	}};/** *	@service DataEncode *	@desc Encodes data from url-encoded other formats * *	@param type string [memory] optional default 'url' ('url', 'json', 'rest-id') *	@param data string [memory] optional default false *	@param url string [memory] optional default false * *	@return data object [memory] *	@return result string [memory] *	@return mime string [memory] *	@return url string [memory] * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.core.service.DataEncode = {	input : function(){		return {			optional : { type : 'url', data : false, url : '' }		}	},		run : function($memory){		var $data = $memory['data'];		var $type = $memory['type'];		var $mime =  'application/x-www-form-urlencoded';				if($data !== false && $data != ''){			$data = $data.replace(/\+/g, '%20');			if($type != 'url'){				var $params = $data.split('&');				var $result = {};				for(var $i=0, $len=$params.length; $i<$len; $i++){					var $prm = ($params[$i]).split('=');					$result[$prm[0]] = unescape($prm[1]);				}				$memory['data'] = $data = $result;			}						switch($type){				case 'json' :					$data = JSON.stringify($data);					$mime =  'application/json';					break;								case 'rest-id' :					$memory['url'] = $memory['url'] + '/' + $data['id'];									case 'url' :				default :					break;			}		}				$memory['result'] = $data;		$memory['mime'] = $mime;		$memory['valid'] = true;		return $memory;	},		output : function(){		return ['data', 'result', 'mime', 'url'];	}};/** *	@helper DataEquals  * *	@param value1 *	@param value2 * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.core.helper.dataEquals = function($value1, $value2){	return $value1 == $value2;}/** *	@service DataRegistry *	@desc Saves a new Reference * *	@param key string [memory] *	@param value object [memory] optional default false *	@param expiry integer [memory] optional default false * *	@return value object [memory] * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.core.service.DataRegistry = {	input : function(){		return {			required : ['key'],			optional : { value : false, expiry : false }		};	},		run : function($memory){		if($memory['value'] === false){			$memory['value'] = Snowblozm.Registry.get($memory['key']);		}		else {			Snowblozm.Registry.save($memory['key'], $memory['value']);		}				$memory['valid'] = true;		return $memory;	},		output : function(){		return ['value'];	}};/** *	@helper DataShort * *	@param data * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.core.helper.dataShort = function($data, $size, $short){	var $maxlen = $size || 15;	var $len = $maxlen - 5;	return $short ? ($data.length < $maxlen ? $data : $data.substr(0, $len) + ' ...') : $data;}/** *	@helper DataSplit * *	@param data *	@param separator optional default : * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.core.helper.dataSplit = function($data, $separator){	$separator = $separator || ':';	return $data.split($separator);}/** *	@service LaunchHash *	@desc Used to launch hash navigator * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.jquery.service.LaunchHash = {	idle : true,		current : '',		input : function(){		return { };	},		run : function($memory){		if(FireSpark.jquery.service.LaunchHash.idle && FireSpark.jquery.service.LaunchHash.current != window.location.hash){			FireSpark.jquery.service.LaunchHash.current = window.location.hash;			Snowblozm.Kernel.launch(FireSpark.jquery.service.LaunchHash.current);		}				$memory['valid'] = true;		return $memory;	},		output : function(){		return [];	}};/** *	@service LaunchMessage *	@desc Processes data to run workflows * *	@param data object [memory] optional default {} *	@param launch boolean [memory] optional default false *	@param status string [memory] optional default 'valid' *	@param message string [memory] optional default 'message' * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.core.service.LaunchMessage = {	input : function(){		return {			optional : { 				data : {}, 				launch : false, 				status : 'valid', 				message : 'message' 			}		};	},		run : function($memory){		if($memory['launch']){			var $data = $memory['data'] || {};			if($data[$memory['status']] || false){				var $key = $memory['message'];				var $message = $data[$key] || false;				if($message){					$message['service'] = Snowblozm.Registry.load($memory['launch']);					return Snowblozm.Kernel.run($message, {});				}			}		}			$memory['valid'] = true;		return $memory;	},		output : function(){		return [];	}};/** *	@service LaunchNavigator *	@desc Processes data to launch navigator * *	@param data array [memory] optional default {} *	@param escaped boolean [memory] optional default false *	@param launch boolean [memory] optional default false * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.core.service.LaunchNavigator = {	input : function(){		return {			optional : { data : [], launch : false, escaped : false }		};	},		run : function($memory){		if($memory['launch']){			$data = $memory['data'];			for(var $i in $data){				Snowblozm.Kernel.launch($data[$i], $memory['escaped']);			}		}				$memory['valid'] = true;		return $memory;	},		output : function(){		return [];	}};/** *	@service LaunchTrigger *	@desc Initializes navigator launch triggers * *	@param selector string [memory] *	@param event string [memory] optional default 'click' *	@param attribute string [memory] *	@param escaped boolean [memory] optional default false *	@param hash boolean [memory] optional default false * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.core.service.LaunchTrigger = {	input : function(){		return {			required : ['selector', 'attribute'],			optional : { 				event : 'click', 				escaped : false, 				hash : false, 				pathname : false 			}		};	},		run : function($memory){		$($memory['selector']).live($memory['event'], function(){			FireSpark.jquery.service.LaunchHash.idle = false;						var $navigator = $root.attr($memory['attribute']);						if($memory['attribute'] == 'href'){				$navigator = unescape($navigator);			}						$result = Snowblozm.Kernel.launch($navigator, $memory['escaped'], $(this));						if($memory['hash']){				FireSpark.jquery.service.LaunchHash.current = window.location.hash = $navigator;			}						FireSpark.jquery.service.LaunchHash.idle = true;			return $result;		});				$memory['valid'] = true;		return $memory;	},		output : function(){		return [];	}};/**
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
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
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
		
		FireSpark.jquery.helper.LoadBarrier.start();
		
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
				Snowblozm.Kernel.execute($memory['workflow'], $memory);
				FireSpark.jquery.helper.LoadBarrier.end();
			},
			
			error : function($request, $status, $error){
				$memory['error'] = $error;
				//$memory['status'] = $status;
				$memory['data'] = FireSpark.core.constant.loaderror + '<span class="hidden"> [Error : ' + $error + ']</span>';
				
				/**
				 *	Run the errorflow if any
				**/
				if($memory['errorflow']){
					Snowblozm.Kernel.execute($memory['errorflow'], $memory);
				}
				FireSpark.jquery.helper.LoadBarrier.end();
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
/** *	@helper LoadBarrier *	@desc Used to load barrier * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.jquery.helper.LoadBarrier = {	requests : 0,		barrier_function : false,		start : function(){		this.requests++;	},		end : function(){		this.requests--;				if(this.requests <= 0){			this.requests = 0;						if(this.barrier_function){				this.barrier_function();			}						this.barrier_function = false;		}	},		barrier : function($barrier_function){		this.barrier_function = $barrier_function;	}};/** *	@service LoadBarrier *	@desc Sets barrier workflow * *	@param barrier array [memory] optional default false * *	@return barrier array [memory] default false * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.core.service.LoadBarrier = {	input : function(){		return {			optional : { barrier : false }		};	},		run : function($memory){		if($memory['barrier']){			FireSpark.jquery.helper.LoadBarrier.barrier(function(){				Snowblozm.Kernel.execute($memory['barrier'], $memory);			});		}				$memory['barrier'] = false;		$memory['valid'] = true;		return $memory;	},		output : function(){		return ['barrier'];	}};/**
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
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
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
		
		FireSpark.jquery.helper.LoadBarrier.start();
		
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
					Snowblozm.Kernel.execute($memory['workflow'], $memory);
					FireSpark.jquery.helper.LoadBarrier.end();
				}
				catch($error){
					$memory['error'] = $error.description;
					$memory['result'] = FireSpark.core.constant.loaderror + '<span class="hidden"> [Error :' + $error.description + ']</span>';
					
					/**
					 *	Run the errorflow if any
					**/
					if($memory['errorflow']){
						Snowblozm.Kernel.execute($memory['errorflow'], $memory);
					}
					FireSpark.jquery.helper.LoadBarrier.end();
				}
			})
			.bind('error', function($error){
				$memory['error'] = $error;
				$memory['result'] = FireSpark.core.constant.loaderror;
				
				/**
				 *	Run the errorflow if any
				**/
				if($memory['errorflow']){
					Snowblozm.Kernel.execute($memory['errorflow'], $memory);
				}
				FireSpark.jquery.helper.LoadBarrier.end();
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
/** *	@service ReadData *	@desc Serializes div into url-encoded data and reads form submit parameters * *	@param cntr string [memory] *	@param cls string [memory] optional default 'data' * *	@return data object [memory] * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.core.service.ReadData = {	input : function(){		return {			required : ['cntr'],			optional : { cls : 'data' }		};	},		run : function($memory){		var $d = new Date();		var $params = '_ts=' +  $d.getTime();				var serialize = function($index, $el){			if($(this).attr('name') || false){				$params = $params + '&' + $(this).attr('name') + '=' +  $(this).val();			}		}		$($memory['cntr'] + ' .' + $memory['cls']).each(serialize);				$memory['data'] = $params;		$memory['valid'] = true;		return $memory;	},		output : function(){		return ['data'];	}};/** *	@helper ReadDate * *	@param time * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.core.helper.readDate = function($time){	var $d = new Date($time);	return $d.toDateString();}/**
 *	@helper readFileSize
 *
 *	@param size
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
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
/** *	@service ReadForm *	@desc Serializes form into url-encoded data and reads form submit parameters * *	@param form string [memory] * *	@return url string [memory] *	@return request string [memory] *	@return data object [memory] * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.core.service.ReadForm = {	input : function(){		return {			required : ['form']		};	},		run : function($memory){		var $form = $($memory['form']);				$memory['url'] = $form.attr('action');		$memory['request'] = $form.attr('method').toUpperCase();				var $params = $form.serialize();		var $d= new Date();		$params = $params + '&_ts=' +  $d.getTime();		$memory['data'] = $params;				$memory['valid'] = true;		return $memory;	},		output : function(){		return ['url', 'request', 'data'];	}};/**
 *	@helper readGender 
 *
 *	@param ch gender character
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.readGender = function($ch){
	switch($ch){
		case 'M' :
			return 'Male';
		case 'F' :
			return 'Female';
		case 'N' :
		default :
			return '';
			break;
	}
}
/** *	@service WindowConfirm *	@desc Confirms whether to continue  * *	@param confirm boolean [memory] optional default false *	@param value string [memory] * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.core.service.WindowConfirm = {	input : function(){		return {			required : ['value'],			optional : { confirm : false }		}	},		run : function($memory){		if($memory['confirm']){			$memory['valid'] = confirm($memory['value']);			return $memory;		}		$memory['valid'] = true;		return $memory;	},		output : function(){		return [];	}};/** *	@helper WindowFrame * *	@param name * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.core.helper.windowFrame = function(name){	for (var i = 0; i < frames.length; i++){		if (frames[i].name == name)			return frames[i];	}		return false;}/** *	@workflow WindowLogin *	@desc Sign in using Cookie * *	@param key string [message] optional default 'sessionid' *	@param value string [message] optional default null *	@param expires integer[message] optional default 1 day *	@param path string [memory] optional default '/' *	@param continue string [message] optional default false * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.core.workflow.WindowLogin = {	input : function(){		return {			optional : { key : 'sessionid', value : null, expires : 1, path : '/', 'continue' : false }		}	},		run : function($memory){		return Snowblozm.Kernel.execute([{			service : FireSpark.core.service.DataCookie		},{			service : FireSpark.core.service.WindowReload		}], $memory);	},		output : function(){		return [];	}};/** *	@service WindowReload *	@desc Reloads the window * *	@param continue string [message] optional default false * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.core.service.WindowReload = {	input : function(){		return {			'optional' : { 'continue' : false }		};	},		run : function($memory){		window.location.hash = '';		if($memory['continue']){			window.location = $memory['continue'];		}		else {			window.location.reload();		}		$memory['valid'] = false;		return $memory;	},		output : function(){		return [];	}};/**
 *	@service ContainerData
 *	@desc Used to prepare container data
 *
 *	@param key string [memory] optional default 'ui-global'
 *	@param id long int [memory] optional default '0'
 *
 *	@param iframe string [memory] optional default false
 *	@param agent string [memory] optional default false
 *	@param root object [memory] optional default false
 *
 *	@param url string [memory] optional default ''
 *	@param data object [memory] optional default ''
 *	@param type string [memory] optional default 'json'
 *	@param request string [memory] optional default 'POST'
 *	@param process boolean [memory] optional default false
 *	@param mime string [memory] optional default 'application/x-www-form-urlencoded'
 *	@param args array [args]
 *
 *	@param workflowend Workflow [memory] optional default { service : FireSpark.jquery.service.ContainerRender }
 *	@param errorflowend Workflow [memory] optional default { service : FireSpark.jquery.service.ElementContent }
 *	@param stop boolean [memory] optional default false
 *
 *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout')
 *	@param dur integer [memory] optional default 1000
 *	@param dly integer [memory] optional default 0
 *
 *	@return data string [memory]
 *	@return error string [memory] optional
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.service.ContainerData = {
	input : function(){
		return {
			optional : { 
				key : 'ui-global', 
				id : '0',
				iframe : false,
				root : false,
				agent : false,
				url : '',
				data : '', 
				type : 'json', 
				request : 'POST', 
				process : false, 
				mime : 'application/x-www-form-urlencoded' ,
				workflowend : { service : FireSpark.ui.service.ContainerRender },
				errorflowend : { service : FireSpark.ui.service.ElementContent },
				loaddata : FireSpark.core.constant.loadmsg,
				anm : 'fadein',
				dur : 1000,
				dly : 0, 
				stop : false
			}
		}
	},
	
	run : function($memory){
		if($memory['iframe']){
			var $loader = FireSpark.core.service.LoadIframe;
		}
		else {
			var $loader = FireSpark.core.service.LoadAjax;
		}
		
		var $instance = $memory['key']+'-'+$memory['id'];
		var $value = Snowblozm.Registry.get($instance) || false;
		
		if($value || false){
			return Snowblozm.Kernel.run($memory['workflowend'], $memory);
		}
		else {
			return Snowblozm.Kernel.execute([{
				service : FireSpark.ui.service.ElementContent,
				element : '#load-status',
				select : true,
				animation : 'slidein',
				data : '<span class="state loading">Loading ...</span>',
				duration : 500
			},{
				service : $loader,
				args : $memory['args'],
				agent : $memory['agent'] || $memory['root'],
				workflow : [
					$memory['workflowend']
				],
				errorflow : [
					$memory['errorflowend']
				]
			}], $memory);
		}
		
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
/**
 *	@service ContainerRemove
 *	@desc Used to remove container
 *
 *	@param key string [memory] optional default 'ui-global'
 *	@param id long int [memory] optional default '0'
 *	@param ins string [memory] optional default '#ui-global-0'
 *	@param inl boolean [memory] optional default false
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.jquery.service.ContainerRemove = {
	input : function(){
		return {
			optional : { 
				key : 'ui-global', 
				id : '0',
				ins : '#ui-global-0',
				inl : false
			}
		}
	},
	
	run : function($memory){		
		var $instance = $memory['key']+'-'+$memory['id'];
		
		if($memory['inl'] || false){
			// To do
		}
		else {
			$memory = Snowblozm.Kernel.execute([{
				service : FireSpark.jquery.service.ElementContent,
				element : '.tls-' + $instance,
				select : true,
				action : 'remove'
			},{
				service : FireSpark.jquery.service.ElementContent,
				element : '.tlc-' + $instance,
				select : true,
				action : 'remove'
			},{
				service : FireSpark.jquery.workflow.TileShow
			}], $memory);
		}
		
		$memory['valid'] = false;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
/**
 *	@service ContainerRender
 *	@desc Used to render container
 *
 *	@param key string [memory] optional default 'ui-global'
 *	@param id long int [memory] optional default '0'
 *	@param ins string [memory] optional default '#ui-global-0'
 *	@param root object [memory] optional default false
 *	@param tpl template [memory] optional default '#tpl-def-tls'
 *	@param inl boolean [memory] optional default false
 *	@param act string [memory] optional default 'first' ('all', 'first', 'last', 'remove')
 *	@param tile string [memory] optional default false
 *	@param data object [memory] optional default {}
 *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout')
 *	@param dur integer [memory] optional default 1000
 *	@param dly integer [memory] optional default 0
 *	@param bg boolean [memory] optional default false
 *
 *	@return element element [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.jquery.service.ContainerRender = {
	input : function(){
		return {
			optional : { 
				key : 'ui-global', 
				id : '0',
				ins : 'ui-global-0',
				root : false,
				tpl : '#tpl-def-tls',
				inl : false,
				act : 'first',
				tile : false,
				data : {},
				anm : 'fadein',
				dur : 1000,
				dly : 0,
				bg : false
			}
		}
	},
	
	run : function($memory){		
		var $instance = $memory['key']+'-'+$memory['id'];
		var $value = Snowblozm.Registry.get($instance) || false;
		
		if($value || false){
		} else {
			$value = $memory['data'];
		}
		
		$value['id'] = $memory['id'];
		$value['key'] = $memory['key'];
		$value['instance'] = $memory['ins'];
		
		if($value['valid'] || false){
		} else {
			Snowblozm.Registry.save($instance, false);
			return Snowblozm.Kernel.run({
				service : FireSpark.jquery.service.ElementContent,
				element : '#load-status',
				select : true,
				animation : 'slidein',
				data : '<span class="error">'+$value['msg']+'</span><span class="hidden">'+$value['details']+'</span>',
				duration : 500
			}, {});
		}
		
		var $render = function(){
			$value['ui'] = $value['ui'] || $value['message']['ui'] || false;
		
			if($value['ui'] || false){
				$templates  = $value['ui']['templates'] || {};
				$flag = false;
				
				for(var $i in $templates){
					if(Snowblozm.Registry.get($templates[$i]) || false){
					} else {
						$flag = true;
						break;
					}
				}
				
				if($flag || false){
					$('#load-status').html('<span class="error">Error Loading Data</span>').stop(true, true).hide().slideDown(500).delay(1500).slideUp(1500);
					return;
				}		
			}		
	
			$('#load-status').html('<span class="state">Initializing ...</span>').stop(true, true).hide().slideDown(500).delay(500).slideUp(500);
				
			if($memory['inl'] || false){
				// To do
			}
			else {
				$memory = Snowblozm.Kernel.execute([{
					service : FireSpark.jquery.service.ElementContent,
					element : '.tls-' + $instance,
					select : true,
					action : 'remove'
				},{
					service : FireSpark.jquery.workflow.TemplateApply,
					input : { action : 'act', animation : 'anm', duration : 'dur', delay : 'dly' },
					element : $memory['ins'] + '>.tiles',
					select : true,
					animation : 'fadein',
					template : $memory['tpl'] + '-tls',
					data : $value,
				}], $memory);
				
				if($memory['valid'] || false){
				} else {
					return $memory;
				}
			}
			
			$workflow = [{
				service : FireSpark.jquery.service.ElementContent,
				element : '.tlc-' + $instance,
				select : true,
				action : 'remove'
			},{
				service : FireSpark.jquery.workflow.TemplateApply,
				input : { action : 'act', animation : 'anm', duration : 'dur', delay : 'dly' },
				element : $memory['ins'] + '>.bands',
				select : true,
				template : $memory['tpl'] + '-tcs',
				animation : 'none',
				data : $value
			}];
			
			if($memory['bg'] || false){
			}
			else {
				$workflow.push({
					service : FireSpark.jquery.workflow.TileShow
				});
			}
				
			$memory = Snowblozm.Kernel.execute($workflow, $memory);
			Snowblozm.Registry.save($instance, $value);
		}
		
		$value['ui'] = $value['message']['ui'];
		
		if($value['ui'] || false){
			$templates  = $value['ui']['templates'] || {};
			$memory['tpl'] = $value['ui']['tpl'];
			
			FireSpark.core.ajax.barrier($render);
			$barrier = false;
			
			for(var $i in $templates){
				if(Snowblozm.Registry.get($templates[$i]) || false){
				} else {
					$barrier = true;
					
					Snowblozm.Kernel.execute([{
						service : FireSpark.jquery.service.RegistrySave,
						key : $templates[$i],
						value : true
					},{
						service : FireSpark.jquery.service.LoadAjax,
						url : $templates[$i],
						type : 'html',
						request : 'GET',
						workflow : [{
							service : FireSpark.jquery.service.ElementContent,
							element : '#ui-templates',
							select : true,
							action : 'last',
							duration : 5
						}],
						errorflow : [{
							service : FireSpark.jquery.service.RegistrySave,
							key : $templates[$i]
						}]
					}], {});
				}
			}
			
			if($barrier){
				$('#load-status').html('<span class="state loading">Loading ...</span>').stop(true, true).slideDown(500);
			} else {
				$render();
			}
		}
		else {
			$render();
		}
		
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['element'];
	}
};
/**
 *	@service ElementContent
 *	@desc Fills element with content and animates it or removes it and returns element in memory
 *
 *	@param element string [memory]
 *	@param select boolean [memory] optional default false
 *	@param data html/text [memory] optional default ''
 *	@param animation string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout', 'none')
 *	@param duration integer [memory] optional default 1000
 *	@param delay integer [memory] optional default 0
 *	@param action string [memory] optional default 'all' ('all', 'first', 'last', 'remove', 'hide', 'show')
 *
 *	@return element element [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.service.ElementContent = {
	input : function(){
		return {
			required : ['element'],
			optional : { 
				select : false,
				data : '',
				animation : 'fadein',
				duration : 1000,
				delay : 0,
				action : 'all'
			}
		};
	},
	
	run : function($memory){
		if($memory['select']){
			var $element = $($memory['element']);
			if(!$element.length && $memory['action'] != 'remove'){
				$element = $(FireSpark.ui.constant.maindiv);
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
		
		switch($memory['action']){
			case 'all' :
				$element.html($memory['data']);
				$element.trigger('load');
				break;
			
			case 'first' :
				$element.prepend($memory['data']);
				$element.trigger('load');
				break;
			
			case 'last' :
				$element.append($memory['data']);
				$element.trigger('load');
				break;
				
			case 'remove' :
				$element.remove();
				break;
				
			default :
				break;
		}
		
		if($memory['action'] != 'remove'){
			$element.stop(true, true).delay($memory['delay']);
			
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
				case 'none' :
					break;
				default :
					$element.html('Animation type not supported').fadeIn($duration);
					break;
			}
		}
		
		$memory['element'] = $element;
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['element'];
	}
};
/**
 *	@service ElementSection
 *	@desc Toggles element with another content and animates it and returns element in memory
 *
 *	@param element string [memory]
 *	@param select boolean [memory] optional default false
 *	@param content string [memory] optional default false
 *	@param child string [memory] optional default '.tile-content'
 *	@param animation string [memory] optional default 'fadein' ('fadein', 'slidein')
 *	@param duration integer [memory] optional default 1000
 *	@param delay integer [memory] optional default 0
 *
 *	@return element element [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.service.ElementSection = {
	input : function(){
		return {
			required : ['element'],
			optional : { 
				select : false,
				content : false,
				child : '.tile-content',
				animation : 'fadein',
				duration : 500,
				delay : 0
			}
		};
	},
	
	run : function($memory){
		if($memory['select']){
			var $element = $($memory['element']);
			if(!$element.length){
				$element = $('#main-container');
			}
		}
		else {
			$element = $memory['element'];
		}
		
		$element.children($memory['child']).hide();
		
		if($memory['content']){
			$element = $element.children($memory['content']);
		}
		else {
			$element = $element.children($memory['child']).eq(0);
		}
		
		var $animation = $memory['animation'];
		var $duration = $memory['duration'];
		
		$element.trigger('load');
		$element.delay($memory['delay']);
		
		switch($animation){
			case 'fadein' :
				$element.fadeIn($duration);
				break;
			case 'slidein' :
				$element.slideDown($duration);
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
/** *	@service ElementState *	@desc Enables and disables element * *	@param element string [memory] optional default false *	@param disabled boolean [memory] optional default false * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.ui.service.ElementState = {	input : function(){		return {			optional : { element : false, disabled : false }		};	},		run : function($memory){		if($memory['element']){			if($memory['disabled']){				$($memory['element']).attr('disabled', true);			}			else {				$($memory['element']).removeAttr('disabled');			}		}		$memory['valid'] = true;		return $memory;	},		output : function(){		return [];	}};/**
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
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.service.ElementTab = {
	input : function(){
		return {
			required : ['tabui', 'title'],
			optional : { autoload : false,	taburl : false }
		};
	},
	
	run : function($memory){
		var $tabui = Snowblozm.Registry.get($memory['tabui']);
		$memory['element'] = $tabui.add($memory['title'], $memory['autoload'], $memory['taburl']);
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['element'];
	}
};
/**
 *	@service TemplateApply
 *	@desc Applies template
 *
 *	@param template Template [memory]
 *	@param data object [memory] optional default {}
 *
 *	@return result html [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.service.TemplateApply = {
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
/** *	@workflow TemplateApply *	@desc Applies template with data * *	@param element string [memory] *	@param template string [memory] optional default 'tpl-default' *	@param data object [memory] optional default {} * *	@param select boolean [memory] optional default false *	@param animation string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout') *	@param duration integer [memory] optional default 1000 *	@param delay integer [memory] optional default 0 *	@param action string [memory] optional default 'all' ('all', 'first', 'last', 'remove', 'hide', 'show') * *	@return element element [memory] * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.ui.workflow.TemplateApply = {	input : function(){		return {			required : ['element'],			optional : { 				data : {}, 				template : 'tpl-default',				select : false, 				animation : 'fadein',				duration : 1000,				delay : 0,				action : 'all'			}		};	},		run : function($memory){		return Snowblozm.Kernel.execute([{			service : FireSpark.ui.service.TemplateRead		},{			service : FireSpark.ui.service.TemplateApply,			input : { template : 'result' }		},{			service : FireSpark.ui.service.ElementContent,			input : { data : 'result' }		}], $memory);	},		output : function(){		return ['element'];	}};/** *	@workflow TemplateBind *	@desc Binds template with data into element * *	@param cntr string [memory] *	@param select boolean [memory] optional default true *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout') *	@param dur integer [memory] optional default 1000 *	@param dly integer [memory] optional default 0 *	@param act string [memory] optional default 'all' ('all', 'first', 'last', 'remove', 'hide', 'show') * *	@param tpl string [memory] optional default 'tpl-default' *	@param data string [memory] optional default {} * *	@return element element [memory] * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.ui.workflow.TemplateBind = {	input : function(){		return {			required : ['cntr'],			optional : { 				select : true, 				anm : 'fadein',				dur : 1000,				dly : 0, 				action : 'all',				tpl : 'tpl-default' ,				data : ''			}		};	},		run : function($memory){		$memory = Snowblozm.Kernel.execute([{			service : FireSpark.core.service.DataEncode,			type : 'json'		},{ 			service : FireSpark.ui.workflow.TemplateApply,			input : {				element : 'cntr',				template : 'tpl', 				animation : 'anm',				duration : 'dur',				delay : 'dly',				action : 'act'			}		}], $memory);				$memory['valid'] = true;		return $memory;	},		output : function(){		return ['element'];	}};/**
 *	@service TemplateRead
 *	@desc Reads template definition into memory
 *
 *	@param template string [memory] optional default 'tpl-default' (FireSpark.jquery.template.Default)
 *
 *	@param result Template [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.service.TemplateRead = {
	input : function(){
		return {
			optional : { template : 'tpl-default' }
		};
	},
	
	run : function($memory){
		$tpl = $memory['template'];
		$template = Snowblozm.Registry.get($tpl);
		
		if(!$template && $tpl.charAt(0) == '#'){
			$template = $.template($tpl);
			if($template){
				Snowblozm.Registry.save($tpl, $template);
			}
		}
	
		$memory['result'] = $template;
		$memory['valid'] = ($template || false) ? true : false;
		return $memory;
	},
	
	output : function(){
		return ['result'];
	}
};
/** *	@helper TransformButton * *	@param element * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.ui.helper.transformButton = function($element, $config){	$element.button();	return $element;}/** *	@helper TransformCKEditor * *	@param element * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.ui.helper.transformCKEditor = function($element, $config){	var $temp = $element;			$element.each(function($index, $el){		var $name = $temp.attr('id') || $temp.attr('name');		var $instance = CKEDITOR.instances[$name] || false;		if($instance){			try {				CKEDITOR.remove($instance);			}			catch(e) {}			delete $instance;		}		$temp = $temp.slice(1);	});		$element.ckeditor();	return $element;}/** *	@helper TransformTabpanel * *	@param element * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.ui.helper.transformTabpanel = function($element, $config){	$element.hide();		var $tab = new Array();	var $index = $config['indexstart'];		var $options = {		cache : $config['cache'],		collapsible : $config['collapsible'],		event : $config['event'],		tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>",		add: function($event, $ui) {			$tab[$index] = $($ui.panel);		}	};		if($config['tablink']){		$options.load = function($event, $ui) {			$('a', $ui.panel).click(function() {				$($ui.panel).load(this.href);				return false;			});		}	}		var $tabpanel = $element.tabs($options);	$element.fadeIn(1000);		$('.ui-icon-close').live( "click", function() {		var $indx = $("li", $tabpanel).index($(this).parent());		$tabpanel.tabs( "remove", $indx );	});	$index--;		Snowblozm.Registry.save($config['savekey'], {		add : function($tabtitle, $autoload, $taburl){			$index++;			var $url = '#ui-tab-' + $index;			if($autoload || false){				$url = $taburl;			}			$tabpanel.tabs('add', $url, $tabtitle);			$tabpanel.tabs('select', '#ui-tab-' + $index);			return $tab[$index];		}	});	return $element;}/** *	@service TransformTrigger *	@desc Initializes transform triggers * *	@param transforms array [memory] optional default FireSpark.core.constant.transforms * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.ui.service.TransformTrigger = {	input : function(){		return {			optional : { 'transform' : FireSpark.ui.constant.transforms }		};	},		run : function($memory){		$transforms = $memory['transforms'];				for(var $i in $transforms){			$tx = $tranform[$i];			$($tx['cls']).live('load', function(){				$helper = $tx['helper'];				$helper($(this), $tx['config']);			});		}			$memory['valid'] = true;		return $memory;	},		output : function(){		return [];	}};/**
 *	@service DataImport
 *	@desc Uses AJAX to load content from server and saves in dom
 *
 *	@param imports array [memory]
 *	@param workflow Workflow [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.smart.service.DataImport = {
	input : function(){
		return {
			required : ['imports', 'workflow']
		}
	},
	
	run : function($memory){
		/**
		 *	Set barrier
		**/
		$workflow = $memory['workflow'];
		$imports = $memory['imports'];
		
		FireSpark.core.helper.LoadBarrier.barrier(function(){
			$flag = false;
			for(var $i in $imports){
				if(Snowblozm.Registry.get($imports[$i]) || false){
				} else {
					$flag = true;
					break;
				}
			}
				
			if($flag || false){
				FireSpark.smart.helper.dataState(FireSpark.smart.constant.loaderror);
				return { valid : false };
			}
			
			Snowblozm.Kernel.execute($workflow, $memory);
		});
		
		/**
		 *	Load imports
		**/
		$barrier = false;
		
		for(var $i in $imports){
			$key = 'FIRESPARK_IMPORT_' + $imports[$i];
			
			if(Snowblozm.Registry.get($key) || false){
			} else {
				$barrier = true;
				
				Snowblozm.Kernel.execute([,{
					service : FireSpark.core.service.LoadAjax,
					url : $imports[$i],
					type : 'html',
					request : 'GET',
					workflow : [{
						service : FireSpark.ui.service.ElementContent,
						element : FireSpark.smart.constant.importdiv,
						select : true,
						action : 'last',
						duration : 5
					},{
						service : FireSpark.core.service.DataRegistry,
						key : $key,
						value : true
					}]
				}], {});
			}
		}
		
		/**
		 *	Finalize barrier
		**/
		if($barrier){
			FireSpark.smart.helper.dataState(FireSpark.smart.constant.loadstatus);
			return { valid : false };
		} else {
			return Snowblozm.Kernel.execute($workflow, $memory);
		}
	},
	
	output : function(){
		return [];
	}
};
/**
 *	@service DataLoad
 *	@desc Uses AJAX and IFRAME to load data from server and saves in pool
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
 *	@param force boolean [memory] optional default FireSpark.smart.constant.poolforce
 *	@param cache boolean [memory] optional default false
 *	@param expiry integer [memory] optional default FireSpark.smart.constant.poolexpiry
 *
 *	@param iframe string [memory] optional default false
 *	@param agent string [memory] optional default root
 *	@param root element [memory] optional default false
 *
 *	@return data string [memory]
 *	@return error string [memory] optional
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.smart.service.DataLoad = {
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
				stop : false,
				cache : true,
				expiry : FireSpark.smart.constant.poolexpiry,
				force : FireSpark.smart.constant.poolforce,
				iframe : false,
				agent : false,
				root : false
			}
		}
	},
	
	run : function($memory){
		/**
		 *	Check AJAX
		**/
		if($memory['iframe']){
			$memory['agent'] = $memory['agent'] ? $memory['agent'] : $memory['root'];
			
			return Snowblozm.Kernel.run({
				service : FireSpark.jquery.service.LoadIframe,
				args : $memory['args']
			}, $memory);
		}
		else if($memory['force'] === false){
			/**
			 *	Check pool
			**/
			$key = 'FIRESPARK_SI_DATA_URL_' + $memory['url'] + '_DATA_' + $memory['data'] + '_TYPE_' + $memory['type'] + '_REQUEST_' + $memory['request'];
			$data = Snowblozm.Registry.get($key);
			
			if($data){
				if($data['valid'] || false){
					$memory['data'] = $data;
					
					/**
					 *	Run the workflow
					**/
					return Snowblozm.Kernel.execute($memory['workflow'], $memory);
				}
			}
		}
		
		$workflow = $memory['workflow'];
		
		if($memory['cache']){
			$workflow.shift({
				service : FireSpark.core.service.DataRegistry,
				input : { value : 'data' },
				key : $key,
				expiry : $memory['expiry']
			});
		}
		
		/**
		 *	Load AJAX
		**/
		return Snowblozm.Kernel.run({
			service : FireSpark.jquery.service.LoadAjax,
			args : $memory['args'],
			workflow : $workflow
		}, $memory);
	},
	
	output : function(){
		return [];
	}
};
/** *	@helper DataState * *	@param state * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.smart.helper.dataState = function($html){	$(FireSpark.smart.constant.statusdiv).html($html).stop(true, true).hide().slideDown(500).delay(1500).slideUp(1500);}/** *	@workflow ReadHtml *	@desc Reads HTML content into element * *	@param url URL [memory] *	@param cntr string [memory] * *	@param select boolean [memory] optional default false *	@param ld string [memory] optional default FireSpark.core.constant.loadmsg *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout') *	@param dur integer [memory] optional default 1000 *	@param dly integer [memory] optional default 0 *	@param act string [memory] optional default 'all' ('all', 'first', 'last', 'remove') * *	@param frc boolean [memory] optional default FireSpark.smart.constant.poolforce *	@param cch boolean [memory] optional default false *	@param exp integer [memory] optional default FireSpark.smart.constant.poolexpiry * *	@param iframe string [memory] optional default false *	@param agt string [memory] optional default root *	@param root element [memory] optional default false * *	@return element element [memory] * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.smart.workflow.ReadHtml = {	input : function(){		return {			required : ['url', 'cntr'],			optional : { 				cch : true,				exp : FireSpark.smart.constant.poolexpiry,				frc : FireSpark.smart.constant.poolforce,				iframe : false,				agt : false,				root : false,				select : false, 				ld : FireSpark.smart.constant.loadmsg,				anm : 'fadein',				dur : 1000,				dly : 0,				act : 'all'			}		};	},		run : function($memory){		var $workflow = [{			service : FireSpark.ui.service.ElementContent,			input : { 				animation : 'anm', 				duration : 'dur', 				delay : 'dly', 				action : 'act' 			}		}];				return Snowblozm.Kernel.execute([{			service : FireSpark.ui.service.ElementContent,			input : { 				element : 'cntr' ,				data : 'ld',				animation : 'anm', 				action : 'act' 			},			duration : 5		},{			service : FireSpark.smart.service.DataLoad,			type : 'html',			request : 'GET',			args : ['element', 'anm', 'dur', 'dly', 'act'],			input : {				cache : 'cch',				expiry : 'exp',				force : 'frc',				agent : 'agt'			},			workflow : $workflow,			errorflow : $workflow		}], $memory);	},		output : function(){		return ['element'];	}};/** *	@workflow ReadTmpl *	@desc Reads template with data into element * *	@param url URL [memory] *	@param cntr string [memory] *	@param tpl string [memory] optional default 'tpl-default' * *	@param select boolean [memory] optional default false *	@param ld string [memory] optional default FireSpark.core.constant.loadmsg *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout') *	@param dur integer [memory] optional default 1000 *	@param dly integer [memory] optional default 0 *	@param act string [memory] optional default 'all' ('all', 'first', 'last', 'remove') * *	@param frc boolean [memory] optional default FireSpark.smart.constant.poolforce *	@param cch boolean [memory] optional default false *	@param exp integer [memory] optional default FireSpark.smart.constant.poolexpiry * *	@param iframe string [memory] optional default false *	@param agt string [memory] optional default root *	@param root element [memory] optional default false * *	@param cnf boolean [memory] optional default false *	@param cnfmsg string [memory] optional default FireSpark.smart.constant.cnfmsg * *	@param sel string [memory] optional default false *	@param enc string [memory] optional default 'url' ('url', 'json') * *	@param data string [memory] optional default  *	@param type string [memory] optional default 'json' *	@param req string [memory] optional default 'POST' *	@param workflow Workflow [memory] optional default [{ service : FireSpark.jquery.workflow.TemplateApply, ... }] *	@param errorflow Workflow [memory] optional default [{ service : FireSpark.jquery.service.ElementContent, ... }] *	@param stop boolean [memory] optional default false * *	@param ln boolean [memory] optional default false *	@param status string [memory] optional default 'valid' *	@param message string [memory] optional default 'message' * *	@return element element [memory] * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.smart.workflow.ReadTmpl = {	input : function(){		return {			required : ['cntr', 'url'],			optional : { 				cch : true,				exp : FireSpark.smart.constant.poolexpiry,				frc : FireSpark.smart.constant.poolforce,				iframe : false,				agt : false,				root : false,				select : false,				ld : FireSpark.smart.constant.loadmsg,				anm : 'fadein',				dur : 1000,				dly : 0,				act : 'all'				tpl : 'tpl-default' ,				cnf : false,				cnfmsg : FireSpark.smart.constant.cnfmsg,				sel : false,				enc : 'url',				data : '',				type : 'json',				req : 'POST',				workflow : [{ 					service : FireSpark.ui.workflow.TemplateApply, 					input : {						element : 'cntr' ,						template : 'tpl',						animation : 'anm', 						duration : 'dur',						delay : 'dly',						action : 'act' 					},					select : true				}],				errorflow :  [{ 					service : FireSpark.ui.service.ElementContent,					input : {						element : 'cntr' ,						animation : 'anm', 						duration : 'dur',						delay : 'dly',						action : 'act' 					},					select : true				}],				stop : false,				ln : false,				status : 'valid',				message : 'message'			}		};	},		run : function($memory){		$workflow = [{			service : FireSpark.ui.service.ElementState,			input : { element : 'sel' }		},{			service : FireSpark.core.service.LaunchMessage,			input : { launch : 'ln' }		}];		$workflow.concat($memory['workflow']);				$errorflow = [{			service : FireSpark.ui.service.ElementState,			input : { element : 'sel' }		}];		$errorflow.concat($memory['errorflow']);				$args = ['cntr', 'sel', 'tpl', 'anm', 'dur', 'dly', 'act'];		$args.concat($memory['args']);				return Snowblozm.Kernel.execute([{			service : FireSpark.core.service.WindowConfirm,			input : { confirm : 'cnf', value : 'cnfmsg' }		},{			service : FireSpark.core.service.DataEncode,			input : { type : 'enc' },			output : { result : 'data' }		},{			service : FireSpark.ui.service.ElementState,			input : { element : 'sel' },			disabled : true		},{			service : FireSpark.ui.service.ElementContent,			input : { 				element : 'cntr' ,				data : 'ld',				animation : 'anm', 				action : 'act' 			},			duration : 5		},{			service : FireSpark.smart.service.DataLoad,			args : $args,			input : {				request : 'req',				cache : 'cch',				expiry : 'exp',				force : 'frc',				agent : 'agt'			},			workflow : $workflow,			errorflow : $workflow		}], $memory);	},		output : function(){		return [];	}};/**
 *	@config FireSpark.core
**/
FireSpark.core.constant = {
	validations : {
		required : {
			cls : '.required',
			helper : FireSpark.core.helper.CheckRequired
		},
		email : {
			cls : '.email',
			helper : FireSpark.core.helper.CheckEmail
		},
		match : {
			cls : '.match',
			helper : FireSpark.core.helper.CheckMatch
		}
	},
	validation_status : 'span'
}

/**
 *	@config FireSpark.ui
**/
FireSpark.ui.constant = {
	transforms : {
		uibutton : {
			cls : '.uibutton',
			helper : FireSpark.ui.helper.transformButton,
			config : {}
		},
		ckeditor : {
			cls : '.ckeditor',
			helper : FireSpark.ui.helper.transformCKEditor,
			config : {}
		},
		uitabpanel : {
			cls : '.uitabpanel',
			helper : FireSpark.ui.helper.transformTabpanel,
			config : { 
				savekey : 'tabpanel',
				select : false, 
				cache : false,	
				collapsible : false, 
				event : 'click', 
				tablink : false, 
				indexstart : 0 
			}
		}
	},
	maindiv : '#ui-global-0'
};

/**
 *	@config FireSpark.smart
**/
FireSpark.smart.constant = {
	statusdiv : '#load-status',
	loaderror : '<span class="error">Error Loading Data</span>',
	loadstatus : '<span class="state loading">Loading ...</span>',
	loadmsg : '<span class="loading">Loading ...</span>',
	cnfmsg : 'Are you sure you want to continue ?',
	importdiv : '#ui-imports',
	poolexpiry : 150,
	poolforce : false
};

