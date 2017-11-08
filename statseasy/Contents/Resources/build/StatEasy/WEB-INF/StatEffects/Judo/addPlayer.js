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
	addPlayer(relevantStat.opponentStat, 1);
}


/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Add Player",
	friendlyName: "Adds the current player to this stat.",
	version: 1.0,
	execute: execute,
	provides: "by %sep",
};