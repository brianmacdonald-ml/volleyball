
function execute() {
	var allStats = relevantStat.event.allStats;
	if (allStats.size() <= 1) {
		return;
	}

	if (relevantStat.getStatIndex() <= 0) {
		return;
	}
	
	var previousStat = allStats.get(relevantStat.getStatIndex() - 1); // Start at the index just before this stat
	var previousStat2 = allStats.get(relevantStat.getStatIndex() - 2); // Start at the index 2 before this stat
	var currentStat = allStats.get(relevantStat.getStatIndex()); // Start at the index just before this stat

	
	//make sure the most recent stat was a goal
	if (previousStat.statType.name == "Goal") {
		var goal_scorer = previousStat.getAllData().get(0).getPlayer();
		var assist_maker = currentStat.getAllData().get(0).getPlayer();
		relevantStat.setPlayerAtIndex(assist_maker, 0);
		relevantStat.setPlayerAtIndex(goal_scorer, 2);
		findAssistType(relevantStat);
	}
	else if (previousStat2.statType.name == "Goal") {
		var goal_scorer = previousStat2.getAllData().get(0).getPlayer();
		var assist_maker = currentStat.getAllData().get(0).getPlayer();
		relevantStat.setPlayerAtIndex(assist_maker, 0);
		relevantStat.setPlayerAtIndex(goal_scorer, 2);
		findAssistType(relevantStat);
	}
	else
		newState.set("errorMessage", "The previous stat (or one before it) must be a goal in order to take this stat.");
	
}

function findAssistType(relevantStat){
	var ourPenaltyCount = currentState.get("ourPenaltyCount");
	var theirPenaltyCount = currentState.get("theirPenaltyCount");
	
	var shortHandedAssistIndex = 2;
	var powerPlayAssistIndex = 1;
	var evenStrengthAssistIndex = 0;
	
	
	//which team scored the goal?
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	
	//teams are at even strength
	if ((ourPenaltyCount == undefined) || (Number(ourPenaltyCount)) == (Number(theirPenaltyCount)) ){
		relevantStat.setNumericalAtIndex(evenStrengthAssistIndex, 1);
		return true;
	}
	//our team has PP
	else if (Number(theirPenaltyCount) > 0){
		//if our team scored, PPG
		if (prefix == "our"){
			relevantStat.setNumericalAtIndex(powerPlayAssistIndex, 1);		
		}
		//else, the other team must have scored a shorty
		else {	
			relevantStat.setNumericalAtIndex(shortHandedAssistIndex, 1);		
		}
		return true;
	}
	//our team is short handed
	else if (Number(ourPenaltyCount) > 0){
		//if wour team scored a goal while their on the PP, shorty!
		if (prefix == "our"){
			relevantStat.setNumericalAtIndex(shortHandedAssistIndex, 1);
		}
		//else, the other team must have scored a shorty
		else {	
			relevantStat.setNumericalAtIndex(powerPlayAssistIndex, 1);
		}
		return true;
	}	
}


/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Assist",
	friendlyName: "An Assist",
	version: 1.0,
	execute: execute,
	provides : "%sed?[A, PPA, SHA]:'Result' on Goal by: %sep",
};