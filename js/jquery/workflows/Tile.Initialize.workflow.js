/** *	@workflow TileInitialize *	@desc Activates container elements using templates for TileUI * *	@param key string [memory] optional default 'ui-global' *	@param id long int [memory] optional default '0' *	@param ins string [memory] optional default '#ui-global-0' *	@param tile string [memory] optional default false * *	@param iframe string [memory] optional default false *	@param agent string [memory] optional default false *	@param root object [memory] optional default false * *	@param url string [memory] optional default '' *	@param data object [memory] optional default '' *	@param type string [memory] optional default 'json' *	@param request string [memory] optional default 'POST' *	@param process boolean [memory] optional default false *	@param mime string [memory] optional default 'application/x-www-form-urlencoded' *	@param args array [args] * *	@param workflowend Workflow [memory] optional default { service : FireSpark.jquery.service.ContainerRender } *	@param errorflowend Workflow [memory] optional default { service : FireSpark.jquery.service.ElementContent } *	@param stop boolean [memory] optional default false * *	@param loaddata string [memory] optional default FireSpark.core.constant.loadmsg *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout') *	@param dur integer [memory] optional default 1000 *	@param dly integer [memory] optional default 0 * *	@param launch boolean [memory] optional default false *	@param status string [memory] optional default 'valid' *	@param message string [memory] optional default 'message' * *	@return element element [memory] ***/FireSpark.jquery.workflow.TileInitialize = {	input : function(){		return {			optional : { 				key : 'ui-global', 				id : '0',				ins : 'ui-global-0',				tile : false,				iframe : false,				root : false,				agent : false,				url : '',				data : '', 				type : 'json', 				request : 'POST', 				process : false, 				mime : 'application/x-www-form-urlencoded',				workflowend : { service : FireSpark.jquery.service.ContainerRender },				errorflowend : { service : FireSpark.jquery.service.ElementContent },				loaddata : FireSpark.core.constant.loadmsg,				anm : 'fadein',				dur : 1000,				dly : 0, 				stop : false,				launch : false,				status : 'valid',				message : 'message'			}		};	},		run : function($memory){		return Snowblozm.Kernel.execute([{			service : FireSpark.jquery.service.ContainerInitialize		},{			service : FireSpark.jquery.service.ContainerData,			args : ['key', 'id', 'ins', 'root', 'ln', 'status', 'message', 'tile'],			workflow : [{				service : FireSpark.jquery.service.LaunchMessage,				input : {					ln : 'launch'				}			},				$memory['workflowend'],			],			errorflow : [				$memory['errorflowend']			]		}], $memory);	},		output : function(){		return [];	}};