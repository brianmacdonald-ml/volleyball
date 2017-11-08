
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
	var statName = prefix + "YellowCardCount";
	
	if(currentState.get(statName) != null)
		count = currentState.get(statName);
	
	newState.set(statName, String(Number(count)+1));

}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Yellow Card",
	friendlyName: "Gives the player a yellow card.",
	version     : 1.0,
	execute     : execute,
};