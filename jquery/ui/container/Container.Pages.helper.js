/**
 *	@helper ContainerPages
 *
 *	@param element
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.helper.containerPages = function($total, $pgno, $pgsz){
	var $pages = [];
	for(var $i = 0, $j = 0; $i < Number($total); $i += Number($pgsz), $j++){
		$pages.push($j != Number($pgno));
	}
	return $pages;
}
