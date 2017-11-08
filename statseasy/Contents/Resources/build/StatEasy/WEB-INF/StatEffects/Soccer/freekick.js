
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
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Free Kick",
	friendlyName: "A free kick was taken by %p",
	version: 1.0,
	execute: execute,
}