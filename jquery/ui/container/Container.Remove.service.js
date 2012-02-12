/**
 *	@service ContainerRemove
 *	@desc Used to remove container
 *
 *	@param key string [memory] optional default 'ui-global'
 *	@param id long int [memory] optional default '0'
 *	@param inl boolean [memory] optional default false
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
				inl : false,
				ins : '#ui-global-0'
			}
		}
	},
	
	run : function($memory){		
		$memory['key'] = $memory[0] || $memory['key'];
		$memory['id'] = $memory[1] || $memory['id'];
		$memory['ins'] = $memory[2] || $memory['ins'];
		//$memory['inl'] = $memory[3] || $memory['inl'] || false;
		
		var $instance = $memory['key']+'-'+$memory['id'];
		
		if($memory['inl'] || false){
			// To do
		}
		else {
			$memory = Snowblozm.Kernel.execute([{
				service : FireSpark.ui.service.ElementContent,
				element : '.tls-' + $instance,
				select : true,
				action : 'remove',
				animation : 'none'
			},{
				service : FireSpark.ui.service.ElementContent,
				element : '.tlc-' + $instance,
				select : true,
				action : 'remove',
				animation : 'none'
			},{
				service : FireSpark.smart.workflow.InterfaceTile
			}], $memory);
		}
		
		$memory['valid'] = false;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
