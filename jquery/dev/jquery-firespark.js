/**
 *	@module snowblozm	
 *
 *	@type iObject, iArray, iString, iRegistry
 *	@desc universal message object, workflow array, navigator string and reference registry container
 *
 *	@extend Object, Array and String
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
( function( window, undefined ){

	/**
	 *	Runs a message object
	**/
	Object.defineProperty( Object.prototype, "run", { 
		value: function( memory ){
			/**
			 *	create a new memory if not passed
			**/
			memory = memory || {};
			
			/**
			 *	Read the service instance
			**/
			if( this.service.constructor == String ){
				this.service = this.service.get();
			}
			
			/**
			 *	Read the service arguments
			**/
			this.args = this.args || [];
			
			/**
			 *	Copy arguments if necessary
			**/
			for( var i in this.args ){
				var key = this.args[ i ];
				this[ key ] = this[ key ] || memory[ key ] || undefined;
			}
			
			/**
			 *	Read the service input
			**/
			this.input = this.input || {};
			var sin = this.service.input();
			var sinreq = sin[ 'required' ] || [];
			var sinopt = sin[ 'optional' ] || {};
			
			/**
			 *	Set the index values
			**/
			if( sin[ 'set' ] || false){
				var sinset = sin['set'];
				var max = sinset.length;
				for( i=0; i<max; i++ ){
					var key = sinset[ i ];
					this[ key ] = this[ key ] || this[ i ] || memory[ i ] || undefined;
				}
			}
			
			/**
			 *	Copy required input if not exists (return valid false if value not found)
			**/
			for( var i in sinreq ){
				var key = sinreq[ i ];
				var param = this.input[ key ] || key;
				this[ key ] = this[ key ] || memory[ param ] || undefined;
				if( this[ key ] === undefined ){
					memory[ 'valid' ] = undefined;
					if( window.debug || undefined ){
						alert( "Value not found for " + key );
					}
					return memory;
				}
			}
			
			/**
			 *	Copy optional input if not exists
			**/
			for( var key in sinopt ){
				var param = this.input[ key ] || key;
				this[ key ] = this[ key ] || memory[ param ] || sinopt[ key ];
			}
			
			/**
			 *	Run the service with the message as memory
			**/
			try {
				var result = this.service.run( this );		
			} catch(id) {
				if(console || false){
					console.log('Exception : ' + id);
				}
				return { valid: false };
			}
			
			/**
			 *	Read the service output and return if not valid
			**/
			memory[ 'valid' ] = result[ 'valid' ] || undefined;
			if( memory[ 'valid' ] ){
				this.output = this.output || [];
			}
			else {
				return memory;
			}
			var sout = this.service.output();
			
			/**
			 *	Copy output
			**/
			for( var i in sout ){
				var key = sout[ i ];
				var param = this.output[ key ] || key;
				memory[ param ] = result[ key ] || undefined;
			}
			
			/**
			 *	Return the memory
			**/
			return memory;
		}
	} );
	
	/**
	 *	Executes a workflow array
	**/
	Object.defineProperty( Array.prototype, "execute", { 
		value: function( memory ){
			/**
			 *	create a new memory if not passed
			**/
			memory = memory || {};
			memory[ 'valid' ] = memory[ 'valid' ] || true;
		
			for( var i in this ){
				var message = this[ i ];
				
				/**
				 *	Check for non strictness
				**/
				var nonstrict = message[ 'nonstrict' ] || undefined;
				
				/**
				 *	Continue on invalid state if non-strict
				**/
				if( memory[ 'valid' ] !== true && nonstrict !== true )
					continue;
				
				/**
				 *	run the service with the message and memory
				**/
				memory = message.run( memory );
			}
			
			return memory;
		}
	} );
	
	/**
	 *	Launches a navigator string
	**/
	Object.defineProperty( String.prototype, "launch", { 
		value: function( memory ){
			var message = {
				navigator : this
			};
			
			switch(this.charAt(1)){
				case '/' : 
					/**
					 *	Parse navigator
					**/
					var parts = this.split('~');
					
					var path = parts[0].split('/');
					var index = path.shift() + path.shift();
					
					/**
					 *	Construct message for workflow
					**/
					message[ 'service' ] = index;
					for(var j in path){
						//path[j] = unescape(path[j]);
						message[j] = path[j];
					}
					
					if(parts[1] || false){
						var req = parts[1].split('/');
						for(var i = 1, len=req.length; i<len; i+=2){
							//req[i + 1] = unescape(req[i + 1]);
							message[req[i]] = req[i + 1];
						}
					}

					break;
				
				default :
					$navigator = this
					$navigator = $navigator.replace(/_/g, '#');
					$navigator = $navigator.replace(/\./g, '=');
					/**
					 *	Parse navigator
					 **/
					var req = $navigator.split(':');
					var index = req[0];
					
					/**
					 *	Construct message for workflow
					**/
					message[ 'service' ] = index;
					for(var i=1, len=req.length; i<len; i++){
						var param = (req[i]).split('=');
						var arg = param[1];
						arg = arg.replace(/~/g, '=');
						//arg = unescape(arg);
						message[param[0]] = arg;
					}					
					break;

			}
			
			/**
			 *	Run the workflow and return the valid value
			**/
			memory = message.run( memory );
			return memory[ 'valid' ];
		}
	} );
	
	var registry = {};
	
	/**
	 *	Save a reference string
	**/
	Object.defineProperty( String.prototype, "save", { 
		value: function( val ){
			registry[ this ] = val;
		}
	} );
	
	/**
	 *	Get value of a reference
	**/
	Object.defineProperty( String.prototype, "get", { 
		value: function(){
			return registry[ this ] || undefined;
		}
	} );
	
	/**
	 *	Delete a reference string
	**/
	Object.defineProperty( String.prototype, "del", { 
		value: function(){
			registry[ this ] = 0;
		}
	} );
	
} )( window );/**
 * @initialize FireSpark
**/
var FireSpark = {
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

function isNumber( n ) {
	return !isNaN( parseFloat( n ) ) && isFinite( n );
}

function is_numeric( n ){
	return !isNaN( Number( n ) );
}

function unique( $array ){
   var u = {}, a = [];
   for( var i = 0, l = $array.length; i < l; ++i ){
      if( $array[ i ] in u )
         continue;
      a.push( $array[ i ] );
      u[ $array[ i ] ] = 1;
   }
   return a;
}
/**
 *	@helper CheckEmail
 *
 *	@param index
 *	@param element
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.CheckEmail = (function(){
	var $emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	return function($index, $el){
		if(!$emailRegex.test($(this).val())){
			FireSpark.core.service.CheckForm.result = false;
			FireSpark.core.helper.checkFail($(this), FireSpark.core.constant.validation_status + '.error');
			return false;
		}
	};
})();
/**
 *	@helper CheckFail
 *
 *	@param element
 *	@param selector
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.checkFail = function($el, $sel){
	return $el.next($sel).stop(true, true).slideDown(1000).delay(5000).fadeOut(1000);
}
/**
 *	@service CheckForm
 *	@desc Validates form input values (required and email) using style class
 *
 *	@param form string [memory]
 *	@param validations array [memory] optional default FireSpark.core.constant.validations
 *	@param error string [memory] optional default span
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.service.CheckForm = {
	result : true,
	
	input : function(){
		return {
			required : ['form'],
			optional : { error : 'span', validations : FireSpark.core.constant.validations }
		};
	},
	
	run : function($memory){
		FireSpark.core.service.CheckForm.result = true;
		FireSpark.core.constant.validation_status = $memory['error'];
		
		$validations = $memory['validations'];
		
		for(var $i in $validations){
			$check = $validations[$i];
			$($memory['form'] + ' ' + $check['cls']).each($check['helper']);
			if(!FireSpark.core.service.CheckForm.result)
				break;
		}
		
		$memory['valid'] = FireSpark.core.service.CheckForm.result;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
/**
 *	@helper CheckMatch
 *
 *	@param index
 *	@param element
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.CheckMatch = (function(){
	var $value = false;
	return function($index, $el){
		if($index && $value && $(this).val()!=$value ){
			FireSpark.core.service.CheckForm.result = false;
			FireSpark.core.helper.checkFail($(this), FireSpark.core.constant.validation_status + '.error');
			return false;
		}
		
		$value = $(this).val();
	}
})();
/**
 *	@helper CheckRequired
 *
 *	@param index
 *	@param element
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.CheckRequired = (function(){
	return function($index, $el){
		if($(this).val() == ''){
			FireSpark.core.service.CheckForm.result = false;
			FireSpark.core.helper.checkFail($(this), FireSpark.core.constant.validation_status + '.error');
			return false;
		}
	};
})();
/**
 *	@service DataCookie
 *	@desc Creates a new Cookie
 *
 *	@param key string [message]
 *	@param value string [message] optional default null
 *	@param expires integer[message] default 1 day
 *	@param path string [memory] optional default '/'
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.service.DataCookie = {
	input : function(){
		return {
			required : ['key'],
			optional : { expires : 1, value : null, path : '/' }
		};
	},
	
	run : function($memory){
		$.cookie($memory['key'], null, {
			path: $memory['path']
		});
		
		$.cookie($memory['key'], $memory['value'], {
			expires : $memory['expires'],
			path: $memory['path']
		});
		
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
/**
 *	@service DataEncode
 *	@desc Encodes data from url-encoded other formats
 *
 *	@param type string [memory] optional default 'url' ('url', 'json', 'rest-id')
 *	@param data string [memory] optional default false
 *	@param url string [memory] optional default false
 *
 *	@return data object [memory]
 *	@return result string [memory]
 *	@return mime string [memory]
 *	@return url string [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.service.DataEncode = {
	input : function(){
		return {
			optional : { type : 'url', data : false, url : '' }
		}
	},
	
	run : function($memory){
		var $data = $memory['data'];
		var $type = $memory['type'];
		var $mime =  'application/x-www-form-urlencoded';
		
		if($data !== false && $data != ''){
			$data = $data.replace(/\+/g, '%20');
			if($type != 'url'){
				var $params = $data.split('&');
				var $result = {};
				for(var $i=0, $len=$params.length; $i<$len; $i++){
					var $prm = ($params[$i]).split('=');
					$result[$prm[0]] = unescape($prm[1]);
				}
				$memory['data'] = $data = $result;
			}
			
			switch($type){
				case 'json' :
					$data = JSON.stringify($data);
					$mime =  'application/json';
					break;
				
				case 'rest-id' :
					$memory['url'] = $memory['url'] + '/' + $data['id'];
					
				case 'url' :
				default :
					break;
			}
		}
		
		$memory['result'] = $data;
		$memory['mime'] = $mime;
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['data', 'result', 'mime', 'url'];
	}
};
/**
 *	@helper DataEquals 
 *
 *	@param value1
 *	@param value2
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.dataEquals = function($value1, $value2){
	return $value1 == $value2;
}
/**
 *	@helper DataFind
 *
 *	@param data
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.dataFind = function($data, $text, $offset){
	return $data.indexOf($text, $offset || 0) > -1;
}
/**
 *	@helper DataNormal
 *
 *	@param data
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.dataNormal = function($data, $normal){
	return $data != false ? $data : $normal;
}
/**
 *	@helper DataOperate
 *
 *	@param value1
 *	@param value2
 *	@param operator
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.dataOperate = function($value1, $value2, $operator){
	switch($operator){
		case '>' :
			return $value1 > $value2;
		case '<' :
			return $value1 < $value2;
		default :
			return $value1 == $value2;
	}
}
/**
 *	@service DataPush
 *	@desc Pushes data into another array
 *
 *	@param data array [memory] optional default {}
 *	@param params array [args] optional default []
 *
 *	@param result array [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.service.DataPush = {
	input : function(){
		return {
			optional : { data : {} }
		};
	},
	
	run : function($memory){
		var $data = $memory['data'];
		var $params = $memory['args'];
		
		for(var $i in $params){
			$value = $params[$i];
			$data[$value] = $memory[$value];
		}
		
		$memory['result'] = $data;
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['result'];
	}
};
/**
 *	@service DataRegistry
 *	@desc Saves a new Reference
 *
 *	@param key string [memory]
 *	@param value object [memory] optional default false
 *	@param expiry integer [memory] optional default false
 *	@param check boolean [memory] optional default false
 *
 *	@return value object [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.service.DataRegistry = {
	input : function(){
		return {
			required : ['key'],
			optional : { value : false, expiry : false, check : false }
		};
	},
	
	run : function($memory){
		if($memory['value'] === false){
			$memory['value'] = $memory['key'].get();
		}
		else {
			if($memory['check'] && ($memory['key'].get() || false)){
				$memory['valid'] = false;
				return $memory;
			}
			
			$memory['key'].save($memory['value']);
		}
		
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['value'];
	}
};
/**
 *	@service DataSelect
 *	@desc Selects data from another array
 *
 *	@param data array [memory] optional default {}
 *	@param params array [memory] optional default {}
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.service.DataSelect = {
	out : [],
	
	input : function(){
		return {
			optional : { data : {}, params : {} }
		};
	},
	
	run : function($memory){
		var $data = $memory['data'];
		var $params = $memory['params'];
		FireSpark.core.service.DataSelect.out = [];
		
		for(var $i in $params){
			var $value = $params[$i];
			$memory[$value] = $data[$i];
			FireSpark.core.service.DataSelect.out.push($value);
		}
		
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return FireSpark.core.service.DataSelect.out;
	}
};
/**
 *	@helper DataShort
 *
 *	@param data
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.dataShort = function($data, $size, $short){
	var $maxlen = $size || 15;
	var $len = $maxlen - 5;
	return $short ? ($data.length < $maxlen ? $data : $data.substr(0, $len) + ' ...') : $data;
}
/**
 *	@helper DataSplit
 *
 *	@param data
 *	@param separator optional default :
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.dataSplit = function($data, $separator){
	$separator = $separator || ':';
	return $data.split($separator);
}
/**
 *	@helper DataStrip
 *
 *	@param data
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.dataStrip = function($data){
	$data = $data.replace(/<\/?[a-z][a-z0-9]*[^<>]*>/ig, "");
	
	var $index = $data.indexOf('<');
	if($index > 0){
		$data = $data.substring(0, $index);
	}
	
	return $data;
}
/**
 *	@service LaunchMessage
 *	@desc Processes data to run workflows
 *
 *	@param data object [memory] optional default {}
 *	@param launch boolean [memory] optional default false
 *	@param status string [memory] optional default 'valid'
 *	@param message string [memory] optional default 'message'
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.service.LaunchMessage = {
	input : function(){
		return {
			optional : { 
				data : {}, 
				launch : false, 
				status : 'valid', 
				message : 'message' 
			}
		};
	},
	
	run : function($memory){
		if($memory['launch']){
			var $data = $memory['data'] || {};
			if($data[$memory['status']] || false){
				var $key = $memory['message'];
				var $message = $data[$key] || false;
				
				if($message && $memory['launch'].get() || false){
					$message['service'] = $memory['launch'].get();
					return $message.run( {} );
				}
				else {
					return $memory['launch'].launch( {} );
				}
			}
		}
	
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
/**
 *	@service LaunchNavigator
 *	@desc Processes data to launch navigator
 *
 *	@param data array [memory] optional default {}
 *	@param launch boolean [memory] optional default false
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.service.LaunchNavigator = {
	input : function(){
		return {
			optional : { data : [], launch : false }
		};
	},
	
	run : function($memory){
		if($memory['launch']){
			$data = $memory['data'];
			if($data.length){
				for(var $i in $data){
					$data[$i].launch( $memory );
				}
			}
			else {
				$memory['launch'].launch( $memory );
			}
		}
		
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
/**
 *	@service LoadAjax
 *	@desc Uses AJAX to load data from server
 *
 *	@param url string [memory]
 *	@param data object [memory] optional default ''
 *	@param type string [memory] optional default 'json'
 *	@param request string [memory] optional default 'POST'
 *	@param process boolean [memory] optional default false
 *	@param mime string [memory] optional default 'application/x-www-form-urlencoded'
 *	@param sync boolean [memory] optional default false
 *	@param barrier boolean [memory] optional default false
 *
 *	@param workflow Workflow [memory]
 *	@param errorflow	Workflow [memory] optional default false
 *	@param function startfn Start Function [memory] optional default false
 *	@param function endfn End Function [memory] optional default false
 *	@param stop boolean [memory] optional default false
 *	@param validity boolean [memory] optional default false
 *
 *	@return data string [memory]
 *	@return error string [memory] optional
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.service.LoadAjax = {
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
				validity : false,
				sync : false,
				barrier : false
			}
		}
	},
	
	run : function($memory){
		
		if( $memory[ 'barrier' ] ){
			FireSpark.core.helper.LoadBarrier.start();
		}
		
		var $mem = {};
		for(var $i in $memory){
			$mem[$i] = $memory[$i];
		}
		
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
			async : $memory['sync'] ? false : true,
			
			success : function($data, $status, $request){
				$mem['data'] = $data;
				//$mem['status'] = $status;
				
				if($mem['validity'] && ( ($mem['data']['valid'] === false) ||  (($mem['data']['message'] || false) && $mem['data']['message']['valid'] === false) )){
					/**
					 *	Run the errorflow if any
					**/
					try {
						if($memory['errorflow']){
							$memory['errorflow'].execute($mem);
						}
						if( $memory[ 'barrier' ] ){
							FireSpark.core.helper.LoadBarrier.end();
						}
					} catch($id) {
						if( $memory[ 'barrier' ] ){
							FireSpark.core.helper.LoadBarrier.end();
						}
						if(console || false){
							console.log('Exception : ' + $id);
						}
					}
				}
				else {
					/**
					 *	Run the workflow
					**/
					try {
						$memory['workflow'].execute($mem);
						if( $memory[ 'barrier' ] ){
							FireSpark.core.helper.LoadBarrier.end();
						}
					} catch($id) {
						if( $memory[ 'barrier' ] ){
							FireSpark.core.helper.LoadBarrier.end();
						}
						if(console || false){
							console.log('Exception : ' + $id);
						}
					}
				}
			},
			
			error : function($request, $status, $error){
				$mem['error'] = $error;
				//$mem['status'] = $status;
				$mem['data'] = FireSpark.core.constant.loaderror + '<span class="hidden"> [Error : ' + $error + ']</span>';
				
				/**
				 *	Run the errorflow if any
				**/
				try {
					if($memory['errorflow']){
						$memory['errorflow'].execute($mem);
					}
					if( $memory[ 'barrier' ] ){
						FireSpark.core.helper.LoadBarrier.end();
					}
				} catch($id) {
					if( $memory[ 'barrier' ] ){
						FireSpark.core.helper.LoadBarrier.end();
					}
					if(console || false){
						console.log('Exception : ' + $id);
					}
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
 *	@helper LoadBarrier
 *	@desc Used to load barrier
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.LoadBarrier = {
	requests : 0,
	lock : false,
	
	barrier_function : [],
	barrier_args : [],
	
	start : function(){
		this.requests++;
	},
	
	end : function(){
		this.requests--;
		
		if(this.requests <= 0){
			this.requests = 0;
			
			var $bf = this.barrier_function;
			this.barrier_function = [];
			
			var $ba = this.barrier_args;
			this.barrier_args = [];
			
			if($bf.length){
				for(var $i in $bf){
					try {
						($bf[$i])($ba[$i]);
					} catch($id) {
						if(console){
							console.log('Exception : ' + $id);
						}
					}
				}
			}
		}
	},
	
	barrier : function($barrier_function, $barrier_args){
		this.barrier_function.push($barrier_function);
		this.barrier_args.push($barrier_args);
	}
};
/**
 *	@service LoadBarrier
 *	@desc Sets barrier workflow
 *
 *	@param barrier array [memory] optional default false
 *
 *	@return barrier array [memory] default false
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.service.LoadBarrier = {
	input : function(){
		return {
			optional : { barrier : false }
		};
	},
	
	run : function($memory){
		if($memory['barrier']){
			FireSpark.core.helper.LoadBarrier.barrier(function(){
				Snowblozm.Kernel.execute($memory['barrier'], $memory);
			});
		}
		
		$memory['barrier'] = false;
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['barrier'];
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
 *	@param barrier boolean [memory] optional default false
 *
 *	@return data string [memory]
 *	@return error string [memory] optional
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.service.LoadIframe = {
	input : function(){
		return {
			required : ['agent', 'workflow'],
			optional : { 
				type : 'json', 
				errorflow : false,
				barrier : false
			}
		}
	},
	
	run : function($memory){
		
		if( $memory[ 'barrier' ] ){
			FireSpark.core.helper.LoadBarrier.start();
		}
		
		var $mem = {};
		for(var $i in $memory){
			$mem[$i] = $memory[$i];
		}
		
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
			.insertAfter(FireSpark.core.constant.iframeroot || $memory['agent'])
			.bind('load', function(){
				try {
					var $frame = FireSpark.core.helper.windowFrame($framename);
					var $data = $frame.document.body.innerHTML;
					switch($memory['type']){
						case 'html' :
							$mem['data'] = $data;
							break;
						case 'json' :
						default :
							try {
								$data = $($data).html();
							}catch($id) { 
								if(console || false){ console.log('Exception : ' + $id); }
							}
							$mem['data'] = $.parseJSON($data);
							break;
					}
					
					/**
					 *	Run the workflow
					**/
					try {
						$memory['workflow'].execute($mem);
						if( $memory[ 'barrier' ] ){
							FireSpark.core.helper.LoadBarrier.end();
						}
					} catch($id) {
						if( $memory[ 'barrier' ] ){
							FireSpark.core.helper.LoadBarrier.end();
						}
						if(console || false){
							console.log('Exception : ' + $id);
						}
					}
				}
				catch($error){
					if(console || false){
						console.log('Exception : ' + $error);
					}
					
					$mem['error'] = $error.description;
					$mem['result'] = FireSpark.core.constant.loaderror + '<span class="hidden"> [Error :' + $error.description + ']</span>';
					$mem['data'] = {
						valid : false,
						msg : FireSpark.core.constant.loaderror,
						code : 500,
						details : $error.description
					};
					
					/**
					 *	Run the errorflow if any
					**/
					try {
						if($memory['errorflow']){
							$memory['errorflow'].execute($mem);
						}
						if( $memory[ 'barrier' ] ){
							FireSpark.core.helper.LoadBarrier.end();
						}
					} catch($id) {
						if( $memory[ 'barrier' ] ){
							FireSpark.core.helper.LoadBarrier.end();
						}
						if(console || false){
							console.log('Exception : ' + $id);
						}
					}
				}
			})
			.bind('error', function($error){
				$mem['error'] = $error;
				$mem['result'] = FireSpark.core.constant.loaderror;
				
				/**
				 *	Run the errorflow if any
				**/
				try {
					if($memory['errorflow']){
						$memory['errorflow'].execute($mem);
					}
					if( $memory[ 'barrier' ] ){
						FireSpark.core.helper.LoadBarrier.end();
					}
				} catch($id) {
					if( $memory[ 'barrier' ] ){
						FireSpark.core.helper.LoadBarrier.end();
					}
					if(console || false){
						console.log('Exception : ' + $id);
					}
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
/**
 *	@helper readControl
 *
 *	@param control Control character
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.readControl = function($control){
	switch($control){
		case 'info' :
			return 'View Entity';
		case 'edit' :
			return 'Edit Entity';
		case 'list' :
			return 'List Children';
		case 'add' :
			return 'Add Children';
		case 'remove' :
			return 'Remove Children';
		default :
			return '';
			break;
	}
}
/**
 *	@service ReadData
 *	@desc Serializes div into url-encoded data and reads form submit parameters
 *
 *	@param cntr string [memory]
 *	@param cls string [memory] optional default 'data'
 *
 *	@return data object [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.service.ReadData = {
	input : function(){
		return {
			required : ['cntr'],
			optional : { cls : 'data' }
		};
	},
	
	run : function($memory){
		var $d = new Date();
		var $params = '_ts=' +  $d.getTime();
		
		var serialize = function($index, $el){
			if($(this).attr('name') || false){
				$params = $params + '&' + $(this).attr('name') + '=' +  $(this).val();
			}
		}
		$($memory['cntr'] + ' .' + $memory['cls']).each(serialize);
		
		$memory['data'] = $params;
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['data'];
	}
};
/**
 *	@helper ReadDate
 *
 *	@param time
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.readDate = function($time){
	var $d = new Date($time);
	return $d.toDateString();
}
/**
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
/**
 *	@service ReadForm
 *	@desc Serializes form into url-encoded data and reads form submit parameters
 *
 *	@param form string [memory]
 *
 *	@return url string [memory]
 *	@return request string [memory]
 *	@return data object [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.service.ReadForm = {
	input : function(){
		return {
			required : ['form']
		};
	},
	
	run : function($memory){
		var $form = $($memory['form']);
		
		$memory['url'] = $form.attr('action');
		try {
			$memory['request'] = $form.attr('method').toUpperCase();
		} catch($e) { $memory['request'] = 'POST'; }
		
		var $params = $form.serialize();
		var $d= new Date();
		$params = $params + '&_ts=' +  $d.getTime();
		$memory['data'] = $params;
		
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['url', 'request', 'data'];
	}
};
/**
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
/**
 *	@helper ReadTime
 *
 *	@param time
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.readTime = function($time){
	var $d = new Date($time);
	var $hours = $d.getHours();
	if($hours < 10) $hours = '0' + $hours/1;
	var $minutes = $d.getMinutes();
	if($minutes < 10) $minutes = '0' + $minutes/1;
	return $d.toDateString() + ' ' + $hours + ':' + $minutes + ' hrs';
}
/**
 *	@service WindowConfirm
 *	@desc Confirms whether to continue 
 *
 *	@param confirm boolean [memory] optional default false
 *	@param value string [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.service.WindowConfirm = {
	input : function(){
		return {
			required : ['value'],
			optional : { confirm : false }
		}
	},
	
	run : function($memory){
		if($memory['confirm']){
			$memory['valid'] = confirm($memory['value']);
			return $memory;
		}
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
/**
 *	@helper WindowFrame
 *
 *	@param name
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.windowFrame = function($name){
	for (var i = window.frames.length -1; i >= 0; i--){
		var $frame = window.frames[i];
		if($frame.name || false){
			if($frame.name == $name){
				return $frame;
			}
		}
	}
	
	return false;
}
/**
 *	@workflow WindowLogin
 *	@desc Sign in using Cookie
 *
 *	@param key string [message] optional default 'sessionid'
 *	@param value string [message] optional default null
 *	@param expires integer[message] optional default 1 day
 *	@param path string [memory] optional default '/'
 *	@param continue string [message] optional default false
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.workflow.WindowLogin = {
	input : function(){
		return {
			optional : { key : 'sessionid', value : null, expires : 1, path : '/', 'continue' : false }
		}
	},
	
	run : function($memory){
		return [{
			service : FireSpark.core.service.DataCookie
		},{
			service : FireSpark.core.service.WindowReload
		}].execute( $memory );
	},
	
	output : function(){
		return [];
	}
};
/**
 *	@service WindowReload
 *	@desc Reloads the window
 *
 *	@param continue string [message] optional default false
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.service.WindowReload = {
	input : function(){
		return {
			'optional' : { 'continue' : false }
		};
	},
	
	run : function($memory){
		//window.location.hash = '';
		if($memory['continue']){
			window.location = $memory['continue'];
		}
		else {
			window.location.reload();
		}
		$memory['valid'] = false;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
/**
 *	@helper ContainerPages
 *
 *	@param element
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.helper.containerPages = function($total, $pgno, $pgsz){
	var $pages = [];
	for(var $i = 0, $j = 0; $i < Number($total); $i += Number($pgsz), $j++){
		$pages.push($j != Number($pgno));
	}
	return $pages;
}
/**
 *	@service ContainerRemove
 *	@desc Used to remove container
 *
 *	@param key string [memory] optional default 'ui-global'
 *	@param id long int [memory] optional default '0'
 *	@param ins string [memory] optional default '#ui-global-0'
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.service.ContainerRemove = {
	input : function(){
		return {
			optional : { 
				key : 'ui-global', 
				id : '0',
				ins : '#ui-global-0'
			},
			set : [ 'key', 'id', 'ins' ]
		}
	},
	
	run : function($memory){		
		var $instance = $memory['key']+'-'+$memory['id'];

		$memory = [{
			service : FireSpark.ui.service.ElementContent,
			element : '.' + $instance,
			select : true,
			action : 'remove',
			animation : 'none'
		},{
			service : FireSpark.smart.workflow.InterfaceTile,
			input : { cntr : 'ins' }
		}].execute( $memory );
		
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
 *	@param bg boolean [memory] optional default false
 *	@param tpl template [memory] optional default [{ '#tpl-default' : '>.bands' }]
 *	@param tile string [memory] optional false
 *	@param act string [memory] optional default 'first' ('all', 'first', 'last', 'remove')
 *	@param data object [memory] optional default {}
 *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout')
 *	@param dur integer [memory] optional default 1000
 *	@param dly integer [memory] optional default 0
 *	@param errorflow workflow [memory] optional default { service : FireSpark.ui.workflow.TemplateApply, tpl : 'tpl-default' }
 *	@param mv boolean [memory] optional default FireSpark.smart.constant.moveup
 *	@param mvdur integer [memory] optional default FireSpark.smart.constant.moveduration
 *
 *	@return element element [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.service.ContainerRender = {
	input : function(){
		return {
			optional : { 
				key : 'ui-global', 
				id : '0',
				ins : '#ui-global-0',
				root : false,
				bg : false,
				tpl : [{ '#tpl-default' : '>.bands' }],
				tile : false,
				act : 'first',
				data : {},
				anm : 'fadein',
				dur : 1000,
				dly : 0,
				errorflow : { service : FireSpark.ui.workflow.TemplateApply, tpl : 'tpl-default' },
				mv : FireSpark.smart.constant.moveup,
				mvdur : FireSpark.smart.constant.moveduration
			}
		}
	},
	
	run : function($memory){				
		if($memory['data']['valid'] || false){
			if($memory['data']['message'] || false){
				if($memory['data']['message']['id'] || false){
					$memory['id'] = $memory['data']['message']['id'];
				}
			}
			
			var $instance = $memory['key']+'-'+$memory['id'];
			
			FireSpark.smart.helper.dataState(FireSpark.smart.constant.initmsg, true);
			var $workflow = [{
				service : FireSpark.ui.service.ElementContent,
				element : '.' + $instance + FireSpark.ui.constant.replacesel,
				select : true,
				action : 'remove'
			}];
			
			var $tpl = $memory['tpl'];
			for(var $i in $tpl){
				$workflow = $workflow.concat([{
					service : FireSpark.ui.workflow.TemplateApply,
					input : {
						action : 'act',
						duration : 'dur'
					},
					element : $memory['ins'] + $tpl[$i]['sel'],
					select : true,
					template : $tpl[$i]['tpl'],
					animation : 'none',
					delay : 0
				}]);
			}
			
			if($memory['bg'] === false){
				$workflow.push({
					service : FireSpark.smart.workflow.InterfaceTile,
					input : { cntr : 'ins' }
				});
			}
			
			return $workflow.execute($memory);
		}
		else if($memory['errorflow']) {
			/**
			 *	Run the errorflow
			**/
			return $memory['errorflow'].execute($memory);
		}
		else return { valid : false };
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
 *	@param action string [memory] optional default 'all' ('all', 'first', 'last', 'remove', 'replace', 'hide', 'show')
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
		
		var $data = $memory['data'];
		var $animation = $memory['animation'];
		var $duration = $memory['duration'];
		
		if($.isPlainObject($data) && $memory['action'] != 'remove' && $data['html'] || false){
			$data = $("<div/>").html($data['html']).text();
		}
		
		if($animation == 'fadein' || $animation == 'slidein'){
			$element.hide();
		}
		
		switch($memory['action']){
			case 'all' :
				$element = $element.html($data);
				$element.trigger('load');
				break;
			
			case 'first' :
				$element = $element.prepend($data);
				$element.trigger('load');
				break;
			
			case 'last' :
				$element = $element.append($data);
				$element.trigger('load');
				break;
			
			case 'replace' :
				$element = $($data).replaceAll($element);
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
 *	@service ElementLoading
 *	@desc Enables and disables loader
 *
 *	@param element string [memory] optional default false
 *	@param data string [memory] optional default FireSpark.smart.constant.loadmsg
 *
 *	@return loading html [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.service.ElementLoading = {
	input : function(){
		return {
			optional : { element : false, disabled : false, data : FireSpark.smart.constant.loadmsg }
		};
	},
	
	run : function($memory){
		if($memory['element']){
			$memory['loading'] = $($memory['element']).html();
			$($memory['element']).html($memory['data']);
		}
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['loading'];
	}
};
/**
 *	@service ElementSection
 *	@desc Toggles element with another content and animates it and returns element in memory
 *
 *	@param element string [memory] optional default parent of content
 *	@param select boolean [memory] optional default false
 *	@param content string [memory] optional default false
 *	@param child string [memory] optional default '.tile-content'
 *	@param none boolean [memory] optional default false
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
			optional : { 
				element : false,
				select : false,
				content : false,
				child : '.tile-content',
				none : false,
				animation : false,
				duration : 500,
				delay : 0
			}
		};
	},
	
	run : function($memory){
		if($memory['select'] && $memory['element']){
			var $element = $($memory['element']);
			if(!$element.length){
				return { valid : false };
			}
		}
		else if($memory['select'] && $memory['content']){
			var $element = $($memory['content']).parent();
			if(!$element.length){
				return { valid : false };
			}
		}
		else {
			$element = $memory['element'];
		}
		
		$element.children($memory['child']).hide();
		
		if(!$memory['none']){
			if($memory['content']){
				$element = $element.children($memory['content']);
			}
			else {
				$element = $element.children($memory['child']).eq(0);
			}
			
			var $animation = $memory['animation'];
			var $duration = $memory['duration'];
			
			$element.trigger('load');
	
			if( $animation ){
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
			}
			else {
				$element.show();
			}
		}
		
		$memory['element'] = $element;
		$memory['valid'] = false;
		return $memory;
	},
	
	output : function(){
		return ['element'];
	}
};
/**
 *	@service ElementState
 *	@desc Enables and disables element
 *
 *	@param element string [memory] optional default false
 *	@param disabled boolean [memory] optional default false
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.service.ElementState = {
	input : function(){
		return {
			optional : { element : false, disabled : false }
		};
	},
	
	run : function($memory){
		if($memory['element']){
			if($memory['disabled']){
				$($memory['element']).attr('disabled', true);
			}
			else {
				$($memory['element']).removeAttr('disabled');
			}
		}
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
/**
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
 *	@service ElementToggle
 *	@desc Shows and hides element
 *
 *	@param element string [memory] optional default false
 *	@param notoggle boolean [memory] optional default false
 *	@param hide boolean [memory] optional default false
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.service.ElementToggle = {
	input : function(){
		return {
			optional : { element : false, notoggle : false, hide : false }
		};
	},
	
	run : function($memory){
		if($memory['element']){
			if($memory['notoggle']){
				$($memory['element']).toggle($memory['hide']);
			}
			else {
				$($memory['element']).toggle();
			}
		}
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
/**
 *	@service ElementTrigger
 *	@desc Triggers event on element
 *
 *	@param element string [memory] optional default false
 *	@param event string [memory] optional default false
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.service.ElementTrigger = {
	input : function(){
		return {
			optional : { element : false, event : false }
		};
	},
	
	run : function($memory){
		if($memory['element'] && $memory['event']){
			$($memory['element']).trigger($memory['event']);
		}
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
/**
 *	@template Default
**/
FireSpark.ui.template.Default = $.template('\
	<span class="{{if valid}}success{{else}}error{{/if}}">{{html msg}}</span>\
	<span class="hidden">${details}</span>\
');

'tpl-default'.save( FireSpark.ui.template.Default );
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
/**
 *	@workflow TemplateApply
 *	@desc Applies template with data
 *
 *	@param element string [memory]
 *	@param template string [memory] optional default FireSpark.ui.constant.defaulttpl
 *	@param data object [memory] optional default {}
 *
 *	@param select boolean [memory] optional default false
 *	@param animation string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout')
 *	@param duration integer [memory] optional default 1000
 *	@param delay integer [memory] optional default 0
 *	@param action string [memory] optional default 'all' ('all', 'first', 'last', 'remove', 'hide', 'show')
 *
 *	@return element element [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.workflow.TemplateApply = {
	input : function(){
		return {
			required : ['element'],
			optional : { 
				data : {}, 
				template : 'tpl-default',
				select : false, 
				animation : 'fadein',
				duration : 1000,
				delay : 0,
				action : 'all'
			}
		};
	},
	
	run : function($memory){
		return [{
			service : FireSpark.ui.service.TemplateRead
		},{
			service : FireSpark.ui.service.TemplateApply,
			input : { template : 'result' }
		},{
			service : FireSpark.ui.service.ElementContent,
			input : { data : 'result' }
		}].execute($memory);
	},
	
	output : function(){
		return ['element'];
	}
};
/**
 *	@workflow TemplateBind
 *	@desc Binds template with data into element
 *
 *	@param cntr string [memory]
 *	@param select boolean [memory] optional default true
 *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout')
 *	@param dur integer [memory] optional default 1000
 *	@param dly integer [memory] optional default 0
 *	@param act string [memory] optional default 'all' ('all', 'first', 'last', 'remove', 'hide', 'show')
 *
 *	@param tpl string [memory] optional default 'tpl-default'
 *	@param data string [memory] optional default {}
 *
 *	@return element element [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.workflow.TemplateBind = {
	input : function(){
		return {
			required : ['cntr'],
			optional : { 
				select : true, 
				anm : 'fadein',
				dur : 1000,
				dly : 0, 
				action : 'all',
				tpl : 'tpl-default' ,
				data : ''
			}
		};
	},
	
	run : function($memory){
		$memory = [{
			service : FireSpark.core.service.DataEncode,
			type : 'json'
		},{ 
			service : FireSpark.ui.workflow.TemplateApply,
			input : {
				element : 'cntr',
				template : 'tpl', 
				animation : 'anm',
				duration : 'dur',
				delay : 'dly',
				action : 'act'
			}
		}].execute($memory);
		
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['element'];
	}
};
/**
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
		$template = $tpl.get();
		
		if(!$template && $tpl.charAt(0) == '#'){
			$template = $.template($tpl);
			if($template){
				$tpl.save($template);
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
/**
 *	@template Tiles
**/
FireSpark.ui.template.Tiles = $.template('\
	<ul class="hover-menu horizontal tls-${key}-${id}">\
		<span class="tilehead">\
			${tilehead}\
			{{if FireSpark.core.helper.dataEquals(close, true)}}\
				<a class="launch close hover" href="#/close/${key}/${id}/${ins}/" title="Close"></a>\
			{{/if}}\
		</span>\
		{{each tiles}}\
		<li>\
			{{if FireSpark.core.helper.dataEquals(!privileged || (privileged && admin), true)}}\
				{{if tpl}}\
					{{tmpl tpl}}\
				{{else urlhash}}\
					<a href="${urlhash}" class="navigate tile ${style}">${name}</a>\
				{{else}}\
					<a href="!/view/${tile}-${id}" class="navigate tile ${style}">${name}</a>\
				{{/if}}\
			{{/if}}\
		</li>\
		{{/each}}\
	</ul>\
');

'tpl-tiles'.save( FireSpark.ui.template.Tiles );

/**
 *	@template Bands
**/
FireSpark.ui.template.Bands = $.template('\
	{{each tiles}}\
		<span></span>\
		{{if $value.tiletpl}}\
			{{tmpl $value.tiletpl}}\
		{{/if}}\
	{{/each}}\
');

'tpl-bands'.save( FireSpark.ui.template.Bands );

/**
 *	@template Container
**/
FireSpark.ui.template.Container = $.template('\
	<div class="tiles"></div>\
	{{if inline}}<div class="bands"></div>{{/if}}\
');

'tpl-container'.save( FireSpark.ui.template.Container );
/**
 *	@helper TransformButton
 *
 *	@param element
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.helper.transformButton = function($element, $config){
	$element.button();
	return $element;
}
/**
 *	@helper TransformCKEditor
 *
 *	@param element
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.helper.transformCKEditor = function($element, $config){
	var $temp = $element;
		
	$element.each(function($index, $el){
		var $name = $temp.attr('id') || $temp.attr('name');
		var $instance = CKEDITOR.instances[$name] || false;
		if($instance){
			try {
				CKEDITOR.remove($instance);
			}
			catch(e) {}
			delete $instance;
		}
		$temp = $temp.slice(1);
	});
	
	$element.ckeditor();
	return $element;
}
/**
 *	@helper TransformRobin
 *
 *	@param element
 *	@param selector
 *	@param total
 *	@param interval
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.helper.transformRobin = function($element, $config){
	
	(function(){
		var $total = $config['total'];
		var $current = 0;
		window.setInterval(function txrobin(){
			$current++;
			$current %= $total;
			$element.children($config['selector']).stop(true, true).fadeOut(500).eq($current).delay(500).fadeIn(500);
		}, $config['interval']);
	})();
	
	return $element;
}
/**
 *	@helper TransformSmartpanel
 *
 *	@param element
 *	@param config
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.helper.transformSmartpanel = function($element, $config){
	return $element.each(function(){
		
		// Settings and variables
		var $self = $(this),
		$settings = $.extend({
			display: '.smart-display',
			edit: '.smart-edit',
			form: '.smart-form',
			cancel: '.smart-cancel',
			hover: '.smart-hover'
		}, $config || {}, {}),
		
		// Local cache for selectors
		$display = $self.find($settings.display),
		$edit = $self.find($settings.edit),
		$form = $self.find($settings.form),
		//$save = $self.find($settings.save),
		$cancel = $self.find($settings.cancel);
		
		// Make sure the plugin only get initialized once
		if($self.hasClass('smart-panel-done')){
			return;
		}
		$self.addClass('smart-panel-done');
		
		// Edit handler
		$edit.bind('click.smart-panel', function(){
			$display.hide();
			$form.show();
			//$edit.hide();
			return false;
		});
		
		// Cancel Actions
		$cancel.bind('click.smart-panel', function(){
			$form.hide();
			$display.show();
			//$edit.show();
			return false;
		});
		
		// Display Actions
		/*$display.bind('click.smart-panel', function(){
			$display.hide();
			$form.show();
			return false;
		})
		/*.bind( 'mouseenter.smart-panel', function(){
			$display.addClass( $settings.hover );
		})
		.bind( 'mouseleave.smart-panel', function(){
			$display.removeClass( $settings.hover );
		})*/;		
	});
}
/**
 *	@helper TransformTabpanel
 *
 *	@param element
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.helper.transformTabpanel = function($element, $config){
	$element.hide();
	
	var $tab = new Array();
	var $index = $config['indexstart'];
	
	var $options = {
		cache : $config['cache'],
		collapsible : $config['collapsible'],
		event : $config['event'],
		tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>",
		add: function($event, $ui) {
			$tab[$index] = $($ui.panel);
		}
	};
	
	if($config['tablink']){
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
	
	Snowblozm.Registry.save($config['savekey'], {
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
	return $element;
}
/**
 *	@helper TransformTop
 *
 *	@param element
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.helper.transformTop = function($element, $config){
	$($config['sel']).animate({
		scrollTop: 0
	}, 850);
	return false;
}
/**
 *	@service TransformTrigger
 *	@desc Initializes transform triggers
 *
 *	@param transforms array [memory] optional default FireSpark.core.constant.transforms
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.service.TransformTrigger = {
	input : function(){
		return {
			optional : { 'transforms' : FireSpark.ui.constant.transforms }
		};
	},
	
	run : function($memory){
		var $transforms = $memory['transforms'];
		
		for(var $i in $transforms){
			$tx = $transforms[$i];
			$($tx['cls']).live('load', function(){
				var $helper = $tx['helper'];
				$helper($(this), $tx['config']);
			});
		}
	
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
/**
 *	@helper TransformWysiwyg
 *
 *	@param element
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.helper.transformWysiwyg = function($element, $config){
	$element.children($config['sel']).wysiwyg();
	return $element;
}
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
 *	@param params array [memory] optional default []
 *	@param workflow Workflow [memory]
 *	@param errorflow	Workflow [memory] optional default false
 *	@param stop boolean [memory] optional default false
 *	@param validity boolean [memory] optional default false
 *
 *	@param force boolean [memory] optional default FireSpark.smart.constant.poolforce
 *	@param global boolean [memory] optional default false
 *	@param nocache boolean [memory] optional default false
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
				params : [],
				errorflow : false,
				stop : false,
				validity : false,
				nocache : false,
				expiry : FireSpark.smart.constant.poolexpiry,
				force : FireSpark.smart.constant.poolforce,
				global : false,
				iframe : false,
				agent : false,
				root : false
			}
		}
	},
	
	run : function($memory){
		var $workflow = $memory['workflow'];
		var $key = 'FIRESPARK_SI_DATA_URL_' + $memory['url'] + '_DATA_' + $memory['data'] + '_TYPE_' + $memory['type'] + '_REQUEST_' + $memory['request'];
		//alert($key);
		
		if($memory['data'] === true) {
			$memory['data'] = '';
		}
		
		$workflow.unshift({
			service : FireSpark.core.service.DataPush,
			args : $memory['params'],
			output : { result : 'data' }
		});
		
		
		/**
		 *	Check AJAX
		**/
		if($memory['iframe']){
			$memory['agent'] = $memory['agent'] ? $memory['agent'] : $memory['root'];
			
			return {
				service : FireSpark.core.service.LoadIframe,
				args : $memory['args']
			}.run($memory);
		}
		else if($memory['force'] === false){
			/**
			 *	Check pool
			**/
			var $data = $key.get();
			
			if($data){
				$memory['data'] = $data;
				if($data['valid'] || false){
					/**
					 *	Run the workflow
					**/
					$workflow.execute($memory);
					return { valid : $memory['stop']};
				}
				else if($memory['errorflow']) {
					/**
					 *	Run the errorflow
					**/
					$memory['errorflow'].execute($memory);
					return { valid : $memory['stop']};
				}
			}
		}
		
		if($memory['nocache'] === false){
			$workflow.unshift({
				service : FireSpark.core.service.DataRegistry,
				input : { value : 'data' },
				key : $key,
				expiry : $memory['expiry']
			});
		}
		
		if($memory['global']){
			var $data = FireSpark.smart.constant.globalkey.get();
			
			if($data){
				$memory['data'] = $data;
				if($data['valid'] || false){
					/**
					*	Run the workflow
					**/
					$workflow.execute($memory);
					return { valid : $memory['stop']};
				}
				else if($memory['errorflow']){
					/**
					 *	Run the errorflow
					**/
					$memory['errorflow'].execute($memory);
					return { valid : $memory['stop']};
				}
			}
		}
		
		/**
		 *	Load AJAX
		**/
		return {
			service : FireSpark.core.service.LoadAjax,
			args : $memory['args'] || false,
			workflow : $workflow
		}.run($memory);
	},
	
	output : function(){
		return [];
	}
};
/**
 *	@helper DataState
 *
 *	@param html
 *	@param state
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/FireSpark.smart.helper.dataState = function($html, $state){
	var $el = $(FireSpark.smart.constant.statusdiv);
	var $data = $el.html();
	$el.html($html).stop(true, true);
	if($state || false){
		$el.hide().slideDown(500).delay(FireSpark.smart.constant.statusdelay).slideUp(FireSpark.smart.constant.statusduration);
	}
	else {
		$el.hide().slideDown(500);
	}
}
/**
 *	@service InterfaceCollect
 *	@desc Initializes navigator, collects data, launch workflows
 *
 *	@param selector string [memory]
 *	@param attribute string [memory] optional default 'href'
 *	@param event string [memory] optional default 'click'
 *	@param nav string [memory] optional default false
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.smart.service.InterfaceCollect = {
	input : function(){
		return {
			required : ['selector'],
			optional : { 
				event : 'click', 
				attribute : 'href',
				nav : false
			}
		};
	},
	
	run : function($memory){
		$($memory['selector']).live($memory['event'], function(){
			FireSpark.smart.service.InterfaceUrl.idle = false;
			
			var $block = $(this).parent();
			var $url = $(this).attr($memory['attribute']);
			
			var $message = { 
				root : $(this) 
			};
			var $history = { 
				root : FireSpark.smart.constant.hststatusdiv
			};
			
			var serialize = function($index, $el){
				if($(this).attr('name') || false){
					$message[$(this).attr('name')] =  $(this).val();
					$history[$(this).attr('name')] =  $(this).val();
				}
			}
			$history[ 'ld' ] = FireSpark.smart.constant.hststatus;
			$block.children('input').each(serialize);
			
			/** 
			 *	@note SmartURL using HTML5 History 
			**/
			if($memory['nav'] || false){
				try {
					window.history.pushState({ 
						navigator : $memory['navigator'],
						message : $history
					},"", $url);
				} catch($id){
					if(console || false){
						console.log('Exception : ' + $id);
					}
				}

				//FireSpark.smart.service.InterfaceUrl.base = $navigator;
			}
			else {
				//window.history.pushState({},"", ' ');
			}
			
			var $result = $message['navigator'].launch($message);
			FireSpark.smart.service.InterfaceUrl.idle = true;
			return $result || false;
		});
		
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
/**
 *	@service InterfaceHistory
 *	@desc Initializes navigator launch history triggers
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.smart.service.InterfaceHistory = {
	input : function(){
		return { };
	},
	
	run : function($memory){
		window.onpopstate = function(e){
			if(e.state){
				if(e.state['message'] || false){
					e.state['message']['navigator'].launch(e.state['message']);
				}
				else {
					var $service = {
						service : FireSpark.smart.service.InterfaceUrl,
						navigator : e.state['nav'],
						escaped : e.state['escaped'],
						event : true,
						save : e.state['hash'],
						nofrc : true
					};					$service.run({});
				}
			}
		};

		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
/**
 *	@workflow InterfaceLoad
 *	@desc Processes loading of UI using imports and keys
 *
 *	@param key string [memory] optional default 'people.person.info'
 *	@param id long int [memory] optional default '0'
 *	@param name string [memory] optional default ''
 *	@param cntr string [memory] optional default false
 *	@param ins string [memory] optional default '0'
 *	@param nav string [memory] optional default false
 *	@param tile string [memory] optional false
 *
 *	@param url URL [memory] optional default FireSpark.smart.constant.defaulturl
 *	@param tpl string [memory] optional default 'tpl-default'
 *
 *	@param select boolean [memory] optional default true
 *	@param lcntr string [memory] optional default FireSpark.smart.constant.statusdiv
 *	@param ld string [memory] optional default FireSpark.core.constant.loadstatus
 *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout')
 *	@param dur integer [memory] optional default 1000
 *	@param dly integer [memory] optional default 0
 *	@param act string [memory] optional default 'all' ('all', 'first', 'last', 'remove')
 *	@param bg boolean [memory] optional default false
 *	@param mv boolean [memory] optional default FireSpark.smart.constant.moveup
 *	@param mvdur integer [memory] optional default FireSpark.smart.constant.moveduration
 *
 *	@param frc boolean [memory] optional default FireSpark.smart.constant.poolforce
 *	@param glb boolean [memory] optional default false
 *	@param nch boolean [memory] optional default false
 *	@param exp integer [memory] optional default FireSpark.smart.constant.poolexpiry
 *
 *	@param iframe string [memory] optional default false
 *	@param agt string [memory] optional default root
 *	@param root element [memory] optional default false
 *
 *	@param data string [memory] optional default ''
 *	@param type string [memory] optional default 'json'
 *	@param req string [memory] optional default 'POST'
 *	@param workflow Workflow [memory] optional default [{ service : FireSpark.ui.service.ContainerRender }]
 *	@param errorflow Workflow [memory] optional default [{ service : FireSpark.jquery.service.ElementContent, ... }]
 *	@param params array [memory] optional default []
 *	@param stop boolean [memory] optional default false
 *	@param config array [memory] optional default FireSpark.smart.constant.config
 *	@param navigator string [memory] optional default ''
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.smart.workflow.InterfaceLoad = {
	input : function(){
		return {
			optional : { 
				key : FireSpark.smart.constant.defaultkey, 
				id : '0',
				name : false,
				ins : '0',
				cntr : false,
				lcntr : FireSpark.smart.constant.statusdiv,
				url : FireSpark.smart.constant.defaulturl,
				nav : false,
				tile : false,
				glb : false,
				nch : false,
				exp : FireSpark.smart.constant.poolexpiry,
				frc : FireSpark.smart.constant.poolforce,
				iframe : false,
				agt : false,
				root : false,
				bg : false,
				select : true,
				ld : FireSpark.smart.constant.loadstatus,
				anm : 'fadein',
				dur : 500,
				dly : 0,
				act : 'first',
				tpl : 'tpl-default' ,
				data : '',
				type : 'json',
				req : 'POST',
				workflow : [{ service : FireSpark.ui.service.ContainerRender }],
				errorflow :  [{ 
					service : FireSpark.ui.service.ElementContent,
					args : ['lcntr'],
					input : {
						element : 'lcntr',
						animation : 'anm', 
						duration : 'dur',
						delay : 'dly'
					},
					select : true,
					act : 'all'
				}],
				params : [],
				stop : false,
				config : FireSpark.smart.constant.config,
				navigator : '',
				mv : FireSpark.smart.constant.moveup,
				mvdur : FireSpark.smart.constant.moveduration
			}
		};
	},
	
	run : function($memory){
		for(var $max=0; ; $max++){
			if($memory[$max] || false){
			} else break;
		}

		var $index = --$max;
		$i = $j = 0;
		var $data = '';
		
		if($index > 1 && is_numeric($memory[$index])){
			$memory['key'] = $memory[$index-1];
			
			$data += ('&' + ($j++) + '=' + $memory[$index]);
			$memory['id'] = $memory[$index];
			
			$data += ('&' + ($j++) + '=');
			$max = $index-1;
		}
		else if($index > 1 && is_numeric($memory[$index-1])){
			$memory['key'] = $memory[$index-2];
			
			$data += ('&' + ($j++) + '=' + $memory[$index-1]);
			$memory['id'] = $memory[$index-1];
			
			$data += ('&' + ($j++) + '=' + $memory[$index]);
			//$memory[$j++] = $memory[$index];
			$max = $index-2;
		}
		else {
			$memory['key'] = $memory[$i++];
			
			$data += ('&' + ($j++) + '=' + $memory[$i]);
			$memory['id'] = $memory[$i++];
		}
		
		while($max && $i <= $max){
			$data += ('&' + ($j++) + '=' + $memory[$i++]);
		}
		/*var $config = $memory['config'];
		for($i=0; $i<$max; $i++){
			$data += ('&' + $config[$i] + '=' + $memory[$i]);
		}*/
		$memory['data'] += $data;
		
		//$memory['key'] = $memory[$i] || $memory['key'];
		//$memory['id'] = $memory[$i+1] || $memory['id'];
		//$memory['name'] = $memory[$i+2] || $memory['name'] || '';
		//if($memory['name'] == '#') $memory['name'] = ''; //$memory['id'];
		//$memory['ins'] = $memory[$i+3] || $memory['ins'];
		
		var $key = $memory['key'];
		var $instance = $memory['key']+'-'+$memory['id'];
		var $workflow = $memory['workflow'];
		
		$memory['key'] = 'ui-' + $key.replace(/\./g, '-');
		$memory['ins'] = $memory['cntr'] || FireSpark.smart.constant.tileuiprefix + $memory['ins'];
		
		var $navigator = $memory['navigator'];
		$navigator = $navigator.replace(/bg\/true\//g, '');
		$memory['navigator'] = $navigator = $navigator.replace(/glb\/true\//g, '');
		
		var $parts = $navigator.split('~');
		if($parts[1] || false){
			var $req = $parts[1].split('/');
			for(var $i = 1, $len=$req.length; $i<$len; $i+=2){
				//$req[$i + 1] = unescape($req[$i + 1]);
				$memory['data'] += ('&' + $req[$i] + '=' + $req[$i + 1]);
			}
		}
		
		if($memory['nav']){
			$workflow = $workflow.concat([{
				service : FireSpark.core.service.LaunchNavigator,
				args : [ 'ins' ],
				data : [$memory['nav']],
				launch : true,
				nonstrict : true
			}]);
		}
		
		var $dataflow = [{
			service : FireSpark.smart.service.DataLoad,
			args : ['tpl', 'ins', 'act', 'dur', 'dly', 'anm', 'key', 'id', 'name', 'ins', 'inline', 'bg', 'tile', 'lcntr', 'ld', 'mv', 'mvdur'],
			url : $memory['url'],
			data : 'service=' + $key + '&navigator=' + $memory['navigator'] + '&' + $memory['data'], 
			validity : true,
			type : $memory['type'],
			request : $memory['req'], 
			global : $memory['glb'],
			nocache : $memory['nch'],
			expiry : $memory['exp'],
			force : $memory['frc'],
			iframe : $memory['iframe'],
			agent : $memory['agt'],
			root : $memory['root'],
			act : $memory['act'],
			dur : $memory['dur'],
			dly : $memory['dly'],
			anm : $memory['anm'],
			bg : $memory['bg'] || $memory['nav'],
			mv : $memory['mv'],
			mvdur : $memory['mvdur'],
			key : $memory['key'],
			id : $memory['id'],
			name : $memory['name'],
			ins : $memory['ins'],
			tile : $memory['tile'],
			navigator : $memory['navigator'],
			params : ($memory['params']).concat(['key', 'id', 'name', 'ins', 'navigator']),
			workflow : $workflow,
			errorflow : [{ 
				service : FireSpark.ui.workflow.TemplateApply,
				input : {
					animation : 'anm', 
					duration : 'dur',
					delay : 'dly'
				},
				element : $memory['lcntr'],
				select : true,
				act : 'all',
				tpl : 'tpl-default'
			}]
		}];
		
		if( FireSpark.smart.constant.nobarrier || false ){
			var $loadflow = [{
				service : FireSpark.core.service.DataSelect,
				params : { imports : 'imports', tpl : 'tpl' }
			}].concat( $dataflow );
			
		}
		else {
			var $loadflow = [{
				service : FireSpark.core.service.DataSelect,
				params : { imports : 'imports', tpl : 'tpl' }
			},{
				service : FireSpark.smart.service.DataImport,
				args : ['tpl', 'lcntr', 'act', 'dur', 'dly', 'anm', 'ld'],
				workflow : $dataflow,
				errorflow : false
			}];
		}
		
		return [{
			service : FireSpark.ui.service.ElementContent,
			input : {
				element : 'lcntr' ,
				animation : 'anm', 
				delay : 'dly',
				duration : 'dur',
				data : 'ld'
			},
			act : 'all',
			select : true
		},{
			service : FireSpark.smart.service.DataLoad,
			url : FireSpark.smart.constant.importroot + $key + FireSpark.smart.constant.importext,
			args : ['lcntr', 'act', 'dur', 'dly', 'anm', 'ld'],
			request : 'GET',
			data : true, 
			type : 'json', 
			process : false, 
			mime : 'application/x-www-form-urlencoded',
			params : [],
			stop : false,
			cache : true,
			expiry : false,
			workflow : $loadflow
		}].execute($memory);
	},
	
	output : function(){
		return [];
	}
};
/**
 *	@workflow InterfaceTab
 *	@desc Loads template with data into new tab in tabui
 *
 *	@param tabui string [message] optional default 'tabuipanel'
 *	@param title string [message] optional default 'Krishna'
 *
 *	@param url URL [memory]
 *	@param cntr string [memory]
 *	@param tpl string [memory] optional default 'tpl-default'
 *
 *	@param select boolean [memory] optional default false
 *	@param ld string [memory] optional default FireSpark.core.constant.loadmsg
 *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout')
 *	@param dur integer [memory] optional default 1000
 *	@param dly integer [memory] optional default 0
 *	@param act string [memory] optional default 'all' ('all', 'first', 'last', 'remove')
 *
 *	@param frc boolean [memory] optional default FireSpark.smart.constant.poolforce
 *	@param nch boolean [memory] optional default false
 *	@param exp integer [memory] optional default FireSpark.smart.constant.poolexpiry
 *
 *	@param iframe string [memory] optional default false
 *	@param agt string [memory] optional default root
 *	@param root element [memory] optional default false
 *
 *	@param cnf boolean [memory] optional default false
 *	@param cnfmsg string [memory] optional default FireSpark.smart.constant.cnfmsg
 *
 *	@param sel string [memory] optional default false
 *	@param enc string [memory] optional default 'url' ('url', 'json')
 *
 *	@param data string [memory] optional default 
 *	@param type string [memory] optional default 'json'
 *	@param req string [memory] optional default 'POST'
 *	@param workflow Workflow [memory] optional default [{ service : FireSpark.jquery.workflow.TemplateApply, ... }]
 *	@param errorflow Workflow [memory] optional default [{ service : FireSpark.jquery.service.ElementContent, ... }]
 *	@param params array [memory] optional default []
 *	@param stop boolean [memory] optional default false
 *
 *	@param ln boolean [memory] optional default false
 *	@param status string [memory] optional default 'valid'
 *	@param message string [memory] optional default 'message'
 *
 *	@return element element [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.smart.workflow.InterfaceTab = {
	input : function(){
		return {
			required : ['cntr', 'url'],
			optional : { 
				tabui : 'tabuipanel',
				title : 'Krishna',
				nch : false,
				exp : FireSpark.smart.constant.poolexpiry,
				frc : FireSpark.smart.constant.poolforce,
				iframe : false,
				agt : false,
				root : false,
				select : false,
				ld : FireSpark.smart.constant.loadmsg,
				anm : 'fadein',
				dur : 1000,
				dly : 0,
				act : 'all',
				tpl : 'tpl-default' ,
				cnf : false,
				cnfmsg : FireSpark.smart.constant.cnfmsg,
				sel : false,
				enc : 'url',
				data : '',
				type : 'json',
				req : 'POST',
				workflow : false,
				errorflow :  false,
				params : [],
				stop : false,
				ln : false,
				status : 'valid',
				message : 'message'
			}
		};
	},
	
	run : function($memory){
		return [{
			service : FireSpark.ui.service.ElementTab
		},{
			service : FireSpark.smart.workflow.ReadTmpl
			//stop : true
		}].execute($memory);
	},
	
	output : function(){
		return ['element'];
	}
};
/**
 *	@workflow InterfaceTile
 *	@desc Shows tile content into parent element
 *
 *	@param cntr string [memory] optional default selects closest with FireSpark.smart.constant.tileuicntr || FireSpark.smart.constant.tileuiprefix + ins
 *	@param ins string [memory] optional default false
 *	@param child selector [memory] optional default FireSpark.smart.constant.tileuisection
 *	@param none boolean [memory] optional default false
 *	@param select boolean [memory] optional default true
 *	@param tile string [memory] optional false
 *	@param anm string [memory] optional default false ('fadein', 'fadeout', 'slidein', 'slideout', false)
 *	@param dur integer [memory] optional default 500
 *	@param dly integer [memory] optional default 0
 *	@param mv boolean [memory] optional default FireSpark.smart.constant.moveup
 *	@param mvdur integer [memory] optional default FireSpark.smart.constant.moveduration
 *
 *	@return element element [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.smart.workflow.InterfaceTile = {
	input : function(){
		return {
			optional : { 
				cntr : false,
				ins : false,
				child : FireSpark.smart.constant.tileuisection,
				canvas : false,
				none : false,
				select : false, 
				tile : false,
				anm : false,
				dur : 150,
				dly : 0,
				mv : 0,
				mvdur : FireSpark.smart.constant.moveduration,
				mvbody : 'body,html'
			},
			set : [ 'tile', 'cntr' ]
		};
	},
	
	run : function($memory){
		var $ins  = $memory['cntr'];
		
		if($memory['tile'] === false){
			$ins = ($memory['cntr'] || FireSpark.smart.constant.tileuiprefix + $memory['ins']) + '>' + FireSpark.smart.constant.tileuicntr;
		}
		var $select = true;
		
		if( $memory[ 'canvas' ] ){
			$( $memory[ 'canvas' ] ).parent().children( $memory[ 'child' ] ).hide();
			$( $memory[ 'canvas' ] ).show();
			$memory[ 'mv' ] = $memory[ 'mv' ] || FireSpark.smart.constant.moveup;
		}

		$memory = [{
				service : FireSpark.ui.service.ElementSection,
				element : $ins || false,
				input : { 
					content : 'tile',
					animation : 'anm',
					duration : 'dur',
					delay : 'dly'
				},
				select : $select
		}].execute($memory);
		
		if(Number($memory['mv'])){
			$( $memory[ 'mvbody' ] ).animate({
					scrollTop: 0
			}, $memory['mvdur']);
		}
		
		return $memory;
	},
	
	output : function(){
		return ['element'];
	}
};
/**
 *	@service InterfaceTrigger
 *	@desc Initializes navigator launch triggers
 *
 *	@format #/path/!/view
 *
 *	@param selector string [memory]
 *	@param event string [memory] optional default 'click'
 *	@param attribute string [memory]
 *	@param escaped boolean [memory] optional default false
 *	@param hash boolean [memory] optional default false
 *	@param nav string [memory] optional default false
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.smart.service.InterfaceTrigger = {
	input : function(){
		return {
			required : ['selector', 'attribute'],
			optional : { 
				event : 'click', 
				escaped : false, 
				hash : false, 
				nav : false
			}
		};
	},
	
	run : function($memory){
		$($memory['selector']).live($memory['event'], function(){
			FireSpark.smart.service.InterfaceUrl.idle = false;
			
			var $navigator = $(this).attr($memory['attribute']);
			var $cache = FireSpark.smart.constant.uicache ? !($(this).hasClass('force')) : $(this).hasClass('nofrc');
			
			if($memory['attribute'] == 'href'){
				$navigator = unescape($navigator);
			}
			
			/** 
			 *	@note SmartURL using HTML5 History 
			**/
			if($memory['nav']){
				if($memory['nav'] === true){
					//window.history.pushState({},"", ' ');
				}
				else {
					window.history.pushState({ 
						nav : $memory['nav'] + $navigator, 
						escaped : $memory['escaped'],
						hash : $memory['hash']
					},"", FireSpark.smart.constant.urlstart + $navigator);
					
					$navigator = $memory['nav'] + $navigator;
					//FireSpark.smart.service.InterfaceUrl.base = $navigator;
				}
			}
			
			var $result = {
				service : FireSpark.smart.service.InterfaceUrl,
				navigator : $navigator,
				escaped :$memory['escaped'],
				root : $(this),
				event : true,
				save : $memory['hash'],
				nofrc : $cache
			};
			$result = $result.run({});
			
			FireSpark.smart.service.InterfaceUrl.idle = true;
			return $result['valid'] || false;
		});
		
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
/**
 *	@service InterfaceUrl
 *	@desc Used to launch URL/Hash SmartInterface navigator
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.smart.service.InterfaceUrl = {
	idle : true,
	
	current : '',
	path : '#',
	view : '',
	
	input : function(){
		return {
			required : ['navigator'],
			optional : { 
				escaped : false,
				root : false,
				event : false,
				save : false,
				nofrc : false
			}
		}
	},
	
	run : function($memory){
		$navigator = $memory['navigator']; // === false ?  FireSpark.smart.service.InterfaceUrl.base : $memory['navigator'];
		$escaped = $memory['escaped'];
		$root = $memory['root'];
		$event = $memory['event'];
		$save = $memory['save'];
		$force = $memory['nofrc'] ? false : true;
		
		if(($event || FireSpark.smart.service.InterfaceUrl.idle) && FireSpark.smart.service.InterfaceUrl.current != $navigator){
			if($event){
				if($navigator[0] == '!'){
					$navigator = FireSpark.smart.service.InterfaceUrl.path + $navigator;
				}
				else if($navigator[1] == '!'){
					$navigator = FireSpark.smart.service.InterfaceUrl.path + $navigator.substring(1);
				}
			}
			
			if($save || false){
				FireSpark.smart.service.InterfaceUrl.current = window.location.hash = $navigator;
			}
			
			var $hash = $navigator.split('!');
			if($hash[0].length > 1 && $hash[0][$hash[0].length - 1] == '#')
				$hash[0] = $hash[0].substring(0, $hash[0].length - 2);
			
			if(FireSpark.smart.service.InterfaceUrl.path != $hash[0]){
				if($save || false){
					FireSpark.smart.service.InterfaceUrl.path = $hash[0];
				}
				
				var $nav = ($hash[1] || false) ? '#' + $hash[1] : false;
				return { valid : $hash[0].launch({ root : $root, nav : $nav, frc : $force }) };
			}
			else if($hash[1] || false) {
				$hash[1] = '#' + $hash[1];
				if($save || false){
					FireSpark.smart.service.InterfaceUrl.view = $hash[1];
				}
				
				return { valid : $hash[1].launch({ root : $root }) };
			}
		}
		
		return { valid : false };
	},
	
	output : function(){
		return [];
	}
};
/**
 *	@workflow ReadHtml
 *	@desc Reads HTML content into element
 *
 *	@param url URL [memory]
 *	@param cntr string [memory]
 *
 *	@param select boolean [memory] optional default false
 *	@param ld string [memory] optional default FireSpark.core.constant.loadmsg
 *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout')
 *	@param dur integer [memory] optional default 1000
 *	@param dly integer [memory] optional default 0
 *	@param act string [memory] optional default 'all' ('all', 'first', 'last', 'remove')
 *
 *	@param frc boolean [memory] optional default FireSpark.smart.constant.poolforce
 *	@param nch boolean [memory] optional default false
 *	@param exp integer [memory] optional default FireSpark.smart.constant.poolexpiry
 *
 *	@param iframe string [memory] optional default false
 *	@param agt string [memory] optional default root
 *	@param root element [memory] optional default false
 *
 *	@return element element [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.smart.workflow.ReadHtml = {
	input : function(){
		return {
			required : ['url', 'cntr'],
			optional : { 
				nch : false,
				exp : FireSpark.smart.constant.poolexpiry,
				frc : FireSpark.smart.constant.poolforce,
				iframe : false,
				agt : false,
				root : false,
				select : true, 
				ld : FireSpark.smart.constant.loadmsg,
				lcntr : FireSpark.smart.constant.statusdiv,
				anm : 'fadein',
				dur : 150,
				dly : 0,
				act : 'all'
			}
		};
	},
	
	run : function($memory){	
		var $workflow = [{
			service : FireSpark.ui.service.ElementLoading,
			input : { 
				data : 'loading',
			},
			element : $memory['root'] || $memory['lcntr'],
		},{
			service : FireSpark.ui.service.ElementContent,
			input : { 
				element : 'cntr',
				animation : 'anm', 
				duration : 'dur', 
				delay : 'dly', 
				action : 'act' 
			},
			select : true
		}];
		
		return [{
			service : FireSpark.ui.service.ElementLoading,
			input : { 
				data : 'ld',
			},
			element : $memory['root'] || $memory['lcntr'],
		},{
			service : FireSpark.smart.service.DataLoad,
			type : 'html',
			request : 'GET',
			args : ['cntr', 'anm', 'dur', 'dly', 'act', 'loading'],
			input : {
				nocache : 'nch',
				expiry : 'exp',
				force : 'frc',
				agent : 'agt'
			},
			workflow : $workflow,
			errorflow : [{
				service : FireSpark.ui.service.ElementLoading,
				input : { 
					data : 'loading',
				},
				element : $memory['root'] || $memory['lcntr'],
			}]
		}].execute($memory);
	},
	
	output : function(){
		return ['element'];
	}
};
/**
 *	@workflow ReadTmpl
 *	@desc Reads template with data into element
 *
 *	@param url URL [memory] optional default FireSpark.smart.constant.defaulturl
 *	@param cntr string [memory] optional default FireSpark.smart.constant.statusdiv
 *	@param tpl string [memory] optional default 'tpl-default'
 *
 *	@param select boolean [memory] optional default true
 *	@param ld string [memory] optional default FireSpark.core.constant.loadmsg
 *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout')
 *	@param dur integer [memory] optional default 1000
 *	@param dly integer [memory] optional default 0
 *	@param act string [memory] optional default 'all' ('all', 'first', 'last', 'remove')
 *
 *	@param frc boolean [memory] optional default FireSpark.smart.constant.poolforce
 *	@param nch boolean [memory] optional default false
 *	@param exp integer [memory] optional default FireSpark.smart.constant.poolexpiry
 *
 *	@param iframe string [memory] optional default false
 *	@param agt string [memory] optional default root
 *	@param root element [memory] optional default false
 *
 *	@param cnf boolean [memory] optional default false
 *	@param cnfmsg string [memory] optional default FireSpark.smart.constant.cnfmsg
 *
 *	@param sel string [memory] optional default false
 *	@param enc string [memory] optional default 'url' ('url', 'json')
 *
 *	@param data string [memory] optional default ''
 *	@param type string [memory] optional default 'json'
 *	@param req string [memory] optional default 'POST'
 *	@param workflow Workflow [memory] optional default [{ service : FireSpark.jquery.workflow.TemplateApply, ... }]
 *	@param errorflow Workflow [memory] optional default [{ service : FireSpark.jquery.service.ElementContent, ... }]
 *	@param params array [memory] optional default []
 *	@param stop boolean [memory] optional default false
 *
 *	@param ln boolean [memory] optional default false
 *	@param status string [memory] optional default 'valid'
 *	@param message string [memory] optional default 'message'
 *
 *	@return element element [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.smart.workflow.ReadTmpl = {
	input : function(){
		return {
			optional : { 
				url : FireSpark.smart.constant.defaulturl,
				cntr : FireSpark.smart.constant.statusdiv,
				nch : false,
				exp : FireSpark.smart.constant.poolexpiry,
				frc : FireSpark.smart.constant.poolforce,
				iframe : false,
				agt : false,
				root : false,
				select : true,
				ld : FireSpark.smart.constant.loadmsg,
				anm : 'fadein',
				dur : 1000,
				dly : 0,
				act : 'all',
				tpl : 'tpl-default' ,
				cnf : false,
				cnfmsg : FireSpark.smart.constant.cnfmsg,
				sel : false,
				enc : 'url',
				data : '',
				type : 'json',
				req : 'POST',
				workflow : FireSpark.smart.constant.readflow() || [{ 
					service : FireSpark.ui.workflow.TemplateApply, 
					input : {
						element : 'cntr' ,
						template : 'tpl',
						animation : 'anm', 
						duration : 'dur',
						delay : 'dly',
						action : 'act' 
					},
					select : true
				}],
				errorflow :  [{ 
					service : FireSpark.ui.service.ElementContent,
					input : {
						element : 'cntr' ,
						animation : 'anm', 
						duration : 'dur',
						delay : 'dly',
						action : 'act' 
					},
					select : true
				}],
				params : [],
				stop : false,
				ln : false,
				status : 'valid',
				message : 'message',
				vld : false
			}
		};
	},
	
	run : function($memory){
		var $workflow = [{
			service : FireSpark.ui.service.ElementState,
			input : { element : 'sel' }
		},{
			service : FireSpark.core.service.LaunchMessage,
			input : { launch : 'ln' }
		}];
		$workflow = $workflow.concat($memory['workflow']);
		
		var $errorflow = [{
			service : FireSpark.ui.service.ElementState,
			input : { element : 'sel' }
		}];
		$errorflow = $errorflow.concat($memory['errorflow']);
		
		$args = ['cntr', 'sel', 'tpl', 'anm', 'dur', 'dly', 'act', 'ln'];
		$args = $args.concat($memory['args']);
		
		return [{
			service : FireSpark.core.service.WindowConfirm,
			input : { confirm : 'cnf', value : 'cnfmsg' }
		},{
			service : FireSpark.core.service.DataEncode,
			input : { type : 'enc' },
			output : { result : 'data' }
		},{
			service : FireSpark.ui.service.ElementState,
			input : { element : 'sel' },
			disabled : true
		},{
			service : FireSpark.ui.service.ElementContent,
			input : { 
				element : 'cntr' ,
				data : 'ld',
				animation : 'anm'
			},
			action : 'all',
			duration : 5
		},{
			service : FireSpark.smart.service.DataLoad,
			args : $args,
			input : {
				request : 'req',
				nocache : 'nch',
				expiry : 'exp',
				force : 'frc',
				agent : 'agt',
				validity : 'vld'
			},
			workflow : $workflow,
			errorflow : $errorflow
		}].execute($memory);
	},
	
	output : function(){
		return [];
	}
};
/**
 *	@workflow WriteData
 *	@desc Submits data using ajax or iframe and loads template with response data into .status in form
 *
 *	@param sel form-parent selector string optional default 0
 *	@param cls string [memory] optional default 'data'
 *	@param err string [memory] optional default span
 *
 *	@param url URL [memory] optional default FireSpark.smart.constant.defaulturl
 *	@param cntr string [memory]
 *	@param pnl string [memory] false
 *	@param tpl string [memory] optional default FireSpark.ui.constant.defaulttpl
 *	@param errtpl string [memory] optional default FireSpark.ui.constant.defaulttpl
 *	@param chng string [optional] default 'none' ('reset', 'hide', 'none')
 *
 *	@param select boolean [memory] optional default false
 *	@param ld string [memory] optional default FireSpark.core.constant.loadmsg
 *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout')
 *	@param dur integer [memory] optional default 1000
 *	@param dly integer [memory] optional default 0
 *	@param act string [memory] optional default 'all' ('all', 'first', 'last', 'remove')
 *
 *	@param frc boolean [memory] optional default FireSpark.smart.constant.poolforce
 *	@param nch boolean [memory] optional default false
 *	@param exp integer [memory] optional default FireSpark.smart.constant.poolexpiry
 *
 *	@param iframe string [memory] optional default false
 *	@param agt string [memory] optional default root
 *	@param root element [memory] optional default false
 *
 *	@param cnf boolean [memory] optional default false
 *	@param cnfmsg string [memory] optional default FireSpark.smart.constant.cnfmsg
 *
 *	@param slr string [memory] optional default false
 *	@param enc string [memory] optional default 'url' ('url', 'json')
 *
 *	@param type string [memory] optional default 'json'
 *	@param req string [memory] optional default 'POST'
 *	@param workflow Workflow [memory] optional default [{ service : FireSpark.ui.workflow.TemplateApply, ... }]
 *	@param errorflow Workflow [memory] optional default [{ service : FireSpark.ui.workflow.TemplateApply, ... }]
 *	@param params array [memory] optional default []
 *	@param stop boolean [memory] optional default false
 *
 *	@param ln boolean [memory] optional default false
 *	@param status string [memory] optional default 'valid'
 *	@param message string [memory] optional default 'message'
 *
 *	@return element element [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.smart.workflow.WriteData = {
	input : function(){
		return {
			optional : { 
				sel : false,
				src : 'form',
				cntr : false,
				pnl : false,
				canvas : false,
				child : FireSpark.smart.constant.tileuisection,
				chng : 'none',
				url : FireSpark.smart.constant.defaulturl,
				cls : 'data',
				err : 'span',
				nch : true,
				exp : FireSpark.smart.constant.poolexpiry,
				frc : FireSpark.smart.constant.poolforce,
				iframe : false,
				agt : false,
				root : false,
				select : false,
				ld : FireSpark.smart.constant.loadmsg,
				anm : 'fadein',
				dur : 1000,
				dly : 0,
				act : 'all',
				tpl : FireSpark.ui.constant.defaulttpl,
				errtpl : FireSpark.ui.constant.defaulttpl,
				cnf : false,
				cnfmsg : FireSpark.smart.constant.cnfmsg,
				slr : false,
				enc : 'url',
				type :  FireSpark.smart.constant.datatype,
				req :  FireSpark.smart.constant.reqtype,
				workflow : FireSpark.smart.constant.readflow() || [{ 
					service : FireSpark.ui.service.ElementContent,
					input : {
						element : 'cntr' ,
						animation : 'anm', 
						duration : 'dur',
						delay : 'dly',
					},
					data : '<span></span>',
					action : 'all',
					select : true
				},{ 
					service : FireSpark.ui.workflow.TemplateApply, 
					input : {
						element : 'pnl' ,
						template : 'tpl',
						animation : 'anm', 
						duration : 'dur',
						delay : 'dly',
						action : 'act' 
					},
					select : true
				}],
				errorflow : [{ 
					service : FireSpark.ui.workflow.TemplateApply, 
					input : {
						element : 'cntr' ,
						template : 'errtpl',
						animation : 'anm', 
						duration : 'dur',
						delay : 'dly'
					},
					action : 'all',
					select : true
				}],
				params : [],
				stop : false,
				ln : false,
				status : 'valid',
				message : 'message'
			}
		};
	},
	
	run : function($memory){
		$memory['src'] = $memory[0] || $memory['src'];
		$memory['sel'] = $memory[1] || $memory['sel'];
		
		$memory['pnl'] = $memory['pnl'] || $memory['cntr'] || $memory['sel'] +' .status:last';
		
		if( $memory[ 'canvas' ] ){
			$( $memory[ 'canvas' ] ).parent().children( $memory[ 'child' ] ).hide();
			$( $memory[ 'canvas' ] ).show();
		}
		
		switch($memory['src']){
			case 'form' : 
				var $form = $memory['sel'] + ' form';
				var $readflow = {
					service : FireSpark.core.service.ReadForm,
					form : $form,
					output : { request : 'req' }
				};
				break;
			
			case 'div' : 
				var $form = $memory['sel'];
				var $readflow = {
					service : FireSpark.core.service.ReadData,
					input : { cntr : 'sel' }
				};
				break;
			
			default :
				return { valid : false };
		}
		
		switch($memory['chng']){
			case 'reset' :
				$memory['workflow'] = [{
					service : FireSpark.ui.service.ElementTrigger,
					element : $form + ' input[type=reset]',
					event : 'click',
				}].concat($memory['workflow']);
				break;
			
			case 'hide' :
				$memory['workflow'] = [{
					service : FireSpark.ui.service.ElementContent,
					element : $form,
					action : 'none',
					animation : 'fadeout',
					duration : 150,
					select : true
				}].concat($memory['workflow']);
				break;
				
			case 'hdsl' :
				$memory['workflow'] = [{
					service : FireSpark.ui.service.ElementTrigger,
					element : $form + ' input[type=reset]',
					event : 'click',
				},{
					service : FireSpark.ui.service.ElementContent,
					element : $memory['sel'],
					action : 'none',
					animation : 'fadeout',
					duration : 150,
					select : true
				}].concat($memory['workflow']);
				break;
			
			case 'none' :
			default : 
				break;
		}
		
		$memory['workflow'] = [{
			service : FireSpark.smart.service.WriteMode,
			input : { element : 'pnl' }
		}].concat($memory['workflow']);
		
		$memory['errorflow'] = [{
			service : FireSpark.smart.service.WriteMode,
			input : { element : 'pnl' }
		}].concat($memory['errorflow']);
		
		$memory['workflow'] = $memory['workflow'].concat([{
			service : FireSpark.smart.service.WriteMode,
			input : { element : 'pnl' },
			admin : true,
			nonstrict : true
		}]);
		
		$memory['errorflow'] = $memory['errorflow'].concat([{
			service : FireSpark.smart.service.WriteMode,
			input : { element : 'pnl' },
			admin : true,
			nonstrict : true
		}]);
	
		return [{
			service : FireSpark.core.service.CheckForm,
			form : $form,
			input : { error : 'err' }
		},
			$readflow
		,{
			service : FireSpark.smart.workflow.ReadTmpl,
			args : ['pnl', 'errtpl'],
			cntr : $memory['cntr'] || $memory['sel'] +' .status:last',
			sel : $memory['slt'] || $memory['sel'] + ' input[name=submit]',
			agt : $memory['agt'] || $memory['sel'] + ' form',
			vld : FireSpark.smart.constant.readvld
		}].execute($memory);
	},
	
	output : function(){
		return ['element'];
	}
};
/**
 *	@service WriteMode
 *	@desc Enables and disables admin mode during smart write
 *
 *	@param element string [memory] optional default false
 *	@param admin boolean [memory] optional default false
 *	@param dtcntr element [memory] optional default false
 *
 *	@param dtcntr element [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.smart.service.WriteMode = {
	last : false,
	
	input : function(){
		return {
			optional : { element : false, admin : false, dtcntr : false }
		};
	},
	
	run : function($memory){
		if($memory['dtcntr'] || $memory['element']){
			var $el = $memory['dtcntr'] || $($memory['element']).parents(FireSpark.smart.constant.dtclass);
			if($el.length){
				if($memory['admin']){
					try {
						$el.dataTable();
					}catch($id) { 
						if(console || false){ console.log('Exception : ' + $id); }
					}
				}
				else {
					try {
						$el.dataTable().fnDestroy();
						$el.removeAttr('style');
					}catch($id) { 
						if(console || false){ console.log('Exception : ' + $id); }
					}
				}
			}
		}
		
		$memory['valid'] = true;
		$memory['dtcntr'] = $el;
		return $memory;
	},
	
	output : function(){
		return ['dtcntr'];
	}
};
/**
 *	@config FireSpark.core.constant
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
	validation_status : 'span',
	loaderror : '<span class="error">Error Loading Data</span>',
	iframeroot : '#ui-imports'
}

/**
 *	@config FireSpark.ui.constant
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
		wysiwyg : {
			cls : '.wysiwyg',
			helper : FireSpark.ui.helper.transformWysiwyg,
			config : {}
		},
		top : {
			cls : '.top',
			helper : FireSpark.ui.helper.transformTop,
			config : { sel: 'body,html' }
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
	maindiv : '#ui-global-0',
	replacesel : ', .ui-replace',
	defaulttpl : 'tpl-default'
};

/**
 *	@config FireSpark.smart.constant
**/
FireSpark.smart.constant = {
	urlstart : '', // '?/'
	globalkey : 'ui-global-data',
	statusdiv : '#load-status',
	hststatusdiv : '#ui-page',
	statusdelay : 1500,
	statusduration : 1500,
	loaderror : '<span class="error">Error Loading Data</span>',
	loadstatus : '<span class="state loading">Loading ...</span>',
	loadmsg : '<span class="loading">Loading ...</span>',
	hststatus : '<div class="loader"></div>',
	initmsg : '<span class="state">Initializing ...</span>',
	cnfmsg : 'Are you sure you want to continue ?',
	importdiv : '#ui-imports',
	importroot : 'ui/import/',
	importext : '.json',
	importsync : false,
	defaultkey : 'people.person.info',
	defaulturl : 'run.php',
	tileuiprefix : '#ui-global-',
	tileuicntr : '.bands',
	tileuisection : '.tile-content',
	moveup : false,
	moveduration: 850,
	poolexpiry : 150,
	poolforce : false,
	config : [],
	defaultln : '#sync',
	uicache : true,
	dtclass : '.datatable',
	readflow : function(){ return false; },
	datatype : 'json',
	datareq : 'POST',
	readvld : true,
	nobarrier : true
};

