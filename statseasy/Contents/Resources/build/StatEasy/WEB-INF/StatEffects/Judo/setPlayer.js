
function getPlayer(opponentStat) {
	var prefix = opponentStat ? "their" : "our";
	var allPlayers = relevantStat.event[prefix + "Season"].allPlayers;
	var playerId = currentState.get(prefix + "Player");
	
	var ourPlayer;
	for (var i = 0; i < allPlayers.size(); i++) {
		var playerInSeason = allPlayers.get(i);
		if (playerId == playerInSeason.number) {
			ourPlayer = playerInSeason.player;
		}
	}
	
	if (ourPlayer == undefined) {
		newState.set("warningMessage", "You have no player set for " + relevantStat.event[prefix + "Season"].team.teamName + ".");
	}
	
	return ourPlayer;
}

function addPlayer(someStat, index) {
	var ourPlayer = getPlayer(someStat.opponentStat);
	
	if (ourPlayer != undefined) {
		someStat.setPlayerAtIndex(ourPlayer, index);
	}
	
	return ourPlayer;
}

function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	var allPlayers = relevantStat.event[prefix + "Season"].allPlayers;
	
	var requestedPlayerId = relevantStat.allData.get(0).player.id;
	
	var ourPlayer = null;
	for (var i = 0; i < allPlayers.size(); i++) {
		var playerInSeason = allPlayers.get(i);
		if (requestedPlayerId == playerInSeason.player.id) {
			newState.set(prefix + "Player", playerInSeason.number);
			return;
		}
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Set Player",
	friendlyName: "Sets the player for this game/practice",
	version: 1.0,
	execute: execute,
	sharedCode	: true,
};