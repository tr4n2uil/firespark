/**
 * @initialize FireSpark
**/
var FireSpark = {
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

var FS = {
	c : {
		s : FireSpark.core.service,
		w : FireSpark.core.workflow,
		h : FireSpark.core.helper,
		c : FireSpark.core.constant
	},
	u : {
		s : FireSpark.ui.service,
		w : FireSpark.ui.workflow,
		h : FireSpark.ui.helper,
		c : FireSpark.ui.constant,
		t : FireSpark.ui.template
	},
	s : {
		s : FireSpark.smart.service,
		w : FireSpark.smart.workflow,
		h : FireSpark.smart.helper,
		c : FireSpark.smart.constant
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
