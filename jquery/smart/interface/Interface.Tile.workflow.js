/**
 *	@workflow InterfaceTile
 *	@desc Shows tile content into parent element
 *
 *	@param cntr string [memory] optional default selects closest with FireSpark.smart.constant.tileuicntr || FireSpark.smart.constant.tileuiprefix + ins
 *	@param ins string [memory] optional default false
 *	@param child selector [memory] optional default FireSpark.smart.constant.tileuisection
 *	@param none boolean [memory] optional default false
 *	@param select boolean [memory] optional default true
 *	@param tile string [memory] optional false
 *	@param anm string [memory] optional default false ('fadein', 'fadeout', 'slidein', 'slideout', false)
 *	@param dur integer [memory] optional default 500
 *	@param dly integer [memory] optional default 0
 *	@param mv boolean [memory] optional default FireSpark.smart.constant.moveup
 *	@param mvdur integer [memory] optional default FireSpark.smart.constant.moveduration
 *
 *	@return element element [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.smart.workflow.InterfaceTile = {
	input : function(){
		return {
			optional : { 
				cntr : false,
				ins : false,
				child : FireSpark.smart.constant.tileuisection,
				canvas : false,
				none : false,
				select : false, 
				tile : false,
				anm : false,
				dur : 150,
				dly : 0,
				mv : 0,
				mvdur : FireSpark.smart.constant.moveduration,
				mvbody : 'body,html'
			},
			set : [ 'tile', 'cntr' ]
		};
	},
	
	run : function($memory){
		var $ins  = $memory['cntr'];
		
		if($memory['tile'] === false){
			$ins = ($memory['cntr'] || FireSpark.smart.constant.tileuiprefix + $memory['ins']) + '>' + FireSpark.smart.constant.tileuicntr;
		}
		var $select = true;
		
		if( $memory[ 'canvas' ] ){
			$( $memory[ 'canvas' ] ).parent().children( $memory[ 'child' ] ).hide();
			$( $memory[ 'canvas' ] ).show();
			$memory[ 'mv' ] = $memory[ 'mv' ] || FireSpark.smart.constant.moveup;
		}

		$memory = [{
				service : FireSpark.ui.service.ElementSection,
				element : $ins || false,
				input : { 
					content : 'tile',
					animation : 'anm',
					duration : 'dur',
					delay : 'dly'
				},
				select : $select
		}].execute($memory);
		
		if(Number($memory['mv'])){
			$( $memory[ 'mvbody' ] ).animate({
					scrollTop: 0
			}, $memory['mvdur']);
		}
		
		return $memory;
	},
	
	output : function(){
		return ['element'];
	}
};
