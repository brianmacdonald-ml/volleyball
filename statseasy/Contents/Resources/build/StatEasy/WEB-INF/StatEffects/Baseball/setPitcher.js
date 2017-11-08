
function execute() {
	var teamString = !!relevantStat.opponentStat ? "their" : "our";
	var allPlayers = relevantStat.event[teamString + "Season"].allPlayers;
	
	relevantStat.setPlayerAtIndex(getPitcher(relevantStat.opponentStat),1);
	
	var playerIdToNumberMap = {};
	for (var i = 0; i < allPlayers.size(); i++) {
		var playerInSeason = allPlayers.get(i);
		playerIdToNumberMap[playerInSeason.player.id] = playerInSeason.number;
	}

	var player = relevantStat.allData.get(0).getPlayer();
	var playerNumber = playerIdToNumberMap[player.id];
	newState.set(teamString + "PlayerAtPosition1", playerNumber);

	var pitchcount = !relevantStat.opponentStat ? "theirPitchCount" : "ourPitchCount";
	newState.set(pitchcount, 0);
	var ballcount = !!relevantStat.opponentStat ? "theirBallCount" : "ourBallCount";
	newState.set(ballcount, 0);
	

}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:         "Set Pitcher",
	friendlyName: "Sets the current pitcher for this game",
	version:      2.0,
	execute:      execute,
	provides:	  "for %sep:'Pitcher'"
};