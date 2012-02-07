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
