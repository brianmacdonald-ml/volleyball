
function execute() {
	var allStats = relevantStat.event.allStats;
	if (allStats.size() <= 1) {
		return;
	}

	if (relevantStat.getStatIndex() <= 0) {
		return;
	}
	
	var previousStat = allStats.get(relevantStat.getStatIndex() - 1); // Start at the index just before this stat
	var penaltyShotGoalIndex = 4;
	var emptyNetGoalIndex = 3;
	var emptyNetGoal = false;
		
	if (previousStat.statType.name == "Shot") {
		findGoalType(relevantStat, allStats);
		emptyNetGoal = checkForEmptyNetter(!relevantStat.opponentStat);
	}

	else if (previousStat.statType.name =="Penalty Shot"){
		//we have a Penalty shot goal - PSG
		relevantStat.setNumericalAtIndex(penaltyShotGoalIndex, 2)
	}
	
	var player = previousStat.getAllData().get(0).getPlayer();
	//the player who scored the goal
	relevantStat.setPlayerAtIndex(player, 0);				
	var scoreString = !!relevantStat.opponentStat ? "theirScore" : "ourScore";
	var score = Number(currentState.get(scoreString));
	newState.set(scoreString, score + 1);
	
	java.lang.System.out.println("empty net goal value: " + emptyNetGoal);
	
	if (emptyNetGoal){
		relevantStat.setNumericalAtIndex(emptyNetGoalIndex, 2);
	}
	else{
		addGoalie(!relevantStat.opponentStat, 1);
	}
	//stop the clock
	newState.set("gameClockRunning", 0);

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

function findGoalType(relevantStat, allStats){
	var ourPenaltyCount = Number(currentState.get("ourPenaltyCount"));
	var theirPenaltyCount = Number(currentState.get("theirPenaltyCount"));
	
	var shortHandedGoalIndex = 2;
	var powerPlayGoalIndex = 1;
	var evenStrengthGoalIndex = 0;
	
	
//	java.lang.System.out.println((Number(ourPenaltyCount)))		//debug

	//which team scored the goal?
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	
	//teams are even
	if ((ourPenaltyCount == undefined) || (ourPenaltyCount == theirPenaltyCount) ){
		relevantStat.setNumericalAtIndex(evenStrengthGoalIndex, 2);
		return true;
	}
	//our team has PP
	else if ((theirPenaltyCount > 0) && (theirPenaltyCount > ourPenaltyCount)){
		//if our team scored, PPG
		if (prefix == "our"){
			relevantStat.setNumericalAtIndex(powerPlayGoalIndex, 2);		
		}
		//else, the other team must have scored a shorty
		else {	
			relevantStat.setNumericalAtIndex(shortHandedGoalIndex, 2);		
		}
		return true;
	}
	//our team is short handed
	else if ((ourPenaltyCount > 0) && (ourPenaltyCount > theirPenaltyCount)){
		//if wour team scored a goal while their on the PP, shorty!
		if (prefix == "our"){
			relevantStat.setNumericalAtIndex(shortHandedGoalIndex, 2);
		}
		//else, the other team must have scored a shorty
		else {	
			relevantStat.setNumericalAtIndex(powerPlayGoalIndex, 2);
		}
		return true;
	}	
}

function checkForEmptyNetter(relevantStat){
	var prefix = relevantStat ? "their" : "our";
	var goalie = currentState.get(prefix + "Goalie");
	
	if (goalie == undefined) {
		return true;
	}
	else return false;
}


/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Goal",
	friendlyName: "A Goal was scored!",
	version: 1.0,
	execute: execute,
	provides : "%sep %seo %sed?[G, PPG, SHG, ENG, PSG]:'Type of Goal'"
};



