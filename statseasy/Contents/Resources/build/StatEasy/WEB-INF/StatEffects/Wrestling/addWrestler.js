
function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	
	addWrestler(relevantStat.opponentStat, 0);
}

function getWrestler(opponentStat) {
	var prefix = opponentStat ? "their" : "our";
	var allPlayers = relevantStat.event[prefix + "Season"].allPlayers;
	var wrestlerNumber = currentState.get(prefix + "Wrestler");
	
	var ourWrestler;
	for (var i = 0; i < allPlayers.size(); i++) {
		var playerInSeason = allPlayers.get(i);
		if (wrestlerNumber == playerInSeason.number) {
			ourWrestler = playerInSeason.player;
		}
	}
	
	if (ourWrestler == undefined) {
		newState.set("warningMessage", "You have no wrestler set for " + relevantStat.event[prefix + "Season"].team.teamName + ".");
	}
	
	return ourWrestler;
}

function addWrestler(someStat, index) {
	var ourWrestler = getWrestler(someStat.opponentStat);
	
	if (ourWrestler != undefined) {
		someStat.setPlayerAtIndex(ourWrestler, index);
	}
	
	return ourWrestler;
}


/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:         "Add Wrestler",
	friendlyName: "Add the appropriate wrestler to this stat.",
	version:      1.2,
	execute:      execute,
	provides:     "by %sep",
	sharedCode:   true,
};