/**
 *	@service DataImport
 *	@desc Uses AJAX to load content from server and saves in dom
 *
 *	@param imports array [memory]
 *	@param workflow Workflow [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.smart.service.DataImport = {
	input : function(){
		return {
			required : ['imports', 'workflow']
		}
	},
	
	run : function($memory){
		/**
		 *	Set barrier
		**/
		var $workflow = $memory['workflow'];
		var $imports = $memory['imports'];
		
		FireSpark.core.helper.LoadBarrier.barrier(function($args){
			var $flag = false;
			var $imports = $args['imports'];
			
			for(var $i in $imports){
				var $key = 'FIRESPARK_IMPORT_' + $imports[$i];
				if(Snowblozm.Registry.get($key) || false){
				} else {
					$flag = true;
					break;
				}
			}
				
			if($flag || false){
				FireSpark.smart.helper.dataState(FireSpark.smart.constant.loaderror);
				return { valid : false };
			}
			
			Snowblozm.Kernel.execute($args['workflow'], $args['memory']);
		}, {
			workflow : $workflow,
			imports : $imports,
			memory : $memory
		});
		
		/**
		 *	Load imports
		**/
		var $barrier = false;
		
		for(var $i in $imports){
			var $key = 'FIRESPARK_IMPORT_' + $imports[$i];
			
			if(Snowblozm.Registry.get($key) || false){
			} else {
				if($barrier === false){
					$barrier = true;
					FireSpark.smart.helper.dataState(FireSpark.smart.constant.loadstatus);
				}
				
				Snowblozm.Kernel.execute([{
					service : FireSpark.core.service.LoadAjax,
					url : $imports[$i],
					type : 'html',
					request : 'GET',
					sync : true,
					workflow : [{
						service : FireSpark.core.service.DataRegistry,
						key : $key,
						value : true
					},{
						service : FireSpark.ui.service.ElementContent,
						element : FireSpark.smart.constant.importdiv,
						select : true,
						action : 'last',
						animation : 'none',
						duration : 5
					}]
				}], {});
			}
		}
		
		/**
		 *	Finalize barrier
		**/
		if($barrier){
			return { valid : false };
		} else {
			FireSpark.core.helper.LoadBarrier.end();
			return { valid : false };
			//return Snowblozm.Kernel.execute($workflow, $memory);
		}
	},
	
	output : function(){
		return [];
	}
};
