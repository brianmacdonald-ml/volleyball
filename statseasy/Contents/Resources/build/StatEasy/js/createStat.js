
// Used to display step two if the user goes back to step one and unchecks doubletap.
var doubleTapWasSet = false;

$(document).ready(function () {
	registerStepComplete(1, function() {
		// Check to see if inputs are valid. If not, return and skip the rest of the stuff in this method.
		if (!inputsForStatsAreValid()) return;
		stepIsComplete(1, step1ResultsSetup);
		
		if ($("#doubleTap").prop("checked")) {
			//double tap was checked, auto complete step two
			stepIsComplete(2, step2ResultsSetupWithDoubleTap);
			doubleTapWasSet = true;
		}
		else if (doubleTapWasSet) {
			//if double tap was set (unchecked now), show step 2
			backToStep(2);
			doubleTapWasSet = false;
		}
	});
	registerStepComplete(2, function() {
		if (!informationForStatIsValid()) return;
		stepIsComplete(2, step2ResultsSetup);
	});
    registerStepComplete(3, function() {
    	if (!informationForStatIsValid()) return;
		if ($("#actionEndingSelection").val() == "Yes") {
			$("#actionEndingStat").val("true");
		} else {
			$("#actionEndingStat").val("false");
		}
		
		// FOR NOW, DO THIS TO MAKE SURE WE GOT THE EDIT CHANGES
		step2ResultsSetup(true);
		
		//Remove (space) before submitting
		unmaskWhiteSpace();
		
		$("#createStatForm").submit();
	});
	$("#statEffect").bind("change", function() {
		if ($("#statEffect").val() == "other") {
			$("#uploadLocator").show();
			$("#editIndicator").val(1);
		} else {
		}
	});
	
	
	//Used to keep step two complete if the user clicks the button to change stuff
	//in step one.  Without this, step two would "uncomplete" and be available
	//to the user.

	$(document).bind("wizard.resetForm", function() {
		if ($("#doubleTap").prop("checked")) {
			stepIsComplete(2, step2ResultsSetupWithDoubleTap);
		}
	});	
	
	//To mask/unmask #shortcut when the user leaves/enters the text
	$("#shortcut").focusin(unmaskWhiteSpace);
	$("#shortcut").focusout(maskWhiteSpace);
	
	//Masks/unmasks #shortcut when the changes double tap
	$("#doubleTap").click(handleDoubleTapClick);
	
	$("#advancedStat").click(setStep2AsAdvanced);
	
	// Setup the bindings for the player and data point elements
	$("#numOfPlayers").bind("keyup", updateElements);
	$("#amountOfData").bind("keyup", updateElements);
	if (PARSE_INFORMATION != null) {
		setupStatSentence(PARSE_INFORMATION, ADVANCED_PARSE);
	}
	
	if( $("#actionEndingStat").val() == "true" ) {
		$("#actionEndingSelection").val("Yes");
	} else {
		$("#actionEndingSelection").val("No");
	}
	
	$("#colorPickerHolder").ColorPicker({
		flat: true,
		color: $("#color").val(),
		onChange: function(hsb, hex, rgb) {
			$("#color").val("#" + hex);
		},
	});
	
	$("#isLocationAware").click(updateLocationDisplay);
	$(".locationAware input").blur(updateLocationDisplay);
	updateLocationDisplay();
	
	//Setup for double if the page is loaded with double tap checked (editing)
	if ($("#doubleTap").prop("checked")) {
		doubleTapChecked();
	}
});

function updateLocationDisplay() {
	var locationAware = $("#isLocationAware").attr("checked");
	var pointCount = $("#pointCount").val();
	var isLine = pointCount != 1;
	
	if (locationAware) {
		$(".locationAware").show();
		
		if (pointCount && isLine) {
			$(".isLine").show();
			$(".isPoint").hide();
		} else if (pointCount) {
			$(".isLine").hide();
			$(".isPoint").show();
		} else {
			$(".isLine").hide();
			$(".isPoint").hide();
		}
	} else {
		$(".locationAware").hide();
	}
}

/*************
 * VALIDATION
 */
function inputsForStatsAreValid() {
	
	return validateNotEmpty("name", "This field is required. Please enter a name.")
			&& validateNotEmpty("shortcut", "This field is required. Please enter a shortcut.")
			&& validateNoSpaces("shortcut", "The shortcut cannot contain spaces.")
			&& validateIfDoubleTap()
			&& informationForStatIsValid();

}

function validateIfDoubleTap() {

	var shortcutValid = true;
	
	if ($("#doubleTap").prop("checked")) {
		
		//The word <space> is suppose to represent an invisible white space but will fail this validation
		//this is a little hack.
		if ($("#shortcut").val() !== "(space)") {
			return validateMaxLength("shortcut", 1, "The shortcut cannot be more than one character with double tap checked")
		}
	}
	
	return true;
	
}

