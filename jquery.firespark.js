/**
 *	jQuery Firespark script file
 *
 *	Vibhaj Rajan <vibhaj8@gmail.com>
 *
 *	Licensed under MIT License 
 *	http://www.opensource.org/licenses/mit-license.php
 *
**/

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
	window.iframe_load = function( success, error ){
		if( !$( this ).hasClass( 'quickload-processing' ) ){
			$( this ).addClass( 'quickload-processing' );

			var $form = $( this );
			var that = $form;
			var $where = $( this ).attr( 'data-where' ) || false;
			var $how = $( this ).attr( 'data-how' ) || 'all';

			var progress = $( $( this ).attr( 'data-progress' ) ) || where;
			var load_success = $( this ).attr( 'data-success' ) || success || window.load_success;
			var load_fail = $( this ).attr( 'data-fail' ) || error || window.load_fail;

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
						load_success( { 'html': $data[ 'html' ] }, that, 200, {} );

						// reset form
						if( !$leave ){
							$form.trigger( 'reset' );	
						}

						if( $tile && $group ){
							return window.show_tile( $tile, $group );
						}
					}
					catch( $error ){
						load_fail( $error, that, 500, {} );

						$( '#error-header' ).html( '<div>An error occurred. Report us at <a href="mailto:learn@orbitnote.com" style="color: black; text-decoration: underline;">learn@orbitnote.com</a></div>' )
						.slideDown( 500 ).delay( 5000 ).slideUp( 500 );
						// Show Error
						//alert( $error );
					}
				})
				.bind('error', function($error){
					$form.removeClass( 'quickload-processing' );

					load_fail( $error, that, 500, {} );

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

	// ajax setup
	window.ajax_setup = function(){
		( function addXhrProgressEvent( $ ){
		    var originalXhr = $.ajaxSettings.xhr;
		    $.ajaxSetup({
		        progress: function() { console.log("standard progress callback"); },
		        progressUpload: function() { console.log("standard upload progress callback"); },
		        xhr: function() {
		            var req = originalXhr(), that = this;
		            if( req ){
		                if( typeof req.addEventListener == "function" ){
		                    req.addEventListener( "progress", function( e ){
		                        that.progress( e );
		                    }, false );
		                }
		            }

		            if( req.upload || false ){
		                if( typeof req.upload.addEventListener == "function" ){
		                    req.upload.addEventListener( "progress", function( e ){
		                        that.progressUpload( e );
		                    }, false );
		                }
		            }

		            return req;
		        }
		    });
		})( jQuery );
	}

	// load ajax
	window.ajax_load = function( success, error ){
		if( !$( this ).hasClass( 'ajaxload-processing' ) ){
			$( this ).addClass( 'ajaxload-processing' );

			var that = $( this );
			var where = $( $( this ).attr( 'data-where' ) ) || false;
			var how = $( this ).attr( 'data-how' ) || 'all';

			var progress = $( $( this ).attr( 'data-progress' ) || where );
			var load_success = $( this ).attr( 'data-success' ) || success || window.load_success;
			var load_fail = $( this ).attr( 'data-fail' ) || error || window.load_fail;

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

			if( !where ){
				return false;
			}

			var url = '';
			url = $( this ).attr( 'action' ) || $( this ).attr( 'href' ) || $( this ).attr( 'data-url' );
		
			var request = 'GET';
			try {
				request = $( this ).attr( 'method' ) || $( this ).attr( 'data-method' );
				request = request.toUpperCase();
			} 
			catch( e ){ request = 'GET'; }

			var ctype = 'application/x-www-form-urlencoded';
			ctype = $( this ).attr( 'enctype' ) || 'application/x-www-form-urlencoded';

			var data = $( this ).serialize();
			if( request == 'POST' && ctype == 'multipart/form-data' ){
				var formdata = new FormData();
				var $params = data.split( '&' );

				for(var $i=0, $len=$params.length; $i<$len; $i++){
					var $prm = ($params[$i]).split('=');
					formdata.append( $prm[0], unescape($prm[1]) );
				}

				that.find( 'input[type=file]' ).each( function(){
					var name = $( this ).attr( 'name' );

					$.each( this.files, function( idx, file ){
						formdata.append( name, file );
					} );
				} );

				data = formdata;
  				ctype = false;
			}

			$.ajax({
				url: url,
				data: data,
				type: request,
				contentType: ctype,
				processData: false,
				dataType: 'json',
				progressUpload: function( e ) {
					if( e.lengthComputable ){
						var len = parseInt( (e.loaded / e.total * 99), 10);
						//console.log( "Loaded " + len + "%" );
						progress.html( '<div class="progress progress-striped active" style="width: 50%; position: relative; margin: 0.5em auto;">\
							<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="' + len + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + len + '%;">\
								<span class="sr-only">' + len + '% Complete</span>\
							</div><div class="percent">' + len + '%</div></div>' );
					}
					else {
						console.log( "Length not computable." );
					}
				},
				success: function( data, status, request ){
					that.removeClass( 'ajaxload-processing' );

					load_success( data, that, status, request );

					if( !$leave ){
						that.trigger( 'reset' );	
					}

					if( $tile && $group ){
						return window.show_tile( $tile, $group );
					}

				},
				error: function( request, status, error ){
					that.removeClass( 'ajaxload-processing' );

					load_fail( error, that, status, request );
				}
			});
		}

		return false;
	}

	// load success handler
	window.load_success = function( data, that, status, request ){
		if( data.html || false ){
			window.put_data( data.html, where, how );
		}
		else {
			window.put_data( data, where, how );
		}
	}

	// load fail handler
	window.load_fail = function( error, that, status, request ){
		if( console ){ 
			console.log( error ); 
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

	// bind events 
	window.bind_events = function( events ){
		for( var $i in events ){
			$e = events[ $i ];
			$( window.document ).on( $e[ 0 ], $e[ 1 ], $e[ 2 ] );
		}
	}

	// get viewport
	window.get_viewport = function(){
		var viewPortWidth;
		var viewPortHeight;

		// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
		if( typeof window.innerWidth != 'undefined' ){
			viewPortWidth = window.innerWidth,
			viewPortHeight = window.innerHeight
		}

		// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
		else if( typeof document.documentElement != 'undefined'
			&& typeof document.documentElement.clientWidth !=
			'undefined' && document.documentElement.clientWidth != 0 ){
			viewPortWidth = document.documentElement.clientWidth,
			viewPortHeight = document.documentElement.clientHeight
		}

		// older versions of IE
		else {
			viewPortWidth = document.getElementsByTagName('body')[0].clientWidth,
			viewPortHeight = document.getElementsByTagName('body')[0].clientHeight
		}
		
		return [ viewPortWidth, viewPortHeight ];
	}

	// fix placeholder
	window.fix_placeholder = function(){
		//fix html5 placeholder attribute for ie7 & ie8
        if( $.browser.msie && $.browser.version.substr(0, 1) < 9 ){ // ie7&ie8
            $( 'input[placeholder], textarea[placeholder]' ).each( function (){
                var input = $( this );

                $( input ).val( input.attr( 'placeholder' ) );

                $( input ).focus( function (){
                    if( input.val() == input.attr( 'placeholder' ) ){
                        input.val( '' );
                    }
                } );

                $( input ).blur( function (){
                    if( input.val() == '' || input.val() == input.attr( 'placeholder' ) ){
                        input.val( input.attr( 'placeholder' ) );
                    }
                } );
            } );
        }
	}

	// update viewport resize
	window.update_viewport = function(){
		var viewport = get_viewport();
		var width = viewport[ 0 ];
		var height = viewport[ 1 ];

		if( height < width ){
			var check = height / 3 * 4;
			if( check < width && check > 320 ){
				width = check;
			}
			else {
				width = height;
			}

			$( '.body' ).width( width );
		}

		var size = '14px';
		if( width >= 1080 ){
			size = '18px';
		}
		else if( width >= 720 ){
			size = '16px';
		}
		else if( width >= 480 ){
			size = '14px';
		}
		else if( width >= 400 ){
			size = '13px';
		}
		else {
			size = '12px';
		}

		var stylesheet = document.styleSheets[ document.styleSheets.length - 1 ],
			selector = "body, input", rule = "{ font-size: "+ size +"}";

		if( stylesheet.insertRule ){
			stylesheet.insertRule( selector + rule, stylesheet.cssRules.length );
		} 
		else if( stylesheet.addRule ){
			stylesheet.addRule( selector, rule, -1 );
		}

		//$( 'body' ).css( 'font-size', size );
		//$( 'input' ).css( 'font-size', size );

		if( document.body.scrollHeight <= viewport[ 1 ] ){
			$( 'fixed-bottom' ).addClass( 'fixed-bottom-done' );
		}
	}

	// open fancybox
	window.open_fancybox = function(){
		var $html = $( $( this ).attr( 'data-target' ) ).html();
		$.fancybox( $html ); 
	}

	// exec content editable commands
	window.exec_command = (function(){
		var map = { 
			'formatblock': {
				'': { 'section': [ 'section', 1 ], 'article': [ 'article', 1 ], 'output': [ 'output', 1 ], 'blockquote': [ 'blockquote', 1 ] },
				'div': { 'section': [ 'section', 1 ], 'article': [ 'article', 1 ], 'output': [ 'output', 1 ], 'blockquote': [ 'blockquote', 1 ] },
				'section': { 'section': [ 'div', 0 ], 'article': [ 'output', 1 ], 'output': [ 'output', 1 ], 'blockquote': [ 'blockquote', 0 ] },
				'article': { 'section': [ 'output', 1 ], 'article': [ 'div', 0 ], 'output': [ 'output', 1 ], 'blockquote': [ 'blockquote', 0 ] },
				'output': { 'section': [ 'article', 0 ], 'article': [ 'section', 0 ], 'output': [ 'div', 0 ], 'blockquote': [ 'blockquote', 0 ] },
				'blockquote': { 'section': [ 'section', 1 ], 'article': [ 'article', 1 ], 'output': [ 'output', 1 ], 'blockquote': [ 'div', 0 ] },
			},
		};

		var def = {
			'': { 'true': [ 'true', 1 ] },
			'true': { 'true': [ 'false', 0 ] },
			'false': { 'true': [ 'true', 1 ] },
		}

		return function( e ){
			e.preventDefault();

			var cmd = $( this ).attr( 'data-cmd' );
			var args = $( this ).attr( 'data-args' );

			var m = map[ cmd ] || def;
			var val = document.queryCommandValue( cmd );
			t = m[ val ][ args ];
			args = t[ 0 ];

			if( t[ 1 ] ){
				$( this ).attr( 'data-done', "true" );
			}
			else {
				$( this ).removeAttr( 'data-done' );
			}

			document.execCommand( cmd, 0, args );
		}
	})();

	// init query command state
	window.init_command = (function(){
		var map = { 
			'formatblock': {
				'': { 'section': 0, 'article': 0, 'output': 0, 'blockquote': 0 },
				'div': { 'section': 0, 'article': 0, 'output': 0, 'blockquote': 0 },
				'section': { 'section': 1, 'article': 0, 'output': 0, 'blockquote': 0 },
				'article': { 'section': 0, 'article': 1, 'output': 0, 'blockquote': 0 },
				'output': { 'section': 1, 'article': 1, 'output': 0, 'blockquote': 0 },
				'blockquote': { 'section': 0, 'article': 0, 'output': 0, 'blockquote': 1 },
			},
		};

		var def = {
			'': { 'true': 0 },
			'true': { 'true': 1 },
			'false': { 'true': 0 },
		}

		return function(){
			var cmd = $( this ).attr( 'data-cmd' );
			var args = $( this ).attr( 'data-args' );

			var m = map[ cmd ] || def;
			var val = document.queryCommandValue( cmd );
		
			if( m[ val ][ args ] ){
				$( this ).attr( 'data-done', "true" );
			}
			else {
				$( this ).removeAttr( 'data-done' );
			}
		}
	})();

	// tooltip init
	window.tooltip_init = function(){
		$('#tooltip-menu').on( 'mouseenter', function(){ 
			$( this ).attr( 'data-rmtooltip', '2' ); 
		} )
		.on( 'mouseleave', function(){ 
			$( this ).attr( 'data-rmtooltip', '1' ); 
		} );
	}

	// show tooltip
	window.tooltip_show = function( el, html, coords ){
		//$('#tooltip-menu').fadeOut( 500 ).delay( 15000, function(){ $( this ).remove() } );
		//$('#tooltip-menu').hide( 0 );

		$('#tooltip-menu')
			.html( html )
			.css( { top: coords[ 1 ] + 5, left: coords[ 0 ] + 5 } )
			.attr( 'data-rmtooltip', '1' )
			.appendTo( el ).show();
	}

	// hide tooltip
	window.tooltip_hide = function(){
		if( $( '#tooltip-menu' ).attr( 'data-rmtooltip' ) == '1' ){
			$( '#tooltip-menu' ).attr( 'data-rmtooltip', '0' );
			$( '#tooltip-menu' ).hide();
			$( $( '#link-form' ).attr( 'data-target' ) ).remove();
			return true;
		}
		return false;
	}

	// selection menus
	window.select_menu = '\
		<a href="#" class="execcmd" data-cmd="bold" data-args="true" title="Bold (ctrl+b)">B</a>\
		<a href="#" class="execcmd" data-cmd="italic" data-args="true" title="Italic (ctrl+i)">I</a>\
		<a href="#" class="execcmd" data-cmd="underline" data-args="true" title="Underline (ctrl+u)">U</a>\
		<a href="#" class="execcmd" data-cmd="formatblock" data-args="article" title="Heading">H</a>\
		<a href="#" class="execcmd" data-cmd="formatblock" data-args="blockquote" title="Blockquote">&ldquo;</a>\
		<a href="#" class="execcmd" data-cmd="formatblock" data-args="section" title="Align Center">C</a>\
	';
	window.click_menu = '\
		<span id="main-tooltip-menu">\
			<a href="#" class="execcmd" data-cmd="insertunorderedlist" data-args="true" title="Bulletted List"><span style="top: -1px;" class="glyphicon glyphicon-list"></span></a>\
			<a href="#" class="initlink" data-group="#tooltip-menu" data-tile="#link-form" title="Embed/Insert Link"><span style="top: -1px;" class="glyphicon glyphicon-link"></span></a>\
			<span style="position: relative; display: inline-block;" title="Insert Picture"><a href="#" title="Insert Picture" onclick="$( \'#main-tooltip-menu input[type=file]\' ).click(); return false;"><span style="top: -1px;" class="glyphicon glyphicon-picture"></span></a>\
				<input type="file" class="insertimage" title="Insert Picture" style="position: absolute; top: 0; left: 0; padding: 0; width: 100%; height: 100%; display: none;" /></span>\
		</span>\
		<span id="link-form" class="no-display">\
			<form id="embed-form" class="embedlink" action="http://noembed.com/embed/" data-how="replace" method="get">\
				<input type="text" name="url" size="25" class="autosubmit" data-target="#embed-form" style="padding: 0.16em 0.36em;" />\
				<a href="#" class="showtile" data-group="#tooltip-menu" data-tile="#main-tooltip-menu" style="font-size: 2em; padding: 0.08em 0 0 0.36em; vertical-align: text-top;">&times;</a>\
				<input type="hidden" name="maxwidth" value="100%"/>\
			</form>\
		</span>\
	';

	// editor selection menu
	window.selection_menu = (function(){
		range = '';

		getSelected = function(){
			var t = '';
			var bw = false;

			if( window.getSelection ){
				t = window.getSelection();
				bw = true;
			}
			else if( document.getSelection ){
				t = document.getSelection();
				bw = true;
			}
			else if( document.selection ){
				t = document.selection.createRange().text;
			}

			return [ t, bw ];
		}

		getCoords = function( t, bw ){
			var coords = [ 0, 0 ];
			var mchar = "\ufeff";
			var mentity = "&#xfeff;";
			var mel = false;

			if( bw ){
				if( t.getRangeAt ) {
					range = t.getRangeAt( 0 ).cloneRange();
				} 
				else {
					// Older WebKit doesn't have getRangeAt
					range.setStart( t.anchorNode, t.anchorOffset );
					range.setEnd( t.focusNode, t.focusOffset );

					// Handle the case when the selection was selected backwards (from the end to the start in the document)
					if( range.collapsed !== t.isCollapsed ){
						range.setStart( t.focusNode, t.focusOffset );
						range.setEnd( t.anchorNode, t.anchorOffset );
					}
				}

				range.collapse(false);

				// Create the marker element containing a single invisible character using DOM methods and insert it
				mel = document.createElement("span");
				mel.id = 'tmp-marker';
				mel.appendChild( document.createTextNode( mchar ) );
				range.insertNode( mel );
			}
			else {
				// Clone the TextRange and collapse
	            range = document.selection.createRange().duplicate();
	            range.collapse( false );

	            // Create the marker element containing a single invisible character by creating literal HTML and insert it
	            range.pasteHTML( '<span id="tmp-marker" style="position: relative;">' + mentity + '</span>');
	            mel = document.getElementById( 'tmp-marker' );
			}

			if( mel ){
				// Find markerEl position http://www.quirksmode.org/js/findpos.html
				var obj = mel;
				var left = 0;
				var top = 0;

				do {
					left += obj.offsetLeft;
					top += obj.offsetTop;
				} while ( obj = obj.offsetParent );

	            coords[ 0 ] = left;
	            coords[ 1 ] = top;
	            mel.parentNode.removeChild( mel );
	        }

	        return coords;		
		}

		on_unselect = function( e ){
			if( tooltip_hide() ){
				range = '';
			}
		}

		on_select = function( e ){
			if( $( '#tooltip-menu' ).attr( 'data-rmtooltip' ) != '2' ){
				if( e.type == 'mouseup' || ( e.type == 'keyup' && e.which != 16 && e.which != 17 ) ){
					var st = getSelected();

					if( st[ 0 ].toString() != ''  && range != st[ 0 ].toString() ){
						range = st[ 0 ].toString();
						//console.log( 'Selected: ' + st[ 0 ] );

						var html = $( window.select_menu );

				        coords = getCoords( st[ 0 ], st[ 1 ] );
						tooltip_show( this, html, coords );

						$( '#tooltip-menu' ).find( '.execcmd' ).each( init_command );
					}
					else if( e.type == 'mouseup' ){
						var that = this;

						var html = $( window.click_menu );

						coords = [ e.pageX, e.pageY ];
						tooltip_show( this, html, coords );

						$( '#tooltip-menu' ).find( '.execcmd' ).each( init_command );

						$( '#tooltip-menu .initlink' ).on( 'click', function(){
							var rid = new Date().getTime() + "_" + Math.random().toString().substr( 2 );
							document.execCommand( 'inserthtml', 0, '<span id="' + rid + '"></span>' );
							$( '#link-form>form' ).attr( 'data-where', '#' + rid );
							var rt = showtile.apply( this );
							$( '#link-form' ).find( 'input[name=url]' ).focus();
							return rt;
						} );
					}
				}
			}
		}

		return function( el ){
			el.on( 'mouseup keyup', on_select )
			.on( 'mousedown keydown mouseleave', on_unselect );
		}
	})();

	// embed links
	window.embed_link = function(){
		var where = $( $( this ).attr( 'data-where' ) );
		var how = $( this ).attr( 'data-how' ) || 'replace';

		return ajax_load.apply( this, [
			function( data, that ){
				if( data.html || false ){
					window.put_data( data.html, where, how );
				}
				else {
					var url = that.find( 'input[name=url]' ).val();
					window.put_data( '<a href="' + url + '" target="_blank">' + url + '</a>', where, how );
				}
				$( '#tooltip-menu' ).hide();
			}, 
			function( e, that ){
				var url = that.find( 'input[name=url]' ).val();
				window.put_data( '<a href="' + url + '" target="_blank">' + url + '</a>', where, how );
				$( '#tooltip-menu' ).hide();
			}
		]);
	}

	// read file as image uri
	window.read_image = function( input, callback ){
		if ( input.files ) {
			$.each( input.files, function( idx, file ){
				if ( /^image\//.test( file.type ) ){
					var FR= new FileReader();
					FR.onload = callback;
					FR.readAsDataURL( file );	
				}
				else {
					console.log( 'Unsupported File Type' );
				}
			} )
		}
	}


	// insert image handler
	window.insert_image = function(){
		window.read_image( this, function( e ){
			document.execCommand( 'inserthtml', 0, '<div contenteditable="false"><a href="' + e.target.result + '" target="_blank" contenteditable="false"><img src="' + e.target.result + '" class="image" /></a></div><div><br/></div>' );
		} );
	}

	// auto submit handler
	window.auto_submit = function(){
		$( $( this ).attr( 'data-target' ) ).submit();
	}

	// call bind events
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
		[ 'click', '.fancybox', window.open_fancybox ],
		[ 'click', '.execcmd', window.exec_command ],
		[ 'change', 'input.insertimage', window.insert_image ],
		[ 'change', 'input.autosubmit', window.auto_submit ],
		[ 'submit', 'form.embedlink', window.embed_link ],
	] );

} )( window, jQuery );
