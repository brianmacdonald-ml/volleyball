
function execute() {
	//stop the clock
	newState.set("gameClockRunning", 0);

	relevantStat.setTimeAtIndex(relevantStat.getGameTime(), 0);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Stop Clock",
	friendlyName: "Stops the clock",
	version: 1.0,
	execute: execute,
	provides : "%set"
};



