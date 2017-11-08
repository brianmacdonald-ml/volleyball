
function execute() {
	var stateName = "ourRotation";
	if (!!relevantStat.opponentStat) {
		stateName = "theirRotation";
	}
	var rotation = Number(relevantStat.allData.get(0).numericalData);
	
	newState.set(stateName, rotation);
	logger.debug("Set " + stateName + " to " + rotation);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Set Rotation Number",
	friendlyName: "Sets the rotation number that we're in",
	version: 2.0,
	execute: execute
};