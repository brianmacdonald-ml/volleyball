var endPossessionStatType = null;

function execute() {
	relevantStat.setNumericalAtIndex(0, 1);
	
	newState.unset("playCall");

	//endPossessions();
}

function lookForFoul(allStats, theStat) {
	var previousStat = allStats.get(theStat.getStatIndex() - 1);
	if (previousStat.statType.statEffectObject != null && previousStat.statType.statEffectObject.name == "Substitution") {
		return lookForFoul(allStats, previousStat);
	} else {
		if (previousStat.statType.name.indexOf("Foul") > -1) {
			return previousStat;
		} else {
			return null;
		}
	}
}

function endPossessions() {
	var allStats = relevantStat.event.allStats;
	
	var offensiveClipStart = traverseBack(function(someStat) {
		// Return last Offensive Possession Clip Start or Clip End stat by this team
		return (someStat.statType.statEffectObject != null) && 
			   (someStat.statType.statEffectObject.name == "Clip Start" || someStat.statType.statEffectObject.name == "Clip End") &&
			   (someStat.statType.name == "Offensive Possession" || someStat.statType.name == "End Possession") &&
			   (someStat.opponentStat == relevantStat.opponentStat);
	});

	// Return last Defensive Possession Clip Start or Clip End stat by this team
	var defensiveClipStart = traverseBack(function(someStat) {
		return (someStat.statType.statEffectObject != null) && 
			   (someStat.statType.statEffectObject.name == "Clip Start" || someStat.statType.statEffectObject.name == "Clip End") &&
			   (someStat.statType.name == "Defensive Possession" || someStat.statType.name == "End Possession") &&
			   (someStat.opponentStat == !relevantStat.opponentStat);
	});

	if (relevantStat.statType.name == "Free Throw") {
		if (lookForFoul(allStats, relevantStat) == null) {
			return;
		}
	}

	if (offensiveClipStart && offensiveClipStart.statType.name == "Offensive Possession") {
		logger.debug("Adding an End Offensive Possession stat")
		if (endPossessionStatType == null) {
			logger.debug("End Possession stat type not set yet")
			for (var i = 0; i < allStatTypes.size(); i++) {
				var statType = allStatTypes.get(i);
				if (statType.name == "End Possession") {
					logger.debug("Found it: " + statType.name);
					endPossessionStatType = statType;
				}
			}
		}

		var supplementalStat = new Packages.com.ressq.stateasy.model.Stat();
		supplementalStat.statType = endPossessionStatType;
		supplementalStat.opponentStat = offensiveClipStart.opponentStat;
		supplementalStat.parentStat = relevantStat;
		supplementalStat.timeTaken = relevantStat.timeTaken;

		logger.debug("Adding stat " + supplementalStat);
		
		newStats.add(supplementalStat);
		setClipEndTime(supplementalStat);
	}

	if (defensiveClipStart && defensiveClipStart.statType.name == "Defensive Possession") {
		logger.debug("Adding an End Defensive Possession stat")
		if (endPossessionStatType == null) {
			logger.debug("End Possession stat type not set yet")
			for (var i = 0; i < allStatTypes.size(); i++) {
				var statType = allStatTypes.get(i);
				if (statType.name == "End Possession") {
					logger.debug("Found it: " + statType.name);
					endPossessionStatType = statType;
				}
			}
		}

		var supplementalStat = new Packages.com.ressq.stateasy.model.Stat();
		supplementalStat.statType = endPossessionStatType;
		supplementalStat.opponentStat = defensiveClipStart.opponentStat;
		supplementalStat.parentStat = relevantStat;
		supplementalStat.timeTaken = relevantStat.timeTaken;

		logger.debug("Adding stat " + supplementalStat);
		
		newStats.add(supplementalStat);
		setClipEndTime(supplementalStat);
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Scoring Opportunity",
	friendlyName: "This is used for a 2 point, 3 point or free throw attempt.",
	version     : 2.8,
	execute     : execute,
	provides    : "%sed?[Missed, Made]"
};