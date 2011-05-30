/**
 *	TabUI renderer and view generator
 *
 *	@param cache boolean
 *	@param collapsible boolean
 *  @param event string
 *	@param tablink boolean
 *
**/
ServiceClient.jquery.view.TabUI = function(params){
	var tab = new Array();
	var index = -1;
	var options = {
		cache : params.cache || false,
		collapsible : params.collapsible || false,
		event : params.event || 'click',
		tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>",
		add: function( event, ui ) {
			tab[index] = $(ui.panel);
		}
	};
	if(params.tablink || false){
		options.load = function(event, ui) {
			$('a', ui.panel).click(function() {
				$(ui.panel).load(this.href);
				return false;
			});
		}
	}
	var tabpanel = null;
	
	/**
	 * @param view View
	**/
	this.render = function(memory){
		tabpanel = memory.view.tabs(options);
		$('.ui-icon-close').live( "click", function() {
			var indx = $("li", tabpanel).index($(this).parent());
			tabpanel.tabs( "remove", indx );
		});
	}
	
	/**
	 *  @param tabtitle string
	 *  @param autoload boolean
	 *  @param taburl string
	**/
	this.getView = function(params){
		index++;
		var url = '#tab-'+index;
		if(params.autoload){
			url = params.taburl;
		}
		tabpanel.tabs('add', url, params.tabtitle);
		return tab[index];
	}
}
