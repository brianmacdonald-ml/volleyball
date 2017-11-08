function execute() {
	var currentLine = relevantStat.allData.get(0).numericalData;
	currentLine = "line_" + currentLine;
	//find currentLine members
	var players = currentState.get(currentLine);

	
	newState.set("On Ice", players);
}



/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Line Change",
	version: 1.0,
	execute: execute
};