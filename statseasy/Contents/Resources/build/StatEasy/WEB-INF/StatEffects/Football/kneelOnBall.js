
function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";

	var startingYardLine = Number(currentState.get("yardLine"));
	var distance = Number(currentState.get("distance"));
	var endingYardLine = getYardLineFrom(relevantStat, 0, 1);
	
	var distanceData = distanceBetween(startingYardLine, endingYardLine, relevantStat.opponentStat);

	// We are reporting a LOSS of positive yardage.
	relevantStat.setNumericalAtIndex(-1 * distanceData, 2);
	
	newState.set("yardLine", endingYardLine);
	
	calculateNewDownAndDistance(distanceData);
	
	clearPlayStatesIfTerminal();
	setTimeStamps();
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Kneel On Ball",
	friendlyName: "The quarterback takes a knee immediately after the snap.",
	version     : 1.2,
	execute     : execute,
	provides    : "for a loss of %sed yards",
};