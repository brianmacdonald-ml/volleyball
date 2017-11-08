
function isSacrificableHit(someStat) {
	return (someStat.statType.statEffectObject != null) && 
	((someStat.statType.name == "Bunt")||(someStat.statType.name == "Fly") ||
			(someStat.statType.name == "Line"));
}

function execute() {
	adjustTeam();
	var scoringChance = traverseBack(isSacrificableHit);

	if (scoringChance != undefined) {
		var typeName;
		if(scoringChance.statType.name == "Bunt"){
			typeName = "Sacrifice Bunt";
		}
		else if(scoringChance.statType.name == "Fly"){
			typeName = "Sacrifice Fly";
		}
		else if(scoringChance.statType.name == "Line"){
			typeName = "Sacrifice Line"; 
		}
		
		var typeObject = findType(typeName);
		
		if(typeObject != undefined){
			scoringChance.statType = typeObject;
		}
		else{
			newState.set("warningMessage", "StatType '" + typeObject + "' was not found.");
		}
			
		
		scoringChance.color = "#00FF00";
		
		relevantStat.opponentStat = scoringChance.opponentStat;
		
		// If we just modify the score of the scoringChance stat directly, all 
		// of the other stats that link to this gameState will have their score 
		// modified; which isn't what we want.  To overcome this, we'll create a new gameState to modify.
		var newGameState = scoringChance.getEndingGameState().clone();
		
		scoringChance.setEndingGameState(newGameState);
		
		setTimeStamps();
		
		modifiedStats.add(scoringChance);
		
		logger.debug("Done");
	}
	else{
	//	newState.set("warningMessage", "Scoring chance is undefined")
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
	name        : "Sacrifice",
	friendlyName: "The previous scoring attempt was a sacrifice.",
	version     : 3.1,
	execute     : execute,
	sharedCode	: true,
};