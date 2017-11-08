
function addPlayer(prefix) {
	var matchAttrPlayer = undefined;
	var relevantPlayerId = undefined;
	
	matchAttrPlayer = currentState.get(prefix + "Player");
	relevantPlayerId = Number(matchAttrPlayer);
	
	if (matchAttrPlayer == undefined) {
		newState.set("errorMessage", "You must have a bowler set for this event in order to take stats.");
		return true;
	}
	
	var allPlayers = relevantStat.event[prefix + "Season"].allPlayers;
	for (var i = 0; i < allPlayers.size(); i++) {
		var playerInSeason = allPlayers.get(i);
		if (relevantPlayerId == playerInSeason.player.id) {
			var whoHitItData = new Packages.com.ressq.stateasy.model.StatData();
			whoHitItData.player = playerInSeason.player;
			var insertionIndex = getFirstIndexOfType(relevantStat, "player");
			if (insertionIndex < relevantStat.allData.size()) {
				relevantStat.allData.set(insertionIndex, whoHitItData);
			} else {
				relevantStat.allData.add(whoHitItData);
			}
		}
	}
}

function getFirstPlayer(stat) {
	var index = getFirstIndexOfType(stat, "player");
	return index == undefined ? undefined : stat.getAllData().get(index).getPlayer();
}

function getFirstIndexOfType(stat, statType) {
	var parseTypes = stat.statType.parseTypes;
	
	for (var i = 0; i < parseTypes.size(); i++) {
		if (parseTypes.get(i).type.getName() == statType) {
			return i;
		}
	}
	
	return undefined;
}

function dimArray(length, initial) {
	var newArray = [];
	for (var i = 0; i < length; i++) {
		newArray[i] = initial;
	}
	return newArray;
}

function setPins(pinsRemaining) {
	for (var i = 1; i <= 10; i++) {
		if ("up" == pinsRemaining[i - 1]) {
			newState.set("pin" + i, pinsRemaining[i - 1]);
		} else {
			newState.unset("pin" + i);
		}
	}
}

function unsetPins() {
	for (var i = 1; i <= 10; i++) {
		newState.unset("pin" + i);
	}
}

function isNOPStatType(type) {
	return (type.name == "Miss / Gutter Ball");
}

function isPinRemainingStat(someStat) {
	var type = someStat.getStatType();
	var statEffect = type.getStatEffectObject();
	
	if ((statEffect != undefined) && (statEffect != null)) {
		return ("Pin Remaining" == statEffect.name);
	}
	
	return false;
}

function isSubStat(someStat) {
	var type = someStat.getStatType();
	
	return "Substitution" == type.name;
}

function getNOPPinsRemaining(stat, pinStatus) {
	var state = stat.getBeginningGameState();
	var pinsRemaining = Number(state.get("pinsRemaining"));
	
	if (pinStatus != undefined) {
		var ballNumber = Number(state.get("ballNumber"));
		if (ballNumber == 1) {
			// First ball, all the pins are still up
			for (var i = 0; i < pinStatus.length; i++) {
				pinStatus[i] = "up";
			}
		} else {
			// Second ball, only the balls that were previously up are still up
			for (var i = 0; i < pinStatus.length; i++) {
				pinStatus[i] = state.get("pin" + (i + 1)) == "up" ? "up" : "down";
			}
		}
	}
	
	return pinsRemaining;
}

function getPinCountRemaining(stat, pinStatus) {
	if (isNOPStatType(stat.statType)) {
		return getNOPPinsRemaining(stat, pinStatus);
	}
	
	var parseTypes = stat.statType.parseTypes;
	var pinsAfterHit = 0;
	for (var i = 0; i < parseTypes.size(); i++) {
		if (parseTypes.get(i).type.getName() == "numerical") {
			if (pinStatus != undefined) {
				var pinRemaining = relevantStat.allData.get(i).numericalData;
				pinStatus[pinRemaining - 1] = "up";
			}
			pinsAfterHit++;
		}
	}
	
	return pinsAfterHit;
}

