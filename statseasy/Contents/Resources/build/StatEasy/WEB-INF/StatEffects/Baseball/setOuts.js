
function execute() {
	var outcount = relevantStat.allData.get(0).numericalData;
	newState.set("outCount", outcount);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Set outs",
	friendlyName: "Sets the number of outs!",
	version: 1.0,
	execute: execute
};