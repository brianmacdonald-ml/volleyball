
function execute() {
	newState.set("gameClockRunning", 0);
	
	if (relevantStat.gameTime != undefined) {
		relevantStat.setTimeAtIndex(relevantStat.gameTime, 1);
		
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Time Out",
	friendlyName: "A time out was called.",
	version: 1.2,
	execute: execute,
	provides: "at %set:'Time'",
};