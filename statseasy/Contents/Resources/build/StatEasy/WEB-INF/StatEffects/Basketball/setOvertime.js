
function execute() {
	var quarter = relevantStat.allData.get(0).numericalData;
	
	newState.set("quarter", "ot" + quarter);
	newState.set("half", "ot" + quarter);
	
	if (newState.get("gameClockRunning") == null) {
		newState.set("gameClockRunning", 0);
		newState.set("gameClockDirection", "down");
	}
	
	relevantStat.gameTime = relevantStat.allData.get(1).time;
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Set Overtime",
	friendlyName: "Sets the current overtime period.",
	version: 1.0,
	execute: execute
};