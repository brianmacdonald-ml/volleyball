
$.extend({
	getUrlVars: function() {
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++) {
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	},
	getUrlVar: function(name){
		return $.getUrlVars()[name];
	}
});

var selectedSeriesId = undefined;
var selectedEventId = undefined;

function backToStepOne() {
	selectedSeriesId = undefined;
	selectedEventId = undefined;
	
	$("#selectedEventId").remove();
	
	$("#step1stuffResult").hide();
	$("#step1stuff").show();
	$("#step1").removeClass("complete");
	$("#step2stuff").hide();
	$("#step2").addClass("notyet");
}

function getSeriesFromGroupingType(someTypeId) {
	for (var seriesId in eventSerieses) {
		for (var typeId in eventSerieses[seriesId].series) {
			if (someTypeId == eventSerieses[seriesId].series[typeId].id) {
				return seriesId;
			}
		}
	}
}

function showEventSelectDialog(jsEvent) {
	jsEvent.preventDefault();
	jsEvent.stopPropagation();
	
	if (showEventSelectDialog.eventDialog == undefined) {
		showEventSelectDialog.eventDialog = $("#selectEvent").dialog({ 
			closeText: '',
			modal: 'true',
		    height: '500',
		    width: '700',
			buttons: { 
				"Use this event": function() { 
					var selectedValue = $("#selectEvent input:checked").val();
					if (selectedValue != undefined) {
						var eventGrouping = eventGroupings[selectedValue];
						selectedEventId = eventGrouping.id;
						selectedSeriesId = getSeriesFromGroupingType(eventGrouping.myType);
						
						$(this).dialog("close");
						
						advanceToStep2();
					}
				},
				"Cancel": function() { $(this).dialog("close"); } 
			}
		});
	} else {
		showEventSelectDialog.eventDialog.dialog("open");
	}
	
}

function advanceToStep2() {
	var resultString;
	var buttonString = "I want to change this";

	$("#step2DynamicStuff").empty().append($("#infoFor" + selectedSeriesId).clone());
	$("#infoFor" + selectedSeriesId).show();
	
	if (selectedEventId == undefined) {
		var actionName = eventSerieses[selectedSeriesId].series[0].name;
		resultString = "You've chosen to create a new '" + actionName + "'.";
	} else {
		var index;
		for (var eventTypeIndex in eventSerieses[selectedSeriesId].series) {
			if (eventSerieses[selectedSeriesId].series[eventTypeIndex].id == eventGroupings[selectedEventId].myType) {
				index = Number(eventTypeIndex);
			}
		}
		var objectName = eventSerieses[selectedSeriesId].series[index + 1].name;
		var actionName = eventGroupings[selectedEventId].name;
		
		resultString = "You've chosen to create a new '" + objectName + "' and add it onto '" + actionName + "'.";
		
		for (var i = 0; i <= index; i++) {
			$("#step2DynamicStuff .eventIndex" + i).remove();
		}
		
		$("#eventForm").append("<input type='hidden' name='selectedEventId' value='" + selectedEventId + "' id='selectedEventId'/>");
	}
	
	connectGroupingFields("#infoFor" + selectedSeriesId);
	
	$("#step1stuff").hide();
	$("#step1stuffResult").empty();	
	var newButton = $("<input id='goBackToStep1' type='button' class='leftMargin'>").attr("value",buttonString);
	newButton.click(backToStepOne);
	$("#step1stuffResult").append($("<p>").append(resultString))
						  .append(newButton);
	$("#step1").addClass("complete");
	$("#step1stuffResult").show();
	if ($("#step2").hasClass("notyet")) {
		$("#step2").removeClass("notyet");
		$("#step2stuff").show();
	}
	
	$("#step2DynamicStuff input").get(1).focus();
}

function changeTheDate() {
	alert("This will change the date.");
}
function changeTheDateTime() {
	alert("This will change the date time.");
}
function changeTheTime() {
	alert("This will change the time.");
}

/********************
 * Validation
 ******************/
function inputsForMatchAreValid() {
	return validateNotEmpty("location_entry", "This field is required. Please enter a match location.")
		&& validateNotEmpty("opponent_entry", "This field is required. Please enter a match opponent.");
}

function addClosePrompt(element_id) {
	alert("#" + element_id);
	$.validationEngine.closePrompt("#" + element_id);
}

$(document).ready(function () {
	
	$("#chooseExistingEventGrouping").click(showEventSelectDialog);
	$("#existingEventRadio").click(showEventSelectDialog);
	
	$("#actionIsChosen").bind("click", function() {
		selectedSeriesId = getSeriesFromGroupingType(Number($("#actionInput").val()));
		electedEventId = undefined;
		
		advanceToStep2();
	});
	
	var eventGroupingId = $.getUrlVar("eventGroupingId");
	if (eventGroupingId != undefined) {
		var eventGrouping = eventGroupings[eventGroupingId];
		selectedEventId = eventGrouping.id;
		selectedSeriesId = getSeriesFromGroupingType(eventGrouping.myType);
		advanceToStep2();
	}
	var seriesId = $.getUrlVar("seriesId");
	if (seriesId != undefined) {
		selectedSeriesId = Number(seriesId);
		advanceToStep2();
	}
	
	connectFormSubmission("#eventForm");
	
	new SeasonDisplay("#selectEvent", eventGroupings, {radioButtonMode: true});
	
	
	// Error display
	if (errors.length > 0) {
		advanceToStep2();
	}
	for (var i=0; i < errors.length; i++) {
		if (errors[i].name != "None") {
			element_id = $("input[name*='" + errors[i].name + "']").attr("id");
			
			$.validationEngine.buildPrompt("#" + element_id ,errors[i].description,"error");
			$("#" + element_id).addClass("validationError");
		    $("#" + element_id).bind("blur", function(someobj) {
		    	$.validationEngine.closePrompt("#" + someobj.currentTarget.id);
		    });
		    $("#goBackToStep1").click(function() {
		    	$.each($(".validationError"), function(index, obj) {
		    		$.validationEngine.closePrompt("#" + $(obj).attr("id"));
		    	});
		    	
		    });
		}
	}
});