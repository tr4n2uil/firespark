/**
 *	AccountForm renderer
 *
 *	@param submiturl string
 *	@param frame boolean
 *	@param title string
 *	@param bodyStyle css
 * @param formStyle css
 * @param formType ('Login'|'Register'|'Reset')
 *
**/
ServiceClient.extjs.renderer.AccountForm = function(params){
	this.config = {};
	this.config.url = params.submiturl;
	this.config.frame = params.frame;
	this.config.title = params.title;
	this.config.bodyStyle = params.bodyStyle;
	this.config.style = params.formStyle;
	this.formType = params.formType;
		
	switch(this.formType){
		case 'Login' : 
			this.config.items = [{
					fieldLabel: 'Username',
					name: 'username',
					allowBlank: false,
					vtype: 'alphanum'
				},{
					fieldLabel: 'Password',
					inputType: 'password',
					name: 'password',
					allowBlank: false,
					vtype: 'alphanum'
				}
			];
			break;
		case 'Register' :
		case 'Reset' :
			this.config.items = [{
					fieldLabel: 'Username',
					name: 'username',
					allowBlank: false,
					vtype: 'alphanum'
				},{
					fieldLabel: 'Email',
					name: 'email',
					allowBlank: false,
					vtype: 'email'
				}
			];
			break;
		default :
			break;
	}
	
	/**
	 *	@param view View
	**/
	this.render = function(memory){
		this.config.labelWidth = 75;
		this.config.width = 250;
		this.config.renderTo = memory.view;
		this.config.defaultType = 'textfield';
		this.config.buttons = [{
			text: this.formType,
			handler: function(btn){
				btn.disable();
				this.form.body.mask('Loading...', 'x-mask-loading');
				this.form.getForm().submit({
					success: function(f,a){
						this.form.body.unmask();
						ServiceClient.client.Kernel.run(a.result.msg);
					},
					failure: function(f, a){
						btn.enable();
						this.form.body.unmask();
						if (a.failureType === Ext.form.Action.CONNECT_FAILURE)
							Ext.Msg.alert("Error", "Please check your internet connection");
						else if (a.failureType === Ext.form.Action.SERVER_INVALID)
							Ext.Msg.alert("Error", a.result.msg);
						else
							Ext.Msg.alert("Error", "An error occured while sending request and/or reading response.");
					},
					scope : this
				});
			},
			scope:this
		},{
			text: 'Cancel',
			handler: function(){
				this.form.getForm().reset();
			},
			scope: this
		}];
	
		this.form = new Ext.FormPanel(this.config);
		memory.view.fadeIn({ 
			duration: 1,
			easing: 'easeBoth'
		});
	}
}
