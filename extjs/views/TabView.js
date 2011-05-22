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

	this.getView = function(config){
		var tabconfig = {
			title: config.tabtitle,
			iconCls: config.tabcls,
			closable: config.isclosable,
			autoScroll: true,
		};
		if(config.autoload){
				tabconfig.autoLoad = {
					url: config.taburl
				};
		}
		var newtab = tabpanel.add(tabconfig);
		newtab.show();
		return newtab.body;
	}
}
