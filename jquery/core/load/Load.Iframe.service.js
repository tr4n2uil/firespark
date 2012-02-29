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
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.service.LoadIframe = {
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
		
		//FireSpark.core.helper.LoadBarrier.start();
		
		$mem = {};
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
			.insertAfter($memory['agent'])
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
							$mem['data'] = $.parseJSON($data);
							break;
					}
					
					/**
					 *	Run the workflow
					**/
					try {
						Snowblozm.Kernel.execute($memory['workflow'], $mem);
						//FireSpark.core.helper.LoadBarrier.end();
					} catch($id) {
						//FireSpark.core.helper.LoadBarrier.end();
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
							Snowblozm.Kernel.execute($memory['errorflow'], $mem);
						}
						//FireSpark.core.helper.LoadBarrier.end();
					} catch($id) {
						//FireSpark.core.helper.LoadBarrier.end();
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
						Snowblozm.Kernel.execute($memory['errorflow'], $mem);
					}
					//FireSpark.core.helper.LoadBarrier.end();
				} catch($id) {
					//FireSpark.core.helper.LoadBarrier.end();
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
