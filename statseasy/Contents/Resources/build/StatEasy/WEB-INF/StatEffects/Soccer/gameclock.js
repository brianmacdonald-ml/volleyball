
function execute() {
	if (newState.get("gameClockRunning") == null) {
		newState.set("gameClockRunning", 0);
	}
	
	relevantStat.gameTime = relevantStat.allData.get(0).time;
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Game Clock",
	friendlyName: "Sets the game clock.",
	version: 1.0,
	execute: execute,
};