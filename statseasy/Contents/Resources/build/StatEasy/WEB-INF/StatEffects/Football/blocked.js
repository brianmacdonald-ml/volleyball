
function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	var fgOrPunt = traverseBack(isNotMetaAndNotWhistleStat);

	var statTypeName = getStatTypeName(fgOrPunt);
	
	if ((statTypeName == "Punt") || 
		(statTypeName == "Field Goal Attempt") || 
		(statTypeName == "Point After Attempt")) 
	{
		var newEndingState = fgOrPunt.endingGameState.clone()
		newEndingState.set("result", "blocked");
		fgOrPunt.endingGameState = newEndingState;
		
		if (statTypeName == "Punt") {
			fgOrPunt.setNumericalAtIndex(0, 1);
		} else if (statTypeName == "Field Goal Attempt") {
			fgOrPunt.setNumericalAtIndex(2, 3);
		} else {
			fgOrPunt.setNumericalAtIndex(2, 1);
		}
		
		modifiedStats.add(fgOrPunt);
	} else {
		newState.set("warningMessage", "The stat taken just before a '" + relevantStat.statType.name + "' must be a 'Punt' or a 'Field Goal Attempt'.  I see a '" + kickoff.statType.name + "' instead.");
	}
	
	setTimeStamps();
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Blocked",
	friendlyName: "The field goal or punt was blocked.",
	version     : 1.3,
	execute     : execute,
};