function getPinsHit(statArray, index) {
	if ((index >= statArray.length) || isNOPStatType(statArray[index].getStatType())) {
		return 0;
	}
	
	var stat = statArray[index];
	var pinCountAfterContact = getPinCountRemaining(stat);
	var pinCountBeforeContact = Number(stat.getBeginningGameState().get("pinsRemaining"));
	
	return pinCountBeforeContact - pinCountAfterContact;
}

function calculateScoreForStat(statArray, index) {
	var stat = statArray[index];
	var pinsRemaining = getPinCountRemaining(stat);
	
	var score = 0;
	if ((pinsRemaining == 0) && (stat.getBeginningGameState().get("ballNumber") == "1")) {
		score = 10 + getPinsHit(statArray, index + 1) + getPinsHit(statArray, index + 2);
	} else if (pinsRemaining == 0) {
		score = getPinsHit(statArray, index) + getPinsHit(statArray, index + 1);
	} else {
		score = getPinsHit(statArray, index);
	}
	
	return score;
}

function tenthFrameExtraHelper(allBowls, i, releaseNumber) {
	return (i >= 0) && 
			(Number(allBowls[i].getBeginningGameState().get("frameNumber")) == 10) && 
			(Number(allBowls[i].getBeginningGameState().get("releaseNumber")) == releaseNumber) &&
			(getPinCountRemaining(allBowls[i]) == 0);
}

function isTenthFrameExtra(allBowls, i) {
	if (i == undefined) {
		i = allBowls.length - 1;
	}
	var isExtra = false;
	
	if (Number(allBowls[i].getBeginningGameState().get("frameNumber")) != 10) {
		return false;
	}
	
	// if the ball two bowls ago is a first release strike in the tenth, then we are
	isExtra = tenthFrameExtraHelper(allBowls, i - 2, 1);
	// if the ball one bowl ago is a first release string in the tenth, then we are
	isExtra = isExtra || tenthFrameExtraHelper(allBowls, i - 1, 1);
	// if the ball one bowl ago is a second release spare in the tenth, then we are
	isExtra = isExtra || tenthFrameExtraHelper(allBowls, i - 1, 2);
	
	return isExtra;
}

function setScore(prefix, playerBowls) {
	var prefixBowls = playerBowls[prefix];
	var totalScore = 0;
	var playerScores = {};
	
	for (var bowlerId in prefixBowls) {
		var allBowls = prefixBowls[bowlerId];
		var playerScore = 0;
		
		for (var i = 0; i < allBowls.length; i++) {
			var statScore = calculateScoreForStat(allBowls, i);
			
			var stat = allBowls[i];
			if (!isTenthFrameExtra(allBowls, i)) {
				playerScore += statScore;
			}
		}
		
		logger.debug("Player (" + bowlerId + ") score: " + playerScore);
		playerScores[bowlerId] = playerScore;
		totalScore += playerScore;
	}
	
	logger.debug("Current score set as: " + totalScore);
	
	newState.set(prefix + "Score", totalScore);
	
	return playerScores;
}

function accountForSubs(stat, playerBowls) {
	var actualPlayerId = getFirstPlayer(stat).id;
	var prefix = stat.opponentStat ? "their" : "our";
	
	if (isSubStat(stat)) {
		var newPlayerId;
		var existingPlayerId;
		for (var i = 0; i < 2; i++) {
			var playerId = stat.getAllData().get(i).getPlayer().id;
			playerId = playerBowls.subs[playerId] != undefined ? playerBowls.subs[playerId] : playerId;
			if (playerBowls[prefix][playerId] != undefined) {
				existingPlayerId = playerId;
			} else {
				newPlayerId = playerId;
			}
		}
		if (newPlayerId != undefined) {
			playerBowls.subs[newPlayerId] = existingPlayerId;
		}
	}
	
	if (playerBowls.subs[actualPlayerId] != undefined) {
		return playerBowls.subs[actualPlayerId];
	} else {
		return actualPlayerId;
	}
}

function addStatToPlayerBowls(stat, playerBowls, isBaker) {
	// We can't add a stat to player bowls that doesn't even have any player information!
	if (getFirstPlayer(stat) == undefined) {
		return;
	}
	
	var playerId = !!isBaker ? 1 : accountForSubs(stat, playerBowls);
	var prefix = stat.opponentStat ? "their" : "our";
	
	if (playerBowls[prefix][playerId] == undefined) {
		playerBowls[prefix][playerId] = [];
	}
	
	if (isPinRemainingStat(stat)) {
		playerBowls[prefix][playerId].unshift(stat);
	}
}

