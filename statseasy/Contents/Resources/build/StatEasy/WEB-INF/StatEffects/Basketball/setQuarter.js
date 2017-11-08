
function execute() {
	var quarter = relevantStat.allData.get(0).numericalData;
	quarter++;
	
	newState.set("quarter", quarter);
	newState.set("half", quarter <= 2 ? 1 : 2);
	
	newState.set("gameClockRunning", 0);
	newState.set("gameClockDirection", "down");

	if (quarter > 1) {
		// Switch possession for 2nd, 3rd and 4th quarters
		switchPossessionArrow();
	}
	
	if (relevantStat.allData.size() >= 2) {
		relevantStat.gameTime = relevantStat.allData.get(1).time;
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Set Quarter",
	friendlyName: "Sets the current quarter.",
	version: 1.8,
	execute: execute
};