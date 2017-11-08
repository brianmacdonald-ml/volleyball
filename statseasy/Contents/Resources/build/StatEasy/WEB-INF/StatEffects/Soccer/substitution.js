
function isPlayerInGame(player) {
	var teamString = !!relevantStat.opponentStat ? "their" : "our";
	return newState.get(teamString + "Player" + player.id) == "In";
}

function substitute(comingOut, goingIn) {
	var teamString = !!relevantStat.opponentStat ? "their" : "our";
	
	newState.unset(teamString + "Player" + comingOut.id);
	newState.set(teamString + "Player" + goingIn.id, "In");
}

function execute() {
	var firstPlayer = relevantStat.allData.get(0).player;
	var secondPlayer = relevantStat.allData.get(1).player;
	
	if (isPlayerInGame(firstPlayer) && !isPlayerInGame(secondPlayer)) {
		substitute(firstPlayer, secondPlayer);
	} else if (isPlayerInGame(secondPlayer) && !isPlayerInGame(firstPlayer)) {
		substitute(secondPlayer, firstPlayer);
	} else if (isPlayerInGame(firstPlayer) && isPlayerInGame(secondPlayer)) {
		newState.error("Both " + firstPlayer.fullName + " and " + secondPlayer.fullName + " are in the game, can't substitute.");
	} else {
		newState.error("Neither " + firstPlayer.fullName + " nor " + secondPlayer.fullName + " are in the game, can't substitute.");
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Substitution",
	friendlyName: "Substitute one player for another",
	version: 1.1,
	execute: execute
};