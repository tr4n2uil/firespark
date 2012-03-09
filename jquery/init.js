/**
 * @initialize FireSpark
**/
FireSpark = {
	core : {
		service : {},
		workflow : {},
		helper : {},
		constant : {}
	},
	ui : {
		service : {},
		workflow : {},
		helper : {},
		constant : {},
		template : {}
	},
	smart : {
		service : {},
		workflow : {},
		helper : {},
		constant : {}
	}
};

function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function is_numeric(n){
	return !isNaN(Number(n));
}

function unique($array){
   var u = {}, a = [];
   for(var i = 0, l = $array.length; i < l; ++i){
      if($array[i] in u)
         continue;
      a.push($array[i]);
      u[$array[i]] = 1;
   }
   return a;
}
