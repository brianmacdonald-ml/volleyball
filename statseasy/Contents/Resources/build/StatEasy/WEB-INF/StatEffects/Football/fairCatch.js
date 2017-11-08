
function execute() {
	var endingYardLine = getYardLineFrom(relevantStat, 1, 2);
	var kickoff = traverseBack(isNotMetaAndNotWhistleStat);
	
	var statTypeName = getStatTypeName(kickoff);
	
	if (statTypeName == "Punt")
	{
		var startingYardLine = Number(kickoff.beginningGameState.get("yardLine"));
		var dataIndex = 1;
		
		kickoff.setNumericalAtIndex(distanceBetween(startingYardLine, endingYardLine, kickoff.opponentStat), dataIndex);
		
		modifiedStats.add(kickoff);

		newState.set("hasBall", !!relevantStat.opponentStat ? "theyDo" : "weDo");
		newState.set("yardLine", endingYardLine);
		newState.set("down", "1");
		newState.set("distance", "10");
		
		if (!statAtOffsetHasEffectNamed(1, "Possession Change")) {
			newState.set("warningMessage", "Be sure to tell StatEasy what time this posession change happened");
		}
	} else {
		newState.set("warningMessage", "The stat taken just before a '" + relevantStat.statType.name + "' should be a 'Punt'.  I see a '" + kickoff.statType.name + "' instead.");
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Fair Catch",
	friendlyName: "The punt returner signaled for a fair catch.",
	version     : 1.8,
	execute     : execute,
};