function isNumPlayersValidForDoubleTap() {
	if ($("#doubleTap").prop("checked")) {
		
		var numOfPlayersEmpty = true;
		
		if (!!$("#numOfPlayers").val()) {
			return numOfPlayersEmpty = validateIsEmpty("numOfPlayers", "Field must be empty with double tap. Number of players is not valid when double tap is checked");
		}		       
	}
	
	return true;	
}

function isAmoutOfDataValidForDoubleTap() {
	if ($("#doubleTap").prop("checked")) {
		
		var amountOfDataEmpty = true;
		
		if (!!$("#amountOfData").val()) {
			return amountOfDataEmpty = validateIsEmpty("amountOfData", "Field must be empty with double tap. Number of additional factors is not valid when double tap is checked");
		}		       
	}
	
	return true;	
}

function informationForStatIsValid() {

	if ($("#doubleTap").prop("checked")) {
		return isNumPlayersValidForDoubleTap() &&
			   isAmoutOfDataValidForDoubleTap()
	}
	
	return true;
	
}

/*************
 * Step transitions
 ****************/
function step1ResultsSetup() {
	createResults("Your stat name is: " + $('#name').val(), "I want to change the name/shortcut", 1);
}

function step2ResultsSetupWithDoubleTap() {
	createResults("Take stat <b>" + $("#name").val() + "</b> by double tapping: " + $("#shortcut").val(), null, 2);
}

var advancedStatSentence = false;
function step2ResultsSetup(updateInfoOnly) {
	var definition = " ";
	var parseInfo = "";
	if (!advancedStatSentence) {
		$.each($("#sortable span.middle"), function(counter, element) {
			definition += "(" + element.textContent + ") ";
			if (element.textContent == "Player") {
				parseInfo += "%p ";
			} else if (element.textContent == "Time") {
				parseInfo += "%t";
			} else {
				parseInfo += "%d ";
			}
		});
		if (!updateInfoOnly) {
			createResults("Take stat <b>" + $("#name").val() + "</b> like this: " + $("#shortcut").val() + definition, "I want to change this information", 2);
		}
	} else {
		parseInfo = $("#advancedSentence").val();
		if (!updateInfoOnly) {
			createResults("Take stat <b>" + $("#name").val() + "</b> like this: " + $("#shortcut").val() + " " + parseInfo, "I want to change this information", 2);
		}
	}
	// Sets the hidden input value for the parse information.
	$("#parseInformation").val(parseInfo);
}

/***************
 * Helper methods
 * ************/

function setStep2AsAdvanced() {
	advancedStatSentence = true;
	var enabled = "";
	if (inUse) {
		enabled = "disabled='disabled' ";
	}
	$("#step2contents").html("<div class='mediumIndent'><p style='font-weight:bold;text-decoration: underline;'>Stat Sentence:</p>" +
			"<input id='advancedSentence' type='text' size='50' " + enabled + "value=\"" + (PARSE_INFORMATION != null ? PARSE_INFORMATION : "") + "\"/>" +
			(PARSE_ERRORS != undefined && PARSE_ERRORS.length > 0 ? "<span id='advancedSentence.errors' class='formErrors'>" + PARSE_ERRORS + "</span>" : "") +
			"</br></br><span class='tinyHelpText'>Type your advanced stat sentence into the field above. What should you type? Here's all you need to know...</span>" +
			"</br></br><span class='tinyHelpText'>%p = a player on your team</span>" +
			"</br></br><span class='tinyHelpText'>%o = a player on the opponent's team</span>" +
			"</br></br><span class='tinyHelpText'>%t = a time value like 20:00.00</span>" +
			"</br></br><span class='tinyHelpText'>%d = a data point that includes all numbers</span>" +
			"</br></br><span class='tinyHelpText'>%d?[any letter(s),any letter(s),any letter(s),...] = a data point that includes a defined set of letters</span>" +
			"</br></br><span class='tinyHelpText'>%d?[any letter(s),any letter(s),...,*] = a data point that includes a defined set of letters and all numbers ('all numbers' is denoted by the asterisk at the end)</span>" +
			"</br></br><span class='tinyHelpText'>%d?[any number,any number,any number,...] = a data point that includes a defined set of numbers</span>" +
			"</br></br><span class='tinyHelpText'>%d?[any letter(s),any letter(s),any number, any number,...] = a data point that includes a defined set of letters and a defined set of numbers</span>" +
			"</br></br><span class='tinyHelpText'>Example:</span>" +
			"</br></br><span class='tinyHelpText'>Say you want to set up a football stat that captures a running play and includes the player on your team who ran the ball, the opponent player who tackled your player, the number of yards gained, and a play rating of exceptional (e), good (g), fair (f), or not so good (nsg). You would type the following for your stat sentence:</span>" +
			"</br></br><span class='tinyHelpText'>&nbsp;&nbsp;&nbsp;&nbsp;%p %o %d %d?[e,g,f,nsg]</span>" +
			"</br></br><span class='tinyHelpText'>If we assume that the stat shortcut is 'r' and that for a particular running play, the player on your team is #22, the opponent player is #58, the number of yards gained is 12, and the play was an exceptional play, you would type the following when taking stats to capture this play:</span>" +
			"</br></br><span class='tinyHelpText'>&nbsp;&nbsp;&nbsp;&nbsp;r 22 58 12 e</span>" +
			"</div>");
	if (PARSE_ERRORS.length > 0) {
		processFormErrors();
	}
	
	return false;
}

