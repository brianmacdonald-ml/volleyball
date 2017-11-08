
function execute() {
	// The kick stat should be a kickoff or a punt
	var kickoff = traverseBack(isNotMetaAndNotWhistleStat);
	
	var outOfBoundYardLine = getYardLineFrom(relevantStat, 0, 1);
	
	var statTypeName = getStatTypeName(kickoff);
	
	if ((statTypeName == "Kickoff") || 
		(statTypeName == "Punt")) 
	{
		var startingYardLine;
		var endingYardLine;
		var distanceIndex;
		if (statTypeName == "Punt") {
			startingYardLine = kickoff.getBeginningGameState().get("yardLine");
			endingYardLine = outOfBoundYardLine;
			distanceIndex = 1;
		} else {
			startingYardLine = getYardLineFrom(kickoff, 1, 2);
			endingYardLine = !!kickoff.opponentStat ? -15 : 15;
			distanceIndex = 3;
		}
		
		relevantStat.opponentStat = kickoff.opponentStat;
		
		kickoff.setNumericalAtIndex(distanceBetween(startingYardLine, endingYardLine, kickoff.opponentStat), distanceIndex);
		
		modifiedStats.add(kickoff);
		
		if (!statAtOffsetHasEffectNamed(1, "Possession Change")) {
			newState.set("warningMessage", "Be sure to tell StatEasy what time this posession change happened");
		}
		
		newState.set("hasBall", !!kickoff.opponentStat ? "weDo" : "theyDo");
		newState.set("yardLine", endingYardLine);
		newState.set("down", "1");
		newState.set("distance", "10");
	} else {
		advancedTo(outOfBoundYardLine);
	}

	setTimeStamps();
	clearPlayStatesIfTerminal();
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Out of Bounds",
	friendlyName: "The previous kickoff went out of bounds.",
	version     : 2.6,
	execute     : execute,
};