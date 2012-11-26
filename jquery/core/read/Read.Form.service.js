/**
 *	@service ReadForm
 *	@desc Serializes form into url-encoded data and reads form submit parameters
 *
 *	@param form string [memory]
 *
 *	@return url string [memory]
 *	@return request string [memory]
 *	@return data object [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.service.ReadForm = {
	input : function(){
		return {
			required : ['form']
		};
	},
	
	run : function($memory){
		var $form = $($memory['form']);
		
		$memory['url'] = $form.attr('action');
		try {
			$memory['request'] = $form.attr('method').toUpperCase();
		} catch($e) { $memory['request'] = 'POST'; }
		
		var $params = $form.serialize();
		var $d= new Date();
		$params = $params + '&_ts=' +  $d.getTime();
		$memory['data'] = $params;
		
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['url', 'request', 'data'];
	}
};
