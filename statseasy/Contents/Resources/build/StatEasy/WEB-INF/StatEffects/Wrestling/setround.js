
function execute() {
	var newPeriod = relevantStat.allData.get(0).numericalData;
	newState.set("round", newPeriod);
	
	newState.set("gameClockRunning", 0);
	newState.set("gameClockDirection", "down");

	if (relevantStat.allData.size() >= 2) {
		relevantStat.gameTime = relevantStat.allData.get(1).time;
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Set Round",
	friendlyName: "Set the round number and the time remaining.",
	version: 1.5,
	execute: execute
};