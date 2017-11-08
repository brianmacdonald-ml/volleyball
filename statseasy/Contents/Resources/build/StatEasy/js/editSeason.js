// We don't need to do anything here.
function cloneNewPlayersIfNecessary() {
	// This is a no op
}

// This is our page specific player row drawer
function createPlayerRow(identity, newPlayer) {
	var name = newPlayer.firstName + " " + newPlayer.lastName;
	var shortcut = newPlayer.shortcut;
	var number = newPlayer.number;
	if (shortcut == undefined) shortcut = "";
	if (number == undefined) number = "";

	if ($('.playersToDelete #' + newPlayer.id).length > 0) {
		// This player was removed once, and is now being re-added. Use their old spot in the array or things 
		// blow up on the server.
		var index = parseInt($('.playersToDelete #' + newPlayer.id).attr('name').split(']')[0].substring(11));
		var useRowCount = index+1;
		
		// Decrease the row counter so the next new guy gets the correct spot
		rowCounter--;
	} else {
		var index = rowCounter - 1;
		var useRowCount = rowCounter;
	}
	var deleteRow = '<td><img src="/images/close.png" class="jQuery" onclick="javascript: deletePlayerRow(\'playerRow' + useRowCount + '\')" /></td>';
	var returnRow =  $("<tr>").attr({
						id: "playerRow" + useRowCount,
						name: identity
					 }).append("<td>" + name + "</td><td><input id=\"short" + index + "\" class=\"shortcut\" name=\"allPlayers[" + index + "].shortcut\" value=\"" + shortcut + "\" /></td><td><input id=\"number" + index + "\" class=\"number\" name=\"allPlayers[" + index + "].number\" value=\"" + number + "\" /></td>").append(deleteRow)
					   .append(makeAHiddenInputWithClass("allPlayers[" + index + "].selected", "true", "selected"));
	$(returnRow).append(makeAHiddenInputWithClass("allPlayers[" + index + "].player.firstName", newPlayer.firstName, "first"));
	$(returnRow).append(makeAHiddenInputWithClass("allPlayers[" + index + "].player.lastName", newPlayer.lastName, "last"));
	if (newPlayer.id != null) {
		$(returnRow).append(makeAHiddenInputWithClass("allPlayers[" + index + "].player.id", newPlayer.id, "id"));
	}
	
	$('.playersToDelete #' + newPlayer.id).remove();
	$('.playersToDelete #s' + newPlayer.id).remove();
	return returnRow;
}

/**************
 * On page load:
 */
$(document).ready(function () {
	
    $("#editingIsComplete").bind("click", function() {
    	if (!inputsForPlayersAreValid()) return;
    	applyFinalPlayers();
    	$("#season").submit();
    });
    
    $("#playerToAdd").unbind("keydown").bind("keydown", function(evt) {
		if (evt.which == 13) {
            evt.preventDefault();
	        evt.stopPropagation();	       
	        $("#addPlayer").click();
	    }
	});
    
    $("#addPlayer").bind("click", function() {
		addSelectedPlayers($(".playersToAdd"));
	});
    
    $(".rowContainer").live("mouseover", function() {
    	if ($(this).find('.addText').length == 0) {
    		$(this).append("<div class='addText'>add ></div>");
    	}
    }).live("mouseleave", function() {
    	$(this).find('.addText').remove();
    });
	
});

/************
 * To finalize the form
 */
function applyFinalPlayers() {
	
	// Check out each player in the table
	/*
	$("tr[id^='playerRow']").each(function(index,element){
		
		var identity = $(element).attr("name");
		
		// Create player inputs
		if (identity.indexOf("existing:") != -1) {
			identity = identity.replace("existing:", "");
			finalizeExistingPlayer(element, findExistingPlayer(identity), index);
		} else {
			finalizeNewPlayer(element, findNewPlayer(identity.substring(identity.indexOf("|") + 1, identity.length), identity.substring(0, identity.indexOf("|"))), index);
		}
		
		
		// Update the number and shortcut inputs
		$(element).find(".shortcut").attr("name", "allPlayers[" + index + "].shortcut");
		$(element).find(".number").attr("name", "allPlayers[" + index + "].number");
		
	});
	*/
	$("#season").append(makeAHiddenInput("playerListSize",newPlayers.length + existingPlayers.length));
}

function finalizeExistingPlayer(putInputHere, playerIndex, index) {
	var player = existingPlayers[playerIndex];
	$(putInputHere).append(makeAHiddenInput("allPlayers[" + index + "].player.firstName", player.firstName));
	$(putInputHere).append(makeAHiddenInput("allPlayers[" + index + "].player.lastName", player.lastName));
	$(putInputHere).append(makeAHiddenInput("allPlayers[" + index + "].player.id", player.id));
	$(putInputHere).append(makeAHiddenInput("allPlayers[" + index + "].selected", "true"));
}

function finalizeNewPlayer(putInputHere, playerIndex, index) {
	var player = newPlayers[playerIndex];
	$(putInputHere).append(makeAHiddenInput("allPlayers[" + index + "].player.firstName", player.firstName));
	$(putInputHere).append(makeAHiddenInput("allPlayers[" + index + "].player.lastName", player.lastName));
	$(putInputHere).append(makeAHiddenInput("allPlayers[" + index + "].selected", "true"));
}
