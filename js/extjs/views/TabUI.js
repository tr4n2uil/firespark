/**
 *	TabUI renderer and view generator
 *
 *	@param border boolean
 *	@param plain boolean
 *  @param autoHeight boolean
 *
**/
ServiceClient.extjs.view.TabUI = function(params){
	var options = {
		border : params.border,				//false
		resizeTabs : true,
		minTabWidth : 115,
		tabWidth : 135,
		enableTabScroll : true,
		plain : params.plain,						//true
		defaults : {
			autoScroll: true,
			autoHeight: params.autoHeight	//true
		}
		//plugins : new Ext.ux.TabMenu();
	};
	
	/**
	 * @param view View
	**/
	this.render = function(memory){
		options.renderTo = memory.view;
		this.tabpanel = new Ext.TabPanel(options);
	}
	
	/**
	 *  @param tabtitle string
	 *  @param tabiconcls css class
	 *  @param tabclosable boolean
	 *  @param autoload boolean
	 *  @param taburl string
	**/
	this.getView = function(params){
		var tabconfig = {
			title: params.tabtitle,
			iconCls: params.tabiconcls,
			closable: params.isclosable,
			autoScroll: true,
		};
		if(params.autoload){
				tabconfig.autoLoad = {
					url: params.taburl
				};
		}
		var newtab = this.tabpanel.add(tabconfig);
		newtab.show();
		return newtab.body;
	}
}
