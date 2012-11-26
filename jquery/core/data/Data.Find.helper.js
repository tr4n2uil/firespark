/**
 *	@helper DataFind
 *
 *	@param data
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.dataFind = function($data, $text, $offset){
	return $data.indexOf($text, $offset || 0) > -1;
}
