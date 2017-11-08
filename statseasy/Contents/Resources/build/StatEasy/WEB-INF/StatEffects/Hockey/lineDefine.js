function getPlayerId(index) {
	return relevantStat.allData.get(index).player.id;
}

function execute() {
	var lineNumber = relevantStat.allData.get(0).numericalData;
	var value = [1, 2, 3, 4, 5].map(getPlayerId).join(",");
	
	newState.set("line_" + lineNumber, value);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Line Define",
	version: 1.0,
	execute: execute
};