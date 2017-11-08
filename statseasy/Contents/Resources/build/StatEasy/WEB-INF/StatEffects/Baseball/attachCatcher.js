
function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	var otherPrefix = !relevantStat.opponentStat ? "their" : "our";
	
	var allStats = relevantStat.event.allStats;
	if (allStats.size() <= 1) {
		return;
	}

	if (relevantStat.getStatIndex() <= 0) {
		return;
	}
	
	addPlayer(relevantStat.opponentStat,2, 0);
	
	setTimeStamps();
}
/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:         "Attach Catcher",
	friendlyName: "Attaches a catcher to a stat",
	version:      1.1,
	execute:      execute,
	provides: "by %sep:'Catcher'"
};