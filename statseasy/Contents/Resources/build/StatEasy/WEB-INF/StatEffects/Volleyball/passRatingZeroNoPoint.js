
function matches(someName) {
	return function (element) {
		return element == someName;
	};
}

function isScoringOpportunity(someStat) {
	return (someStat.statType.statEffectObject != null) && (someStat.statType.statEffectObject.name == "Attempt");
}

function skipServeType(someStat) {
	return (someStat.statType.statEffectObject != null) && ("Serve Type" != someStat.statType.statEffectObject.name);
}

function isServiceAttempt(someStat) {
	return (someStat.statType.name == "Service Attempt");
}

function findServiceAttempt(someStat) {
	return isServiceAttempt(someStat) || skipServeType(someStat);
}

function findFBSO(someStat) {
	var lookingForEvents = ["Service Attempt", "Kill", "Error", "Attempt", "Passer Rating", "Dig"];
	return lookingForEvents.some(matches(someStat.statType.name));
}

function getPrevious(testFunction) {
	var allStats = relevantStat.event.allStats;
	var i = relevantStat.getStatIndex() - 1; // Start at the index just before this stat
	return (i >= 0) && testFunction(allStats.get(i)) ? allStats.get(i) : undefined;
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

function findStatTypeByName(typeName) {
	var supplementalStatType = undefined;
	
	for (var i = 0; i < allStatTypes.size(); i++) {
		var statType = allStatTypes.get(i);
		if (statType.name == typeName) {
			supplementalStatType = statType;
		}
	}
	
	return supplementalStatType;
}

function getSetter(opponentStat) {
	var prefix = opponentStat ? "their" : "our";
	var allPlayers = relevantStat.event[prefix + "Season"].allPlayers;
	var setterId = currentState.get(prefix + "Setter");
	
	var ourPlayer;
	for (var i = 0; i < allPlayers.size(); i++) {
		var playerInSeason = allPlayers.get(i);
		if (setterId == playerInSeason.number) {
			ourPlayer = playerInSeason.player;
		}
	}
	
	if (ourPlayer == undefined) {
		newState.set("warningMessage", "You have no setter set for " + relevantStat.event[prefix + "Season"].team.teamName + ".");
	}
	
	return ourPlayer;
}

function addSetter(someStat, index) {
	var ourPlayer = getSetter(someStat.opponentStat);
	
	if (ourPlayer != undefined) {
		someStat.setPlayerAtIndex(ourPlayer, index);
	}
	
	return ourPlayer;
}

function movePlayer(from, to, startingState, endingState) {
	var atOldPos = startingState.get("position_" + from);
	
	if (!!atOldPos) {
		logger.debug("Moving " + atOldPos + " from " + from + " to " + to);
	
		newState.set("position_" + to, atOldPos);
	}
}

function rotatePlayers(positionOffset, startingState, endingState) {
	movePlayer(2 + positionOffset, 1 + positionOffset, startingState, endingState);
	movePlayer(3 + positionOffset, 2 + positionOffset, startingState, endingState);
	movePlayer(4 + positionOffset, 3 + positionOffset, startingState, endingState);
	movePlayer(5 + positionOffset, 4 + positionOffset, startingState, endingState);
	movePlayer(6 + positionOffset, 5 + positionOffset, startingState, endingState);
	movePlayer(1 + positionOffset, 6 + positionOffset, startingState, endingState);
	
	var stateName = "ourRotation";
	if (positionOffset != 0) {
		stateName = "theirRotation";
	}
	var oldRotation = Number(startingState.get(stateName));
	if (!!oldRotation) {
		var newRotation = (oldRotation + 1) % 7;
		if (newRotation < 1) {
			newRotation = 1;
		}
		logger.debug("Old rotation = " + oldRotation + ", New rotation = " + newRotation);
		endingState.set(stateName, newRotation);
	}
}

function addSetAttempt(toStat) {
	addSupplementalStatByTypeAddSetter(toStat, "Set Attempt");	
}

function addAssist(toStat) {
	addSupplementalStatByTypeAddSetter(toStat, "Assist");	
}

function addSupplementalStatByType(toStat, opponentStat, supplementalTypeName) {
	var supplementalStatType = findStatTypeByName(supplementalTypeName);
	
	if (supplementalStatType != undefined) {
		var supplementalStat = new Packages.com.ressq.stateasy.model.Stat();
		supplementalStat.statType = supplementalStatType;
		supplementalStat.opponentStat = opponentStat;
		supplementalStat.parentStat = toStat;
		supplementalStat.timeTaken = toStat.timeTaken;
		
		newStats.add(supplementalStat);
		
		return supplementalStat;
	} else {
		logger.error("Error: no stat type named " + supplementalTypeName);
	}
}

function addSupplementalStatByTypeAddSetter(toStat, supplementalTypeName) {
	var setter = getSetter(toStat.opponentStat);
	if (setter == undefined) {
		return;
	}
	
	var supplementalStat = addSupplementalStatByType(toStat, toStat.opponentStat, supplementalTypeName);
	
	if (supplementalStat != null) {
		supplementalStat.setPlayerAtIndex(setter, 0);
		logger.debug("Inserting " + supplementalTypeName + " for " + setter.firstName + " " + setter.lastName);		
	}
}

function setFirstAttempt() {
	// Is there a kill, error or attempt between this stat and the nearest Service Attempt?
	var fbsoTest = traverseBack(findFBSO);
	if ((fbsoTest != undefined) && ((fbsoTest.statType.name == "Service Attempt") || (fbsoTest.statType.name == "Passer Rating"))) {
		currentState.set("firstAttempt", "Yes");
	}
}

function setBeginningState(someStat, stateName, stateValue) {
	setBeginningStateDontAddToModified(someStat, stateName, stateValue);
	
	modifiedStats.add(someStat);
}

function setBeginningStateDontAddToModified(someStat, stateName, stateValue) {
	var beginningState = someStat.beginningGameState.clone();
	beginningState.set(stateName, stateValue);
	someStat.beginningGameState = beginningState;
}

function pointFor(toStat, opponentStat, startingState, endingState) {
	var scoreString = opponentStat ? "theirScore" : "ourScore";
	var rotateString = opponentStat ? "weDo" : "theyDo";
	var newServer = opponentStat ? "theyDo" : "weDo";
	var positionOffset = opponentStat ? 6 : 0;
	
	var score = Number(currentState.get(scoreString));
	newState.set(scoreString, score+1);
	
	var hasServe = currentState.get("hasServe");
	if (hasServe == rotateString) {
		rotatePlayers(positionOffset, startingState, endingState);
	}
		
	newState.set("hasServe", newServer);
	
	startingState.unset("setType");
	endingState.unset("setType");
	
	resolveSideoutAttemptForPointScore(toStat, opponentStat, startingState);
	
	return score + 1;
}

function resolveSideoutAttemptForPointScore(toStat, opponentPoint, servingState) {
	var hasServe = servingState.get("hasServe");
	
	var sideoutStat = null;
	
	if ((hasServe == "weDo") && opponentPoint) {
		sideoutStat = addSupplementalStatByType(toStat, true, "Sideout Success");
	} else if ((hasServe == "weDo") && !opponentPoint) {
		sideoutStat = addSupplementalStatByType(toStat, true, "Sideout Failure");
	} else if ((hasServe == "theyDo") && opponentPoint) {
		sideoutStat = addSupplementalStatByType(toStat, false, "Sideout Failure");
	} else if ((hasServe == "theyDo") && !opponentPoint) {
		sideoutStat = addSupplementalStatByType(toStat, false, "Sideout Success");
	}
	
	if (sideoutStat != null) {
		logger.debug("Setting rotation to " + servingState.get("ourRotation"));
		sideoutStat.beginningGameState = servingState;
	}
}

function passRating(pointScale) {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	var otherPrefix = !!relevantStat.opponentStat ? "our" : "their";
	
	var passerRating = relevantStat.allData.get(1).numericalData;
	var score = Number(currentState.get(otherPrefix + "Score"));
	
	var newServer = !relevantStat.opponentStat ? "theyDo" : "weDo";
	currentState.set("hasServe", newServer);
	newState.set("hasServe", newServer);
	
	var previousStat = traverseBack(findServiceAttempt);
	
	if ((previousStat != null) && (previousStat.statType.name == "Service Attempt")) {
		
		if (previousStat.beginningGameState.get("serveType") != undefined) {
			var serveType = previousStat.beginningGameState.get("serveType");
			logger.debug("Found a service attempt with type information (" + serveType + ").  Copying to this Passer Rating");
			currentState.set("serveType", serveType);
		}
		
		var supplementalStatType = findStatTypeByName("Serve Rating");
		if (supplementalStatType != undefined) {
			var supplementalStat = new Packages.com.ressq.stateasy.model.Stat();
			supplementalStat.statType = supplementalStatType;
			supplementalStat.opponentStat = previousStat.opponentStat;
			supplementalStat.parentStat = relevantStat;
			supplementalStat.timeTaken = relevantStat.timeTaken;
			
			supplementalStat.setPlayerAtIndex(previousStat.allData.get(0).player, 0);
			supplementalStat.setNumericalAtIndex(pointScale + 1 - passerRating, 1);
			
			newStats.add(supplementalStat);
		} else {
			logger.debug("StatType 'Serve Rating' was not found.");
		}
	}
}

function execute() {
	passRating(3);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Pass Rating - Zero No Point",
	friendlyName: "If the previous stat taken was a Service Attempt, we update it to add the service rating based on this pass rating.",
	version     : 1.0,
	execute     : execute,
	sharedCode	: true,
};