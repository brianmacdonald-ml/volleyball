
function execute() {
	var scoringChance = traverseBack(isNotMetaAndNotWhistleStat);
	
	var statTypeName = getStatTypeName(scoringChance);
	
	if ((statTypeName == "Point After Attempt") ||
		(statTypeName == "Field Goal Attempt"))
	{
		var missedIndex = 1;
		var scoreChange = 1;
		
		if (statTypeName == "Point After Attempt"){
			missedIndex = 3;
		}
		
		if ("Field Goal Attempt" == statTypeName) {
			missedIndex = 3;
			scoreChange = 3;
		}
		
		scoringChance.setNumericalAtIndex(1, missedIndex);
		
		var scoreString = !!scoringChance.opponentStat ? "theirScore" : "ourScore";
		var score = Number(currentState.get(scoreString));
		
		// If we just modify the score of the scoringChance stat directly, all 
		// of the other stats that link to this gameState will have their score 
		// modified; which isn't what we want.  To overcome this, we'll create a new gameState to modify.
		var newGameState = scoringChance.getEndingGameState().clone();
		newGameState.set(scoreString, score + scoreChange);
		scoringChance.setEndingGameState(newGameState);
		
		currentState.set(scoreString, score + scoreChange);
		newState.set(scoreString, score + scoreChange);

		relevantStat.opponentStat = scoringChance.opponentStat;
		
		modifiedStats.add(scoringChance);
	} else {
		newState.set("warningMessage", "The stat taken just before a '" + relevantStat.statType.name + "' must be a 'Point After Attempt' or a 'Field Goal Attempt'.  I see a '" + scoringChance.statType.name + "' instead.");
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Made",
	friendlyName: "The previous point after or field goal attempt was successful.",
	version     : 2.4,
	execute     : execute,
};