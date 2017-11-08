
function execute() {
	var newPeriod = relevantStat.allData.get(0).numericalData;
	if(relevantStat.allData.get(1) == 1){
		newPeriod +=0.5;
	}
	newState.set("inning", newPeriod);
	
	newState.set("gameClockRunning", 0);
	newState.set("gameClockDirection", "down");
	

	if (relevantStat.allData.size() > 2) {
		relevantStat.gameTime = relevantStat.allData.get(1).time;
		newState.set("initialTime", relevantStat.gameTime);
	}
	if (relevantStat.gameTime != undefined) {
		newState.set("gameTime", relevantStat.gameTime);
		newState.set("ridingTime", 0);
	}

}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Set Inning",
	friendlyName: "Set the inning!",
	version: 1.2,
	execute: execute
};