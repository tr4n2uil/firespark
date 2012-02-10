/**
 *	@service ContainerRender
 *	@desc Used to render container
 *
 *	@param key string [memory] optional default 'ui-global'
 *	@param id long int [memory] optional default '0'
 *	@param ins string [memory] optional default '#ui-global-0'
 *	@param root object [memory] optional default false
 *	@param bg boolean [memory] optional default false
 *	@param tpl template [memory] optional default '#tpl-def-tls'
 *	@param inl boolean [memory] optional default false
 *	@param act string [memory] optional default 'first' ('all', 'first', 'last', 'remove')
 *	@param data object [memory] optional default {}
 *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout')
 *	@param dur integer [memory] optional default 1000
 *	@param dly integer [memory] optional default 0
 *
 *	@return element element [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.service.ContainerRender = {
	input : function(){
		return {
			optional : { 
				key : 'ui-global', 
				id : '0',
				ins : '#ui-global-0',
				root : false,
				bg : false,
				tpl : '#tpl-def-tls',
				inl : false,
				act : 'first',
				data : {},
				anm : 'fadein',
				dur : 1000,
				dly : 0
			}
		}
	},
	
	run : function($memory){		
		var $instance = $memory['key']+'-'+$memory['id'];
		
		FireSpark.smart.helper.dataState(FireSpark.smart.constant.initmsg, true);
		
		$workflow = [];
			
		if($memory['inl']){
			// Todo
		}
		else {
			$workflow = $workflow.concat([{
				service : FireSpark.ui.service.ElementContent,
				element : '.tls-' + $instance,
				select : true,
				action : 'remove'
			},{
				service : FireSpark.ui.workflow.TemplateApply,
				input : {
					action : 'act',
					duration : 'dur'
				},
				element : $memory['ins'] + '>.tiles',
				select : true,
				template : $memory['tpl'] + '-tls',
				animation : 'none',
				delay : 0
			}]);
		}
		
		$workflow = $workflow.concat([{
			service : FireSpark.ui.service.ElementContent,
			element : '.tlc-' + $instance,
			select : true,
			action : 'remove'
		},{
			service : FireSpark.ui.workflow.TemplateApply,
			input : {
				action : 'act',
				duration : 'dur'
			},
			element : $memory['ins'] + '>.bands',
			select : true,
			template : $memory['tpl'] + '-tcs',
			animation : 'none',
			delay : 0
		}]);
		
		if($memory['bg'] === false){
			$workflow.push({
				service : FireSpark.smart.workflow.InterfaceTile
			});
		}
		
		return Snowblozm.Kernel.execute($workflow, $memory);
	},
	
	output : function(){
		return ['element'];
	}
};
