
function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	var otherPrefix = !relevantStat.opponentStat ? "their" : "our";
	var player = relevantStat.allData.get(0).player;
	
	
	addPitcher(!relevantStat.opponentStat, 1);
	
	
	var teamString = !!relevantStat.opponentStat ? "their" : "our";
	var allPlayers = relevantStat.event[teamString + "Season"].allPlayers;
	
	var playerIdToNumberMap = {};
	for (var i = 0; i < allPlayers.size(); i++) {
		var playerInSeason = allPlayers.get(i);
		playerIdToNumberMap[playerInSeason.player.id] = playerInSeason.number;
	}
	newState.set("currentBatter", playerIdToNumberMap[player.id]);

	if(prefix != currentState.get("currentBattingTeam")){
		changeBattingTeam();
	}
	
	newState.set("currentBattingTeam", prefix);
	newState.set("currentFieldingTeam", otherPrefix);
	
	newState.set("strikeCount", 0);
	newState.set("ballCount", 0);


}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:         "Set Batter",
	friendlyName: "Sets the current batter for this game",
	version:      2.6,
	execute:      execute,
	provides:     "current pitcher %seo:'Pitcher'"
};