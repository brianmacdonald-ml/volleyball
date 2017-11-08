var terminalStats = {
	"Tackle"				: true,
	"Pass Incomplete"		: true,
	"Sack"					: true,
	"Penalty"				: true,
	"Safety"				: true,
	"Whistle"				: true,
	"Touchdown"				: true,
	"Touchback"				: true,
	"Fair Catch"			: true,
	"Field Goal Attempt"	: true,
	"2 Point Conversion"	: true,
	"Out of Bounds"			: true,
	"No Return"				: true,
	"Kneel On Ball"         : true,
	"Out of Bounds"         : true,
};

var startStats = {
	"Snap"					: true,
	"Kickoff"				: true,
	"Punt"					: true,
	"Point After Attempt"	: true,
	"Field Goal Attempt"	: true,
}

var carryStats = {
	"Carry"				: true,
	"Pass Complete"		: true,
	"Return"			: true,
	"Recovered"			: true,
	"Pass Intercepted"	: true,
	"Lateral"			: true,
}

var metaStats = {
	"Formation" : true,
	"Play Call" : true,
	"Motion" : true,
	"Back Set" : true,
	"Hash Mark" : true,
	"Formation Shift" : true,
	"Blitz" : true,
	"Coverage" : true,
	"Front" : true,
	"Onside Kick" : true,
}

function isTerminalStat(someStat) {
	return (someStat.statType.statEffectObject != null) && (terminalStats[someStat.statType.statEffectObject.name]);
}

function isStartStat(someStat) {
	return (someStat.statType.statEffectObject != null) && (startStats[someStat.statType.statEffectObject.name]);
}

function isMetaStat(someStat) {
	return (someStat.statType.statEffectObject != null) && (metaStats[someStat.statType.statEffectObject.name]);
}

function isWhistle(someStat) {
	return (someStat.statType.statEffectObject != null) && ("Whistle" == someStat.statType.statEffectObject.name);
}

function statTypeMatches(someStat, typeName) {
	return (someStat.statType.name == typeName);
}

function isNotMetaAndNotWhistleStat(someStat) {
	return !isMetaStat(someStat) && !isWhistle(someStat) && !statTypeMatches(someStat, "Tackle Assist");
}

function isCarryStat(someStat) {
	return (someStat.statType.statEffectObject != null) && (carryStats[someStat.statType.statEffectObject.name]);
}

function untilCarryOrSnap(someStat) {
	return isStartStat(someStat) || isCarryStat(someStat);
}

function isTerminalOrStart(someStat) {
	return (isTerminalStat(someStat) && !isWhistle(someStat)) || isStartStat(someStat);
}

function clearPlayStatesIfTerminal() {
	if (isTerminalStat(relevantStat)) {
		logger.debug("Terminal play detected, clearing play states.");
		clearPlayStates();
	}
}

function clearPlayStates() {
	var unsetThese = ["formation", "playCall", "motion", "backSet", "hash", "formationShift", "blitz", "coverage", "front"];
	
	for (var i in unsetThese) {	
		newState.unset(unsetThese[i]);
	}
}

function spreadGameStateBackToTerminal(stateName, stateValue) {
	var allStats = relevantStat.event.allStats;
	var i = relevantStat.getStatIndex() - 1; // Start at the index just before this stat
	var currentStat;
	
	newState.set(stateName, stateValue);
	
	traverseBack(isTerminalStat, function (currentStat) {
		logger.debug("Found " + currentStat.getStatText() + " as a non terminal action.  Setting " + stateName + " to " + stateValue);
		
		currentStat.beginningGameState.set(stateName, stateValue);
		currentStat.endingGameState.set(stateName, stateValue);
		
		modifiedStats.add(currentStat);
	});
}

function setTimeStamps() {
	var stoppingEvent = traverseBack(isStartStat, function (currentStat) {
		var statTypeName = getStatTypeName(currentStat);
		
		if (statTypeName == "Whistle") 
		{
			logger.debug("Whistle stat found at index " + currentStat.statIndex + " @ " + currentStat.timeInSeconds);
			relevantStat.timeTaken = currentStat.timeTaken;
			relevantStat.endTimeOffset = 5.0;  //In seconds
		}
	});

	if (stoppingEvent != undefined) {
		logger.debug("Found a " + stoppingEvent.statType.name + " start stat as index " + stoppingEvent.statIndex);
		relevantStat.seekTimeOffset = stoppingEvent.timeInSeconds - relevantStat.timeInSeconds - 5.0;
	}
}

