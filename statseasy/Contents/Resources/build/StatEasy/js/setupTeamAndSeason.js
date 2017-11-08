var seasonsForThisTeam = null;
var newTeam = false;

//Returns the selected team name
function whatsTheTeamName() {
	if ($("#oldTeamRadio").attr("checked")) {
		return $('#oldTeamInput :selected').text()
	} else {
		newTeam = true;
		return $("#newTeamInput").val();
	}
}

function backToStepOne() {
	$("#step1stuffResult").hide();
	$("#step1stuff").show();
	$("#step1").removeClass("complete");
}

function backToStepTwo() {
	$("#step2stuffResult").hide();
	$("#step2stuff").show();
	$("#step2").removeClass("complete");
}

function gotSeasonsResponse(seasons) {
	seasonsForThisTeam = seasons;
}

/*************
	EVENTS
**************/


function createPlayerRow(identity, newPlayer) {
	return $('#addedPlayerTemplate').tmpl({ id : identity, row_id : "playerRow" + rowCounter, name : identity, lastName : newPlayer.lastName, firstName : newPlayer.firstName });
}

function removeExistingPlayer(id) {
	var foundElementNum = null;
	for (var i = 0; i < existingPlayers.length; i++) {
		if (existingPlayers[i].id == id) {
			foundElementNum = i;
			break;
		}
	}
	if (foundElementNum != null) {
		existingPlayers.splice(foundElementNum, 1);
	}
}

function removeNewPlayer(id) {
	var foundElementNum = null;
	for (var i = 0; i < newPlayers.length; i++) {
		if (newPlayers[i].temp_id == id) {
			foundElementNum = i;
			break;
		}
	}
	if (foundElementNum != null) {
		newPlayers.splice(foundElementNum, 1);
	}	
}

function cloneNewPlayersIfNecessary() {
	if ($("#noPlayersYet").size() > 0) {
		noPlayersYet = $("#noPlayersYet").clone();
	}
	$("#noPlayersYet").remove();
}

/**
 * Occurs after step 3. Populates the shortcut/number table.
 */
function addPlayersToTable() {
	if (existingPlayers.length != 0 || newPlayers.length !=0) {
		$("#noplayersText").hide();
		$("#inputTable").show();
		// Clear players already in the table
		var firstChild = $("#inputTable").children().first().children().first();
		$("#inputTable").empty();
		
		$("#inputTable").append(firstChild);
		
		// Add existing players to input table
		for (var i = 0; i < existingPlayers.length; i++) {
			$("#inputTable").append(buildPlayerRow(existingPlayers[i], i, "existingPlayers"));
		}
		
		// Add new players to input table
		for (var i =0; i < newPlayers.length; i++) {
			$("#inputTable").append(buildPlayerRow(newPlayers[i], i, "newPlayers"));
		}	

	} else {
		$("#noplayersText").show();
		$("#inputTable").hide();
	}

}

function applyFinalPlayers() {
	// Add existing players to form
	for (var i = 0; i < existingPlayers.length; i++) {
		$("#teamAndSeasonForm").append(makeAHiddenInput("existingPlayerIds[" + i + "]", existingPlayers[i].id));
		$("#teamAndSeasonForm").append(makeAHiddenInput("existingPlayers[" + i + "].player.id", existingPlayers[i].id));
		$("#teamAndSeasonForm").append(makeAHiddenInput("existingPlayers[" + i + "].player.firstName", existingPlayers[i].firstName));
		$("#teamAndSeasonForm").append(makeAHiddenInput("existingPlayers[" + i + "].player.lastName", existingPlayers[i].lastName));
	}
	$("#teamAndSeasonForm").append(makeAHiddenInput("oldPlayerCount", existingPlayers.length));
	
	// Add new players to form
	for (var i =0; i < newPlayers.length; i++) {
		$("#teamAndSeasonForm").append(makeAHiddenInput("newPlayers[" + i + "].player.firstName", newPlayers[i].firstName));
		$("#teamAndSeasonForm").append(makeAHiddenInput("newPlayers[" + i + "].player.lastName", newPlayers[i].lastName));
	}	
	$("#teamAndSeasonForm").append(makeAHiddenInput("newPlayerCount", newPlayers.length));
}

