
function execute() {
	addGoalie(relevantStat.opponentStat, 0);
}

function addGoalie(opponentStat, index) {
	var prefix = opponentStat ? "their" : "our";
	var allPlayers = relevantStat.event[prefix + "Season"].allPlayers;
	var qbId = currentState.get(prefix + "Goalie");
	
	if (qbId == undefined) {
		newState.set("errorMessage", "You must have a goalie set for " + relevantStat.event[prefix + "Season"].team.teamName + " in order to take this stat.");
		return true;
	}
	
	var ourPlayer = null;
	for (var i = 0; i < allPlayers.size(); i++) {
		var playerInSeason = allPlayers.get(i);
		if (qbId == playerInSeason.player.id) {
			ourPlayer = playerInSeason.player;
		}
	}
	
	relevantStat.setPlayerAtIndex(ourPlayer, index);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Add Goalie",
	friendlyName: "Adds the goalkeeper to a stat.",
	version: 1.1,
	execute: execute,
	provides : "%sep",
};