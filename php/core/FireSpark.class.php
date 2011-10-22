<?php 
/**
 *	@project FireSpark
 *	@desc PHP Service Computing Platform Kernel
 *
 *	@class FireSpark
 *	@desc Provides Registry and Kernel functionalities
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
 *	@functionalities
 *					Central class for management purposes
 *					Manages ServiceProvider configurations
 *					Manages Initialization configurations
 *					Manages loading of Services and Workflows
 *
 *	@format 	request = {
 *						user : (email of key to use for crypt),
 *						challenge : (used to generate key for decrypting message),
 *						message : (all request values as array/object within this encrypted message),
 *						hash : (hash of message)
 *					}
 *
 *	@format	response = {
 *						valid : (valid execution flag),
 *						msg : (service execution message),
 *						status : (status code),
 *						details : (service execution details),
 *						message : (all response values as array/object within this encrypted message),
 *						hash : (hash of message)
 *					}
 *
 *	@format	message = {
 *						service : (service URI (root.service.operation)),
 *						... params ...
 *					}
 *	
 *
 **/
class FireSpark {
	
	/** 
	 *	@static sparray array ServiceProvider configurations
	**/
	private static $sparray = array();
	
	/** 
	 *	@static initarray array Initialization configurations
	**/
	private static $initarray = array();
	
	/** 
	 *	@static debug boolean Debug flag
	**/
	public static $debug = false;
	
	/** 
	 *	@static setmime string Set response MIME type
	**/
	public static $setmime = false;
	
	/** 
	 *	@method add
	 *	@desc Adds a service provider configuration
	 *
	 *	@param spname string ServiceProvider name
	 *	@param spconf array (root, location, type, map, key)
	 *
	**/
	public static function add($spname, $spconf){
		self::$sparray[$spname] = $spconf;
	}
	
	/** 
	 *	@method init
	 *	@desc Adds an initialization configuration
	 *
	 *	@param initname string Initialization name
	 *	@param initconf array 
	 *
	**/
	public static function init($initname, $initconf){
		self::$initarray[$initname] = $initconf;
	}
	
	/** 
	 *	@method get
	 *	@desc Gets an initialization configuration if exists
	 *
	 *	@param initname string Initialization name
	 *
	 *	@return initconf array 
	 *
	**/
	public static function get($initname){
		if(!isset(self::$initarray[$initname])){
			echo 'Initialization configuration not found for key : '.$initname;
			exit;
		}
		
		return self::$initarray[$initname];
	}
	
	/** 
	 *	@method load
	 *	@desc Loads local and remote services and workflows transparently
	 *
	 *	@param uri string Service / Workflow URI (sproot.service.operation.stype) (stype = service|workflow)
	 *
	**/
	public static function load($uri){
		list($sproot, $service, $operation, $stype) = explode('.' ,$uri);
		
		if(!isset(self::$sparray[$sproot])){
			echo 'Unable to identify Service Provider';
			exit;
		}
		
		$sp = self::$sparray[$sproot];
		$root = $sp['root'];
		$location = $sp['location'];
		
		switch($location){
			case 'local' :
				$path = $root.$service.'/';
				$service = ucfirst($service);
				$operation = ucfirst($operation);
				$class = $service.$operation.ucfirst($stype);
				require_once($path.$service.'.'.$operation.'.'.$stype.'.php');
				return new $class;
				
			case 'remote' :
				$type = $sp['type'];
				$key = $sp['key'];
				$map =$sp['map'];
				require_once(FSREMOTE);
				return new RemoteServiceWorkflow($map.'.'.$service.'.'.$operation.'.'.$type, $root, $key);
			
			default :
				echo 'Unable to identify Service Provider location';
				exit;
		}
	}
	
	/** 
	 *	@method execute
	 *	@desc Runs a workflow by using its definition array
	 *				workflow [{
	 *					service => ...,
	 *					input => ...,
	 *					output => ...,
	 *					strict => ...,
	 *					... message params ...
	 *				}]
	 *
	 *	@param $workflow Workflow definition array
	 *	@param $memory object optional default array()
	 *
	 *	@return $memory object
	 *
	**/
	public static function execute($workflow, $memory = array()){
		$memory['valid'] = isset($memory['valid']) ? $memory['valid'] : true;
		
		foreach($workflow as $message){
			/**
			 *	Check for strictness
			**/
			$strict = isset($message['strict']) ? $message['strict'] : true;
			
			/**
			 *	Continue on invalid state if strict
			**/
			if(!$memory['valid'] && $strict)
				continue;
			
			/**
			 *	Run the service with the message and memory
			**/
			$memory = self::run($message, $memory);
		}
		
		/**
		 *	Return memory
		**/
		return $memory;
	}
	
