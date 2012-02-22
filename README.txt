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

::: OTHERS TO_BE_DONE :::
	
	var ck_name = /^[A-Za-z0-9 ]{3,20}$/;				Alphabets, numbers and space(' ') no special characters min 3 and max 20 characters. 
	var ck_username = /^[A-Za-z0-9_]{3,20}$/;			Supports alphabets and numbers no special characters except underscore('_') min 3 and max 20 characters. 
	var ck_password = /^[A-Za-z0-9!@#$%^&*()_]{6,20}$/;		Password supports special characters and here min length 6 max 20 charters.


::: METHODS :::

	submitForm
	submitRequest
	validateForm
	errorMsg

---