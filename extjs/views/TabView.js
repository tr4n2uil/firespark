ServiceClient.extjs.view.TabView = function(config){
	var tabpanel = new Ext.TabPanel({
		renderTo: config.container,
		border: config.border,	//false
		resizeTabs: true,
		minTabWidth: 115,
		tabWidth: 135,
		enableTabScroll: true,
		plain: config.plain,		//true
		defaults: {
			autoScroll: true,
			autoHeight: config.autoHeight		//true
		},
		//plugins: new Ext.ux.TabCloseMenu(),
	});

	this.getView = function(params){
		var tabconfig = {
			title: params.tabtitle,
			iconCls: params.tabcls,
			closable: params.isclosable,
			autoScroll: true,
		};
		if(params.autoload){
				tabconfig.autoLoad = {
					url: params.taburl
				};
		}
		var newtab = tabpanel.add(tabconfig);
		newtab.show();
		return newtab.body;
	}
}
