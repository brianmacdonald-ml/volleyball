
function execute() {
	var period = relevantStat.allData.get(0).numericalData;
	period++;
	if (period == 3) {
		period = "OT";
	} else if (period == 4) {
		period = "OT2";
	}
	
	newState.set("gameClockRunning", 0);
	newState.set("gameClockDirection", "down");
	
	if (relevantStat.gameTime != undefined) {
		newState.set("gameTime", relevantStat.gameTime);
	}
	
	if (relevantStat.allData.size() >= 2) {
		relevantStat.gameTime = relevantStat.allData.get(1).time;
		newState.set("initialTime", relevantStat.gameTime);
	}
	newState.set("period", period);

}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Set Period",
	friendlyName: "Sets what the current period is.",
	version: 2.0,
	execute: execute
};