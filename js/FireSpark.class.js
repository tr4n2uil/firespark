/**
 *	@project FireSpark
 *	@desc JavaScript Service Computing Platform Kernel
 *
 *	@class FireSpark
 *	@desc Provides Registry and Kernel functionalities
 *	
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
 *	@desc Services are generic modules providing resuable stateless functionalities than tranforms blocks
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
