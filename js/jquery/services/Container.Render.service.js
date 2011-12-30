/**
 *	@service ContainerRender
 *	@desc Used to render container
 *
 *	@param key string [memory] optional default 'ui-global'
 *	@param id long int [memory] optional default '0'
 *	@param ins string [memory] optional default '#ui-global-0'
 *	@param root object [memory] optional default false
 *	@param tile string [memory] optional default false
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
				ins : 'ui-global-0',
				root : false,
				tile : false
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
			$value['instance'] = $memory['ins'];
			$memory = Snowblozm.Kernel.execute([{
				service : FireSpark.jquery.workflow.TemplateApply,
				element : $memory['ins'] + '>.tiles',
				select : true,
				template : 'tpl-tiles',
				animation : 'fadein',
				data : $value,
				action : 'first'
			}], $memory);
			
			if($memory['valid'] || false){
			} else {
				return $memory;
			}
		}
		
		$memory = Snowblozm.Kernel.execute([{
			service : FireSpark.jquery.workflow.TemplateApply,
			element : $memory['ins'] + '>.bands',
			select : true,
			template : 'tpl-bands',
			animation : 'none',
			data : $value,
			action : 'first'
		},{
			service : FireSpark.jquery.workflow.TileShow
		}], $memory);
		
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['element'];
	}
};
