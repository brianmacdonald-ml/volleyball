
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

function addAppearance(someStat, playerId) {
	var prefix = !!someStat.opponentStat ? "their" : "our";
	
	var supplementalTypeName = "Appearance";
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
	
	var bowler = [relevantStat.allData.get(0).player, relevantStat.allData.get(1).player];
	var bowlerFound = [false, false];
	
	var allStats = relevantStat.event.allStats;
	var allFound = false;
	var i = relevantStat.getStatIndex() - 1; // Start at the index just before this stat
	while ((i < allStats.size()) && (0 <= i) && !allFound) 
	{
		allFound = true;
		var currentStat = allStats.get(i);
		for (var j = 0; j < bowler.length; j++) {
			if (statContainsBowler(currentStat, bowler[j].id)) {
				bowlerFound[j] = true;
			}
			allFound = allFound && bowlerFound[j];
		}
		i--;
	}
	
	for (var j = 0; j < bowler.length; j++) {
		if (!bowlerFound[j]) {
			addAppearance(relevantStat, bowler[j].id);
		}
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Substitution",
	friendlyName: "Adds an appearance for the player entering the game.",
	version     : 1.1,
	execute     : execute,
};