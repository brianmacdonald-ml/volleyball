
/*********
 * Some initializations:
 */
var existingPlayers = new Array();
var newPlayers = new Array();

var playerCounter = 0;
var rowCounter = 0;

var noPlayersYet = null;


/*********
 * Player class
 * @param first
 * @param last
 * @param id
 * @return player object
 */
function player(first, last, id, shortcut, number) {
	this.firstName = first;
	this.lastName = last;
	this.id = id;
	this.shortcut = shortcut;
	this.number = number;
}






/**********************
 * Create new player stuff
 * 
 */

var createDialog = null;

function showCreateDialog() {
	if (createDialog == null) {
		createDialog = $("#createNewPlayerDialog").dialog({ closeText: '',
															modal: 'true',
															width: 'auto',
										 					buttons: { "Create this player": function() { createNewPlayer(this); },
																	   "Cancel": function() { $(this).dialog("close"); } }});
		setupEnterKeyBinding();
	} else {
		$("#firstName").val("");
		$("#lastName").val("");
		createDialog.dialog("open");
	}
	$("#firstName").focus();
}

function createNewPlayer(thisDialog) {
	if (!validateNotEmpty("firstName","This field is required. Please enter a first name.")) return;
	$(thisDialog).dialog("close");
	var newPlayer = new player($("#firstName").val(), $("#lastName").val());
	
	cloneNewPlayersIfNecessary();
	
	appendPlayerToList(newPlayer);
}

function setupEnterKeyBinding() {
	$('#lastName').keyup(function(e) {
		if(e.keyCode == 13) {
			createNewPlayer(createDialog);
		}
	});
}

function removeNewPlayer(id) {
	var foundElementNum = findNewPlayer(id);
	
	if (foundElementNum != null) {
		newPlayers.splice(foundElementNum, 1);
	}	
}

function findNewPlayer(id) {
	var foundElementNum = null;
	for (var i = 0; i < newPlayers.length; i++) {
		if (newPlayers[i].firstName == firstName && newPlayers[i].lastName == lastName) {
			foundElementNum = i;
			break;
		}
	}
	return foundElementNum;
}





/**********************
 * Add existing player stuff
 * 
 */

var editDialog = null;

function showEditDialog(caller) {
	var edit_row = caller.parent().parent();
	$("#editPlayerDialog #firstName").val(edit_row.find(".first").text());
	$("#editPlayerDialog #lastName").val(edit_row.find(".last").text());
	editDialog = $("#editPlayerDialog").dialog({ closeText: '',
												   modal: 'true',
												   height: '310',
												   width: '450',
				  								   buttons: { "Save Changes": function() { editPlayer(this, edit_row); },
					   										  "Cancel": function() { $(this).dialog("close"); } }});
	$('#firstName,#lastName').keyup(function(e) {
		if(e.keyCode == 13) {
			$('.ui-dialog-buttonpane button:first').click();
		}
	});
}

function editPlayer(thisDialog, row) {
	$(thisDialog).dialog("close");
	row.find('.first').text($(thisDialog).find('#firstName').val());
	row.find('.last').text($(thisDialog).find('#lastName').val());
	var found = false;
	
	// Check existing players
	for (var i = 0; i < existingPlayers.length; i++) {
		if ("existing:" + existingPlayers[i].id == row.find('#id').val()) {
			existingPlayers[i].firstName = $(thisDialog).find('#firstName').val();
			existingPlayers[i].lastName = $(thisDialog).find('#lastName').val();
			found = true;
		}
	}
	
	// Check new players
	if (!found) {
		for (var i = 0; i < newPlayers.length; i++) {
			if ("new:" + newPlayers[i].temp_id == row.find("#id").val()) {
				newPlayers[i].firstName = $(thisDialog).find("#firstName").val();
				newPlayers[i].lastName = $(thisDialog).find("#lastName").val();
			}
		}
	}
}

function addSelectedPlayers(parent) {
	var existing = false;
	parent.find("input[type=radio]:checked").each(function(index) {
		// This was a pre-existing player in the list
		existing = true;
		var oldPlayer = new player(
				$(this).attr("firstname"),
				$(this).attr("lastname"),
				$(this).attr("playerid"));
		
		addPlayerToTeam(oldPlayer, true);
	});
	
	if (!existing) {
		// This was a new player - split the name on a space to guess first and last
		var name = parent.find("input.acInput").val();
		if (name == "") {
			ac.blankError();
		} else {
			var nameParts = name.split(" ");
			addPlayerToTeam(new player(nameParts[0], nameParts[1]), false);
		}
	}
	
	parent.find('.acInput').val("").trigger({ type : "keyup", which : 8 });
}

/*
 * Do the work to move a player from left list to right list in the DOM
 */
function addPlayerToTeam(player, from_list) {
	cloneNewPlayersIfNecessary();
	appendPlayerToList(player);
	if (from_list) {
		$(".playersToAdd tr#ac_row_" + player.id).remove();
	}
}

/*
 * Add existing shortcuts and numbers from previous season players 
 */
function populateShortcutsAndNumbers() {
	for (var i in existingPlayers) {
		if (existingPlayers[i].shortcut != null && $.trim(existingPlayers[i].shortcut) != "") {
			$('#short'+i).val(existingPlayers[i].shortcut);
		}
		if (existingPlayers[i].number != null && $.trim(existingPlayers[i].number) != "") { 
			$('#number'+i).val(existingPlayers[i].number);
		}
	}
}

function removeExistingPlayer(id) {
	var foundElementNum = findExistingPlayer(id);
	
	if (foundElementNum != null) {
		existingPlayers.splice(foundElementNum, 1);
	}
}

