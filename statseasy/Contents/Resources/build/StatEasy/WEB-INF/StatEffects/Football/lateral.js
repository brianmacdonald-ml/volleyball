
function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";

	var startingYardLine = Number(currentState.get("yardLine"));
	var endingYardLine = getYardLineFrom(relevantStat, 0, 1);
	
	var distanceData = distanceBetween(startingYardLine, endingYardLine, relevantStat.opponentStat);
	
	addDistanceToCarryStat(distanceData);
	
	newState.set("yardLine", endingYardLine);
	
	setTimeStamps();
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Lateral",
	friendlyName: "The ball carrier laterals the ball to a teammate.",
	version     : 1.1,
	execute     : execute,
	provides    : "for %sed yards gained",
};