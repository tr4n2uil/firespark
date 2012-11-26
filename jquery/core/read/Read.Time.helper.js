/**
 *	@helper ReadTime
 *
 *	@param time
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.readTime = function($time){
	var $d = new Date($time);
	var $hours = $d.getHours();
	if($hours < 10) $hours = '0' + $hours/1;
	var $minutes = $d.getMinutes();
	if($minutes < 10) $minutes = '0' + $minutes/1;
	return $d.toDateString() + ' ' + $hours + ':' + $minutes + ' hrs';
}
