
function execute() {
	if (relevantStat.gameTime != undefined) {
		relevantStat.gameTime = relevantStat.allData.get(1).time;
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Set Clock",
	friendlyName: "Set the clock to a particular time",
	version: 1.4,
	execute: execute
};