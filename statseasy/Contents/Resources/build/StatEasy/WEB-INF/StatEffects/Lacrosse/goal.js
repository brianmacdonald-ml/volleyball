
function execute() {
	var scoringChance = traverseBack(justSearchOneStat);
	
	if (scoringChance != undefined) {
		var pointsScored = 1;
		
		var scoreString = !!relevantStat.opponentStat ? "theirScore" : "ourScore";
		var score = Number(currentState.get(scoreString));
		newState.set(scoreString, score + pointsScored);
		
		var relevantPlayer = scoringChance.allData.get(0).player;
		
		relevantStat.setPlayerAtIndex(relevantPlayer, 0);
	}
}

function matches(someName) {
	return function (element) {
		return element == someName;
	};
}

function justSearchOneStat() {
	return true;
}

function traverseBack(iterationFunction) {
	var allStats = relevantStat.event.allStats;
	var stopAtEvents = ["Shot"];
	
	var foundStopEvent = false;
	var stopRequested = false;
	var i = relevantStat.getStatIndex() - 1; // Start at the index just before this stat
	var currentStat;
	
	while ((i < allStats.size()) && (0 <= i) && !foundStopEvent && !stopRequested) 
	{
		currentStat = allStats.get(i);
		foundStopEvent = ((currentStat.statType.statEffectObject != undefined) && (currentStat.statType.statEffectObject != null)) && 
			stopAtEvents.some(matches(currentStat.statType.name)); 
		
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
	name        : "Goal Scored",
	friendlyName: "The previous shot on goal was successful.",
	version     : 1.0,
	execute     : execute,
	provides    : "%sep"
};