/**
 *	@workflow ReadHtml
 *	@desc Reads HTML content into element
 *
 *	@param url URL [memory]
 *	@param cntr string [memory]
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
 *	@return element element [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.smart.workflow.ReadHtml = {
	input : function(){
		return {
			required : ['url', 'cntr'],
			optional : { 
				nch : false,
				exp : FireSpark.smart.constant.poolexpiry,
				frc : FireSpark.smart.constant.poolforce,
				iframe : false,
				agt : false,
				root : false,
				select : true, 
				ld : FireSpark.smart.constant.loadmsg,
				lcntr : FireSpark.smart.constant.statusdiv,
				anm : 'fadein',
				dur : 150,
				dly : 0,
				act : 'all'
			}
		};
	},
	
	run : function($memory){	
		var $workflow = [{
			service : FireSpark.ui.service.ElementLoading,
			input : { 
				data : 'loading',
			},
			element : $memory['root'] || $memory['lcntr'],
		},{
			service : FireSpark.ui.service.ElementContent,
			input : { 
				element : 'cntr',
				animation : 'anm', 
				duration : 'dur', 
				delay : 'dly', 
				action : 'act' 
			},
			select : true
		}];
		
		return [{
			service : FireSpark.ui.service.ElementLoading,
			input : { 
				data : 'ld',
			},
			element : $memory['root'] || $memory['lcntr'],
		},{
			service : FireSpark.smart.service.DataLoad,
			type : 'html',
			request : 'GET',
			args : ['cntr', 'anm', 'dur', 'dly', 'act', 'loading'],
			input : {
				nocache : 'nch',
				expiry : 'exp',
				force : 'frc',
				agent : 'agt'
			},
			workflow : $workflow,
			errorflow : [{
				service : FireSpark.ui.service.ElementLoading,
				input : { 
					data : 'loading',
				},
				element : $memory['root'] || $memory['lcntr'],
			}]
		}].execute($memory);
	},
	
	output : function(){
		return ['element'];
	}
};
