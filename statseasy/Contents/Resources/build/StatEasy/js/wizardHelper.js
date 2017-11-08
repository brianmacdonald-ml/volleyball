var registeredSteps = new Array();

function step(number) {
	this.number = number;
}
/**
 * Generic wizard step progression.
 * @param stepNumber - step that is complete.
 * @param resultsFunction - how to fill in the results block.
 */
function stepIsComplete(stepNumber, resultsFunction, focusField) {
	var nextStep = stepNumber + 1;
	$("#step" + stepNumber + "stuff").hide();
	$("#step" + stepNumber + "stuffResult").empty();
	resultsFunction();
	$("#step" + stepNumber).addClass("complete");			
	$("#step" + stepNumber + "stuffResult").show();
	if ($("#step" + nextStep).hasClass("notyet")) {
		$("#step" + nextStep).removeClass("notyet");
		$("#step" + nextStep + "stuff").show();
	}
	
	if (focusField !== undefined) {
		$(focusField).focus();
	}
}

function resetForm(stepNumber) {
	for (var i=0; i < registeredSteps.length; i++) {
		if (registeredSteps[i].number > stepNumber) {
			backToStep(registeredSteps[i].number);
		}
	}
	
	$.event.trigger("wizard.resetForm");
}

/**
 * Backs the wizard up one spot.
 */
function backToStep(stepNumber) {
	$("#step" + stepNumber + "stuffResult").hide();
	$("#step" + stepNumber + "stuff").show();
	$("#step" + stepNumber).removeClass("complete");
}

/**
 * Builds a result div.
 * @param labelText - text that summarizes the step.
 * @param buttonText - text that talks about changing the value.
 * @param stepNumber - the number of the step that this summarizes.
 */
function createResults(labelText, buttonText, stepNumber) {
	var p = $("<p>").append(labelText);
	if (buttonText != null) {
		p.append($("<input>").attr({
			"id":"goBackToStep" + stepNumber,
			"type":"button",
			"value":buttonText,
			"class":"leftMargin"
			})
		);
	}
	$("#step" + stepNumber + "stuffResult").append(p);
	
	if (buttonText != null) {
		$("#goBackToStep" + stepNumber).bind("click", function() {
			backToStep(stepNumber);
			resetForm(stepNumber);
		});
	}
}

function registerStepComplete(stepNumber, stepFunction) {
    $("#step" + stepNumber + "IsComplete").click(stepFunction);
    $("#step" + stepNumber + "stuff input").keydown(function (evt) {
	    if (evt.which == 13) {
            evt.preventDefault();
	        evt.stopPropagation();	       
	        $("#step" + stepNumber + "IsComplete").click();
	    }
	});
    registeredSteps.push(new step(stepNumber));
}

/******************

	Builders

*******************/

function makeAHiddenInput(name, value) {
	return makeAnInput(name, value, "hidden");
}
function makeAHiddenInputWithClass(name, value, className) {
	return makeAnInput(name, value, "hidden", className);
}
function makeATextInput(name, value, className) {
	return makeAnInput(name, value, "text", className);
}
function makeAnInput(name, value, type, className) {
	if (className == undefined)
		className = "";
	return  $("<input>").attr({
		type: type,
		name: name,
		value: value,
		class: className});
}
