
function execute() {
	var allStats = relevantStat.event.allStats;
	if (allStats.size() <= 1) {
		return;
	}

	if (relevantStat.getStatIndex() <= 0) {
		return;
	}
	
	addPlayer(relevantStat.opponentStat, 0);
	
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	var scoreString = !!relevantStat.opponentStat ? "theirScore" : "ourScore";
	var score = Number(currentState.get(scoreString));
	var scoreReport = [ ];
	var player;
	if(currentState.get(prefix + "Player.name.last") == null)
		player = prefix + "Player";
	else
		player = currentState.get(prefix + "Player.name.last");
	
	if(currentState.get("scoreReport") != null)
		scoreReport = currentState.get("scoreReport");

	scoreReport += [["-Riding Time: " + player]];
	
	newState.set("scoreReport", scoreReport);
	newState.set(scoreString, score + 1);
}

function addPlayer(opponentStat, index) {
	var prefix = opponentStat ? "their" : "our";
	var allPlayers = relevantStat.event[prefix + "Season"].allPlayers;
	var qbId = currentState.get(prefix + "Player");
	
	if (qbId == undefined) {
		newState.set("warningMessage", "Please set a player for " + relevantStat.event[prefix + "Season"].team.teamName + " in order to take this stat.");
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
	name:    "Riding Time",
	friendlyName: "The player gets points for riding time",
	version: 2.5,
	execute: execute,
	provides: "given to %sep"
};