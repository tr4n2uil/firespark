/**
 *	@service ReadData
 *	@desc Serializes div into url-encoded data and reads form submit parameters
 *
 *	@param cntr string [memory]
 *	@param cls string [memory] optional default 'data'
 *
 *	@return data object [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.service.ReadData = {
	input : function(){
		return {
			required : ['cntr'],
			optional : { cls : 'data' }
		};
	},
	
	run : function($memory){
		var $d = new Date();
		var $params = '_ts=' +  $d.getTime();
		
		var serialize = function($index, $el){
			if($(this).attr('name') || false){
				$params = $params + '&' + $(this).attr('name') + '=' +  $(this).val();
			}
		}
		$($memory['cntr'] + ' .' + $memory['cls']).each(serialize);
		
		$memory['data'] = $params;
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['data'];
	}
};