function setEndTime(currentStat) {
	var name = currentStat.getStatText();
	logger.debug("Updating the end time of " + name);
	
	var endTime = relevantStat.getTimeInSeconds() + 5.0;
	currentStat.endTimeOffset = endTime - currentStat.getTimeInSeconds();  //In seconds
	
	modifiedStats.add(currentStat);
}

function adjustEndTime() {
	traverseBack(isStartStat, setEndTime, true);
}

function getYardLineFrom(someStat, homeAwayIndex, yardLineIndex) {
	var homeAway = someStat.allData.get(homeAwayIndex).numericalData;
	var yardLine = someStat.allData.get(yardLineIndex).numericalData;
	
	logger.debug("Getting yard line from " + someStat.getStatText() + " [" + homeAwayIndex + "]=" + homeAway + " and [" + yardLineIndex + "]=" + yardLine);
	
	yardLine = 50 - yardLine;
	
	if (homeAway == 0) {
		yardLine = yardLine * -1;
	}
	
	return yardLine;
}

function distanceBetween(startingYardLine, endingYardLine, opponentStat) {
	var distance = endingYardLine - startingYardLine;
	if (opponentStat) {
		distance = distance * -1;
	}
	return distance;
}

function getStatTypeName(someStat) {
	return someStat.statType.statEffectObject != undefined ? someStat.statType.statEffectObject.name : undefined;
}

function addDistanceToCarryStat(distanceData) {
	//logger.debug("Looking for Carry Stat");
	
	var carryStat = traverseBack(isNotMetaAndNotWhistleStat);
	
	var statTypeName = getStatTypeName(carryStat);
	
	if ((statTypeName == "Carry") || 
		(statTypeName == "Pass Complete") || 
		(statTypeName == "Return") || 
		(statTypeName == "Recovered") || 
		(statTypeName == "Pass Intercepted") ||
		(statTypeName == "Lateral")) 
	{
		var dataIndex = 1;
		if ((statTypeName == "Return") || (statTypeName == "Pass Intercepted") || (statTypeName == "Recovered") || (statTypeName == "Lateral")) {
			dataIndex = 3;
		}
		carryStat.setNumericalAtIndex(distanceData, dataIndex);
		
		modifiedStats.add(carryStat);
	} else {
		newState.set("warningMessage", "The stat taken just before a '" + relevantStat.statType.name + "' must be a 'Carry', 'Pass Complete', 'Pass Intercepted', 'Return', 'Recovered', or a 'Lateral'.  I see a '" + carryStat.statType.name + "' instead.");
	}
	
	return carryStat;
}

