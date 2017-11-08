
var entryStats = {
	"Set Lineup"	: true,
	"Substitution"		: true,
}

function isEntryStat(someStat) {
	return (someStat.statType.statEffectObject != null) && (entryStats[someStat.statType.statEffectObject.name]);
}

function isScoringOpportunity(someStat) {
	return (someStat.statType.statEffectObject != null) && (someStat.statType.statEffectObject.name == "Scoring Opportunity");
}

function execute() {
	var scoringChance = traverseBack(isScoringOpportunity);
	var defensivePoss = false;
	var previousStat = null;
	
	if (scoringChance != undefined) {
		scoringChance.setNumericalAtIndex(1, 1);
		
		scoringChance.color = "#00FF00";
		
		var pointsScored = 0;
		switch (scoringChance.statType.name) 
		{
			case "3 Point Attempt":
				pointsScored = 3;
				defensivePoss = true;
				break;
			case "Field Goal - 3 Point":
				pointsScored = 3;
				defensivePoss = true;
				break;
			case "2 Point Attempt":
				pointsScored = 2;
				defensivePoss = true;
				break;
			case "Field Goal - 2 Point":
				pointsScored = 2;
				defensivePoss = true;
				break;
			case "Free Throw":
				pointsScored = 1;
				var freeThrowCount = 0;
				var i = relevantStat.getStatIndex() - 1;
				var nonPossessionStats = [];
				while(nonPossessionStats.length < 3) {
					var thisStat = relevantStat.event.allStats.get(i);

					if (thisStat.statType.name.indexOf("Possession") > -1 || thisStat.statType.name == "Made") {
						// this is a possession stat... ignore it
					} else {
						nonPossessionStats.push(thisStat);
						if (thisStat.statType.name == "Free Throw") {
							freeThrowCount++;
							if (freeThrowCount > 1) {
								defensivePoss = true;
								break;
							}
						}
					}

					i--;
				}

				var freeThrowFound = false;
				var foulFound = false;
				var shotFound = false;
				for (var i in nonPossessionStats) {
					var thisStat = nonPossessionStats[i];
					logger.debug("* Checking " + thisStat.statType.name);
					if (!freeThrowFound && thisStat.statType.name == "Free Throw") {
						freeThrowFound = true;
						continue;
					}

					if (!foulFound && thisStat.statType.name == "Foul") {
						foulFound = true;
						continue;
					}

					if (!shotFound && thisStat.statType.statEffectObject != null && thisStat.statType.statEffectObject.name == "Scoring Opportunity") {
						if (thisStat.allData.get(1).numericalData == 1) {
							shotFound = true;
						}
						continue;
					}
				}

				if (freeThrowCount > 1) {
					defensivePoss = true;
				}

				if (freeThrowFound && foulFound && shotFound) {
					defensivePoss = true;
				}

				break;
		}
		
		relevantStat.opponentStat = scoringChance.opponentStat;
		
		var scoreString = !!scoringChance.opponentStat ? "theirScore" : "ourScore";
		var score = Number(scoringChance.getBeginningGameState().get(scoreString));
		
		// If we just modify the score of the scoringChance stat directly, all 
		// of the other stats that link to this gameState will have their score 
		// modified; which isn't what we want.  To overcome this, we'll create a new gameState to modify.
		var newGameState = scoringChance.getEndingGameState().clone();
		newGameState.set(scoreString, score + pointsScored);
		scoringChance.setEndingGameState(newGameState);
		
		currentState.set(scoreString, score + pointsScored);
		newState.set(scoreString, score + pointsScored);
		
		markBenchPoint(scoringChance);
		
		modifiedStats.add(scoringChance);

		if (defensivePoss) {
			beginPossession("Defensive", relevantStat.opponentStat, relevantStat);
			beginPossession("Offensive", !relevantStat.opponentStat, relevantStat);
		}
	}
}

function findStartingLineup(scoringChance) {
	var allStats = relevantStat.event.allStats;
	
	for (var i = 0; i < allStats.size(); i++) {
		var previousStat = allStats.get(i);
		
		if ((scoringChance.opponentStat == previousStat.opponentStat) && (previousStat.statType.name == "Starting Lineup")) {
			var startingPlayers = [];
			
			for (var j = 0; j < 5; j++) {
				startingPlayers.push(previousStat.allData.get(j).player);
			}
			
			return startingPlayers;
		}
	}
	
	logger.debug("No Starting Lineup found");
}

function markBenchPoint(scoringChance) { 
	var scoringPlayer = scoringChance.allData.get(0).player;
	var startingPlayers = findStartingLineup(scoringChance);
	var isBenchPlayer = true;
	
	for (var i in startingPlayers) {
		isBenchPlayer = isBenchPlayer && (startingPlayers[i].id != scoringPlayer.id);
	}
	
	var newStartingState = scoringChance == relevantStat ? currentState : scoringChance.getBeginningGameState().clone();
	newStartingState.set("benchPoint", isBenchPlayer ? "1" : "0");
	scoringChance.setBeginningGameState(newStartingState);
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

function switchPossessionArrow() {
	var oldPossession = relevantStat.getBeginningGameState().get("possessionArrow");
	if (oldPossession != null) {
		newState.set("possessionArrow", oldPossession == "ourTeam" ? "theirTeam" : "ourTeam");
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Made",
	friendlyName: "The previous scoring attempt was successful.",
	version     : 4.3,
	execute     : execute,
	sharedCode	: true,
};