
function isScoringOpportunity(someStat) {
	return (someStat.statType.statEffectObject != null) && (someStat.statType.statEffectObject.name == "Strikeout");
}

function execute() {
	var scoringChance = traverseBack(isScoringOpportunity);
	
	if (scoringChance != undefined) {

		scoringChance.color = "#00FF00";
		
		relevantStat.opponentStat = !scoringChance.opponentStat;
		
		// If we just modify the score of the scoringChance stat directly, all 
		// of the other stats that link to this gameState will have their score 
		// modified; which isn't what we want.  To overcome this, we'll create a new gameState to modify.
		var newGameState = scoringChance.getEndingGameState().clone();
		
		outCount = Number(newGameState.get("outCount"))-1;
		scoringChance.setNumericalAtIndex(outCount-1, 3);
		newState.set("outCount", outCount);
				
		scoringChance.setEndingGameState(newGameState);
		
		setTimeStamps();
		
		modifiedStats.add(scoringChance);
		
		logger.debug("Done");
	}
	setTimeStamps();
}


function matches(someName) {
	return function (element) {
		return element == someName;
	};
}

function traverseBack(isStopStatFunction, iterationFunction, includeStoppingStat) {
	var allStats = relevantStat.event.allStats;
	
	var foundStopEvent = false;
	var stopRequested = false;
	var i = relevantStat.getStatIndex() - 1; // Start at the index just before this stat
	var currentStat;
	
	while ((i < allStats.size()) && (0 <= i) && !foundStopEvent && !stopRequested) 
	{
		currentStat = allStats.get(i);
		
		foundStopEvent = isStopStatFunction(currentStat);
		
		//logger.debug("Traverse[" + i + "]: " + currentStat.getStatText() + " foundStopEvent " + foundStopEvent);
		
		if ((!foundStopEvent || includeStoppingStat) && (iterationFunction != undefined)) {
			stopRequested = !!iterationFunction(currentStat);
			//logger.debug("iterationFunction ran: " + stopRequested);
		}
		
		//logger.debug("foundStopEvent: " + foundStopEvent);
		
		i--;
	}
	
	if (foundStopEvent) {
		return currentStat;
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Dropped Third Strike",
	friendlyName: "The catcher dropped the third strike.",
	version     : 1.6,
	execute     : execute,
	sharedCode	: true,
};