/**
 *	@helper DataShort
 *
 *	@param data
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.dataShort = function($data, $size, $short){
	var $maxlen = $size || 15;
	var $len = $maxlen - 5;
	return $short ? ($data.length < $maxlen ? $data : $data.substr(0, $len) + ' ...') : $data;
}
