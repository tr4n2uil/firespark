/**
 *	@helper readControl
 *
 *	@param control Control character
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.readControl = function($control){
	switch($control){
		case 'info' :
			return 'View Entity';
		case 'edit' :
			return 'Edit Entity';
		case 'list' :
			return 'List Children';
		case 'add' :
			return 'Add Children';
		case 'remove' :
			return 'Remove Children';
		default :
			return '';
			break;
	}
}
