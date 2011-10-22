<?php

/**
 *	@interface Service
 *	@desc Abstract interface for services and workflows (service compositions)
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
interface Service {

	/** 
	 *	@method input
	 *	@desc returns input array for the service
	 *
	 *	@return $input array ('required', 'optional')
	 *
	**/
	public function input();
	
	/** 
	 *	@method run
	 *	@desc executes the service functionality
	 *
	 *	@param $memory object Local memory for service execution
	 *
	 *	@return $memory	object Local memory for service execution
	 *
	**/
	public function run($memory);
	
	/** 
	 *	@method output
	 *	@desc returns output array for the service (other than default ('valid', 'msg', 'status', 'details'))
	 *
	 *	@return $output array
	 *
	**/
	public function output();
	
}
?>
