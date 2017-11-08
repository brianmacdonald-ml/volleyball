function execute() {
	var allStats = relevantStat.event.allStats;
	if (allStats.size() <= 1) {
		return;
	}

	if (relevantStat.getStatIndex() <= 0) {
		return;
	}

	var previousStat = allStats.get(relevantStat.getStatIndex() - 1); // Start at the index just before this stat
	if (previousStat.statType.name == "Face Off") {
		var ourPlayer = previousStat.getAllData().get(0).getPlayer();
		var theirPlayer = previousStat.getAllData().get(1).getPlayer();
		
		relevantStat.setPlayerAtIndex(ourPlayer, 1);
		relevantStat.setPlayerAtIndex(theirPlayer, 2);
	}
	else{
		newState.set("errorMessage", "The previous stat must be a face off in order to take this stat.");
	}
}






/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Face off result",
	friendlyName: "The result of a face off",
	version: 1.0,
	execute: execute,
	provides: "%sep %seo",
};