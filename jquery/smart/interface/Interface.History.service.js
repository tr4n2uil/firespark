/**
 *	@service InterfaceHistory
 *	@desc Initializes navigator launch history triggers
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.smart.service.InterfaceHistory = {
	input : function(){
		return { };
	},
	
	run : function($memory){
		window.onpopstate = function(e){
			if(e.state){
				if(e.state['message'] || false){
					e.state['message']['navigator'].launch(e.state['message']);
				}
				else {
					var $service = {
						service : FireSpark.smart.service.InterfaceUrl,
						navigator : e.state['nav'],
						escaped : e.state['escaped'],
						event : true,
						save : e.state['hash'],
						nofrc : true
					};					$service.run({});
				}
			}
		};

		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