function populateWithExistingSeason(existingSeason) {
	$("#headCoach").val(existingSeason.headCoach);
	$("#assistantCoach").val(existingSeason.assistantCoach);
	$("#mainTable tr").not(".dontremove").each(function() {
		deletePlayerRow($(this).attr("id").substring(0));
	});
	for (var i in existingSeason.allPlayers) {
		addPlayerToTeam(existingSeason.allPlayers[i], true);
	}
}

function shortcutGen(firstName, lastName, option) {
	var numFromFirst = 0;
	var numFromLast = 0;
	
	// Only consider non-apostrophe characters when creating shortcuts
	firstName = firstName.replace(/'/g, '');
	lastName = lastName.replace(/'/g, '');
	
	switch (option) {
		case 0:
			numFromFirst = 1;
			numFromLast = 1;
			break;
		case 1:
			numFromFirst = 0;
			numFromLast = 2;
			break;
		case 2:
			numFromFirst = 2;
			numFromLast = 0;
			break;
		case 3:
			numFromFirst = 1;
			numFromLast = 2;
			break;
		case 4:
			numFromFirst = 2;
			numFromLast = 1;
			break;
		case 5:
			numFromFirst = 2;
			numFromLast = 2;
			break;
	}
	
	var shortcut = firstName.substr(0, numFromFirst) + lastName.substr(0, numFromLast);
	return shortcut.toLowerCase();
}

function getShortcutFor(firstName, lastName, allShortcuts) {
	var shortcut;
	var option = 0;
	
	do {
		shortcut = shortcutGen(firstName, lastName, option);
		option++;
	} while ((shortcut != "") && (allShortcuts[shortcut]));
	
	return shortcut;
}

/**
 * Builder for the shortcut/number table.
 * @param thisPlayer - player
 * @param num - number of players (0 based)
 * @param type - new or existing
 * @return table row with formatted data
 */
function buildPlayerRow(thisPlayer, num, type) {
	var shortcuts = {};
	$(".shortcut").each(function () {
		shortcuts[$(this).val()] = true;
	});
	
	var shortcut = getShortcutFor(thisPlayer.firstName, thisPlayer.lastName, shortcuts);
	
	return $("<tr>").append($("<td>").append(thisPlayer.firstName + " " +  thisPlayer.lastName))
					.append($("<td>").append(makeATextInput(type + "[" + num + "].shortcut", shortcut, "shortcut").attr("id","short" + num)))
					.append($("<td>").append(makeATextInput(type + "[" + num + "].number", "", "number").attr("id","number" + num)));
}

function getTeamById(id) {
	for (var i in teams) {
		if (id == teams[i].id) {
			return teams[i];
		}
	}
}

$(document).ready(function () {
    registerStepComplete(1, function() {
    	// Check to see if inputs are valid. If not, return and skip the rest of the stuff in this method.
		if (!inputsForTeamAreValid()) return;
		stepIsComplete(1, step1ResultsSetup, "#seasonName");				
		$("#hiddenTeamName").remove();
		$("#step1stuff").append($("<input>").attr("type","hidden").attr("id","hiddenTeamName").attr("name","teamName").attr("value",whatsTheTeamName()));
	});
	
	registerStepComplete(2, function() {
		// Check to see if inputs are valid. If not, return and skip the rest of the stuff in this method.
		if (!inputsForSeasonAreValid()) return;			
        stepIsComplete(2, step2ResultsSetup, "#playerToAdd");
		if (newTeam || seasonsForThisTeam == null || seasonsForThisTeam.length == 0) {
			$("#previousSeason").hide();
		} else {
			for (var i = 0; i < seasonsForThisTeam.length; i++) {
				$("#previousSeasons").append($("<option>").attr("value",seasonsForThisTeam[i].id).append(seasonsForThisTeam[i].name));
			}
			// remove when you implement previous season stuff
			$("#previousSeason").hide();
		}
	});	
	
	registerStepComplete(3, function() {
		stepIsComplete(3, step3ResultsSetup);
		addPlayersToTable();
		populateShortcutsAndNumbers();
		
		// Bind code to resulting 'back' button
		$("#goBackToStep3").bind("click", function() {
			backToStep(3);
			$("#step4stuff").hide();
			$("#step4").addClass("notyet");
		});
	});
	
	$("#addPlayer").bind("click", function() {
		addSelectedPlayers($(".playersToAdd"));
	});
	
	$("#playerToAdd").unbind("keydown").bind("keydown", function(evt) {
		if (evt.which == 13) {
            evt.preventDefault();
	        evt.stopPropagation();	       
	        $("#addPlayer").click();
	    }
	});
	
	$("#editPlayer").live("click", function() {
		showEditDialog($(this));
	});
	
    $("#newTeamInput").bind("click", function() {
            $("#newTeamRadio").attr("checked","checked");
    });
    
    $("#oldTeamInput").bind("click", function() {
    	$("#oldTeamRadio").attr("checked","checked");
    }).bind("change", function() {
    	
    	if ($(this).val() != "default") {
    		// An existing team was selected
    		$(".existingSeasonRow").show();
    		var selected_team = getTeamById($(this).val());
    		
    		// Clear out existing options in previousSeasons menu and add new ones based on team 
    		$("#existingSeason option").remove();
    		selected_team.allSeasons.splice(0, 0, { name : "-- Create new season --" });  // Add default option for not using existing season
    		for (var s in selected_team.allSeasons) {
    			$("#existingSeason").append("<option value='" + s + "'>" + selected_team.allSeasons[s].name + "</option>");
    		}
    	} else {
    		// New team is being created - hide the existing season control
    		$(".existingSeasonRow").hide();
    	}
    });
    
    $(".rowContainer").live("mouseover", function() {
    	if ($(this).find('.addText').length == 0) {
    		$(this).append("<div class='addText'>add ></div>");
    	}
    }).live("mouseleave", function() {
    	$(this).find('.addText').remove();
    });
    
    $("#existingSeason").bind("change", function() {
    	var selected_team = getTeamById($("#oldTeamInput").val());
    	var selected_season = selected_team.allSeasons[$(this).val()];
    	populateWithExistingSeason(selected_season);
    })
    
    $("#step4IsComplete").bind("click", function() {
    	if (!inputsForPlayersAreValid()) return;
    	applyFinalPlayers();
    	$("#teamAndSeasonForm").submit();
    });

});

/******************
VALIDATION
******************/
function inputsForTeamAreValid() {
	
	//Make sure the team name isn't "Select a team"
	if (whatsTheTeamName() == "-- Select a team --") {
		//Add new message for the existing team name
		$.validationEngine.buildPrompt("#oldTeamInput","This field is required. Please select a team.","error");
		$("#oldTeamInput").bind("blur", function() {
			$.validationEngine.closePrompt("#oldTeamInput");
		});
		return false;
	}
	
	//Make sure the team name isn't empty
	if (whatsTheTeamName() == "") {
		//Add new message for the new team name
		$.validationEngine.buildPrompt("#newTeamInput","This field is required. Please enter a team name.","error");
		$("#newTeamInput").bind("blur", function() {
			$.validationEngine.closePrompt("#newTeamInput");
		});
		return false;
	}
	
	return true;
}

function inputsForSeasonAreValid() {
	return validateNotEmpty("seasonName", "This field is required. Please enter a season name.");
}

/*************
 * Step transitions
 ****************/

function step1ResultsSetup() {
	createResults("You've selected: " + whatsTheTeamName(), "I want to change this team", 1);
}
function step2ResultsSetup() {
	createResults("You've created: " + $("#seasonName").val(), "I want to change this season", 2);
}
function step3ResultsSetup() {
	createResults("", "I want to change the player list", 3, "hideStep4");
}