
function execute() {
	var kickoff = traverseBack(isNotMetaAndNotWhistleStat);
	
	var statTypeName = getStatTypeName(kickoff);
	
	if ((statTypeName == "Kickoff") ||
		(statTypeName == "Punt") ||
		(statTypeName == "Pass Intercepted"))
	{
		var distanceIndex;
		var startingYardLine;
		var endingYardLine = !!kickoff.opponentStat ? -30 : 30;
		
		if (statTypeName == "Punt") {
			distanceIndex = 1;
			startingYardLine = Number(kickoff.beginningGameState.get("yardLine"));
		} else if (statTypeName == "Pass Intercepted") {
			distanceIndex = 3;
			startingYardLine = getYardLineFrom(kickoff, 0, 1);
			endingYardLine = !!kickoff.opponentStat ? 50 : -50;
		} else {
			distanceIndex = 3;
			startingYardLine = getYardLineFrom(kickoff, 1, 2);
		}
		
		relevantStat.opponentStat = !kickoff.opponentStat;
		
		kickoff.setNumericalAtIndex(distanceBetween(startingYardLine, endingYardLine, kickoff.opponentStat), distanceIndex);
		
		modifiedStats.add(kickoff);
		
		if (!statAtOffsetHasEffectNamed(1, "Possession Change")) {
			newState.set("warningMessage", "Be sure to tell StatEasy what time this posession change happened");
		}
		
		newState.set("hasBall", !!kickoff.opponentStat ? "weDo" : "theyDo");
		newState.set("yardLine", endingYardLine);
		newState.set("down", "1");
		newState.set("distance", "10");
		
		setTimeStamps();
		adjustEndTime();
		clearPlayStatesIfTerminal();
	} else {
		newState.set("warningMessage", "The stat taken just before a touchback must be a 'Punt', 'Kickoff', I see a " + statTypeName + " instead.");
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Touchback",
	friendlyName: "The previous kickoff went into the endzone for a touchback.",
	version     : 2.5,
	execute     : execute,
};