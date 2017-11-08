
function execute() {
	var teamString = !!relevantStat.opponentStat ? "their" : "our";
	var allPlayers = relevantStat.event[teamString + "Season"].allPlayers;
	
	var playerIdToNumberMap = {};
	for (var i = 0; i < allPlayers.size(); i++) {
		var playerInSeason = allPlayers.get(i);
		playerIdToNumberMap[playerInSeason.player.id] = playerInSeason.number;
	}
	
	for (var i = 0; i < 9; i++) {
		var player = relevantStat.allData.get(i).getPlayer();
		var playerNumber = playerIdToNumberMap[player.id];
		newState.set(teamString + "PlayerAtPosition" + String(i+1), playerNumber);
	}
	if(currentState.get("inning") == undefined){
		newState.set("inning", 0.5);
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Set Lineup",
	friendlyName: "Puts 9 players into spots on the court",
	version: 2.5,
	execute: execute
};