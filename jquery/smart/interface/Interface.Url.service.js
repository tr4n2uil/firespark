/**
 *	@service InterfaceUrl
 *	@desc Used to launch URL/Hash SmartInterface navigator
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.smart.service.InterfaceUrl = {
	idle : true,
	
	current : '',
	path : '#',
	view : '',
	
	input : function(){
		return {
			required : ['navigator'],
			optional : { 
				escaped : false,
				root : false,
				event : false,
				save : false,
				nofrc : false
			}
		}
	},
	
	run : function($memory){
		$navigator = $memory['navigator']; // === false ?  FireSpark.smart.service.InterfaceUrl.base : $memory['navigator'];
		$escaped = $memory['escaped'];
		$root = $memory['root'];
		$event = $memory['event'];
		$save = $memory['save'];
		$force = $memory['nofrc'] ? false : true;
		
		if(($event || FireSpark.smart.service.InterfaceUrl.idle) && FireSpark.smart.service.InterfaceUrl.current != $navigator){
			if($event){
				if($navigator[0] == '!'){
					$navigator = FireSpark.smart.service.InterfaceUrl.path + $navigator;
				}
				else if($navigator[1] == '!'){
					$navigator = FireSpark.smart.service.InterfaceUrl.path + $navigator.substring(1);
				}
			}
			
			if($save || false){
				FireSpark.smart.service.InterfaceUrl.current = window.location.hash = $navigator;
			}
			
			var $hash = $navigator.split('!');
			if($hash[0].length > 1 && $hash[0][$hash[0].length - 1] == '#')
				$hash[0] = $hash[0].substring(0, $hash[0].length - 2);
			
			if(FireSpark.smart.service.InterfaceUrl.path != $hash[0]){
				if($save || false){
					FireSpark.smart.service.InterfaceUrl.path = $hash[0];
				}
				
				var $nav = ($hash[1] || false) ? '#' + $hash[1] : false;
				return { valid : $hash[0].launch({ root : $root, nav : $nav, frc : $force }) };
			}
			else if($hash[1] || false) {
				$hash[1] = '#' + $hash[1];
				if($save || false){
					FireSpark.smart.service.InterfaceUrl.view = $hash[1];
				}
				
				return { valid : $hash[1].launch({ root : $root }) };
			}
		}
		
		return { valid : false };
	},
	
	output : function(){
		return [];
	}
};
