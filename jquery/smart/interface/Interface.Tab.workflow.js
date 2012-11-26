/**
 *	@workflow InterfaceTab
 *	@desc Loads template with data into new tab in tabui
 *
 *	@param tabui string [message] optional default 'tabuipanel'
 *	@param title string [message] optional default 'Krishna'
 *
 *	@param url URL [memory]
 *	@param cntr string [memory]
 *	@param tpl string [memory] optional default 'tpl-default'
 *
 *	@param select boolean [memory] optional default false
 *	@param ld string [memory] optional default FireSpark.core.constant.loadmsg
 *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout')
 *	@param dur integer [memory] optional default 1000
 *	@param dly integer [memory] optional default 0
 *	@param act string [memory] optional default 'all' ('all', 'first', 'last', 'remove')
 *
 *	@param frc boolean [memory] optional default FireSpark.smart.constant.poolforce
 *	@param nch boolean [memory] optional default false
 *	@param exp integer [memory] optional default FireSpark.smart.constant.poolexpiry
 *
 *	@param iframe string [memory] optional default false
 *	@param agt string [memory] optional default root
 *	@param root element [memory] optional default false
 *
 *	@param cnf boolean [memory] optional default false
 *	@param cnfmsg string [memory] optional default FireSpark.smart.constant.cnfmsg
 *
 *	@param sel string [memory] optional default false
 *	@param enc string [memory] optional default 'url' ('url', 'json')
 *
 *	@param data string [memory] optional default 
 *	@param type string [memory] optional default 'json'
 *	@param req string [memory] optional default 'POST'
 *	@param workflow Workflow [memory] optional default [{ service : FireSpark.jquery.workflow.TemplateApply, ... }]
 *	@param errorflow Workflow [memory] optional default [{ service : FireSpark.jquery.service.ElementContent, ... }]
 *	@param params array [memory] optional default []
 *	@param stop boolean [memory] optional default false
 *
 *	@param ln boolean [memory] optional default false
 *	@param status string [memory] optional default 'valid'
 *	@param message string [memory] optional default 'message'
 *
 *	@return element element [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.smart.workflow.InterfaceTab = {
	input : function(){
		return {
			required : ['cntr', 'url'],
			optional : { 
				tabui : 'tabuipanel',
				title : 'Krishna',
				nch : false,
				exp : FireSpark.smart.constant.poolexpiry,
				frc : FireSpark.smart.constant.poolforce,
				iframe : false,
				agt : false,
				root : false,
				select : false,
				ld : FireSpark.smart.constant.loadmsg,
				anm : 'fadein',
				dur : 1000,
				dly : 0,
				act : 'all',
				tpl : 'tpl-default' ,
				cnf : false,
				cnfmsg : FireSpark.smart.constant.cnfmsg,
				sel : false,
				enc : 'url',
				data : '',
				type : 'json',
				req : 'POST',
				workflow : false,
				errorflow :  false,
				params : [],
				stop : false,
				ln : false,
				status : 'valid',
				message : 'message'
			}
		};
	},
	
	run : function($memory){
		return [{
			service : FireSpark.ui.service.ElementTab
		},{
			service : FireSpark.smart.workflow.ReadTmpl
			//stop : true
		}].execute($memory);
	},
	
	output : function(){
		return ['element'];
	}
};
