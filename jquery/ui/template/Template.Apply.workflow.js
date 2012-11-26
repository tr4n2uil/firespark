/**
 *	@workflow TemplateApply
 *	@desc Applies template with data
 *
 *	@param element string [memory]
 *	@param template string [memory] optional default FireSpark.ui.constant.defaulttpl
 *	@param data object [memory] optional default {}
 *
 *	@param select boolean [memory] optional default false
 *	@param animation string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout')
 *	@param duration integer [memory] optional default 1000
 *	@param delay integer [memory] optional default 0
 *	@param action string [memory] optional default 'all' ('all', 'first', 'last', 'remove', 'hide', 'show')
 *
 *	@return element element [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.workflow.TemplateApply = {
	input : function(){
		return {
			required : ['element'],
			optional : { 
				data : {}, 
				template : 'tpl-default',
				select : false, 
				animation : 'fadein',
				duration : 1000,
				delay : 0,
				action : 'all'
			}
		};
	},
	
	run : function($memory){
		return [{
			service : FireSpark.ui.service.TemplateRead
		},{
			service : FireSpark.ui.service.TemplateApply,
			input : { template : 'result' }
		},{
			service : FireSpark.ui.service.ElementContent,
			input : { data : 'result' }
		}].execute($memory);
	},
	
	output : function(){
		return ['element'];
	}
};
