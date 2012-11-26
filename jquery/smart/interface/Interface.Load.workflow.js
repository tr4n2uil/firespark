/**
 *	@workflow InterfaceLoad
 *	@desc Processes loading of UI using imports and keys
 *
 *	@param key string [memory] optional default 'people.person.info'
 *	@param id long int [memory] optional default '0'
 *	@param name string [memory] optional default ''
 *	@param cntr string [memory] optional default false
 *	@param ins string [memory] optional default '0'
 *	@param nav string [memory] optional default false
 *	@param tile string [memory] optional false
 *
 *	@param url URL [memory] optional default FireSpark.smart.constant.defaulturl
 *	@param tpl string [memory] optional default 'tpl-default'
 *
 *	@param select boolean [memory] optional default true
 *	@param lcntr string [memory] optional default FireSpark.smart.constant.statusdiv
 *	@param ld string [memory] optional default FireSpark.core.constant.loadstatus
 *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout')
 *	@param dur integer [memory] optional default 1000
 *	@param dly integer [memory] optional default 0
 *	@param act string [memory] optional default 'all' ('all', 'first', 'last', 'remove')
 *	@param bg boolean [memory] optional default false
 *	@param mv boolean [memory] optional default FireSpark.smart.constant.moveup
 *	@param mvdur integer [memory] optional default FireSpark.smart.constant.moveduration
 *
 *	@param frc boolean [memory] optional default FireSpark.smart.constant.poolforce
 *	@param glb boolean [memory] optional default false
 *	@param nch boolean [memory] optional default false
 *	@param exp integer [memory] optional default FireSpark.smart.constant.poolexpiry
 *
 *	@param iframe string [memory] optional default false
 *	@param agt string [memory] optional default root
 *	@param root element [memory] optional default false
 *
 *	@param data string [memory] optional default ''
 *	@param type string [memory] optional default 'json'
 *	@param req string [memory] optional default 'POST'
 *	@param workflow Workflow [memory] optional default [{ service : FireSpark.ui.service.ContainerRender }]
 *	@param errorflow Workflow [memory] optional default [{ service : FireSpark.jquery.service.ElementContent, ... }]
 *	@param params array [memory] optional default []
 *	@param stop boolean [memory] optional default false
 *	@param config array [memory] optional default FireSpark.smart.constant.config
 *	@param navigator string [memory] optional default ''
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.smart.workflow.InterfaceLoad = {
	input : function(){
		return {
			optional : { 
				key : FireSpark.smart.constant.defaultkey, 
				id : '0',
				name : false,
				ins : '0',
				cntr : false,
				lcntr : FireSpark.smart.constant.statusdiv,
				url : FireSpark.smart.constant.defaulturl,
				nav : false,
				tile : false,
				glb : false,
				nch : false,
				exp : FireSpark.smart.constant.poolexpiry,
				frc : FireSpark.smart.constant.poolforce,
				iframe : false,
				agt : false,
				root : false,
				bg : false,
				select : true,
				ld : FireSpark.smart.constant.loadstatus,
				anm : 'fadein',
				dur : 500,
				dly : 0,
				act : 'first',
				tpl : 'tpl-default' ,
				data : '',
				type : 'json',
				req : 'POST',
				workflow : [{ service : FireSpark.ui.service.ContainerRender }],
				errorflow :  [{ 
					service : FireSpark.ui.service.ElementContent,
					args : ['lcntr'],
					input : {
						element : 'lcntr',
						animation : 'anm', 
						duration : 'dur',
						delay : 'dly'
					},
					select : true,
					act : 'all'
				}],
				params : [],
				stop : false,
				config : FireSpark.smart.constant.config,
				navigator : '',
				mv : FireSpark.smart.constant.moveup,
				mvdur : FireSpark.smart.constant.moveduration
			}
		};
	},
	
	run : function($memory){
		for(var $max=0; ; $max++){
			if($memory[$max] || false){
			} else break;
		}

		var $index = --$max;
		$i = $j = 0;
		var $data = '';
		
		if($index > 1 && is_numeric($memory[$index])){
			$memory['key'] = $memory[$index-1];
			
			$data += ('&' + ($j++) + '=' + $memory[$index]);
			$memory['id'] = $memory[$index];
			
			$data += ('&' + ($j++) + '=');
			$max = $index-1;
		}
		else if($index > 1 && is_numeric($memory[$index-1])){
			$memory['key'] = $memory[$index-2];
			
			$data += ('&' + ($j++) + '=' + $memory[$index-1]);
			$memory['id'] = $memory[$index-1];
			
			$data += ('&' + ($j++) + '=' + $memory[$index]);
			//$memory[$j++] = $memory[$index];
			$max = $index-2;
		}
		else {
			$memory['key'] = $memory[$i++];
			
			$data += ('&' + ($j++) + '=' + $memory[$i]);
			$memory['id'] = $memory[$i++];
		}
		
		while($max && $i <= $max){
			$data += ('&' + ($j++) + '=' + $memory[$i++]);
		}
		/*var $config = $memory['config'];
		for($i=0; $i<$max; $i++){
			$data += ('&' + $config[$i] + '=' + $memory[$i]);
		}*/
		$memory['data'] += $data;
		
		//$memory['key'] = $memory[$i] || $memory['key'];
		//$memory['id'] = $memory[$i+1] || $memory['id'];
		//$memory['name'] = $memory[$i+2] || $memory['name'] || '';
		//if($memory['name'] == '#') $memory['name'] = ''; //$memory['id'];
		//$memory['ins'] = $memory[$i+3] || $memory['ins'];
		
		var $key = $memory['key'];
		var $instance = $memory['key']+'-'+$memory['id'];
		var $workflow = $memory['workflow'];
		
		$memory['key'] = 'ui-' + $key.replace(/\./g, '-');
		$memory['ins'] = $memory['cntr'] || FireSpark.smart.constant.tileuiprefix + $memory['ins'];
		
		var $navigator = $memory['navigator'];
		$navigator = $navigator.replace(/bg\/true\//g, '');
		$memory['navigator'] = $navigator = $navigator.replace(/glb\/true\//g, '');
		
		var $parts = $navigator.split('~');
		if($parts[1] || false){
			var $req = $parts[1].split('/');
			for(var $i = 1, $len=$req.length; $i<$len; $i+=2){
				//$req[$i + 1] = unescape($req[$i + 1]);
				$memory['data'] += ('&' + $req[$i] + '=' + $req[$i + 1]);
			}
		}
		
		if($memory['nav']){
			$workflow = $workflow.concat([{
				service : FireSpark.core.service.LaunchNavigator,
				args : [ 'ins' ],
				data : [$memory['nav']],
				launch : true,
				nonstrict : true
			}]);
		}
		
		var $dataflow = [{
			service : FireSpark.smart.service.DataLoad,
			args : ['tpl', 'ins', 'act', 'dur', 'dly', 'anm', 'key', 'id', 'name', 'ins', 'inline', 'bg', 'tile', 'lcntr', 'ld', 'mv', 'mvdur'],
			url : $memory['url'],
			data : 'service=' + $key + '&navigator=' + $memory['navigator'] + '&' + $memory['data'], 
			validity : true,
			type : $memory['type'],
			request : $memory['req'], 
			global : $memory['glb'],
			nocache : $memory['nch'],
			expiry : $memory['exp'],
			force : $memory['frc'],
			iframe : $memory['iframe'],
			agent : $memory['agt'],
			root : $memory['root'],
			act : $memory['act'],
			dur : $memory['dur'],
			dly : $memory['dly'],
			anm : $memory['anm'],
			bg : $memory['bg'] || $memory['nav'],
			mv : $memory['mv'],
			mvdur : $memory['mvdur'],
			key : $memory['key'],
			id : $memory['id'],
			name : $memory['name'],
			ins : $memory['ins'],
			tile : $memory['tile'],
			navigator : $memory['navigator'],
			params : ($memory['params']).concat(['key', 'id', 'name', 'ins', 'navigator']),
			workflow : $workflow,
			errorflow : [{ 
				service : FireSpark.ui.workflow.TemplateApply,
				input : {
					animation : 'anm', 
					duration : 'dur',
					delay : 'dly'
				},
				element : $memory['lcntr'],
				select : true,
				act : 'all',
				tpl : 'tpl-default'
			}]
		}];
		
		if( FireSpark.smart.constant.nobarrier || false ){
			var $loadflow = [{
				service : FireSpark.core.service.DataSelect,
				params : { imports : 'imports', tpl : 'tpl' }
			}].concat( $dataflow );
			
		}
		else {
			var $loadflow = [{
				service : FireSpark.core.service.DataSelect,
				params : { imports : 'imports', tpl : 'tpl' }
			},{
				service : FireSpark.smart.service.DataImport,
				args : ['tpl', 'lcntr', 'act', 'dur', 'dly', 'anm', 'ld'],
				workflow : $dataflow,
				errorflow : false
			}];
		}
		
		return [{
			service : FireSpark.ui.service.ElementContent,
			input : {
				element : 'lcntr' ,
				animation : 'anm', 
				delay : 'dly',
				duration : 'dur',
				data : 'ld'
			},
			act : 'all',
			select : true
		},{
			service : FireSpark.smart.service.DataLoad,
			url : FireSpark.smart.constant.importroot + $key + FireSpark.smart.constant.importext,
			args : ['lcntr', 'act', 'dur', 'dly', 'anm', 'ld'],
			request : 'GET',
			data : true, 
			type : 'json', 
			process : false, 
			mime : 'application/x-www-form-urlencoded',
			params : [],
			stop : false,
			cache : true,
			expiry : false,
			workflow : $loadflow
		}].execute($memory);
	},
	
	output : function(){
		return [];
	}
};
