/**
 *	ServiceClient
 *	JavaScript UI Framework for consuming Services 
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
**/

var ServiceClient = (function(){
	/**
	 *	@var references array
	 *
	 *	an array for saving references
	 *	references may be accessed through the Registry
	 *
	**/
	var references = new Array();
	
	/**
	 *	@var navigators array
	 *
	 *	an array that saves indexes to service workflows
	 *	workflow = [{	
	 *		service : ...,
	 *		message : { ... }
	 *	}];
	 *
	 *	indexes usually starts with # (href programming)
	 *	navigator is index followed by parameters to be overrided delimited by ':'
	 *
	 *	example #testtab:tabtitle=Krishna:loadurl=test.php
	 *
	**/
	var navigators = new Array();
	
	return {
		/**
		 *	@var Registry object
		 *	
		 *	manages references and navigator indexes
		 *
		**/
		Registry : {
			/**
			 *	saves a Reference with index
			 *
			 *	@param index string
			 *	@param reference object or any type
			 *
			**/
			save : function(index, reference){
				references[index] = reference;
			},
			
			/**
			 *	gets the Reference for index
			 *
			 *	@param index string
			 *
			**/
			get : function(index){
				return references[index];
			},
			
			/**
			 *	removes a Reference with index
			 *
			 *	@param index string
			 *
			**/
			remove : function(index){
				references[index] = 0;
			},
			
			/**
			 *	adds a Navigator with index
			 *
			 *	@param index string
			 *	@param navigator object
			 *
			**/
			add : function(index, navigator){
				navigators[index] = navigator;
			},
			
			/**
			 *	removes a Navigator with index
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
		 *	manages the following tasks
		 *		runs services when requested
		 *		processes navigators when received
		 *
		**/
		Kernel : {			
			/** 
			 *	executes a workflow with the given definition
			 *
			 *	@param config object
			 *	@param mem object optional
			 *
			**/
			run : function(config, mem){
				/**
				 *	create a new memory if not passed
				**/
				var memory = mem || {};
				
				for(var i in config){
					var service = config[i].service;
					var message = config[i].message;
					/**
					 *	run the service with the message and memory
					**/
					if(service.run(message, memory) !== true)
						return false;
				}
				
				return true;
			},
			
			/**
			 *	processes the navigator request received to run services and workflows
			 *
			 *	@param request string
			 *
			**/
			navigate : function(request){
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
				
				return 0;
			}
		}
	};
})();
