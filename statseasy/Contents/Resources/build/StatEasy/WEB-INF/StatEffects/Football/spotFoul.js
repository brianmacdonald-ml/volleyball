
function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";

	var carryStat = traverseBack(untilCarryOrSnap);
	if (carryStat == undefined) {
		logger.debug("No carry or snap stat found.");
		return;
	}
	
	var statTypeName = getStatTypeName(carryStat);
	
	var startingYardLine = Number(carryStat.getBeginningGameState().get("yardLine"));
	var endingYardLine = getYardLineFrom(relevantStat, 0, 1);
	var distanceData = distanceBetween(startingYardLine, endingYardLine, carryStat.opponentStat);

	if ((statTypeName == "Carry") || 
		(statTypeName == "Pass Complete") || 
		(statTypeName == "Return") || 
		(statTypeName == "Recovered") || 
		(statTypeName == "Pass Intercepted") ||
		(statTypeName == "Lateral")) 
	{
		var dataIndex = 1;
		if ((statTypeName == "Return") || (statTypeName == "Pass Intercepted") || (statTypeName == "Recovered") || (statTypeName == "Lateral")) {
			dataIndex = 3;
		}
		carryStat.setNumericalAtIndex(distanceData, dataIndex);
		
		modifiedStats.add(carryStat);
	} else {
		newState.set("warningMessage", "There must be a 'Carry', 'Pass Complete', 'Pass Intercepted', 'Return', 'Recovered', or a 'Lateral' before a '" + relevantStat.statType.name + "'.  I see a '" + carryStat.statType.name + "' instead.");
	}
	
	var penaltyStat = traverseBack(isNotMetaAndNotWhistleStat);
	statTypeName = getStatTypeName(penaltyStat);
	
	if ((penaltyStat != null) && (statTypeName == "Penalty")) {
		startingYardLine = endingYardLine;
		endingYardLine = getYardLineFrom(penaltyStat, 2, 3);
		var acceptDecline = penaltyStat.allData.get(1).numericalData;
		
		logger.debug("Starting yardline: " + startingYardLine + " ending yardline: " + endingYardLine + " acceptDecline: " + acceptDecline);
		
		if (acceptDecline == 0) {
			var distanceData = distanceBetween(startingYardLine, endingYardLine, !penaltyStat.opponentStat);
			penaltyStat.setNumericalAtIndex(distanceData, 6);
			
			modifiedStats.add(penaltyStat);
		}
	} else {
		newState.set("warningMessage", "The stat taken just before a '" + relevantStat.statType.name + "' must be a 'Penalty'.  I see a '" + carryStat.statType.name + "' instead.");
	}
	
	clearPlayStatesIfTerminal();
	setTimeStamps();
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Spot Foul",
	friendlyName: "The preceeding penalty was a spot foul.  This stat adjusts the distance calculation of plays that happened during the play.",
	version     : 1.6,
	execute     : execute,
};