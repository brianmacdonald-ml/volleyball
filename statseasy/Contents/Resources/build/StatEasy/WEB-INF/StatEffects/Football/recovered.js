
function execute() {
	var carryStat = traverseBack(isNotMetaAndNotWhistleStat);
	var endingYardLine = getYardLineFrom(relevantStat, 1, 2);
	
	if (carryStat == undefined) {
		newState.set("warningMessage", "The stat taken just before a '" + relevantStat.statType.name + "' must be a 'Fumble', or a 'Blocked'.  I don't see any of those.");
		return;
	}
	
	var statTypeName = getStatTypeName(carryStat);
	
	if ((statTypeName == "Fumble") || 
		(statTypeName == "Blocked")) 
	{
		var startingYardLine = Number(currentState.get("yardLine"));
		var distance = Number(currentState.get("distance"));
		
		var distanceData = distanceBetween(startingYardLine, endingYardLine, currentState.get("hasBall") == "theyDo");
		
		// Update the distance to go, so that we can appropriately update the down in case of a recovery
		newState.set("distance", distance - distanceData);
		
		// distance information will be added by the tackle stat
		newState.set("yardLine", endingYardLine);
		
		setTimeStamps();
	} else if (statTypeName == "Kickoff") {
		startingYardLine = getYardLineFrom(carryStat, 1, 2);
		
		carryStat.setNumericalAtIndex(distanceBetween(startingYardLine, endingYardLine, carryStat.opponentStat), 3);
		
		newState.set("hasBall", !!relevantStat.opponentStat ? "theyDo" : "weDo");

		newState.unset("down");
		newState.unset("distance");
	} else {
		newState.set("warningMessage", "The stat taken just before a '" + relevantStat.statType.name + "' must be a 'Fumble', or a 'Blocked'.  I see a '" + carryStat.statType.name + "' instead.");
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Recovered",
	friendlyName: "Recover the ball after a fumble, blocked punt, or blocked field goal.",
	version     : 2.3,
	execute     : execute,
	provides    : "and run for %sed yards"
};