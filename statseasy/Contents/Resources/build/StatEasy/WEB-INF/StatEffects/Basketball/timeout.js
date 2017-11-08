
function execute() {
	newState.set("gameClockRunning", 0);
	
	if (relevantStat.gameTime != undefined) {
		relevantStat.setTimeAtIndex(relevantStat.gameTime, 2);
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Timeout",
	friendlyName: "Timeout for the team calling the timeout.",
	version: 1.1,
	execute: execute,
	provides: "taken at %set",
};