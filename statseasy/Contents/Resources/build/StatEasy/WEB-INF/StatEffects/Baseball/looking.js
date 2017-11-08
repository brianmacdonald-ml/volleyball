
function isStrikeout(someStat) {
	return (someStat.statType.statEffectObject != null) && (someStat.statType.statEffectObject.name == "Strikeout");
}

function execute() {
	var scoringChance = traverseBack(isStrikeout);
	
	if (scoringChance != undefined) {
		
		scoringChance.color = "#00FF00";
		
		relevantStat.opponentStat = scoringChance.opponentStat;
		
		// If we just modify the score of the scoringChance stat directly, all 
		// of the other stats that link to this gameState will have their score 
		// modified; which isn't what we want.  To overcome this, we'll create a new gameState to modify.
		var newGameState = scoringChance.getEndingGameState().clone();
		scoringChance.setEndingGameState(newGameState);
		scoringChance.setNumericalAtIndex(1,0);
		
		modifiedStats.add(scoringChance);
		
		logger.debug("Done");
	}
	setTimeStamps();
}


/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Looking",
	friendlyName: "The previous strikeout was looking.",
	version     : 1.3,
	execute     : execute,
};