
function isScoringOpportunity(someStat) {
	return (someStat.statType.statEffectObject != null) && 
	(someStat.statType.statEffectObject.name == "Takedown" || someStat.statType.statEffectObject.name == "Reversal" 
	|| someStat.statType.statEffectObject.name == "Escape" || someStat.statType.statEffectObject.name == "Near Fall");
}

function execute() {
	var previousStat = traverseBack(isScoringOpportunity)
	if(previousStat != undefined){
		var newStartingState = previousStat == relevantStat ? currentState : previousStat.getBeginningGameState().clone();
		newStartingState.set("causedBy", relevantStat.getName) 
	}
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	
	addWrestler(relevantStat.opponentStat, 0);
	
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
	name:         "Move",
	friendlyName: "The wrestler performed a move.",
	version:      1.8,
	execute:      execute,
	provides: 	  "by %sep:'Wrestler'"
};