function getPlayerBowls(allStats, isBaker, preConfiguredStats) {
	// Object indexed by player id that contains arrays for every ball bowled by player during this game
	var playerBowls = {
		their : {},
		our   : {},
		subs  : {}, // Subs is indexed by player Id as well. It maps playerId to the playerId of a pre-existing player
	};
	
	var i;
	if (!preConfiguredStats) {
		addStatToPlayerBowls(relevantStat, playerBowls, isBaker);
		
		i = relevantStat.getStatIndex() - 1;
	} else {
		i = allStats.size() - 1;
	}
	
	while ((i < allStats.size()) && (0 <= i)) 
	{
		var stat = allStats.get(i);
		
		addStatToPlayerBowls(stat, playerBowls, isBaker);
		
		i--;
	}
	
	return playerBowls;
}

function adjustTime() {
	var allStats = relevantStat.event.allStats;
	var i = relevantStat.getStatIndex() - 1;
	
	if ((i < allStats.size()) && (0 <= i)) {
		var stat = allStats.get(i);
		var typeName = stat.statType.name;
		
		if (typeName == "Release") 
		{
			logger.debug("Adjusting time to match the previous contact stat");
			relevantStat.timeTaken = stat.timeTaken;
		}
	}
}

/* Graphical Adjacency
 * 7   8   9   10
 *  \ /|\ /|\ /
 *   4 | 5 | 6
 *    \|/ \|/
 *     2   3
 *      \ /
 *       1
 */

function isSplit(pinStatus) {
	if (pinStatus[0] == "up") {
		return false;
	}
	
	var adjacencyMatrix = [
	  //1  2  3  4  5  6  7  8  9  10
	   [0, 1, 1, 0, 0, 0, 0, 0, 0, 0], // Pin 1
	   [1, 0, 0, 1, 1, 0, 0, 1, 0, 0], // Pin 2
	   [1, 0, 0, 0, 1, 1, 0, 0, 1, 0], // Pin 3
	   [0, 1, 0, 0, 0, 0, 1, 1, 0, 0], // Pin 4
	   [0, 1, 1, 0, 0, 0, 0, 1, 1, 0], // Pin 5
	   [0, 0, 1, 0, 0, 0, 0, 0, 1, 1], // Pin 6
	   [0, 0, 0, 1, 0, 0, 0, 0, 0, 0], // Pin 7
	   [0, 1, 0, 1, 1, 0, 0, 0, 0, 0], // Pin 8
	   [0, 0, 1, 0, 1, 1, 0, 0, 0, 0], // Pin 9
	   [0, 0, 0, 0, 0, 1, 0, 0, 0, 0], // Pin 10
	];
	
	var pinVector = [];
	for (var i = 0; i < 10; i++) {
		pinVector[i] = pinStatus[i] == "up" ? (i + 1) : 0;
	}
	
	for (var i = 0; i < 10; i++) {
		if (pinVector[i] != 0) {
			// If this pin is up, "push" its set # to its adjacent pins
			var setNumber = pinVector[i];
			for (var j = i; j < 10; j++) {
				if (pinVector[j] != 0) {
					pinVector[j] = adjacencyMatrix[i][j] == 1 ? setNumber : pinVector[j];
				}
			}
		}
	}
	
	logger.debug("Pin sets: " + pinVector);
	
	var setNumber = undefined;
	for (var i = 0; i < 10; i++) {
		if (pinVector[i] != 0) {
			if (setNumber == undefined) {
				setNumber = pinVector[i];
			} else if (setNumber != pinVector[i]) {
				// Found a different setNumber, therefore we have multiple sets (SPLIT!)
				return true;
			}
		}
	}
	
	return false;
	
}

/**
 * The tenth frame is a weird one.  Ball number two or three could be an effective
 * ball number one if there was a mark in the previous bowl
 * @param playerBowls
 * @return
 */
