/* 
---

name: mooValidForm

description: a simple class for client-side form validation written in MooTools.

license: MIT-style

author: Paolo Manganiello

author URI: http://paolomanganiello.com

requires: ...

provides: mooValidForm

===
Usage Instruction
===

Add one (or more) of the following values to a 'class' attribute in the element that has to be validated:
	
	required			...	 
	minChar_XXX			Minimum number of character to be entered (replace XXX with you own value)		
	maxChar_XXX			Maximum number of character to be entered (replace XXX with you own value)
	sameAs_XXX 					
	validEmail			Check for valid email format							
	onlyNumbers			...
	onlyLetters			...
	onlyAlpha			Letters + Numbers allowed	
	noWhitespace		...
	validDate			Validate for:	DD/MM/YY(YY) , DD.MM.YY(YY) , DD-MM.YY(YY)
	validUrl			Check for valid Url format
	
NOTE: All the form elements to be validate MUST be procedeed by a 'label' tag related to theme with a 'for' attribute. 

---
 */

var mooValidForm = new Class({
	Implements: [Options, Events],
	options: {
		myForm: '',				// ID of the Form
		// Regular_Expression
		minChar_regExp: 		/minChar_\d+/,	
		maxChar_regExp: 		/maxChar_\d+/,
		sameAs_regExp: 			/sameAs_\w+/,
		validEmail_regExp: 		/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, 	// http://www.regular-expressions.info/email.html
		onlyNumbers_regExp: 	/^[0-9]+$/,
		onlyLetters_regExp: 	/^[A-Za-z]+$/,
		onlyAlpha_regExp: 		/^[0-9a-zA-Z]+$/,
		noWhitespace_regExp: 	/^[\S]+$/,
		validDate_regExp:		 /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/, // http://gskinner.com/RegExr/?2rijn
		validUrl_regExp:		/^(http|https|ftp)\:\/\/[a-z0-9\-\.]+\.[a-z]{2,3}(:[a-z0-9]*)?\/?([a-z0-9\-\._\?\,\'\/\\\+&amp;%\$#\=~])*$/i,
		// Error Messages
		required_error: 		' Error Required',
		minChar_error: 			' Error MinChar',
		maxChar_error: 			' Error MaxChar',
		sameAs_error: 			' Not Match',
		validEmail_error: 		' Check Email',
		onlyNumbers_error:  	' Only numbers allowed',
		onlyLetters_error: 		' Only letters allowed',
		onlyAlpha_error: 		' Only letters and numbers allowed',
		noWhitespace_error: 	' No whitespace allowed',
		validDate_error: 		' Date not correct',
		validUrl_error:			' Url not correct',
		// General Messages
		submit_success:			'Your message has been sent successfully.',
		submit_failure:			'There was an error sending the message.'
	},
	initialize: function(options) {
		this.setOptions(options);
		// Setup
		this.myForm = $(this.options.myForm);
		this.eleArray = this.myForm.getElements('input, select, textarea'); 	// Get all elements of the form
		this.isValid = [];
		// Validate single inputs (onBlur - Fired when an element target loses focus.)
		this.eleArray.each(function(ele) {
			ele.addEvent('blur', function(evt) {
				// Setup
				var errorContId = 'errorContainer_' + ele.getPrevious('label').getProperty('for');
				if ($(errorContId)) {
					$(errorContId).dispose();
				}	
				// Validate
				this.validateForm(ele);
			}.bind(this));
		}.bind(this));
		// On Submit revalidate everything
		this.myForm.getElement('input[type=submit]').addEvent('click', this.submitForm.bind(this));
	},
	submitForm: function(evt) {
		// Prevent Default Submit
		evt.preventDefault();	
		// Setup 
		this.myForm.getElements('div[id^=errorContainer]').dispose();				// Reset error container on Submit
		this.myForm.getElements('p[id=successEle], p[id=failureEle]').dispose();	// Remove success_or_failure messages
		this.isValid = [];															// Reset error array for validation
		// Revalidate every form element
		this.eleArray.each(function(ele) {
			this.validateForm(ele);
		}.bind(this));
		// Submit Request 
		if (this.isValid.length == 0) {
			this.submitRequest();
		} else {
			console.log('not valid');
		}
	},
	submitRequest: function() {
		var myRequest = new Request({
			url: this.myForm.get('action'),			// Get the action 
			method: this.myForm.get('method'),		// Get the method
			data: this.myForm.toQueryString(),		// Get parameter to string
			// OnRequest
			onRequest: function() {
				// console.log('request');
			},
			// OnSuccess
			onSuccess: function() {
				var successEle = new Element('p', {
					id: 'successEle',
					text: this.options.submit_success,
					styles: {
						opacity: 0
					}
				}).inject(this.myForm, 'top').fade('in');
				
			}.bind(this),
			// OnFailure
			onFailure: function() {
				var failureEle = new Element('p', {
					id: 'failureEle',
					text: this.options.submit_failure,
					styles: {
						opacity: 0
					}
				}).inject(this.myForm, 'top').fade('in');
			}.bind(this),
		}).send();
	},
	validateForm: function(ele) {
		// Setup 
		var eleValue = ele.get('value');	// Value
		var valueLength = eleValue.length;	// Length
		
		/*
			Testing Rules
		*/
		
		// Required
		if (ele.hasClass('required')) {
			if (eleValue == '') {
				this.errorMsg(ele, this.options.required_error);
				this.isValid = ['false'];
			} 
			// Radio Buttons 
			if (ele.get('type') == 'radio') {
				var radioButton = 'input[name=' + ele.get('name') + ']:checked';
				if (!($$(radioButton).length > 0)) {
					this.errorMsg(ele, this.options.required_error);
					this.isValid = ['false'];
				}
			}
			// Checkbox 
			if (ele.get('type') == 'checkbox') {
				if (!(ele.checked)) {
					this.errorMsg(ele, this.options.required_error);
					this.isValid = ['false'];
				}
			}
			// Select Tag
			if (ele.tagName == 'SELECT') {
				if (ele.selectedIndex == 0) {
					this.errorMsg(ele, this.options.required_error);
					this.isValid = ['false'];
				}
			}
		}
		// MinChar (minChar_XXX)
		var result = this.options.minChar_regExp.exec(ele.get('class'));
		if (result) {
			var split = result[0].split("_");
			var minChar = split[1];
			if (valueLength < minChar && valueLength != 0) {
				this.errorMsg(ele, this.options.minChar_error);
				this.isValid = ['false'];
			} 
		}
		// Max Characters (maxChar_XXX)
		var result = this.options.maxChar_regExp.exec(ele.get('class'));
		if (result) {
			var split = result[0].split("_");
			var maxChar = split[1];
			if (valueLength > maxChar && valueLength != 0) {
				this.errorMsg(ele, this.options.maxChar_error);
				this.isValid = ['false'];
			}
		}
		// Same as ...  - (sameAs_XXX) - Match other Input field (e.g Password or Email double check)
		var result = this.options.sameAs_regExp.exec(ele.get('class'));
		if (result) {
			var eleArray = this.myForm.getElements('.' + result[0]);
			var valueEle1 = eleArray[0].get('value');
			var valueEle2 = eleArray[1].get('value');
			if (valueEle1 != valueEle2 && valueEle1 != '' && valueEle2 != '') {
				this.errorMsg(ele, this.options.sameAs_error);
				this.isValid = ['false'];
			}
		}
		// Email 
		if (ele.hasClass('validEmail')) {
			var result = this.options.validEmail_regExp.exec(eleValue);
			if (!result && valueLength != 0) {
				this.errorMsg(ele, this.options.validEmail_error);
				this.isValid = ['false'];
			}
		}
		// URLs
		if (ele.hasClass('validUrl')) {
			var result = this.options.validUrl_regeExp.exec(ele.get('value'));
			if (!result && valueLength != 0) {
				this.errorMsg(ele, this.options.validUrl_error);
				this.isValid = ['false'];
			}
		}
		// Only Numbers
		if (ele.hasClass('onlyNumbers')) {
			var result = this.options.onlyNumbers_regExp.exec(eleValue);
			if (!result && valueLength != 0) {
				this.errorMsg(ele, this.options.onlyNumbers_error);
				this.isValid = ['false'];
			}
		}
		// Only Letters
		if (ele.hasClass('onlyLetters')) {
			var result = this.options.onlyLetters_regExp.exec(eleValue);
			if (!result && valueLength != 0) {
				this.errorMsg(ele, this.options.onlyLetters_error);
				this.isValid = ['false'];
			}
		}
		// Only Alphanumerical (Numbers and Letters)
		if (ele.hasClass('onlyAlpha')) {
			var result = this.options.onlyAlpha_regExp.exec(eleValue);
			if (!result && valueLength != 0) {
				this.errorMsg(ele, this.options.onlyAlpha_error);
				this.isValid = ['false'];
			}
		}
		// No Whitespace
		if (ele.hasClass('noWhitespace')) {
			var result = this.options.noWhitespace_regExp.exec(eleValue);
			if (!result && valueLength != 0) {
				this.errorMsg(ele, this.options.noWhitespace_error);
				this.isValid = ['false'];
			}
		}
		// Date
		if (ele.hasClass('validDate')) {
			var result = this.options.validDate_regExp.exec(eleValue);
			if (!result && valueLength != 0) {
				this.errorMsg(ele, this.options.validDate_error);
				this.isValid = ['false'];
			}
		}
		// Result...
		return (this.isValid[0]) ? true : false;
	},
	errorMsg: function(ele, msg) {
		// Setup
		var label = ele.getPrevious('label');
		var labelFor = label.getProperty('for');
		var errorContId = 'errorContainer_' + labelFor
		// Error Container
		if (!$(errorContId)) {
			var errorContainer = new Element('div', {
				'id': errorContId,
				styles: {
					opacity: 0
				}
			});
			errorContainer.inject(label, 'after').fade('in');
		}
		// Error Message
		var errorLabel = new Element('span', {
			'class': 'errorMsg',
			html: msg
		});
		errorLabel.inject($(errorContId), 'bottom');
	}
});
// That's all folks! - Fork me on GitHub...