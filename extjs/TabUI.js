// TabUI Class for managing Tabbed interface
function TabUI(container) {

	// the tabpanel instance
	this.panel = null;
	this.container = container;
	
	// initialize the tabpanel
	this.init = function(){
		this.panel = new Ext.TabPanel({
			renderTo: this.container,
			//border: false,
			resizeTabs: true,
			minTabWidth: 115,
			tabWidth: 135,
			enableTabScroll: true,
			plain: true,
			defaults: {
				autoScroll: true,
				autoHeight: true
			},
			//plugins: new Ext.ux.TabCloseMenu(),
		});
	}
	
	// create autoload tabs
	this.createURLTab = function(tabtitle, taburl, tabcls, isclosable) {
		var newtab = this.panel.add({
			title: tabtitle,
			iconCls: tabcls,
			closable: isclosable,
			autoScroll: true,
			autoLoad: {
				url: taburl
			}
		});
		newtab.show();
		return newtab;
	}
	
	// create simple tabs
	this.createRawTab = function(tabtitle, tabcls, isclosable) {
		var newtab = this.panel.add({
			title: tabtitle,
			iconCls: tabcls,
			closable: isclosable,
			autoScroll: true,
		});
		newtab.show();
		return newtab;
	}
	
	this.init();
}