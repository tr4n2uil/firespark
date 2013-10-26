( function( window, $ ){

	// helper to get frame by name
	window.get_frame = function( $name ){
		for( var i = window.frames.length -1; i >= 0; i-- ){
			var $frame = window.frames[ i ];
			if( $frame.name || false ){
				if( $frame.name == $name ){
					return $frame;
				}
			}
		}
		return false;
	}

	// helper to add html into dom
	window.put_data = function( $data, $where, $how ){
		$el = $( $where );
		//$el.hide();

		switch( $how ){
			case 'all' :
				$el = $el.html( $data );
				$el.trigger( 'load' );
				break;
			
			case 'first' :
				$el = $el.prepend( $data );
				$el.trigger( 'load' );
				break;
			
			case 'last' :
				$el = $el.append( $data );
				$el.trigger( 'load' );
				break;
			
			case 'replace' :
				$el = $( $data ).replaceAll( $el );
				$el.trigger( 'load' );
				break;
				
			case 'remove' :
				$el.remove();
				break;
				
			default :
				break;
		}
	}

	// show single tile from among group
	window.show_tile = function( $tile, $group, $cls, $ret ){
		if( $cls ){
			$( $group + ' ' + $cls ).hide();
		}
		else {
			$( $group ).children().hide();
		}
		$( $tile ).fadeIn( 150 );
		
		return $ret;
	}

	// load using iframe
	window.iframe_load = function(){
		if( !$( this ).hasClass( 'quickload-processing' ) ){
			$( this ).addClass( 'quickload-processing' );

			var $form = $( this );
			var $where = $( this ).attr( 'data-where' ) || false;
			var $how = $( this ).attr( 'data-how' ) || 'all';
			var $cf = $( this ).attr( 'data-confirm' ) || false;
			var $gather = $( this ).attr( 'data-gather' ) || false;
			var $leave = $( this ).attr( 'data-leave' ) || false;

			var $tile = $( this ).attr( 'data-tile' ) || false;
			var $group = $( this ).attr( 'data-group' ) || false;

			if( $cf && !confirm( $cf ) ){
				return false;
			}

			if( $gather ){
				$form.children( 'input[type=hidden]' ).remove();
				$( $gather ).each( function(){
					if( this.name && !this.disabled && ( this.checked || /select|textarea/i.test( this.nodeName ) || /text|hidden|password/i.test( this.type ) ) ){
						$( '<input type="hidden">' ).attr( 'name', this.name ).attr( 'value', $(this).val() ).appendTo( $form );
					}
				} );
			}

			if( !$where ){
				return true;
			}

			/**
			 *	Genarate unique framename
			**/
			var $d= new Date();
			var $framename = 'firespark_iframe_' + $d.getTime();

			/**
			 *	Set target attribute to framename in form
			**/
			$form.attr( 'target', $framename );

			/**
			 *	Create IFRAME and define callbacks
			**/
			var $iframe = $( '<iframe id="' + $framename + '" name="'+ $framename + '" style="width:0;height:0;border:0px solid #fff;"></iframe>' )
				.insertAfter( $( this ) )
				.bind( 'load', function(){
					$form.removeClass( 'quickload-processing' );

					try {
						var $frame = window.get_frame( $framename);
						if( !$frame ) return false;

						var $data = $frame.document.body.innerHTML;

						$data = $( $data ).html();
						$data = $.parseJSON( $data );
						
						/**
						 *	Invoke Renderer
						**/
						$data = $( "<div/>" ).html( $data[ 'html' ] ).text();
						window.put_data( $data, $where, $how );

						// reset form
						if( !$leave ){
							$form.trigger( 'reset' );	
						}

						if( $tile && $group ){
							return window.show_tile( $tile, $group );
						}
					}
					catch( $error ){
						if( console ){
							console.log( $error );
						}
						$( '#error-header' ).html( '<div>An error occurred. Report us at <a href="mailto:learn@orbitnote.com" style="color: black; text-decoration: underline;">learn@orbitnote.com</a></div>' )
						.slideDown( 500 ).delay( 5000 ).slideUp( 500 );
						// Show Error
						//alert( $error );
					}
				})
				.bind('error', function($error){
					$form.removeClass( 'quickload-processing' );

					if( console ){
						console.log( $error );
					}
					$( '#error-header' ).html( '<div>An error occurred. Report us at <a href="mailto:learn@orbitnote.com" style="color: black; text-decoration: underline;">learn@orbitnote.com</a></div>' )
					.slideDown( 500 ).delay( 5000 ).slideUp( 500 );
					// Show Error
					//alert( $error );

				});
				
			/**
			 *	Remove IFRAME after timeout (150 seconds)
			**/
			window.setTimeout(function(){
				$iframe.remove();
			}, 150000);
			
			/**
			 *	@return true 
			 *	to continue default browser event with target on iframe
			**/
			return true;
		}
		else {
			return false;
		}
	}

	// trigger scroll handler
	window.scroll_trigger = function( callback ){
		jQuery( document ).ready( function(){
			jQuery( document ).unbind( 'scroll' );
			var processing = false;
			
			if( callback ){
				jQuery( document ).bind( 'scroll', function( e ){
					if ( processing || false )
						return false;

					if ( $( window ).scrollTop() >= $( document ).height() - $( window ).height() - 500 ){
						processing = true;
						callback();
					}
				} );	
			}
		} );
	}

	// show tile from group
	window.showtile = function(){
		var $tile = $( this ).attr( 'data-tile' ) || false;
		var $group = $( this ).attr( 'data-group' ) || false;
		var $cls = $( this ).attr( 'data-cls' ) || false;
		var $ret = $( this ).attr( 'data-return' ) || false;

		if( $tile && $group ){
			return window.show_tile( $tile, $group, $cls, $ret );
		}
		
		return true;
	}

	// activate html element
	window.activate = function(){
		var $element = $( this ).attr( 'data-element' ) || false;

		if( $( $element ).hasClass( 'no-display' ) ){
			$( $element ).removeClass( 'no-display' );
		}
		
		return true;
	}

	// init sortable
	window.init_sortable = function(){
		if( !$( this ).hasClass( 'sortable-done' ) ){
			$( this ).addClass( 'sortable-done' );
			var $save = $( this ).attr( 'data-save' ) || false;

			$( this ).sortable( {
				update: function( event, ui ) {
					if( $( $save ).hasClass( 'no-display' ) ){
						$( $save ).removeClass( 'no-display' );
					}
				}
			} );	
		}
		
		return true;
	}

	// datetime picker
	window.pick_datetime = function(){
		if( !$( this ).hasClass( 'datetime-done' ) ){
			$( this ).datetimepicker( { 
				dateFormat: "yy-mm-dd", 
				timeFormat: 'hh:mm:ss' 
			} ).addClass( 'datetime-done' );
		}
	}

	// date picker
	window.pick_date = function(){
		if( !$( this ).hasClass( 'datepick-done' ) ){
			$( this ).datepicker( { 
				dateFormat: "yy-mm-dd" 
			} ).addClass( 'datepick-done' );
		}
	}

	// textarea autogrow
	window.auto_grow = function(){
		while( $( this ).get( 0 ).scrollHeight > $( this ).get( 0 ).clientHeight ){
			var $rows = Number( $( this ).attr( 'rows' ) );
			$( this ).attr( 'rows', $rows + 1 );
		}	
		return true;
	}

	// textarea wysiwyg
	window.init_wysiwyg = function(){
		if( !$( this ).hasClass( 'no-display' ) ){
			$( this ).addClass( 'no-display' ).hide();
			var $target = $( '<div>' );
			$( this ).after( $target );
			window.wysiwyg_editor( $target, $( this ) );	
		}
	}

	window.bind_events = function( events ){
		for( var $i in events ){
			$e = events[ $i ];
			$( window.document ).on( $e[ 0 ], $e[ 1 ], $e[ 2 ] );
		}
	}

	// bind events
	window.bind_events( [
		[ 'submit', 'form.quickload', window.iframe_load ],
		[ 'click', 'a.quickload', window.iframe_load ],
		[ 'click', '.showtile', window.showtile ],
		[ 'change', '.activator', window.activate ],
		[ 'hover', '.sortable', window.init_sortable ],
		[ 'focus', 'input.datetime', window.pick_datetime ],
		[ 'focus', 'input.date', window.pick_date ],
		[ 'input', '.autogrow', window.auto_grow ],
		[ 'focus', '.autogrow', window.auto_grow ],
		[ 'focus', '.wysiwyg', window.init_wysiwyg ],
	] );

} )( window, jQuery );
