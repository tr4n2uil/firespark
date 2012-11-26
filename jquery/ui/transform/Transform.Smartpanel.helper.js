/**
 *	@helper TransformSmartpanel
 *
 *	@param element
 *	@param config
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.helper.transformSmartpanel = function($element, $config){
	return $element.each(function(){
		
		// Settings and variables
		var $self = $(this),
		$settings = $.extend({
			display: '.smart-display',
			edit: '.smart-edit',
			form: '.smart-form',
			cancel: '.smart-cancel',
			hover: '.smart-hover'
		}, $config || {}, {}),
		
		// Local cache for selectors
		$display = $self.find($settings.display),
		$edit = $self.find($settings.edit),
		$form = $self.find($settings.form),
		//$save = $self.find($settings.save),
		$cancel = $self.find($settings.cancel);
		
		// Make sure the plugin only get initialized once
		if($self.hasClass('smart-panel-done')){
			return;
		}
		$self.addClass('smart-panel-done');
		
		// Edit handler
		$edit.bind('click.smart-panel', function(){
			$display.hide();
			$form.show();
			//$edit.hide();
			return false;
		});
		
		// Cancel Actions
		$cancel.bind('click.smart-panel', function(){
			$form.hide();
			$display.show();
			//$edit.show();
			return false;
		});
		
		// Display Actions
		/*$display.bind('click.smart-panel', function(){
			$display.hide();
			$form.show();
			return false;
		})
		/*.bind( 'mouseenter.smart-panel', function(){
			$display.addClass( $settings.hover );
		})
		.bind( 'mouseleave.smart-panel', function(){
			$display.removeClass( $settings.hover );
		})*/;		
	});
}
