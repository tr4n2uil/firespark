/**
 *	@helper LoadBarrier
 *	@desc Used to load barrier
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.LoadBarrier = {
	requests : 0,
	lock : false,
	
	barrier_function : [],
	barrier_args : [],
	
	start : function(){
		this.requests++;
	},
	
	end : function(){
		this.requests--;
		
		if(this.requests <= 0){
			this.requests = 0;
			
			var $bf = this.barrier_function;
			this.barrier_function = [];
			
			var $ba = this.barrier_args;
			this.barrier_args = [];
			
			if($bf.length){
				for(var $i in $bf){
					try {
						($bf[$i])($ba[$i]);
					} catch($id) {
						if(console){
							console.log('Exception : ' + $id);
						}
					}
				}
			}
		}
	},
	
	barrier : function($barrier_function, $barrier_args){
		this.barrier_function.push($barrier_function);
		this.barrier_args.push($barrier_args);
	}
};
