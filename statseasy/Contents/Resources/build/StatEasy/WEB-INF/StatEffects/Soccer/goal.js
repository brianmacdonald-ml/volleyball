
function execute() {
	var allStats = relevantStat.event.allStats;
	if (allStats.size() <= 1) {
		return;
	}

	if (relevantStat.getStatIndex() <= 0) {
		return;
	}
	
	var previousStat = allStats.get(relevantStat.getStatIndex() - 1); // Start at the index just before this stat
	
	if (previousStat.statType.name == "Shot" || previousStat.statType.name == "Shot On Goal") {
		var player = previousStat.getAllData().get(0).getPlayer();
		relevantStat.setPlayerAtIndex(player, 0);
	}
	if (relevantStat.gameTime != undefined) {
		relevantStat.setTimeAtIndex(relevantStat.gameTime, 2);
	}
	
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	var otherPrefix = !relevantStat.opponentStat ? "their" : "our";
	var scoreString = !!relevantStat.opponentStat ? "theirScore" : "ourScore";
	var score = Number(currentState.get(scoreString));
	var scoreReport = "";
	var player;
	var initialTime = Math.floor((Number(currentState.get("initialTime"))/1000)/60);
	var time = initialTime - Math.floor((relevantStat.gameTime/1000)/60)

	if(currentState.get("period")==2)
		time +=initialTime ;

	if(relevantStat.getAllData().get(0).getPlayer() == null)
		player = prefix + "Player";
	else
		player = relevantStat.getAllData().get(0).getPlayer().getName();
	
	if(currentState.get(prefix +"ScoreReport") != null)
		scoreReport = currentState.get(prefix + "ScoreReport");

	scoreReport += "-"+ player + " ('" + time + ")";
	
	newState.set(prefix + "ScoreReport", scoreReport);
	newState.set(scoreString, score + 1);
	addGoalie(!relevantStat.opponentStat, 1);
	
	if (relevantStat.gameTime != undefined) {
		newState.set("gameTime", relevantStat.gameTime);
	}
	

	
}

function addGoalie(opponentStat, index) {
	var prefix = opponentStat ? "their" : "our";
	var allPlayers = relevantStat.event[prefix + "Season"].allPlayers;
	var qbId = currentState.get(prefix + "Goalie");
	
	if (qbId == undefined) {
		newState.set("warningMessage", "You must have a goalie set for " + relevantStat.event[prefix + "Season"].team.teamName + " in order to take this stat.");
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
	name:    "Goal",
	friendlyName: "A shot on goal that went in!",
	version: 4.4,
	execute: execute,
	provides : "%sep %seo %set",
};