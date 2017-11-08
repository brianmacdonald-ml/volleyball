
function execute() {
	var startingYardLine = currentState.get("yardLine");
	var endingYardLine = !!relevantStat.opponentStat ? -50 : 50;
	var yardLineDistance = distanceBetween(startingYardLine, endingYardLine, relevantStat.opponentStat);
	var actualDistance = 7 + yardLineDistance + 10;
	
	relevantStat.setNumericalAtIndex(actualDistance, 2);
	
	relevantStat.setNumericalAtIndex(0, 3);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Field Goal Attempt",
	friendlyName: "A field goal attempt.",
	version     : 1.7,
	execute     : execute,
	provides    : "for %sed yards was %sed?[Missed, Made, Blocked]:'Result'"
};