
function execute() {
	var allStats = relevantStat.event.allStats;
	if (allStats.size() <= 1) {
		return;
	}

	if (relevantStat.getStatIndex() <= 0) {
		return;
	}
	
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	var count = 0;
	var statName = prefix + "FoulCount";
	
	if(currentState.get(statName) != null)
		count = currentState.get(statName);
	
	newState.set(statName, String(Number(count)+1));

}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Foul",
	friendlyName: "There was a foul.",
	version     : 1.1,
	execute     : execute,
};