	/** 
	 *	@method run
	 *	@desc Runs a service by using its definition message object
	 *				service {
	 *					service => ...,
	 *					input => ...,
	 *					output => ...,
	 *					strict => ...,
	 *					... params ...
	 *				}
	 *
	 *	@param $message Service definition message
	 *	@param $memory object optional default array('valid' => true)
	 *
	 *	@return $memory object
	 *
	**/
	public static function run($message, $memory = array()){
		$memory['valid'] = isset($memory['valid']) ? $memory['valid'] : true;
		$default = array('valid', 'msg', 'status', 'details');
		
		/**
		 *	Read the service uri and load an instance
		**/
		$service = self::load($message['service']);
		
		/**
		 *	Read the service arguments
		**/
		$args = isset($message['args']) ? $message['args'] : $message['args'] = array();
		
		/**
		 *	Copy arguments if necessary
		**/
		foreach($args as $key){
			if(!isset($message[$key])){
				$message[$key] = isset($memory[$key]) ? $memory[$key] : false;
			}
		}
		
		/**
		 *	Read the service input
		**/
		$input = isset($message['input']) ? $message['input'] : array();
		$sin = $service->input();
		$sinreq = isset($sin['required']) ? $sin['required'] : array();
		$sinopt = isset($sin['optional']) ? $sin['optional'] : array();
		
		/**
		 *	Copy required input if not exists
		**/
		foreach($sinreq as $key){
			if(!isset($message[$key])){
				$param = isset($input[$key]) ? $input[$key] : $key;
				if(!isset($memory[$param])){	
					if($key == 'keyid'){
						$memory['msg'] = 'Session Expired. Please Login.';
						$memory['status'] = 407;
						$memory['details'] = 'Value not found for '.$key.' @'.$message['service'];
					}
					else {
						$memory['msg'] = 'Invalid Service Input Parameters';
						$memory['status'] = 500;
						$memory['details'] = 'Value not found for '.$key.' @'.$message['service'];
					}
					$memory['valid'] = false;
					return $memory;
				}
				$message[$key] = $memory[$param];
			}
		}
		
		/**
		 *	Copy optional input if not exists
		**/
		foreach($sinopt as $key => $value){
			if(!isset($message[$key])){
				$param = isset($input[$key]) ? $input[$key] : $key;
				if(!isset($memory[$param])){				
					$message[$key] = $value;
					continue;
				}
				$message[$key] = $memory[$param];
			}
		}
		
		/**
		 *	@debug
		**/
		if(self::$debug){
			echo 'IN '.json_encode($message)."<br /><br />\n\n";
		}
			
		/**
		 *	Run the service with the message as memory
		**/
		$message = $service->run($message);
		
		/**
		 *	@debug
		**/
		if(self::$debug){
			echo 'OUT '.json_encode($message)."<br /><br />\n\n";
		}
		
		/**
		 *	Read the service output
		**/
		$output = isset($message['output']) && $message['valid'] ? $message['output'] : array();
		$sout = $service->output();
		
		/**
		 *	Copy default output and return if not valid
		**/
		$memory['valid'] = $message['valid'];
		if(!$memory['valid']){
			foreach($default as $key){
				if(isset($message[$key])){
					$memory[$key] = $message[$key];
				}
			}
			return $memory;
		}
		
		/**
		 *	Copy default output if not exists
		**/
		foreach($default as $key){
			if(!isset($memory[$key]) && isset($message[$key])){
				$memory[$key] = $message[$key];
			}
		}
		
		/**
		 *	Copy output
		**/
		foreach($sout as $key){
			$param = isset($output[$key]) ? $output[$key] : $key;
			if(!isset($message[$key])){				
				$memory['valid'] = false;
				$memory['msg'] = 'Invalid Service Output Parameters';
				$memory['status'] = 501;
				$memory['details'] = 'Value not found for '.$key.' @'.$message['service'];
				return $memory;
			}
			$memory[$param] = $message[$key];
		}
		
		/**
		 *	@debug
		**/
		if(self::$debug){
			echo 'MEMORY '.json_encode($memory)."<br /><br />\n\n";
		}
		
		/**
		 *	Return the memory
		**/
		return $memory;
	}
	
}

?>
