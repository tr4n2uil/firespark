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
		$workflow = $memory['workflow'];
		$imports = $memory['imports'];
		
		FireSpark.core.helper.LoadBarrier.barrier(function(){
			$flag = false;
			for(var $i in $imports){
				if(Snowblozm.Registry.get($imports[$i]) || false){
				} else {
					$flag = true;
					break;
				}
			}
				
			if($flag || false){
				FireSpark.smart.helper.dataState(FireSpark.smart.constant.loaderror);
				return { valid : false };
			}
			
			Snowblozm.Kernel.execute($workflow, $memory);
		});
		
		/**
		 *	Load imports
		**/
		$barrier = false;
		
		for(var $i in $imports){
			$key = 'FIRESPARK_IMPORT_' + $imports[$i];
			
			if(Snowblozm.Registry.get($key) || false){
			} else {
				$barrier = true;
				
				Snowblozm.Kernel.execute([,{
					service : FireSpark.core.service.LoadAjax,
					url : $imports[$i],
					type : 'html',
					request : 'GET',
					workflow : [{
						service : FireSpark.ui.service.ElementContent,
						element : FireSpark.smart.constant.importdiv,
						select : true,
						action : 'last',
						duration : 5
					},{
						service : FireSpark.core.service.DataRegistry,
						key : $key,
						value : true
					}]
				}], {});
			}
		}
		
		/**
		 *	Finalize barrier
		**/
		if($barrier){
			FireSpark.smart.helper.dataState(FireSpark.smart.constant.loadstatus);
			return { valid : false };
		} else {
			return Snowblozm.Kernel.execute($workflow, $memory);
		}
	},
	
	output : function(){
		return [];
	}
};
