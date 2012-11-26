/**
 *	@service DataEncode
 *	@desc Encodes data from url-encoded other formats
 *
 *	@param type string [memory] optional default 'url' ('url', 'json', 'rest-id')
 *	@param data string [memory] optional default false
 *	@param url string [memory] optional default false
 *
 *	@return data object [memory]
 *	@return result string [memory]
 *	@return mime string [memory]
 *	@return url string [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.service.DataEncode = {
	input : function(){
		return {
			optional : { type : 'url', data : false, url : '' }
		}
	},
	
	run : function($memory){
		var $data = $memory['data'];
		var $type = $memory['type'];
		var $mime =  'application/x-www-form-urlencoded';
		
		if($data !== false && $data != ''){
			$data = $data.replace(/\+/g, '%20');
			if($type != 'url'){
				var $params = $data.split('&');
				var $result = {};
				for(var $i=0, $len=$params.length; $i<$len; $i++){
					var $prm = ($params[$i]).split('=');
					$result[$prm[0]] = unescape($prm[1]);
				}
				$memory['data'] = $data = $result;
			}
			
			switch($type){
				case 'json' :
					$data = JSON.stringify($data);
					$mime =  'application/json';
					break;
				
				case 'rest-id' :
					$memory['url'] = $memory['url'] + '/' + $data['id'];
					
				case 'url' :
				default :
					break;
			}
		}
		
		$memory['result'] = $data;
		$memory['mime'] = $mime;
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['data', 'result', 'mime', 'url'];
	}
};
