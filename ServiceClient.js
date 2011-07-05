/**
 *	@project ServiceClient
 *	@desc JavaScript Service Architecture and Workflow Framework
 *
 *	@class ServiceClient
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
 * 	Navigator is index followed by parameters to be overrided delimited by ':'
 *	indexes usually starts with # (href programming)
 *
 *	example #testtab:tabtitle=Krishna:loadurl=test.php
 *
 *	escapes for usage in form id
 *	# by _ 
 *	= by .
 *	
**/

var ServiceClient = (function(){
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
		 *	@desc manages references and navigator indexes
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
			 *	@desc adds a Navigator with index
			 *
			 *	@param index string
			 *	@param navigator object
			 *
			**/
			add : function(index, navigator){
				navigators[index] = navigator;
			},
			
			/**
			 *	@method removeNavigator
			 *	@desc removes a Navigator with index
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
		 *		runs services when requested
		 *		processes navigators when received
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
			 *	@method navigate
			 *	@desc processes the navigator request received to run services and workflows
			 *
			 *	@param request string
			 *	@param escaped boolean optional default false
			 *
			**/
			navigate : function(request, escaped){
				if(escaped || false){
					request = request.replace(/_/g, '#');
					request = request.replace(/\./g, '=');
				}
				
				var req = request.split(':');
				var index = req[0];
				
				var config = new Array();
				for(var i=1, len=req.length; i<len; i++){
					var param = (req[i]).split('=');
					config[param[0]] = param[1];
				}
				
				if(navigators[index] || false){
					var navigator = new (navigators[index])(config);
					return this.run(navigator);
				}
				
				return false;
			}
		}
	};
})();
