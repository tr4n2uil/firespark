FireSpark = {
	core : {
		service : {},
		workflow : {},
		helper : {},
		constant : {
			validation : [{
					cls : '.required',
					helper : FireSpark.core.helper.CheckRequired
			},{
					cls : '.email',
					helper : FireSpark.core.helper.CheckEmail
			},{
					cls : '.match',
					helper : FireSpark.core.helper.CheckMatch
			}],
			validation_status : 'span'
		}
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

