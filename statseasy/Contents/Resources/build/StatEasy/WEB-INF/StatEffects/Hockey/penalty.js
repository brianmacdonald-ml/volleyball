
function execute() {
	var allStats = relevantStat.event.allStats;
	if (allStats.size() <= 1) {
		return;
	}

	if (relevantStat.getStatIndex() <= 0) {
		return;
	}
	
	var ourPenaltyCount = currentState.get("ourPenaltyCount");
	if (ourPenaltyCount == undefined) {
		newState.set("ourPenaltyCount", 0);
	}
	var theirPenaltyCount = currentState.get("theirPenaltyCount");
	if (theirPenaltyCount == undefined) {
		newState.set("theirPenaltyCount", 0);
	}
	
	
	
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	
	ourPenaltyCount = Number(ourPenaltyCount);
	theirPenaltyCount = Number(theirPenaltyCount);
	
	if (prefix == "our"){
	//our team took a penalty
		ourPenaltyCount = ourPenaltyCount + 1;
		newState.set("ourPenaltyCount", ourPenaltyCount);
	}
	else {
	//their team took a penalty
		theirPenaltyCount = theirPenaltyCount + 1;
		newState.set("theirPenaltyCount", theirPenaltyCount);
	}
	
	//stop the clock
	newState.set("gameClockRunning", 0);
	
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Penalty",
	friendlyName: "A penalty was called",
	version: 1.0,
	execute: execute,
	provides : " "
};