function effectiveBallNumber(playerBowls, bakerScored) {
	var ballNumber = Number(currentState.get("ballNumber"));
	
	if (ballNumber == 1) {
		return 1;
	}
	
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	var playerId = !bakerScored ? getFirstPlayer(relevantStat).id : 1;
	
	var allBowls = playerBowls[prefix][playerId];
	var previousBowl = allBowls[allBowls.length - 2];
	var previousPinsRemaining = getPinCountRemaining(previousBowl);
	
	if (previousPinsRemaining == 0) {
		return 1;
	} else {
		return 2;
	}
}

/**
 * Set Extra Shot / Non-Mark
 * @return
 */
function setESNM(playerBowls, bakerScored) {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	var playerId = !bakerScored ? getFirstPlayer(relevantStat).id : 1;
	var allBowls = playerBowls[prefix][playerId];
	
	var index = allBowls.length - 2;
	var firstMark = undefined;
	while (Number(allBowls[index].getBeginningGameState().get("frameNumber")) == 10) {
		if (getPinCountRemaining(allBowls[index]) == 0) {
			firstMark = Number(allBowls[index].getBeginningGameState().get("releaseNumber"));
		}
		index--;
	}
	
	var stat = allBowls[allBowls.length - 1];
	if (firstMark == 1) { // First mark is a strike, any mark is an extra shot and any non-mark is exactly that
		if (getPinCountRemaining(stat) == 0) {
			logger.debug("First mark is a strike, so this is an extra shot");
			currentState.set("extraShot", "true");
		} else {
			logger.debug("First mark is a strike, so this is a non-mark");
			currentState.set("nonMark", "true");
		}
	} else if (firstMark == 2) { // First mark is a spare, so everything after it is an extra shot
		logger.debug("First mark is a spare, so this is an extra shot");
		currentState.set("extraShot", "true");
	}
}

function isCompleteFrame(allStats, i) {
	i = Number(i);
	
	var stat = allStats[i];
	if (Number(stat.getBeginningGameState().get("frameNumber")) == 10) {
		return true;
	}
	
	var type = stat.getStatType();
	if (type.name == "Strike") {
		return i + 2 < allStats.length;
	}

	if (type.name == "Spare") {
		return i + 1 < allStats.length;
	}
	
	if (Number(stat.getBeginningGameState().get("ballNumber")) == 1) {
		return (i + 1 < allStats.length) && isCompleteFrame(allStats, i + 1);
	}
	
	return true;
	
}

function resolveIncompleteFrames() {
	var parentGrouping = relevantStat.event.eventGrouping;
	var isBaker = parentGrouping.attributes.get("Baker-Scored?") == "yes";
	
	// Get all stats from this match only if this is a baker scored match
	while (isBaker && (parentGrouping.parentGroup != null)) {
		parentGrouping = parentGrouping.parentGroup;
	}
	
	var relevantPlayerId = getFirstPlayer(relevantStat).id;
	var allStats = parentGrouping.getAllStats();
	var playerBowls = getPlayerBowls(allStats, false, true);

	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	var allBowls = playerBowls[prefix][relevantPlayerId];
	for (var i in allBowls) {
		var stat = allBowls[i];
		var completeScore = stat.getBeginningGameState().get("completeScore");
		var currentlyComplete = completeScore == "true";
		var isComplete = isCompleteFrame(allBowls, i);
		logger.debug("Stat '" + stat.getStatText() + "' is" + (isComplete ? "" : " not") + " complete and is currently set as" + (currentlyComplete ? "" : " not") + " complete.");
		if ((isComplete != currentlyComplete) || (completeScore == undefined)) {
			logger.debug("Modifying this stat: " + stat.statIndex + " == " + relevantStat.statIndex);
			var gameState = undefined;
			if ((stat.statIndex != relevantStat.statIndex) || (stat.event.id != relevantStat.event.id)) {
				gameState = stat.getBeginningGameState();
				logger.debug("Adding to modified list");
				modifiedStats.add(stat);
			} else {
				gameState = currentState;
			}
			gameState.set("completeScore", isComplete ? "true" : "false");
		}
	}
}

