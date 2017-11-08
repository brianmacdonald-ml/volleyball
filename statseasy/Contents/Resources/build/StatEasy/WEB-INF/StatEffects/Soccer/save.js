
function execute() {
	var allStats = relevantStat.event.allStats;
	if (allStats.size() <= 1) {
		return;
	}

	if (relevantStat.getStatIndex() <= 0) {
		return;
	}
	
	if (relevantStat.gameTime != undefined) {
		newState.set("gameTime", relevantStat.gameTime);
	}
	
	addGoalie(relevantStat.opponentStat, 0);
	
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	var otherPrefix = !relevantStat.opponentStat ? "their" : "our";
	saveCount = 0
	if(currentState.get(prefix +"SaveCount") != null)
		saveCount = currentState.get(prefix +"SaveCount");
	newState.set(prefix + "SaveCount", String(Number(saveCount)+1));
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
	name:    "Save",
	friendlyName: "A shot on goal was saved!",
	version: 1.3,
	execute: execute,
	provides: "%sep"
};