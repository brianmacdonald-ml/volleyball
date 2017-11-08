
function execute() {
	var allStats = relevantStat.event.allStats;
	if (allStats.size() <= 1) {
		return;
	}

	if (relevantStat.getStatIndex() <= 0) {
		return;
	}
	
	if (relevantStat.gameTime != undefined) {
		newState.set("gameTime", relevantStat.gameTime);
	}

}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Set Game Time",
	friendlyName: "This sets the game time of the stat.",
	version     : 1.0,
	execute     : execute,
};