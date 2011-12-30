/**
 *	@service ContainerRender
 *	@desc Used to render container
 *
 *	@param key string [memory] optional default 'ui-global'
 *	@param id long int [memory] optional default '0'
 *	@param instance string [memory] optional default '#ui-global-0'
 *	@param root object [memory] optional default false
 *
 *	@return element element [memory]
 *
**/
FireSpark.jquery.service.ContainerRender = {
	input : function(){
		return {
			optional : { 
				key : 'ui-global', 
				id : '0',
				instance : 'ui-global-0',
				root : false,
			}
		}
	},
	
	run : function($memory){		
		var $config = Snowblozm.Registry.get($memory['key']) || {};
		var $instance = $memory['key']+'-'+$memory['id'];
		var $value = Snowblozm.Registry.get($instance) || {};
		
		if($value['inline'] || false){
			
		}
		else {
			$memory = Snowblozm.Kernel.execute([{
				service : FireSpark.jquery.workflow.TemplateApply,
				element : $memory['instance'] + '>.tiles',
				template : 'tpl-tiles',
				animation : 'none',
				input : {
					action : 'first'
				}
			}], $memory);
			
			if($memory['valid'] || false){
			} else {
				return $memory;
			}
		}
		
		$memory = Snowblozm.Kernel.execute([{
			service : FireSpark.jquery.workflow.TemplateApply,
			element : $memory['instance'] + '>.bands',
			template : 'tpl-bands',
			animation : 'none',
			input : {
				action : 'first'
			}
		}], $memory);
		
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['element'];
	}
};
