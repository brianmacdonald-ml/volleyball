
function execute() {
	var endingYardLine = getYardLineFrom(relevantStat, 1, 2);
	var kickoff = traverseBack(isNotMetaAndNotWhistleStat);
	
	var statTypeName = getStatTypeName(kickoff);
	
	if ((statTypeName == "Kickoff") || 
		(statTypeName == "Punt") || 
		(statTypeName == "Fumble")) 
	{
		var startingYardLine;
		var dataIndex;
		if ("Kickoff" == statTypeName) {
			// Kickoff contains the starting yard line as a data point because the kickoff could happen from a number of different locations depending on penalties and level of play
			startingYardLine = getYardLineFrom(kickoff, 1, 2);
			dataIndex = 3;
		} else {
			// Punt, however, does not contain the starting yard line.  So we grab the starting yard line from the game state. 
			startingYardLine = Number(kickoff.beginningGameState.get("yardLine"));
			dataIndex = 1;
		}
		
		if ("Fumble" != statTypeName) {
			kickoff.setNumericalAtIndex(distanceBetween(startingYardLine, endingYardLine, kickoff.opponentStat), dataIndex);
			
			modifiedStats.add(kickoff);
		}
		
		newState.set("hasBall", !!relevantStat.opponentStat ? "theyDo" : "weDo");
		newState.set("yardLine", endingYardLine);
		newState.unset("down");
		newState.unset("distance");
		
		setTimeStamps();
		
		if (!statAtOffsetHasEffectNamed(1, "Possession Change")) {
			newState.set("warningMessage", "Be sure to tell StatEasy what time this posession change happened");
		}
	} else {
		newState.set("warningMessage", "The stat taken just before a '" + relevantStat.statType.name + "' must be a 'Kickoff', 'Punt', or a 'Fumble'.  I see a '" + kickoff.statType.name + "' instead.");
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Return",
	friendlyName: "A return of a kickoff, punt, or a fumble.",
	version     : 2.8,
	execute     : execute,
	provides:     "and run for %sed yards",
};