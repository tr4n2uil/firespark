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
