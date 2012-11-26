/**
 *	@workflow ReadTmpl
 *	@desc Reads template with data into element
 *
 *	@param url URL [memory] optional default FireSpark.smart.constant.defaulturl
 *	@param cntr string [memory] optional default FireSpark.smart.constant.statusdiv
 *	@param tpl string [memory] optional default 'tpl-default'
 *
 *	@param select boolean [memory] optional default true
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
 *	@param data string [memory] optional default ''
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
FireSpark.smart.workflow.ReadTmpl = {
	input : function(){
		return {
			optional : { 
				url : FireSpark.smart.constant.defaulturl,
				cntr : FireSpark.smart.constant.statusdiv,
				nch : false,
				exp : FireSpark.smart.constant.poolexpiry,
				frc : FireSpark.smart.constant.poolforce,
				iframe : false,
				agt : false,
				root : false,
				select : true,
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
				workflow : FireSpark.smart.constant.readflow() || [{ 
					service : FireSpark.ui.workflow.TemplateApply, 
					input : {
						element : 'cntr' ,
						template : 'tpl',
						animation : 'anm', 
						duration : 'dur',
						delay : 'dly',
						action : 'act' 
					},
					select : true
				}],
				errorflow :  [{ 
					service : FireSpark.ui.service.ElementContent,
					input : {
						element : 'cntr' ,
						animation : 'anm', 
						duration : 'dur',
						delay : 'dly',
						action : 'act' 
					},
					select : true
				}],
				params : [],
				stop : false,
				ln : false,
				status : 'valid',
				message : 'message',
				vld : false
			}
		};
	},
	
	run : function($memory){
		var $workflow = [{
			service : FireSpark.ui.service.ElementState,
			input : { element : 'sel' }
		},{
			service : FireSpark.core.service.LaunchMessage,
			input : { launch : 'ln' }
		}];
		$workflow = $workflow.concat($memory['workflow']);
		
		var $errorflow = [{
			service : FireSpark.ui.service.ElementState,
			input : { element : 'sel' }
		}];
		$errorflow = $errorflow.concat($memory['errorflow']);
		
		$args = ['cntr', 'sel', 'tpl', 'anm', 'dur', 'dly', 'act', 'ln'];
		$args = $args.concat($memory['args']);
		
		return [{
			service : FireSpark.core.service.WindowConfirm,
			input : { confirm : 'cnf', value : 'cnfmsg' }
		},{
			service : FireSpark.core.service.DataEncode,
			input : { type : 'enc' },
			output : { result : 'data' }
		},{
			service : FireSpark.ui.service.ElementState,
			input : { element : 'sel' },
			disabled : true
		},{
			service : FireSpark.ui.service.ElementContent,
			input : { 
				element : 'cntr' ,
				data : 'ld',
				animation : 'anm'
			},
			action : 'all',
			duration : 5
		},{
			service : FireSpark.smart.service.DataLoad,
			args : $args,
			input : {
				request : 'req',
				nocache : 'nch',
				expiry : 'exp',
				force : 'frc',
				agent : 'agt',
				validity : 'vld'
			},
			workflow : $workflow,
			errorflow : $errorflow
		}].execute($memory);
	},
	
	output : function(){
		return [];
	}
};
