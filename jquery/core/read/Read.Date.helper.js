/**
 *	@helper ReadDate
 *
 *	@param time
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.readDate = function($time){
	var $d = new Date($time);
	return $d.toDateString();
}
