function execute() {
	setClipEndTime(relevantStat);
}

function setClipEndTime(thisStat) {
	traverseBackForStat(thisStat, isClipStart);
}

function isClipStart(someStat, opponentStat) {
	return (someStat.statType.statEffectObject != null) && (someStat.statType.statEffectObject.name == "Clip Start") && (someStat.opponentStat == opponentStat);
}

function traverseBackForStat(originalStat, isStopStatFunction) {
	var allStats = relevantStat.event.allStats;
	
	var foundStopEvent = false;
	var stopRequested = false;
	if (originalStat.getStatIndex() != null & originalStat.getStatIndex != "") {
		var i = originalStat.getStatIndex() - 1; // Start at the index just before this stat
	} else {
		// The new stat didn't have an index yet. Use relevantStat's index
		var i = relevantStat.getStatIndex();
	}
	var currentStat;
	var affectedPlaycalls = [];
	
	while ((i < allStats.size()) && (0 <= i) && !foundStopEvent && !stopRequested) 
	{
		currentStat = allStats.get(i);
		
		foundStopEvent = isStopStatFunction(currentStat, originalStat.opponentStat);
		
		if (foundStopEvent) {
			var name = currentStat.getStatText();
			var endTime = originalStat.getTimeInSeconds() + originalStat.endTimeOffset;
			var timeOffset = endTime - currentStat.getTimeInSeconds();
			
			currentStat.endTimeOffset = timeOffset;  //In seconds
			
			modifiedStats.add(currentStat);

			for (var j in affectedPlaycalls) {
				affectedPlaycalls[j].endTimeOffset = (currentStat.getTimeInSeconds() + currentStat.getEndTimeOffset()) - affectedPlaycalls[j].getTimeInSeconds();
				modifiedStats.add(affectedPlaycalls[j]);
			}
			
		} else {
			if ((currentStat.statType.statEffectObject != null) && (currentStat.statType.statEffectObject.name == "Play Call") && (currentStat.opponentStat == originalStat.opponentStat)) {
				affectedPlaycalls.push(currentStat);
			}
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
	name        : "Clip Start",
	friendlyName: "Marks the beginning of a clip.",
	version     : 2.9,
	execute     : execute,
	sharedCode  : true
};