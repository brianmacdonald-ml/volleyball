
function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	var allPlayers = relevantStat.event[prefix + "Season"].allPlayers;
	
	var playerIdToNumberMap = {};
	for (var i = 0; i < allPlayers.size(); i++) {
		var playerInSeason = allPlayers.get(i);
		playerIdToNumberMap[playerInSeason.player.id] = playerInSeason.number;
	}
	
	for (var i = 0; i < 5; i++) {
		var player = relevantStat.allData.get(i).player;
		var playerNumber = playerIdToNumberMap[player.id];
		
		newState.set(prefix + "Player" + playerNumber, "In");
	}
	
	if (relevantStat.gameTime == undefined) {
		newState.set("warningMessage", "Set the game clock before taking the starting lineup stat to automatically add player entry times.");
	} else {
		// Add game time for this starting lineup stat
		relevantStat.setTimeAtIndex(relevantStat.gameTime, 5);
	}
	
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Set Lineup",
	friendlyName: "Puts five players into spots on the court",
	version: 1.6,
	execute: execute,
	provides: "at time %set"
};