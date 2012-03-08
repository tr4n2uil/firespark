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
