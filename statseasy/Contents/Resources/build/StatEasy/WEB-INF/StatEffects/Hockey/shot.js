
function execute() {
	var allStats = relevantStat.event.allStats;
	if (allStats.size() <= 1) {
		return;
	}

	if (relevantStat.getStatIndex() <= 0) {
		return;
	}
	
	findShotType(relevantStat);
}	

function findShotType(relevantStat){
	var ourPenaltyCount = Number(currentState.get("ourPenaltyCount"));
	var theirPenaltyCount = Number(currentState.get("theirPenaltyCount"));
	
	var shortHandedShotIndex = 2;
	var powerPlayShotIndex = 1;
	var evenStrengthShotIndex = 0;
	
	
//	java.lang.System.out.println((Number(ourPenaltyCount)))		//debug

	//which team scored the goal?
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	
	
	
	//teams are even
	if ((ourPenaltyCount == undefined) || (ourPenaltyCount == theirPenaltyCount) ){
		relevantStat.setNumericalAtIndex(evenStrengthShotIndex, 1);
		return true;
	}
	//our team has PP  
	else if ((theirPenaltyCount > 0) && (theirPenaltyCount > ourPenaltyCount)){
		//if our team scored, PPG
		if (prefix == "our"){
			relevantStat.setNumericalAtIndex(powerPlayShotIndex, 1);		
		}
		//else, the other team must have scored a shorty
		else {	
			relevantStat.setNumericalAtIndex(shortHandedShotIndex, 1);		
		}
		return true;
	}
	//our team is short handed
	else if ((ourPenaltyCount > 0) && (ourPenaltyCount > theirPenaltyCount)){
		//if wour team scored a goal while their on the PP, shorty!
		if (prefix == "our"){
			relevantStat.setNumericalAtIndex(shortHandedShotIndex, 1);
		}
		//else, the other team must have scored a shorty
		else {	
			relevantStat.setNumericalAtIndex(powerPlayShotIndex, 1);
		}
		return true;
	}	
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Shot",
	friendlyName: "A Shot on Goal",
	version: 1.0,
	execute: execute,
	provides : "%sed?[S, PPS, SHS]:'Type of Shot'"
};



