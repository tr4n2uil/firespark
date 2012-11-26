/**
 *	@service ContainerRemove
 *	@desc Used to remove container
 *
 *	@param key string [memory] optional default 'ui-global'
 *	@param id long int [memory] optional default '0'
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
				ins : '#ui-global-0'
			},
			set : [ 'key', 'id', 'ins' ]
		}
	},
	
	run : function($memory){		
		var $instance = $memory['key']+'-'+$memory['id'];

		$memory = [{
			service : FireSpark.ui.service.ElementContent,
			element : '.' + $instance,
			select : true,
			action : 'remove',
			animation : 'none'
		},{
			service : FireSpark.smart.workflow.InterfaceTile,
			input : { cntr : 'ins' }
		}].execute( $memory );
		
		$memory['valid'] = false;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
