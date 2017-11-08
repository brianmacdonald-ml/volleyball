
function execute() {
	adjustTeam();
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	var otherPrefix = !relevantStat.opponentStat ? "their" : "our";
	var batter = currentState.get("currentBatter");
	var pitcher = currentState.get(otherPrefix + "PlayerAtPosition1");
	
	var allStats = relevantStat.event.allStats;
	if (allStats.size() <= 1) {
		return;
	}

	if (relevantStat.getStatIndex() <= 0) {
		return;
	}
	
	
	if (batter == undefined) {
		newState.set("warningMessage", "You must have a batter set for " + relevantStat.event[prefix + "Season"].team.teamName + " in order to take this stat.");
	}
	
	if (pitcher == undefined) {
		newState.set("warningMessage", "You must have a pitcher set for " + relevantStat.event[otherPrefix + "Season"].team.teamName + " in order to take this stat.");
	}
	
	
	addBatter(relevantStat.opponentStat, 0)
	addPitcher(!relevantStat.opponentStat, 1);
	
	var strikeCount = 0;
	
	if(currentState.get("strikeCount")!= null)
		strikeCount = Number(currentState.get("strikeCount"));
	
	newState.set("strikeCount", strikeCount+1);
	
	relevantStat.setNumericalAtIndex(strikeCount, 2);
	
	if(strikeCount >= 2){
		addStrikeOut();
		newState.set("strikeCount", 0);
		newState.set("ballCount", 0);
	}

	var pitchcount = !!relevantStat.opponentStat ? "theirPitchCount" : "ourPitchCount";
	var pitch = Number(currentState.get(pitchcount));
	newState.set(pitchcount, pitch+1);
	setTimeStamps();
	adjustEndTime();
	
}
function addStrikeOut() {
	var supplementalTypeName = "Strikeout";
	var supplementalStatType = undefined;
	
	for (var i = 0; i < allStatTypes.size(); i++) {
		var statType = allStatTypes.get(i);
		if (statType.name == supplementalTypeName) {
			supplementalStatType = statType;
		}
	}
	
	if (supplementalStatType != undefined) {
		var supplementalStat = new Packages.com.ressq.stateasy.model.Stat();
		supplementalStat.statType = supplementalStatType;
		supplementalStat.opponentStat = !!relevantStat.opponentStat;
		supplementalStat.parentStat = relevantStat;
		supplementalStat.timeTaken = relevantStat.timeTaken;
		
		supplementalStat.setNumericalAtIndex(0, 0);
		outcount = 0;
		if(currentState.get("outCount")!= undefined){
			outcount = currentState.get("outCount");
		}
		outcount++;
		newState.set("outCount", outcount);
		supplementalStat.setNumericalAtIndex(outcount-1, 3);
		supplementalStat.setPlayerAtIndex(getBatter(supplementalStat.opponentStat), 1);
		supplementalStat.setPlayerAtIndex(getPitcher(!supplementalStat.opponentStat), 2);
		setTimeStamps();
		newStats.add(supplementalStat);
	} else {
		logger.debug("StatType '" + supplementalTypeName + "' was not found.");
	}
	addCatcherPutOut(supplementalStat.opponentStat);
}
/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:         "Strike",
	friendlyName: "Strike",
	version:      3.5,
	execute:      execute,
	provides: "on %sep:'Batter' pitched by %seo:'Pitcher' this is Strike %sed?[1,2,3]:'Strike Count'"
};