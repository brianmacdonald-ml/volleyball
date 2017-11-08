
function execute() {
	if (newState.get("gameClockRunning") == 1) {
		newState.set("gameClockRunning", 0);
		relevantStat.setNumericalAtIndex(1, 0);
	} else {
		newState.set("gameClockRunning", 1);
		relevantStat.setNumericalAtIndex(0, 0);
	}
	
	if (relevantStat.gameTime != undefined) {
		relevantStat.setTimeAtIndex(relevantStat.gameTime, 1);
	}
	newState.set("gameTime", relevantStat.gameTime);

	
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Toggle Game Clock",
	friendlyName: "Starts or stops the game clock.",
	version: 1.9,
	execute: execute,
	provides: "is %sed?[Running, Stopped] at %set",
};