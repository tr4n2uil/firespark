/** *	Upload navigator * *	@param sel form selector string *	@param val string ***/ServiceClient.jquery.navigator.Upload = function(config){		return [{		service : ServiceClient.jquery.module.ElementStatus,		selector : config.sel + ' input[name=submit]',		disabled : true	},{		service : ServiceClient.jquery.module.AlertStatus,		selector : config.sel + ' div.status',		value : config.val || 'Uploading ... Please Wait'	}];}