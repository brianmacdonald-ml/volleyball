
function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	var allPlayers = relevantStat.event[prefix + "Season"].allPlayers;
	
	var requestedPlayerId = relevantStat.allData.get(0).player.id;
	logger.debug("Looking for player id " + requestedPlayerId);
	
	var ourPlayer = null;
	for (var i = 0; i < allPlayers.size(); i++) {
		var playerInSeason = allPlayers.get(i);
		logger.debug("Checking against " + playerInSeason.player.id + " (" + playerInSeason.player.firstName + " " + playerInSeason.player.lastName + ")");
		if (requestedPlayerId == playerInSeason.player.id) {
			newState.set(prefix + "Qb", playerInSeason.number);
			return;
		}
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Set Quarterback",
	friendlyName: "Sets the quarterback for this game.",
	version: 1.2,
	execute: execute
};