/**
 *	@helper DataSplit
 *
 *	@param data
 *	@param separator optional default :
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.dataSplit = function($data, $separator){
	$separator = $separator || ':';
	return $data.split($separator);
}
