
function execute() {
	var prefix = relevantStat.opponentStat ? "their" : "our";
	var allPlayers = relevantStat.event[prefix + "Season"].allPlayers;
	
	if (relevantStat.gameTime == undefined) {
		newState.set("warningMessage", "Set the game clock before subbing players to automatically add player entry times.");
	} else {
		// Add game time for this starting lineup stat
		relevantStat.setTimeAtIndex(relevantStat.gameTime, 5);
	}
	
	var playerIdToNumberMap = {};
	var playersFormerlyIn = {};
	for (var i = 0; i < allPlayers.size(); i++) {
		var playerInSeason = allPlayers.get(i);
		playerIdToNumberMap[playerInSeason.player.id] = playerInSeason.number;
		if ("In" == currentState.get(prefix + "Player" + playerInSeason.number)) {
			playersFormerlyIn[playerInSeason.number] = playerInSeason.player;
		}
	}
	
	for (var i = 0; i < 5; i++) {
		var player = relevantStat.allData.get(i).player;
		var playerNumber = playerIdToNumberMap[player.id];
		
		if ((relevantStat.gameTime != undefined) && (!isPlayerInGame(playerNumber))) {
			// Generate a player entry
			addPlayerEntry(player);
		}
		
		newState.set(prefix + "Player" + playerNumber, "In");
		
		delete playersFormerlyIn[playerNumber];
	}
	
	if (relevantStat.gameTime != undefined) {
		for (var playerNumber in playersFormerlyIn) {
			newState.unset(prefix + "Player" + playerNumber);
			
			// Generate a player exit
			addPlayerExit(playersFormerlyIn[playerNumber]);
		}
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name			: "Reset Lineup",
	friendlyName	: "Makes the appropriate substitutions to get the lineup set correctly.",
	version			: 1.1,
	execute			: execute,
	provides		: "at time %set",
};