function addQuarterback(opponentStat, index) {
	var prefix = opponentStat ? "their" : "our";
	var allPlayers = relevantStat.event[prefix + "Season"].allPlayers;
	var qbId = currentState.get(prefix + "Qb");
	
	if (qbId == undefined) {
		newState.set("warningMessage", "You have no quarterback set for " + relevantStat.event[prefix + "Season"].team.teamName + ".");
		return undefined;
	}
	
	var ourPlayer = null;
	for (var i = 0; i < allPlayers.size(); i++) {
		var playerInSeason = allPlayers.get(i);
		if (qbId == playerInSeason.number) {
			ourPlayer = playerInSeason.player;
		}
	}
	
	relevantStat.setPlayerAtIndex(ourPlayer, index);
	
	return ourPlayer;
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

function adjustTeam() {
	if (currentState.get("hasBall") == "weDo") {
		relevantStat.opponentStat = false;
	} else if (currentState.get("hasBall") == "theyDo") {
		relevantStat.opponentStat = true;
	}
}

function statAtOffsetHasEffectNamed(offset, statTypeName) {
	var statIndex = relevantStat.getStatIndex() + offset;
	var allStats = relevantStat.event.allStats;
	
	return (statIndex < allStats.size()) && (allStats.get(statIndex).statType.statEffect != undefined) && (allStats.get(statIndex).statType.statEffectObject.name == statTypeName);
}

function calculateNewDownAndDistance(distanceData) {
	calculateNewDownAndDistanceWithState(distanceData, currentState);
}

function calculateNewDownAndDistanceWithState(distanceData, someState) {
	var distance = Number(someState.get("distance"));
	if ((distanceData >= distance) || (someState.get("distance") == undefined)) {
		newState.set("down", "1");
		newState.set("distance", "10");
	} else {
		var newDown = Number(someState.get("down")) + 1;
		if (newDown > 4) {
			logger.debug("Turnover - Loss of downs!");
			newState.set("down", "1");
			newState.set("distance", "10");
			newState.set("hasBall", someState.get("hasBall") == "weDo" ? "theyDo" : "weDo");
			
			if (!statAtOffsetHasEffectNamed(1, "Possession Change")) {
				newState.set("warningMessage", "Be sure to tell StatEasy what time this posession change happened");
			}
		} else {
			newState.set("down", newDown);
			newState.set("distance", distance - distanceData);
		}
	}
}

function advancedTo(endingYardLine) {
	var lastStartingStat = traverseBack(isStartStat);
	var startingYardLine;
	
	if (lastStartingStat != null) {
		startingYardLine = Number(lastStartingStat.getEndingGameState().get("yardLine"));
	} else {
		startingYardLine = Number(currentState.get("yardLine"));
	}
	
	var carryStat = traverseBack(isNotMetaAndNotWhistleStat);
	
	if (carryStat == undefined) {
		newState.set("warningMessage", "No carry stat found before this Tackle.");
		return;
	}
	
	var carryStatType = getStatTypeName(carryStat);
	var originalStartingYardLine;
	
	if (carryStatType == "Pass Intercepted") {
		startingYardLine = getYardLineFrom(carryStat, 0, 1);

		logger.debug("Found a pass interception, using that yardline as the starting yardline. (" + startingYardLine + ") -> (" + endingYardLine + ")");
	} else if ((carryStatType == "Return") || (carryStatType == "Recovered")) {
		originalStartingYardLine = startingYardLine;
		startingYardLine = getYardLineFrom(carryStat, 1, 2);

		logger.debug("Found a " + carryStatType + ", using that yardline as the starting yardline. (" + startingYardLine + ") -> (" + endingYardLine + ")");
	}
	var distanceData = distanceBetween(startingYardLine, endingYardLine, carryStat.opponentStat);
	
	if (carryStatType == "Pass Intercepted") {
		carryStat = addDistanceToCarryStat(-1 * distanceData);
	} else {
		carryStat = addDistanceToCarryStat(distanceData);
	}

	newState.set("yardLine", endingYardLine);
	
	// If the ball was recovered by the team that does not currently have the ball, then down, distance and yard line are easy to calculate.
	if (((carryStatType == "Recovered") && ((carryStat.opponentStat ? "theyDo" : "weDo") != currentState.get("hasBall"))) || (carryStatType == "Return")) {
		newState.set("down", "1");
		newState.set("distance", "10");
		newState.set("hasBall", (carryStat.opponentStat ? "theyDo" : "weDo"));
	} else if (carryStatType == "Pass Intercepted") {
		newState.set("down", "1");
		newState.set("distance", "10");
		newState.set("hasBall", (carryStat.opponentStat ? "weDo" : "theyDo"));
	} else {
		if (carryStatType == "Recovered") {
			// Recovered by the same team that originally had the ball
			distanceData = distanceBetween(originalStartingYardLine, endingYardLine, carryStat.opponentStat);
		}
		if (lastStartingStat != null) {
			calculateNewDownAndDistanceWithState(distanceData, lastStartingStat.getBeginningGameState());
		} else {
			calculateNewDownAndDistance(distanceData);
		}
	}
	
	copyDownAndDistanceFrom(newState, carryStat);
}

function copyDownAndDistanceFrom(someState, toStat) {
	// If we just modify the ending state of the stat directly, all 
	// of the other stats that link to that gameState will have their down and distance 
	// modified; which isn't what we want.  To overcome this, we'll create a new gameState to modify.
	var newGameState = toStat.getEndingGameState().clone();
	newGameState.set("down", someState.get("down"));
	newGameState.set("distance", someState.get("distance"));
	toStat.setEndingGameState(newGameState);
	
	modifiedStats.add(toStat);
}

function execute() {
	adjustTeam();
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Snap",
	friendlyName: "Marks the beginning of the play.",
	version     : 9.4,
	execute     : execute,
	sharedCode	: true,
};