function updateElements() {
	addElementsToStatSentence($("#numOfPlayers").val(), $("#amountOfData").val());
}

function setupStatSentence(parseInfo, advanced) {
	
	if (advanced) {
		setStep2AsAdvanced();
		return;
	}
	
	var points = parseInfo.split(/\s/g);
	var players = 0;
	var data = 0;
	var time = 0;
	
	if (points.length > 0) {
		$("#sortable").empty();
	}
	
	for (point in points) {
		if (points[point] == "%p") {
			$("#sortable").append(buildResortableFactor("Player"));
			players++;
		} else if (points[point] == "%d") {
			$("#sortable").append(buildResortableFactor("Data Point"));
			data++;
		} else if (points[point] == "%t") {
			$("#sortable").append(buildResortableFactor("Time"));
			time++;
		}
	}
	$("#numOfPlayers").val(players);
	$("#amountOfData").val(data);
	$("#timeData").val(time);
	addOnClickEventToSortables();
}

/**
 * Adds elements to the re-order data section.
 * @return true if this step should be skipped.
 */
function addElementsToStatSentence(players, data_points) {
	if (areTheyBothEmpty(players, data_points)) {
		$("#sortable").empty().append("<i>No player or factor data necessary for this stat.</i>")
		return true;
	}
	
	players = parseInt(players);
	data_points = parseInt(data_points);
	
	$("#sortable").empty();
	for (var i=0; i < players; i++) {
		$("#sortable").append(buildResortableFactor("Player"));
	}
	for (var i=0; i < data_points; i++) {
		$("#sortable").append(buildResortableFactor("Data Point"));
	}
	addOnClickEventToSortables() ;
	return false;
}

/**
 * Called when a left or right arrow is hit.
 * @param event - the event passed by jquery
 * @param direction - which way to move the element
 */
function moveElement(event, direction) {
	var parent = $(event.currentTarget).parent();
	var moveMe = $(parent).clone();
	if (direction == "left") {
		var leftSibling = $(parent).prev();
		$(leftSibling).before(moveMe);
		addEventToElement($(moveMe).find("span.leftArrow"), "left");
		addEventToElement($(moveMe).find("span.rightArrow"), "right");
	} else {
		var rightSibling = $(parent).next();
		$(rightSibling).after(moveMe);
		addEventToElement($(moveMe).find("span.leftArrow"), "left");
		addEventToElement($(moveMe).find("span.rightArrow"), "right");
	}
	$(parent).remove();
}

/**
 * Helper method for adding event to arrow element. 
 * @param element
 * @param direction
 */
function addEventToElement(element, direction) {
	$(element).bind("click", function(event) {
			moveElement(event, direction);
	});
}


function addOnClickEventToSortables() {
	$.each($("#sortable span.ui-state-default span.leftArrow"), function(num, element){
		addEventToElement(element, "left");
	});
	$.each($("#sortable span.ui-state-default span.rightArrow"), function(num, element){
		addEventToElement(element, "right");
	});
}

/**
 * Helper that builds the stat sentence elements.
 * @param text - the text for the element.
 * @return HTML elements that wrap the text
 */
function buildResortableFactor(text) {
	if (inUse) {
		return $("<span>").addClass("ui-state-default")
			.append($("<span>").append(text).addClass("middle"));
	} else {
		return $("<span>").addClass("ui-state-default")
		.append($("<span>").append("<").addClass("leftArrow"))
		.append($("<span>").append(text).addClass("middle"))
		.append($("<span>").append(">").addClass("rightArrow"));
	}
}

function areTheyBothEmpty(x, y) {
	// Changed this back to an AND because I'm going to change the resort implementation a bit (and the sentence building)
	return ((x == 0 || x == "") && (y == 0 || y == ""));
}

function handleDoubleTapClick() {
	if ($("#doubleTap").prop("checked")) {
		doubleTapChecked();
	}
	else {
		doubleTapUnchecked();
	}
}

function maskWhiteSpace() {
	val = $("#shortcut").val()
	
	if (val === " ") {
		$("#shortcut").val("(space)");
	}	
}

function unmaskWhiteSpace() {
	val = $("#shortcut").val()
	
	if (val === "(space)") {
		$("#shortcut").val(" ");
	}
}

function doubleTapUnchecked() {
	unmaskWhiteSpace();
}

function doubleTapChecked() {
	maskWhiteSpace();
}
