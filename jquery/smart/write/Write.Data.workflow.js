/**
 *	@workflow WriteData
 *	@desc Submits data using ajax or iframe and loads template with response data into .status in form
 *
 *	@param sel form-parent selector string optional default 0
 *	@param cls string [memory] optional default 'data'
 *	@param err string [memory] optional default span
 *
 *	@param url URL [memory] optional default FireSpark.smart.constant.defaulturl
 *	@param cntr string [memory]
 *	@param pnl string [memory] false
 *	@param tpl string [memory] optional default FireSpark.ui.constant.defaulttpl
 *	@param errtpl string [memory] optional default FireSpark.ui.constant.defaulttpl
 *	@param chng string [optional] default 'none' ('reset', 'hide', 'none')
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
 *	@param slr string [memory] optional default false
 *	@param enc string [memory] optional default 'url' ('url', 'json')
 *
 *	@param type string [memory] optional default 'json'
 *	@param req string [memory] optional default 'POST'
 *	@param workflow Workflow [memory] optional default [{ service : FireSpark.ui.workflow.TemplateApply, ... }]
 *	@param errorflow Workflow [memory] optional default [{ service : FireSpark.ui.workflow.TemplateApply, ... }]
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
FireSpark.smart.workflow.WriteData = {
	input : function(){
		return {
			optional : { 
				sel : false,
				src : 'form',
				cntr : false,
				pnl : false,
				canvas : false,
				child : FireSpark.smart.constant.tileuisection,
				chng : 'none',
				url : FireSpark.smart.constant.defaulturl,
				cls : 'data',
				err : 'span',
				nch : true,
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
				tpl : FireSpark.ui.constant.defaulttpl,
				errtpl : FireSpark.ui.constant.defaulttpl,
				cnf : false,
				cnfmsg : FireSpark.smart.constant.cnfmsg,
				slr : false,
				enc : 'url',
				type :  FireSpark.smart.constant.datatype,
				req :  FireSpark.smart.constant.reqtype,
				workflow : FireSpark.smart.constant.readflow() || [{ 
					service : FireSpark.ui.service.ElementContent,
					input : {
						element : 'cntr' ,
						animation : 'anm', 
						duration : 'dur',
						delay : 'dly',
					},
					data : '<span></span>',
					action : 'all',
					select : true
				},{ 
					service : FireSpark.ui.workflow.TemplateApply, 
					input : {
						element : 'pnl' ,
						template : 'tpl',
						animation : 'anm', 
						duration : 'dur',
						delay : 'dly',
						action : 'act' 
					},
					select : true
				}],
				errorflow : [{ 
					service : FireSpark.ui.workflow.TemplateApply, 
					input : {
						element : 'cntr' ,
						template : 'errtpl',
						animation : 'anm', 
						duration : 'dur',
						delay : 'dly'
					},
					action : 'all',
					select : true
				}],
				params : [],
				stop : false,
				ln : false,
				status : 'valid',
				message : 'message'
			}
		};
	},
	
	run : function($memory){
		$memory['src'] = $memory[0] || $memory['src'];
		$memory['sel'] = $memory[1] || $memory['sel'];
		
		$memory['pnl'] = $memory['pnl'] || $memory['cntr'] || $memory['sel'] +' .status:last';
		
		if( $memory[ 'canvas' ] ){
			$( $memory[ 'canvas' ] ).parent().children( $memory[ 'child' ] ).hide();
			$( $memory[ 'canvas' ] ).show();
		}
		
		switch($memory['src']){
			case 'form' : 
				var $form = $memory['sel'] + ' form';
				var $readflow = {
					service : FireSpark.core.service.ReadForm,
					form : $form,
					output : { request : 'req' }
				};
				break;
			
			case 'div' : 
				var $form = $memory['sel'];
				var $readflow = {
					service : FireSpark.core.service.ReadData,
					input : { cntr : 'sel' }
				};
				break;
			
			default :
				return { valid : false };
		}
		
		switch($memory['chng']){
			case 'reset' :
				$memory['workflow'] = [{
					service : FireSpark.ui.service.ElementTrigger,
					element : $form + ' input[type=reset]',
					event : 'click',
				}].concat($memory['workflow']);
				break;
			
			case 'hide' :
				$memory['workflow'] = [{
					service : FireSpark.ui.service.ElementContent,
					element : $form,
					action : 'none',
					animation : 'fadeout',
					duration : 150,
					select : true
				}].concat($memory['workflow']);
				break;
				
			case 'hdsl' :
				$memory['workflow'] = [{
					service : FireSpark.ui.service.ElementTrigger,
					element : $form + ' input[type=reset]',
					event : 'click',
				},{
					service : FireSpark.ui.service.ElementContent,
					element : $memory['sel'],
					action : 'none',
					animation : 'fadeout',
					duration : 150,
					select : true
				}].concat($memory['workflow']);
				break;
			
			case 'none' :
			default : 
				break;
		}
		
		$memory['workflow'] = [{
			service : FireSpark.smart.service.WriteMode,
			input : { element : 'pnl' }
		}].concat($memory['workflow']);
		
		$memory['errorflow'] = [{
			service : FireSpark.smart.service.WriteMode,
			input : { element : 'pnl' }
		}].concat($memory['errorflow']);
		
		$memory['workflow'] = $memory['workflow'].concat([{
			service : FireSpark.smart.service.WriteMode,
			input : { element : 'pnl' },
			admin : true,
			nonstrict : true
		}]);
		
		$memory['errorflow'] = $memory['errorflow'].concat([{
			service : FireSpark.smart.service.WriteMode,
			input : { element : 'pnl' },
			admin : true,
			nonstrict : true
		}]);
	
		return [{
			service : FireSpark.core.service.CheckForm,
			form : $form,
			input : { error : 'err' }
		},
			$readflow
		,{
			service : FireSpark.smart.workflow.ReadTmpl,
			args : ['pnl', 'errtpl'],
			cntr : $memory['cntr'] || $memory['sel'] +' .status:last',
			sel : $memory['slt'] || $memory['sel'] + ' input[name=submit]',
			agt : $memory['agt'] || $memory['sel'] + ' form',
			vld : FireSpark.smart.constant.readvld
		}].execute($memory);
	},
	
	output : function(){
		return ['element'];
	}
};
