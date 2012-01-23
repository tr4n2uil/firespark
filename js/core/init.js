var FireSpark = FireSpark || {};
FireSpark.core = {};

FireSpark.core.service = {};
FireSpark.core.workflow = {};

FireSpark.core.helper = {};
FireSpark.core.constant = {};

FireSpark.core.constant.loadmsg = '<span class="loading">Loading ...</span>';
FireSpark.core.constant.loaderror = '<span class="error">The requested resource could not be loaded</span>';

/**
 *	@component AjaxBarrier
**/
FireSpark.core.ajax = {
	requests : 0,
	
	barrier_function : function() {
		
	},
	
	start : function(){
		this.requests++;
	},
	
	end : function(){
		this.requests--;
		if(this.requests <= 0){
			this.requests = 0;
			this.barrier_function();
			this.barrier_function = function() {}
		}
	},
	
	barrier : function($bfunc){
		this.barrier_function = $bfunc;
	}
};

