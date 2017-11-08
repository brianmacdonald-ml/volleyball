
function execute() {
	var teamString = !!relevantStat.opponentStat ? "their" : "our";
	var allPlayers = relevantStat.event[teamString + "Season"].allPlayers;
	var position = relevantStat.allData.get(0).numericalData+1;
	
	addPlayer(relevantStat.opponentStat, position, 2);
	
	
	var playerIdToNumberMap = {};
	for (var i = 0; i < allPlayers.size(); i++) {
		var playerInSeason = allPlayers.get(i);
		playerIdToNumberMap[playerInSeason.player.id] = playerInSeason.number;
	}

	var player = relevantStat.allData.get(1).getPlayer();
	var playerNumber = playerIdToNumberMap[player.id];
	newState.set(teamString + "PlayerAtPosition"+String(position), playerNumber);
	if(position == 1){
		var pitchcount = !relevantStat.opponentStat ? "theirPitchCount" : "ourPitchCount";
		newState.set(pitchcount, 0);
		var ballcount = !!relevantStat.opponentStat ? "theirBallCount" : "ourBallCount";
		newState.set(ballcount, 0);
	}
	

}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:         "Set Postition",
	friendlyName: "Sets a player to a position for this game",
	version:      1.,
	execute:      execute,
	provides:	  "for %sep:'Player'"
};