function insertTotalPinfall(someStat, playerScores) {
	var prefix = !!someStat.opponentStat ? "their" : "our";
	var playerId = getFirstPlayer(someStat).id;
	
	var supplementalTypeName = "Traditional Pinfall";
	var supplementalStatType = undefined;
	
	for (var i = 0; i < allStatTypes.size(); i++) {
		var statType = allStatTypes.get(i);
		if (statType.name == supplementalTypeName) {
			supplementalStatType = statType;
		}
	}
	
	if (supplementalStatType != undefined) {
		var allPlayers = someStat.event[prefix + "Season"].allPlayers;
		var ourPlayer = null;
		for (var i = 0; i < allPlayers.size(); i++) {
			var playerInSeason = allPlayers.get(i);
			if (playerId == playerInSeason.player.id) {
				ourPlayer = playerInSeason.player;
			}
		}
		
		var supplementalStat = new Packages.com.ressq.stateasy.model.Stat();
		supplementalStat.statType = supplementalStatType;
		supplementalStat.opponentStat = relevantStat.opponentStat;
		supplementalStat.parentStat = relevantStat;
		supplementalStat.timeTaken = relevantStat.timeTaken;
		
		var whoGotItData = new Packages.com.ressq.stateasy.model.StatData();
		whoGotItData.player = ourPlayer;
		supplementalStat.allData.add(whoGotItData);
		
		var scoreData = new Packages.com.ressq.stateasy.model.StatData();
		scoreData.numericalData = Number(playerScores[playerId]);
		supplementalStat.allData.add(scoreData);
		
		newStats.add(supplementalStat);
		
		logger.debug("Inserting " + supplementalTypeName + " for " + playerId + " with score " + scoreData.numericalData);
	} else {
		logger.debug("StatType '" + supplementalTypeName + "' was not found.");
	}
}

function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	
	if (addPlayer(prefix)) {
		return;
	}

	adjustTime();
	
	var bakerScored = relevantStat.event.eventGrouping.attributes.get("Baker-Scored?") == "yes";
	var playerBowls = getPlayerBowls(relevantStat.event.allStats, bakerScored);
	
	var playerScores = setScore(prefix, playerBowls);
	
	resolveIncompleteFrames();
	
	var pinStatus = dimArray(10, "down");
	var pinsRemaining = getPinCountRemaining(relevantStat, pinStatus);

	if (isSplit(pinStatus) && (effectiveBallNumber(playerBowls, bakerScored) == 1)) {
		newState.set("split", "true");
	} else {
		newState.set("split", "false");
	}
	
	var playerId = Number(currentState.get("player"));
	var frameNumber = Number(currentState.get("frameNumber"));
	var ballNumber = Number(currentState.get("ballNumber"));
	var releaseNumber = Number(currentState.get("releaseNumber"));
	
	if (frameNumber == 10) {
		newState.set("frameNumber", "10");
		newState.set("ballNumber", ballNumber + 1);
		
		if (pinsRemaining == 0) {
			newState.set("pinsRemaining", "10");
			newState.set("releaseNumber", "1");
			unsetPins();
		} else {
			newState.set("pinsRemaining", pinsRemaining);
			newState.set("releaseNumber", releaseNumber + 1);
			setPins(pinStatus);
		}
		
		setESNM(playerBowls, bakerScored);
		
		// In a non-baker match, after the tenth frame, we can auto-insert a total pinfall stat
		if (!bakerScored && ((ballNumber == 3) || ((releaseNumber == 2) && (pinsRemaining > 0)))) {
			insertTotalPinfall(relevantStat, playerScores);
		}
		
	} else if ((ballNumber == 2) ||
		((ballNumber == 1) && (pinsRemaining == 0)))
	{
		newState.set("frameNumber", frameNumber + 1);
		newState.set("ballNumber", "1");
		newState.set("releaseNumber", "1");
		newState.set("pinsRemaining", "10");
		
		unsetPins();
	} else {

		newState.set("ballNumber", "2");
		newState.set("releaseNumber", "2");
		newState.set("pinsRemaining", pinsRemaining);
		
		setPins(pinStatus);
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:         "Pin Remaining",
	friendlyName: "Advances the frame and ball number based on how many pins were hit",
	version:      8.9,
	execute:      execute,
	provides:     "%sep",
};