
function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	var allPlayers = relevantStat.event[prefix + "Season"].allPlayers;
	
	var requestedPlayerId = relevantStat.allData.get(0).player.id;
	
	var ourPlayer = null;
	for (var i = 0; i < allPlayers.size(); i++) {
		var playerInSeason = allPlayers.get(i);
		if (requestedPlayerId == playerInSeason.player.id) {
			newState.set(prefix + "Wrestler", playerInSeason.number);
			return;
		}
	}
	

}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:         "Set Wrestler",
	friendlyName: "Sets the current wrestler for this game",
	version:      1.7,
	execute:      execute,
};