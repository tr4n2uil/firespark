/**
 *	@helper DataStrip
 *
 *	@param data
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.dataStrip = function($data){
	$data = $data.replace(/<\/?[a-z][a-z0-9]*[^<>]*>/ig, "");
	
	var $index = $data.indexOf('<');
	if($index > 0){
		$data = $data.substring(0, $index);
	}
	
	return $data;
}
