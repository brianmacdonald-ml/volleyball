
function execute() {
	var scoringChance = traverseBack(isScoringOpportunity);

	if (scoringChance.opponentStat == relevantStat.opponentStat) {
		relevantStat.setNumericalAtIndex(0, 1);
	} else {
		relevantStat.setNumericalAtIndex(1, 1);
	}
	
	beginPossession("Defensive", !relevantStat.opponentStat, relevantStat);
	beginPossession("Offensive", relevantStat.opponentStat, relevantStat);

	newState.unset("playCall");
}

function matches(someName) {
	return function (element) {
		return element == someName;
	};
}

function traverseBack(iterationFunction) {
	var allStats = relevantStat.event.allStats;
	var stopAtEvents = ["Scoring Opportunity"];
	
	var foundStopEvent = false;
	var stopRequested = false;
	var i = relevantStat.getStatIndex() - 1; // Start at the index just before this stat
	var currentStat;
	
	while ((i < allStats.size()) && (0 <= i) && !foundStopEvent && !stopRequested) 
	{
		currentStat = allStats.get(i);
		foundStopEvent = ((currentStat.statType.statEffectObject != undefined) && (currentStat.statType.statEffectObject != null)) && 
			stopAtEvents.some(matches(currentStat.statType.statEffectObject.name)); 
		
		if (!foundStopEvent && (iterationFunction != undefined)) {
			stopRequested = !!iterationFunction(currentStat);
		}
		
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
	name        : "Rebound",
	friendlyName: "An offensive or defensive rebound (determined by who took the last shot).",
	version     : 1.2,
	execute     : execute,
	provides    : "%sed?[Offensive, Defensive]"
};