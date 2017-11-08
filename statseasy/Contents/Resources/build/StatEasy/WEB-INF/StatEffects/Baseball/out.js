

function isFieldAndAssist(someStat) {
	return (someStat.statType.statEffectObject != null) && 
	((someStat.statType.statEffectObject.name == "Field or Assist") || (someStat.statType.statEffectObject.name == "Pickoff Attempt"));
}


function execute() {
	//adjustTeam();
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	var otherPrefix = !relevantStat.opponentStat ? "their" : "our";

	var allStats = relevantStat.event.allStats;
	if (allStats.size() <= 1) {
		return;
	}

	if (relevantStat.getStatIndex() <= 0) {
		return;
	}
	
	var base = findPlayerBase(relevantStat.opponentStat, relevantStat.allData.get(0).player);
	if(base == 1){
		newState.set("playerAtFirst", 0);
	}
	else if(base == 2){
		newState.set("playerAtSecond", 0);
	}
	else if(base == 3){
		newState.set("playerAtThird", 0);
	}
	
	var outCount = 0;
	
	if(currentState.get("outCount")!= null)
		outCount = Number(currentState.get("outCount"));
	
	newState.set("outCount", outCount +1);
	
	relevantStat.setNumericalAtIndex(outCount, 1);

	newState.set("strikeCount", 0);
	newState.set("ballCount", 0);
	
	if(outCount>= 2){
		newState.set("outCount", 0);
	}
	
	var scoringChance = traverseBack(isFieldAndAssist);

	if (scoringChance != undefined) {
		scoringChance.color = "#00FF00";
		
		relevantStat.opponentStat = !scoringChance.opponentStat;
		
		// If we just modify the score of the scoringChance stat directly, all 
		// of the other stats that link to this gameState will have their score 
		// modified; which isn't what we want.  To overcome this, we'll create a new gameState to modify.
		var newGameState = scoringChance.getEndingGameState().clone();
		
		if(scoringChance.statType.statEffectObject.name == "Field or Assist"){
			scoringChance.setNumericalAtIndex(2,0);
		}
		else if (scoringChance.statType.statEffectObject.name == "Pickoff Attempt"){
			scoringChance.setNumericalAtIndex(1,2);
		}
			var i = scoringChance.getStatIndex() - 1; // Start at the index just before this stat
			var allStats = relevantStat.event.allStats;
			while ((i < allStats.size()) && (0 < i) && 
				 (allStats.get(i-1).statType.statEffectObject.name !="Pitch" )) {
				currentStat = allStats.get(i);
				if(currentStat.statType.statEffectObject.name == "Field or Assist"){
					if(currentStat.allData.get(0).numericalData==2){
						currentStat.setNumericalAtIndex(3,0);
					}
					else{
						currentStat.setNumericalAtIndex(1,0);
					}

					modifiedStats.add(currentStat);
				
				}
				i--;
			}
		
		scoringChance.setEndingGameState(newGameState);
		
		modifiedStats.add(scoringChance);
		
		logger.debug("Done");
	}
	else{
		newState.set("warningMessage", "scoringChance is" + scoringChance)
	}
	
	
	setTimeStamps();
}


function findType(typeName) {
	for (var i = 0; i < allStatTypes.size(); i++) {
		var statType = allStatTypes.get(i);
		if (statType.name == typeName) {
			return statType;
		}
	}
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
	name:         "Out",
	friendlyName: "A player got out",
	version:      3.3,
	execute:      execute,
	provides: "This is out %sed?[1,2,3]:'Out Count'"
};