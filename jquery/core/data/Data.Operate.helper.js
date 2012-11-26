/**
 *	@helper DataOperate
 *
 *	@param value1
 *	@param value2
 *	@param operator
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.dataOperate = function($value1, $value2, $operator){
	switch($operator){
		case '>' :
			return $value1 > $value2;
		case '<' :
			return $value1 < $value2;
		default :
			return $value1 == $value2;
	}
}
