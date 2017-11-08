
function execute() {
	var newPeriod = relevantStat.allData.get(0).numericalData;
	newState.set("period", newPeriod);
	
	var gameClockRunning = currentState.get("gameClockRunning");
	
	//gameclock is not defined yet...init
	if (gameClockRunning == undefined) {
		newState.set("gameClockRunning", 0);
		newState.set("gameClockDirection", "down");
		
		relevantStat.setGameTime(relevantStat.allData.get(1).time)
	}

}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Set Period",
	version: 1.0,
	execute: execute
};