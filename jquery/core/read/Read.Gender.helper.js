/**
 *	@helper readGender 
 *
 *	@param ch gender character
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.readGender = function($ch){
	switch($ch){
		case 'M' :
			return 'Male';
		case 'F' :
			return 'Female';
		case 'N' :
		default :
			return '';
			break;
	}
}
