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
 *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout')
 *	@param dur integer [memory] optional default 1000
 *	@param dly integer [memory] optional default 0
 *	@param bg boolean [memory] optional default false
 *
 *	@return element element [memory]
 *
**/
FireSpark.ui.service.ContainerRender = {
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
				data : {},
				anm : 'fadein',
				dur : 1000,
				dly : 0,
				bg : false
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
			Snowblozm.Registry.save($instance, false);
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
			$value['ui'] = $value['ui'] || $value['message']['ui'] || false;
		
			if($value['ui'] || false){
				$templates  = $value['ui']['templates'] || {};
				$flag = false;
				
				for(var $i in $templates){
					if(Snowblozm.Registry.get($templates[$i]) || false){
					} else {
						$flag = true;
						break;
					}
				}
				
				if($flag || false){
					$('#load-status').html('<span class="error">Error Loading Data</span>').stop(true, true).hide().slideDown(500).delay(1500).slideUp(1500);
					return;
				}		
			}		
	
			$('#load-status').html('<span class="state">Initializing ...</span>').stop(true, true).hide().slideDown(500).delay(500).slideUp(1500);
				
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
					input : { action : 'act', animation : 'anm', duration : 'dur', delay : 'dly' },
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
			
			$workflow = [{
				service : FireSpark.jquery.service.ElementContent,
				element : '.tlc-' + $instance,
				select : true,
				action : 'remove'
			},{
				service : FireSpark.jquery.workflow.TemplateApply,
				input : { action : 'act', animation : 'anm', duration : 'dur', delay : 'dly' },
				element : $memory['ins'] + '>.bands',
				select : true,
				template : $memory['tpl'] + '-tcs',
				animation : 'none',
				data : $value
			}];
			
			if($memory['bg'] || false){
			}
			else {
				$workflow.push({
					service : FireSpark.jquery.workflow.TileShow
				});
			}
				
			$memory = Snowblozm.Kernel.execute($workflow, $memory);
			Snowblozm.Registry.save($instance, $value);
		}
		
		$value['ui'] = $value['message']['ui'];
		
		if($value['ui'] || false){
			$templates  = $value['ui']['templates'] || {};
			$memory['tpl'] = $value['ui']['tpl'];
			
			FireSpark.core.ajax.barrier($render);
			$barrier = false;
			$('#load-status').html('<span class="state loading">Loading ...</span>').stop(true, true).slideDown(500);
			
			for(var $i in $templates){
				if(Snowblozm.Registry.get($templates[$i]) || false){
				} else {
					$barrier = true;
					
					Snowblozm.Kernel.execute([{
						service : FireSpark.jquery.service.RegistrySave,
						key : $templates[$i],
						value : true
					},{
						service : FireSpark.jquery.service.LoadAjax,
						url : $templates[$i],
						type : 'html',
						request : 'GET',
						workflow : [{
							service : FireSpark.jquery.service.ElementContent,
							element : '#ui-templates',
							select : true,
							action : 'last',
							duration : 5
						}],
						errorflow : [{
							service : FireSpark.jquery.service.RegistrySave,
							key : $templates[$i]
						}]
					}], {});
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
