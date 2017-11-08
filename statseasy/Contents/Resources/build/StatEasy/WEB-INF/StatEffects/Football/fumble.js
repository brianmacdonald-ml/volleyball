
function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";

	var startingYardLine = Number(currentState.get("yardLine"));
	var endingYardLine = getYardLineFrom(relevantStat, 0, 1);
	
	var carryStat = traverseBack(isNotMetaAndNotWhistleStat);
	
	var distanceData = distanceBetween(startingYardLine, endingYardLine, carryStat.opponentStat);
	
	addDistanceToCarryStat(distanceData);
	
	setTimeStamps();
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Fumble",
	friendlyName: "The ball carrier fumbles the ball.",
	version     : 1.4,
	execute     : execute,
};