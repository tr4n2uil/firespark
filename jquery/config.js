/**
 *	@config FireSpark.core.constant
**/
FireSpark.core.constant = {
	validations : {
		required : {
			cls : '.required',
			helper : FireSpark.core.helper.CheckRequired
		},
		email : {
			cls : '.email',
			helper : FireSpark.core.helper.CheckEmail
		},
		match : {
			cls : '.match',
			helper : FireSpark.core.helper.CheckMatch
		}
	},
	validation_status : 'span',
	loaderror : '<span class="error">Error Loading Data</span>',
	iframeroot : '#ui-imports'
}

/**
 *	@config FireSpark.ui.constant
**/
FireSpark.ui.constant = {
	transforms : {
		uibutton : {
			cls : '.uibutton',
			helper : FireSpark.ui.helper.transformButton,
			config : {}
		},
		ckeditor : {
			cls : '.ckeditor',
			helper : FireSpark.ui.helper.transformCKEditor,
			config : {}
		},
		wysiwyg : {
			cls : '.wysiwyg',
			helper : FireSpark.ui.helper.transformWysiwyg,
			config : {}
		},
		uitabpanel : {
			cls : '.uitabpanel',
			helper : FireSpark.ui.helper.transformTabpanel,
			config : { 
				savekey : 'tabpanel',
				select : false, 
				cache : false,	
				collapsible : false, 
				event : 'click', 
				tablink : false, 
				indexstart : 0 
			}
		}
	},
	maindiv : '#ui-global-0',
	replacesel : ', .ui-replace',
	defaulttpl : 'tpl-default'
};

/**
 *	@config FireSpark.smart.constant
**/
FireSpark.smart.constant = {
	urlstart : '', // '?/'
	globalkey : 'ui-global-data',
	statusdiv : '#load-status',
	hststatusdiv : '#ui-page',
	statusdelay : 1500,
	statusduration : 1500,
	loaderror : '<span class="error">Error Loading Data</span>',
	loadstatus : '<span class="state loading">Loading ...</span>',
	loadmsg : '<span class="loading">Loading ...</span>',
	hststatus : '<div class="loader"></div>',
	initmsg : '<span class="state">Initializing ...</span>',
	cnfmsg : 'Are you sure you want to continue ?',
	importdiv : '#ui-imports',
	importroot : 'ui/import/',
	importext : '.json',
	importsync : false,
	defaultkey : 'people.person.info',
	defaulturl : 'run.php',
	tileuiprefix : '#ui-global-',
	tileuicntr : '.bands',
	tileuisection : '.tile-content',
	moveup : false,
	moveduration: 850,
	poolexpiry : 150,
	poolforce : false,
	config : [],
	defaultln : '#sync',
	uicache : true,
	dtclass : '.datatable',
	readflow : function(){ return false; },
	datatype : 'json',
	datareq : 'POST',
	readvld : true
};

