/**
 *	@workflow TemplateBind
 *	@desc Binds template with data into element
 *
 *	@param cntr string [memory]
 *	@param select boolean [memory] optional default true
 *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout')
 *	@param dur integer [memory] optional default 1000
 *	@param dly integer [memory] optional default 0
 *	@param act string [memory] optional default 'all' ('all', 'first', 'last', 'remove', 'hide', 'show')
 *
 *	@param tpl string [memory] optional default 'tpl-default'
 *	@param data string [memory] optional default {}
 *
 *	@return element element [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.workflow.TemplateBind = {
	input : function(){
		return {
			required : ['cntr'],
			optional : { 
				select : true, 
				anm : 'fadein',
				dur : 1000,
				dly : 0, 
				action : 'all',
				tpl : 'tpl-default' ,
				data : ''
			}
		};
	},
	
	run : function($memory){
		$memory = [{
			service : FireSpark.core.service.DataEncode,
			type : 'json'
		},{ 
			service : FireSpark.ui.workflow.TemplateApply,
			input : {
				element : 'cntr',
				template : 'tpl', 
				animation : 'anm',
				duration : 'dur',
				delay : 'dly',
				action : 'act'
			}
		}].execute($memory);
		
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['element'];
	}
};
