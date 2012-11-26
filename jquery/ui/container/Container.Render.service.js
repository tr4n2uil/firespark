/**
 *	@service ContainerRender
 *	@desc Used to render container
 *
 *	@param key string [memory] optional default 'ui-global'
 *	@param id long int [memory] optional default '0'
 *	@param ins string [memory] optional default '#ui-global-0'
 *	@param root object [memory] optional default false
 *	@param bg boolean [memory] optional default false
 *	@param tpl template [memory] optional default [{ '#tpl-default' : '>.bands' }]
 *	@param tile string [memory] optional false
 *	@param act string [memory] optional default 'first' ('all', 'first', 'last', 'remove')
 *	@param data object [memory] optional default {}
 *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout')
 *	@param dur integer [memory] optional default 1000
 *	@param dly integer [memory] optional default 0
 *	@param errorflow workflow [memory] optional default { service : FireSpark.ui.workflow.TemplateApply, tpl : 'tpl-default' }
 *	@param mv boolean [memory] optional default FireSpark.smart.constant.moveup
 *	@param mvdur integer [memory] optional default FireSpark.smart.constant.moveduration
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
				tpl : [{ '#tpl-default' : '>.bands' }],
				tile : false,
				act : 'first',
				data : {},
				anm : 'fadein',
				dur : 1000,
				dly : 0,
				errorflow : { service : FireSpark.ui.workflow.TemplateApply, tpl : 'tpl-default' },
				mv : FireSpark.smart.constant.moveup,
				mvdur : FireSpark.smart.constant.moveduration
			}
		}
	},
	
	run : function($memory){				
		if($memory['data']['valid'] || false){
			if($memory['data']['message'] || false){
				if($memory['data']['message']['id'] || false){
					$memory['id'] = $memory['data']['message']['id'];
				}
			}
			
			var $instance = $memory['key']+'-'+$memory['id'];
			
			FireSpark.smart.helper.dataState(FireSpark.smart.constant.initmsg, true);
			var $workflow = [{
				service : FireSpark.ui.service.ElementContent,
				element : '.' + $instance + FireSpark.ui.constant.replacesel,
				select : true,
				action : 'remove'
			}];
			
			var $tpl = $memory['tpl'];
			for(var $i in $tpl){
				$workflow = $workflow.concat([{
					service : FireSpark.ui.workflow.TemplateApply,
					input : {
						action : 'act',
						duration : 'dur'
					},
					element : $memory['ins'] + $tpl[$i]['sel'],
					select : true,
					template : $tpl[$i]['tpl'],
					animation : 'none',
					delay : 0
				}]);
			}
			
			if($memory['bg'] === false){
				$workflow.push({
					service : FireSpark.smart.workflow.InterfaceTile,
					input : { cntr : 'ins' }
				});
			}
			
			return $workflow.execute($memory);
		}
		else if($memory['errorflow']) {
			/**
			 *	Run the errorflow
			**/
			return $memory['errorflow'].execute($memory);
		}
		else return { valid : false };
	},
	
	output : function(){
		return ['element'];
	}
};
