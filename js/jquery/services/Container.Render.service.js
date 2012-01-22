/**
 *	@service ContainerRender
 *	@desc Used to render container
 *
 *	@param key string [memory] optional default 'ui-global'
 *	@param id long int [memory] optional default '0'
 *	@param ins string [memory] optional default '#ui-global-0'
 *	@param root object [memory] optional default false
 *	@param tpl template [memory] optional default '#tpl-def-tls'
 *	@param inl boolean [memory] optional default false
 *	@param act string [memory] optional default 'first' ('all', 'first', 'last', 'remove')
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
				tpl : '#tpl-def-tls',
				inl : false,
				act : 'first',
				tile : false
			}
		}
	},
	
	run : function($memory){		
		var $config = Snowblozm.Registry.get($memory['key']) || {};
		var $instance = $memory['key']+'-'+$memory['id'];
		var $value = Snowblozm.Registry.get($instance) || {};
		
		$value['id'] = $memory['id'];
		$value['key'] = $memory['key'];
		$value['instance'] = $memory['ins'];
		
		var $data = $value['data'];
		for(var $i in $data){
			$value[$i] = $data[$i];
		}
		$value['data'] = true;
		
		if($memory['inl'] || false){
			// To do
		}
		else {
			$memory = Snowblozm.Kernel.execute([{
				service : FireSpark.jquery.service.ElementContent,
				element : '.tls-'+$instance,
				select : true,
				action : 'remove'
			},{
				service : FireSpark.jquery.workflow.TemplateApply,
				input : { action : 'act' },
				element : $memory['ins'] + '>.tiles',
				select : true,
				animation : 'fadein',
				template : $memory['tpl'] + '-tls',
				data : $value,
			}], $memory);
			
			if($memory['valid'] || false){
			} else {
				return $memory;
			}
		}
		
		/*$tiles = $value['tiles'];
		for(var $i in $tiles){
			$tile = $tiles[$i];
			$memory = Snowblozm.Kernel.run({
				service : FireSpark.jquery.workflow.TemplateApply,
				element : $memory['ins'] + '>.bands',
				select : true,
				template : $tile['tiletpl'],
				animation : 'none',
				data : $value,
				action : $value['action'] || 'first'
			}, $memory);
			
			if($memory['valid'] || false){
			} else return $memory;
		}*/
			
		$memory = Snowblozm.Kernel.execute([{
			service : FireSpark.jquery.service.ElementContent,
			element : '.tlc-'+$instance,
			select : true,
			action : 'remove'
		},{
			service : FireSpark.jquery.workflow.TemplateApply,
			input : { action : 'act' },
			element : $memory['ins'] + '>.bands',
			select : true,
			template : $memory['tpl'] + '-tcs',
			animation : 'none',
			data : $value
		},{
			service : FireSpark.jquery.workflow.TileShow
		}], $memory);
		
		Snowblozm.Registry.save($instance, $value);
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['element'];
	}
};
