
/*****************
	VALIDATION HELPERS
*******************/
function processFormErrors() {
	$.each($(".formErrors"), function(index, element) {
        
        var id = $(element).attr("id").split(".")[0];
        $.validationEngine.buildPrompt("#" + id,$(element).html(),"error");
        $(element).remove();
        $("#" + id).bind("blur", function() {
            $.validationEngine.closePrompt("#" + id);
        });
        
    });
}

function buildPromptAndBinding(inputId, errorMessage) {
	$.validationEngine.buildPrompt("#" + inputId,errorMessage,"error");
    $("#" + inputId).bind("blur", function() {
        $.validationEngine.closePrompt("#" + inputId);
    });
}

function validateNotDefaultSelected(inputName, errorMessage) {
	//Make sure the season name isn't empty
	if ($("#" + inputName).val() == "default") {
		//Add new message
		buildPromptAndBinding(inputName, errorMessage);
		return false;
	}
	return true;
}
function validateNotEmpty(inputName, errorMessage) {
	//Make sure the name isn't empty
	if ($("#" + inputName).val() == "") {
		//Add new message for the name
        buildPromptAndBinding(inputName, errorMessage);
        $("#" + inputName).focus();

		return false;
	}
	return true;
}

function validateIsEmpty(inputName, errorMessage) {
	if ($("#" + inputName).val() != "") {
        buildPromptAndBinding(inputName, errorMessage);
        $("#" + inputName).focus();

		return false;
	}
	return true;
}

function validateNoSpaces(inputName, errorMessage) {
	//Make sure there is no whitespace in the entry
	if ($("#" + inputName).val().replace(/^\s+|\s+$/g,"").indexOf(" ") != -1) {
		//Add new message for the name
        buildPromptAndBinding(inputName, errorMessage);
        $("#" + inputName).focus();
		
		return false;
	}
	return true;
	
}

function validateMaxLength(inputName, maxLength, errorMessage) {
	var length = $("#" + inputName).val().length;
	
	if ($("#" + inputName).val().length > maxLength) {
		//Add new message for the name
        buildPromptAndBinding(inputName, errorMessage);
        $("#" + inputName).focus();
		
		return false;
	}
	return true;
}