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
 *	@param data object [memory] optional default {}
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
				tile : false,
				data : {}
			}
		}
	},
	
	run : function($memory){		
		var $instance = $memory['key']+'-'+$memory['id'];
		var $value = Snowblozm.Registry.get($instance) || false;
		
		if($value || false){
		} else {
			$value = $memory['data'];
		}
		
		$value['id'] = $memory['id'];
		$value['key'] = $memory['key'];
		$value['instance'] = $memory['ins'];
		
		if($value['valid'] || false){
		} else {
			return Snowblozm.Kernel.run({
				service : FireSpark.jquery.service.ElementContent,
				element : '#load-status',
				select : true,
				animation : 'slidein',
				data : '<span class="error">'+$value['msg']+'</span><span class="hidden">'+$value['details']+'</span>',
				duration : 500
			}, {});
		}
		
		var $render = function(){
			$('#load-status').html('<span class="state">Initializing ...</span>').delay(500).slideUp(1500);
				
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
				
			$memory = Snowblozm.Kernel.execute([{
				service : FireSpark.jquery.service.ElementContent,
				element : '.tlc-' + $instance,
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
		}
		
		if($value['ui'] || false){
			$templates  = $value['ui']['templates'] || {};
			
			FireSpark.core.ajax.barrier($render);
			$barrier = false;
			
			for(var $i in $templates){
				if(Snowblozm.Registry.get($templates[$i]) || false){
				} else {
					$barrier = true;
					Snowblozm.Registry.save($templates[$i], true);
					Snowblozm.Kernel.launch('#htmlload:url='+$templates[$i]+':cntr=#ui-templates:act=last:ld=<span></span>:dur=5');
				}
			}
			
			if(!$barrier) $render();
		}
		else {
			$render();
		}
		
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['element'];
	}
};
