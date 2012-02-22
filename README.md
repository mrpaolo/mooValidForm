# mooValidForm
A simple class for client-side form validation written in MooTools.

## Usage Instruction

Add one (or more) of the following values to a 'class' attribute in the element that has to be validated:
	
 * required 
 * minChar_XXX 
   * minimum number of character to be entered (replace XXX with you own value)		
 * maxChar_XXX 
   * maximum number of character to be entered (replace XXX with you own value)
 * sameAs_XXX 						
 * validEmail 
   * Check for valid email format							
 * onlyNumbers			
 * onlyLetters			
 * onlyAlpha			
   * Letters + Numbers allowed	
 * noWhitespace		
 * validDate		
   * Validate for:	DD/MM/YY(YY) , DD.MM.YY(YY) , DD-MM.YY(YY)
 * validUrl			
   * Check for valid Url format
	
__NOTE:__ All the form elements to be validate MUST be procedeed by a __label__ tag related to theme with a __for__ attribute. 

## Class Initialisation

Normal Mootools class initialisation - required is only the __id__ of the form - example:

	window.addEvent('domready', function() {
		var mooFormInstance = new mooValidForm({
			myForm: 'mooForm'
		});
	});`

Error messages can be easily changed using the class options, see the class code for further information.

## Examples

See also the examples for possible usage of the class.