function findExistingPlayer(id) {
	var foundElementNum = null;
	
	for (var i = 0; i < existingPlayers.length; i++) {
		if (existingPlayers[i].id == id) {
			foundElementNum = i;
			break;
		}
	}
	return foundElementNum;
}





/**********
 * Generally good stuff:
 */

function appendPlayerToList(newPlayer) {
	var identity = null;
	if (newPlayer.id != null) {
		if (newPlayer.id.toString().indexOf("new:") != -1) {
			// This person is technically new, we've just added them once already
			newPlayer.temp_id = newPlayer.id.replace("new:", "");
			newPlayers.push(newPlayer);
			identity = newPlayer.id;
		} else {
			existingPlayers.push(newPlayer);
			identity = "existing:" + newPlayer.id;
		}
	} else {
		newPlayer.temp_id = rowCounter;
		identity = "new:" + rowCounter;
		newPlayers.push(newPlayer);
	}
	rowCounter++;
	playerCounter++;

	var playerRow = createPlayerRow(identity, newPlayer);
	$("#mainTable").append(playerRow);
}

function deletePlayerRow(rowId) {	
	identity = $("#" + rowId).attr("name");
	
	if (identity.indexOf("existing:") != -1) {
		identity = identity.replace("existing:", "");
		removeExistingPlayer(identity);
	} else {
		identity = identity.replace("new:", "");
		removeNewPlayer(identity);
	}
	
	addToAvailablePlayers($("#" + rowId));
	
	if ($('.playersToDelete').length != 0) {
		// This is the edit team configuration page - we must maintain some hidden fields to ensure the player is removed from the team
		var id = $("#" + rowId).find('.id').val();
		$("#" + rowId).find(".id").clone().attr('id', id).appendTo('.playersToDelete');
		$("#" + rowId).find(".selected").clone().attr('id', 's'+id).val('false').appendTo('.playersToDelete');
	}
	
	$("#" + rowId).remove();
	playerCounter--;
	if (playerCounter == 0 && noPlayersYet != null) {
		$("#mainTable").append(noPlayersYet);
	}
	
}

function addToAvailablePlayers(row) {
	var id = row.attr("name").replace("existing:", "");
	if(row.find('.first').get(0).tagName == "INPUT") {
		var first = row.find('.first').val();
		var last = row.find('.last').val();
	} else {
		var first = row.find('.first').text();
		var last = row.find('.last').text();
	}
	var player = { id : id, firstName : first, lastName : last, name : first + " " + last };
	ac.addData(player);
	
	addInAlphaOrder(player);
}

function addInAlphaOrder(player) {
	var insertedPlayer = $('#playerToAddTemplate').tmpl(player);
	var done = false;
	$('.playersToAdd tr td').each(function() {
		if (done) { return; }
		var compareName = $(this).find("input").attr('lastname') + " " + $(this).find("input").attr('firstname');
		if ($.trim(player.lastName + " " + player.firstName) < $.trim(compareName)) {
			insertedPlayer.insertBefore($(this).parent());
			done = true;
		}
	});
	
	if (!done) {
		insertedPlayer.appendTo("#ac_select table");
	}
}

/********************
 *  Validation:
 */
function inputsForPlayersAreValid() {
	
	$("#numberAndShortcutError").empty();
	
	var shortcuts = new Array();
	var noneAreEmpty = true;
	var noneAreFormattedWrong = true;
	
	// Verify shortcut is alpha's.
	$("input.shortcut").each(function(index,element){
		if ($(element).val() == "") {
			// As of release 17, this is ok - do nothing with blanks 
		} else if (!/^[a-zA-Z]+$/.test($(element).val())) {
			noneAreFormattedWrong = false;
			buildPromptAndBinding($(element).attr("id"), "Shortcut can only be letters.");
		} else {
			shortcuts.push($(element).val());
		}
	});
	
	if (!noneAreEmpty || !noneAreFormattedWrong) {
		return false;
	}
	
	var numbers = new Array();
	
	// Verify shortcut is filled in and alpha's.
	$("input.number").each(function(index,element){
		if ($(element).val() == "") {
			noneAreEmpty = false;
			buildPromptAndBinding($(element).attr("id"), "This is a required field.");
		} else if (!/^[0-9]+$/.test($(element).val())) {
			noneAreFormattedWrong = false;
			buildPromptAndBinding($(element).attr("id"), "Numbers can only be digits.");
		} else {
			numbers.push($(element).val());
		}
	});
	
	if (!noneAreEmpty || !noneAreFormattedWrong) {
		return false;
	}
	
	
	// Make sure the shortcuts are unique
	var noDuplicates = unique(shortcuts);
	
	if (noDuplicates != "") {
		$("input.shortcut").each(function(index,element){
			if ($(element).val() == noDuplicates) {
				buildPromptAndBinding($(element).attr("id"), "Shortcuts must be unique."); 
			} else {
				$.validationEngine.closePrompt("#" + $(element).attr("id"));
			}
		});
		return false;
	} else {
		$("input.shortcut").each(function(index,element){
			$.validationEngine.closePrompt("#" + $(element).attr("id"));
		});
	}
	
	// Make sure the numbers are unique
	noDuplicates = unique(numbers);
	
	if (noDuplicates != "") {
		$("input.number").each(function(index,element){
			if ($(element).val() == noDuplicates) {
				buildPromptAndBinding($(element).attr("id"), "Numbers must be unique."); 
			} else {
				$.validationEngine.closePrompt("#" + $(element).attr("id"));
			}
		});
		return false;
	} else {
		$("input.number").each(function(index,element){
			$.validationEngine.closePrompt("#" + $(element).attr("id"));
		});
	}
	
	return true;
}





