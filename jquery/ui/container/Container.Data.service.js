/**
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
				workflowend : { service : FireSpark.jquery.service.ContainerRender },
				errorflowend : { service : FireSpark.jquery.service.ElementContent },
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
			var $loader = FireSpark.jquery.service.LoadIframe;
		}
		else {
			var $loader = FireSpark.jquery.service.LoadAjax;
		}
		
		var $instance = $memory['key']+'-'+$memory['id'];
		var $value = Snowblozm.Registry.get($instance) || false;
		
		if($value || false){
			return Snowblozm.Kernel.run($memory['workflowend'], $memory);
		}
		else {
			return Snowblozm.Kernel.execute([{
				service : FireSpark.jquery.service.ElementContent,
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
