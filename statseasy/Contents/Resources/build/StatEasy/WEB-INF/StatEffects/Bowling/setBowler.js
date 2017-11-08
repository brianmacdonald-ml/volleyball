
function setPlayer(player, prefix) {
	newState.set(prefix + "Player", player.id);
}

function statsContainBowler(allStats, bowlerId) {
	var i = allStats.size() - 1;
	
	while (0 <= i) {
		if (statContainsBowler(allStats.get(i), bowlerId)) {
			return true;
		}
		i--;
	}
	
	return false;
}

function statContainsBowler(statObj, bowlerId) {
	var statData = statObj.allData;
	
	for (var i = 0; i < statData.size(); i++)
	{
		if ((statData.get(i).player != undefined) &&
			(statData.get(i).player.id == bowlerId)) 
		{
			return true;
		}
	}

	return false;
}

function retrieveBowlerState(fromState) {
	newState.set("frameNumber", fromState.get("frameNumber"));
	newState.set("ballNumber", fromState.get("ballNumber"));
	newState.set("releaseNumber", fromState.get("releaseNumber"));
	newState.set("pinsRemaining", fromState.get("pinsRemaining"));
	var splitValue = fromState.get("split");
	if ((splitValue != null) && (splitValue != undefined)) {
		newState.set("split", splitValue);
	} else {
		newState.set("split", "false");
	}
	for (var i = 1; i <= 10; i++) {
		var thisPinStatus = fromState.get("pin" + i);
		if ((thisPinStatus != undefined) && (thisPinStatus != null)) {
			newState.set("pin" + i, thisPinStatus);
		} else {
			newState.unset("pin" + i);
		}
	}
}

function statMatchesCriteria(currentStat, bowlerId) {
	var isBaker = relevantStat.event.eventGrouping.attributes.get("Baker-Scored?") == "yes";
	var hasRelevantStates = currentStat.endingGameState.get("frameNumber") != undefined;
	
	if (isBaker && hasRelevantStates) {
		return currentStat.opponentStat == relevantStat.opponentStat;
	} else if (hasRelevantStates) {
		return statContainsBowler(currentStat, bowlerId);
	}
}

function getFirstPlayer(stat) {
	var index = getFirstIndexOfType(stat, "player");
	return stat.getAllData().get(index).getPlayer();
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

function addStart(someStat) {
	var prefix = !!someStat.opponentStat ? "their" : "our";
	var playerId = getFirstPlayer(someStat).id;
	
	var supplementalTypeName = "Start";
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
		
		newStats.add(supplementalStat);
		
		logger.debug("Inserting " + supplementalTypeName + " for " + playerId);
	} else {
		logger.debug("StatType '" + supplementalTypeName + "' was not found.");
	}
}

function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	
	var bowler = relevantStat.allData.get(0).player;
	
	var allStats = relevantStat.event.allStats;
	var foundLastBowl = false;
	var i = relevantStat.getStatIndex() - 1; // Start at the index just before this stat
	while ((i < allStats.size()) && (0 <= i) && !foundLastBowl) 
	{
		var currentStat = allStats.get(i);
		if (statMatchesCriteria(currentStat, bowler.id)) {
			foundLastBowl = true;
			var previousBowl = currentStat.endingGameState;
			
			retrieveBowlerState(previousBowl);
		}
		i--;
	}
	
	var isBaker = relevantStat.event.eventGrouping.attributes.get("Baker-Scored?") == "yes";
	if (!foundLastBowl) {
		newState.set("frameNumber", "1");
		newState.set("ballNumber", "1");
		newState.set("releaseNumber", "1");
		newState.set("pinsRemaining", "10");
		addStart(relevantStat);
	} else if (isBaker && !statsContainBowler(allStats, bowler.id)) {
		addStart(relevantStat);
	}
	
	newState.set("isBaker", isBaker ? 1 : 0);
	
	setPlayer(bowler, prefix);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Set Bowler",
	friendlyName: "Sets the bowler that is about to bowl",
	version     : 3.5,
	execute     : execute,
};